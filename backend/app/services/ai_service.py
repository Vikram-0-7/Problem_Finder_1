"""AI service: uses Groq LLM to extract problems and power the chat feature."""

import json
import logging

from groq import Groq

from app.config import settings

logger = logging.getLogger(__name__)

_client = Groq(api_key=settings.GROQ_API_KEY)

_EXTRACTION_SYSTEM_PROMPT = """\
You are a government policy analyst AI. Your ONLY job is to extract REAL \
public problems that are explicitly mentioned or clearly implied in the provided \
government document text.

CRITICAL DISCRIMINATION RULE:
Before extracting any item, ask yourself: "Is this text describing a real public problem (shortage, crisis, risk, negative condition, or an unresolved challenge), or is it describing positive progress, achievements, or a government initiative?"

Do NOT extract:
- Positive progress reports or improvements (e.g. "poverty declined from 53.8% to 15.5%" should NOT be extracted as a problem about declining poverty. It is progress).
- Government schemes, policies, announcements, budget allocations, or staff deployments.
- Success stories or achievements.

REFRAMING TO UNRESOLVED ISSUES:
If a text mentions progress but highlights a remaining challenge, you must frame it strictly as the remaining unresolved problem:
- INSTEAD OF: "Poverty declined to 15.5%" (Progress)
- EXTRACT AS: "15.5% of the population still lives in multidimensional poverty" or "Significant segment of population remains below the poverty line" (Unresolved Problem).

If no actual public problems (shortages, crises, risks, poor outcomes, or people still affected) are mentioned, return an empty JSON array [].

Rules:
1. Extract ONLY problems that are supported by numbers/data/facts in the text.
2. NEVER fabricate, guess, or invent problems.
3. Return a JSON array of objects. Each object MUST have these fields:
   - title (str, concise problem title focusing on the unresolved challenge, max 120 chars)
   - description (str, detailed description focusing on the remaining issue, 2-4 sentences)
   - category (str, one of: Healthcare, Education, Infrastructure, Poverty, \
Employment, Agriculture, Environment, Women & Children, Digital Governance, \
Law & Order, Housing, Water & Sanitation, Other)
   - affected_population (str, who is affected)
   - state (str, Indian state name or "India" if national)
   - severity (str, one of: Critical, High, Medium, Low)
   - source (str, the URL of the source document)
   - report_name (str, name of the report/document if identifiable, else "")
   - published_year (str, year if identifiable, else "")
   - statistics (str, key statistics reflecting the remaining challenge quoted from the text, else "")
   - innovation_areas (array of strings, 3-5 specific, realistic public-sector technology, engineering, or policy innovation ideas that can help solve this specific problem)
4. Respond ONLY with the JSON array – no markdown, no explanation.
"""

_CHAT_SYSTEM_PROMPT = """\
You are an expert assistant on Indian government policies, public welfare \
schemes, and socio-economic challenges.  Answer the user's question in a \
helpful, factual manner.  When possible, cite government reports or data.  \
If you are unsure, say so clearly rather than speculating.
"""


def retrieve_relevant_chunks(texts: list[dict], query: str, max_total_chars: int = 3500) -> list[dict]:
    """Retrieve only the most relevant paragraphs from scraped pages containing problem indicators.
    
    This acts as a local RAG retriever to keep token usage extremely low.
    """
    import re
    
    # List of terms that indicate a public/government issue or statistic
    problem_indicators = {
        "shortage", "vacancy", "vacancies", "lack", "deficit", "problem", "problems",
        "challenge", "challenges", "poverty", "crisis", "poor", "inadequate", "fail",
        "failure", "decline", "declined", "drop", "dropped", "high", "critical", "severe",
        "insufficient", "depletion", "depleted", "low", "outcomes", "vacant", "unemployed",
        "unemployment", "illness", "disease", "fatalities", "accident", "accidents",
        "crore", "lakh", "million", "percent", "percentage", "%"
    }
    
    query_words = set(re.findall(r'\w+', query.lower())) if query else set()
    
    chunks = []
    for page in texts:
        # Split page text into paragraphs (paragraphs are usually separated by newlines)
        paragraphs = [p.strip() for p in page["text"].split("\n") if p.strip()]
        for p in paragraphs:
            if len(p) < 80:  # skip too short headers or links
                continue
            
            p_lower = p.lower()
            score = 0
            
            # 1. Relevance to query: count matching query words
            if query_words:
                query_matches = sum(1 for word in query_words if word in p_lower)
                score += query_matches * 5
            
            # 2. Presence of problem indicating keywords
            problem_matches = sum(1 for indicator in problem_indicators if indicator in p_lower)
            score += problem_matches * 3
            
            # 3. Presence of statistics/numbers (crucial for government reports)
            if re.search(r'\d+[\d,%\s]*(?:percent|crore|lakh|million|%|\b\d{4}\b)?', p_lower):
                score += 4
                
            # If the chunk has some relevance or problem indicators, consider it
            if score > 0:
                chunks.append({
                    "url": page["url"],
                    "title": page["title"],
                    "text": p,
                    "score": score
                })
                
    # Sort chunks by score in descending order
    chunks.sort(key=lambda x: x["score"], reverse=True)
    
    # Select chunks until we reach the character limit or a maximum of 8 snippets
    selected_chunks = []
    total_chars = 0
    for chunk in chunks:
        if total_chars + len(chunk["text"]) > max_total_chars:
            break
        if len(selected_chunks) >= 8:
            break
        selected_chunks.append(chunk)
        total_chars += len(chunk["text"])
        
    return selected_chunks


async def extract_problems(texts: list[dict], query: str = "") -> list[dict]:
    """Extract problems from scraped government pages using the Groq LLM.
    
    Utilizes local RAG to select only relevant paragraphs containing statistics and problem indicators.
    """
    if not texts:
        return []

    # Calculate original total size
    original_size = sum(len(p["text"]) for p in texts)
    
    # Run local RAG retrieval
    relevant_chunks = retrieve_relevant_chunks(texts, query)
    
    if not relevant_chunks:
        logger.warning("RAG: No relevant paragraphs with problem indicators found. Skipping LLM call.")
        return []

    # Build a combined user prompt containing only retrieved chunks
    parts: list[str] = []
    for idx, chunk in enumerate(relevant_chunks, 1):
        parts.append(
            f"--- Snippet {idx} ---\n"
            f"Source URL: {chunk['url']}\n"
            f"Source Title: {chunk['title']}\n\n"
            f"{chunk['text']}\n"
        )
    user_content = "\n".join(parts)

    logger.info(
        "RAG Optimization: Reduced context size from %d chars to %d chars (%d snippets). Sending to Groq.",
        original_size,
        len(user_content),
        len(relevant_chunks)
    )

    try:
        response = _client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": _EXTRACTION_SYSTEM_PROMPT},
                {"role": "user", "content": user_content},
            ],
            temperature=0.1,
            max_tokens=4096,
        )

        raw = response.choices[0].message.content.strip()
        logger.debug("Groq raw response (first 500 chars): %s", raw[:500])

        # Clean up and check for empty indicators
        cleaned_raw = raw.strip()
        if cleaned_raw in ("", "_", "[]", "null", "None") or len(cleaned_raw) < 5:
            logger.info("Groq returned empty or malformed indicator: %s. Returning empty list.", cleaned_raw)
            return []

        # Robustly extract JSON array from raw response (handles fences or conversational text)
        start_idx = cleaned_raw.find('[')
        end_idx = cleaned_raw.rfind(']')
        if start_idx != -1 and end_idx != -1 and end_idx >= start_idx:
            raw_json = cleaned_raw[start_idx:end_idx + 1]
        else:
            # If no bracket found, check if it contains invalid short text
            if "_" in cleaned_raw or len(cleaned_raw) < 10:
                logger.info("Groq returned invalid response without JSON array: %s", cleaned_raw)
                return []
            raw_json = cleaned_raw

        problems: list[dict] = json.loads(raw_json)
        if not isinstance(problems, list):
            logger.error("Groq returned non-list JSON: %s", type(problems))
            return []

        logger.info("Extracted %d problems from Groq response", len(problems))
        return problems

    except json.JSONDecodeError as exc:
        logger.error("Failed to parse Groq JSON response: %s. Raw content was: %s", exc, raw_json)
        return []
    except Exception as exc:
        logger.error("Groq extraction failed: %s", exc)
        return []


async def chat_with_ai(message: str) -> str:
    """Send *message* to the Groq LLM and return the assistant reply."""
    logger.info("Chat request (%d chars)", len(message))

    try:
        response = _client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": _CHAT_SYSTEM_PROMPT},
                {"role": "user", "content": message},
            ],
            temperature=0.7,
            max_tokens=2048,
        )
        reply = response.choices[0].message.content.strip()
        logger.info("Chat reply (%d chars)", len(reply))
        return reply

    except Exception as exc:
        logger.error("Groq chat failed: %s", exc)
        return "I'm sorry, I encountered an error processing your request. Please try again."
