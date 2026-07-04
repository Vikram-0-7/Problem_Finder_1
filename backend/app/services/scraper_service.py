"""Scraper service: searches government websites and extracts readable text."""

import asyncio
import logging
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup
from ddgs import DDGS

from app.config import settings

logger = logging.getLogger(__name__)

# Elements to strip from pages – they add noise, not content.
_STRIP_TAGS = [
    "script", "style", "header", "footer", "nav", "aside",
    "form", "iframe", "noscript", "svg", "img", "button",
    "input", "select", "textarea",
]


def _is_gov_domain(url: str) -> bool:
    """Return True if *url* belongs to a whitelisted government domain."""
    hostname = urlparse(url).hostname or ""
    return any(hostname.endswith(domain) for domain in settings.GOV_DOMAINS)


def _is_valid_report_url(url: str) -> bool:
    """Filter out non-report pages like logins, tender systems, e-procurement sites, and generic registration portals."""
    url_lower = url.lower()
    
    # Block list of terms typically indicating non-report pages
    block_terms = [
        "tender", "tenders", "eprocure", "login", "register", "services", 
        "organization", "apply", "auth", "signin", "signup", "dashboard", 
        "feedback", "contact", "about-us", "faq", "faqs", "help", "sitemap",
        "mptenders", "aquaptax", "eprocure.gov.in"
    ]
    if any(term in url_lower for term in block_terms):
        return False
        
    return True


def _search_ddgs(query: str, max_results: int) -> list[dict]:
    """Run a DuckDuckGo search synchronously and return result dicts.
    
    Bypasses duplicate site scoping, refines query for reports, and rejects non-report pages like tenders and login portals.
    """
    import re
    
    # Remove existing site:gov.in parameters to prevent duplicates
    cleaned = re.sub(r'\bsite:gov\.in\b', '', query, flags=re.IGNORECASE).strip()
    cleaned = re.sub(r'\s+', ' ', cleaned)
    
    # If the query doesn't mention report, pdf, statistics, or survey, append report indicators to focus the search
    lower_query = cleaned.lower()
    report_keywords = ["report", "pdf", "survey", "statistics", "publication", "census"]
    if not any(k in lower_query for k in report_keywords):
        gov_query = f"{cleaned} (report OR pdf OR survey OR statistics) site:gov.in"
    else:
        gov_query = f"{cleaned} site:gov.in"
        
    logger.info("DDGS search: %s (max_results=%d)", gov_query, max_results)

    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(gov_query, max_results=max_results * 2))
    except Exception as exc:
        logger.error("DuckDuckGo search failed: %s", exc)
        return []

    # Keep only results from whitelisted government domains and valid report URLs
    gov_results: list[dict] = []
    for r in results:
        url = r.get("href", r.get("link", ""))
        if _is_gov_domain(url) and _is_valid_report_url(url):
            gov_results.append({
                "url": url,
                "title": r.get("title", ""),
                "snippet": r.get("body", ""),
            })
        if len(gov_results) >= max_results:
            break

    logger.info("Filtered to %d government report results", len(gov_results))
    return gov_results


def _extract_text(html: str, max_chars: int = settings.MAX_CONTENT_LENGTH) -> str:
    """Parse *html* with BeautifulSoup and return clean body text."""
    soup = BeautifulSoup(html, "html.parser")

    for tag in _STRIP_TAGS:
        for el in soup.find_all(tag):
            el.decompose()

    text = soup.get_text(separator="\n", strip=True)

    # Collapse blank lines.
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    clean = "\n".join(lines)

    # Enforce character limits.
    if len(clean) > max_chars:
        clean = clean[:max_chars]
    return clean


async def _fetch_page(
    client: httpx.AsyncClient,
    url: str,
    title: str,
) -> dict | None:
    """Download a single page and return ``{url, text, title}`` or ``None``."""
    try:
        resp = await client.get(url, timeout=10.0, follow_redirects=True)
        resp.raise_for_status()
        text = _extract_text(resp.text)
        if len(text) < settings.MIN_CONTENT_LENGTH:
            logger.warning("Page too short (%d chars), skipping: %s", len(text), url)
            return None
        logger.info("Scraped %d chars from %s", len(text), url)
        return {"url": url, "text": text, "title": title}
    except httpx.TimeoutException:
        logger.warning("Timeout fetching %s", url)
        return None
    except httpx.HTTPStatusError as exc:
        logger.warning("HTTP %d for %s", exc.response.status_code, url)
        return None
    except Exception as exc:
        logger.error("Error fetching %s: %s", url, exc)
        return None


async def search_and_scrape(query: str) -> list[dict]:
    """Search for *query* on government sites and scrape the top pages.

    Returns a list of dicts with keys ``url``, ``text``, ``title``.
    Pages that fail to crawl (SSL errors, blocks, etc.) are discarded in favor of other working sites.
    """
    # Fetch up to 15 search results so we have enough candidate pages to choose from
    loop = asyncio.get_running_loop()
    search_results = await loop.run_in_executor(
        None, _search_ddgs, query, 8
    )

    if not search_results:
        logger.warning("No government search results for query: %s", query)
        return []

    # Fetch pages concurrently with secure SSL verification (verify=True)
    async with httpx.AsyncClient(
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        verify=True,
    ) as client:
        tasks = [
            _fetch_page(client, r["url"], r["title"])
            for r in search_results
        ]
        results = await asyncio.gather(*tasks)

    # Keep only pages that successfully downloaded (not None and meets size limit)
    successful_pages = [r for r in results if r is not None]
    
    # Cap results at settings.MAX_SEARCH_RESULTS (typically 5)
    final_pages = successful_pages[:settings.MAX_SEARCH_RESULTS]
    
    logger.info(
        "Successfully scraped %d pages out of %d candidates (discarded %d failed/blocked sites). Cap set at %d.",
        len(successful_pages),
        len(search_results),
        len(search_results) - len(successful_pages),
        settings.MAX_SEARCH_RESULTS
    )
    return final_pages
