"""Search service: orchestrates DB lookup, scraping, AI extraction, and storage."""

import logging

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.problem import Problem
from app.services import scraper_service, ai_service, duplicate_service

logger = logging.getLogger(__name__)

# Valid severity values accepted by the Problem model.
_VALID_SEVERITIES = {"Critical", "High", "Medium", "Low"}

# Valid categories matching the AI prompt.
_VALID_CATEGORIES = {
    "Healthcare", "Education", "Infrastructure", "Poverty",
    "Employment", "Agriculture", "Environment", "Women & Children",
    "Digital Governance", "Law & Order", "Housing", "Water & Sanitation",
    "Other",
}


def _normalise_severity(raw: str) -> str:
    """Return a valid severity value, defaulting to ``'Medium'``."""
    for s in _VALID_SEVERITIES:
        if raw.strip().lower() == s.lower():
            return s
    return "Medium"


def _normalise_category(raw: str) -> str:
    """Return a valid category, defaulting to ``'Other'``."""
    for c in _VALID_CATEGORIES:
        if raw.strip().lower() == c.lower():
            return c
    return "Other"


async def _search_database(session: AsyncSession, query: str) -> list[Problem]:
    """Search PostgreSQL for problems matching *query* using ILIKE."""
    pattern = f"%{query}%"
    stmt = (
        select(Problem)
        .where(
            or_(
                Problem.title.ilike(pattern),
                Problem.description.ilike(pattern),
                Problem.category.ilike(pattern),
            )
        )
        .order_by(Problem.created_at.desc())
    )
    result = await session.execute(stmt)
    return list(result.scalars().all())


async def live_search(
    session: AsyncSession,
    query: str,
    bypass_db: bool = False,
) -> tuple[list[Problem], str]:
    """Execute the full live-search pipeline.

    1. Search PostgreSQL first (unless bypass_db is True).
    2. If enough results exist, return them (``source='database'``).
    3. Otherwise scrape → extract → deduplicate → store → return
       (``source='live_search'``).

    Returns
    -------
    tuple[list[Problem], str]
        The list of problem ORM instances and the source label.
    """
    # --- Step 1: DB search ---------------------------------------------------
    db_problems = await _search_database(session, query)
    logger.info("DB search for '%s' returned %d results", query, len(db_problems))

    if not bypass_db and len(db_problems) >= settings.MIN_DB_RESULTS:
        return db_problems, "database"

    # --- Step 2: Scrape -------------------------------------------------------
    logger.info("Not enough DB results – launching live scrape for '%s'", query)
    scraped_pages = await scraper_service.search_and_scrape(query)

    if not scraped_pages:
        logger.warning("Scraper returned no pages for '%s'", query)
        # Fall back to whatever we got from the DB.
        return db_problems, "database"

    # --- Step 3: AI extraction ------------------------------------------------
    extracted = await ai_service.extract_problems(scraped_pages, query)
    logger.info("AI extracted %d problems from scraped pages", len(extracted))

    if not extracted:
        return db_problems, "database"

    # --- Step 4: Deduplicate & save -------------------------------------------
    new_problems: list[Problem] = []
    inserted_any = False
    for raw in extracted:
        title = str(raw.get("title", "")).strip()
        if not title:
            continue

        existing_problem = await duplicate_service.get_duplicate_problem(session, title)
        if existing_problem is not None:
            existing_problem.already_in_db = True
            if existing_problem not in new_problems and existing_problem not in db_problems:
                new_problems.append(existing_problem)
            continue

        problem = Problem(
            title=title[:500],
            description=str(raw.get("description", ""))[:5000],
            category=_normalise_category(str(raw.get("category", "Other"))),
            state=str(raw.get("state", "India"))[:100],
            affected_population=str(raw.get("affected_population", "General public"))[:255],
            severity=_normalise_severity(str(raw.get("severity", "Medium"))),
            statistics=str(raw.get("statistics", "")) or None,
            report_name=str(raw.get("report_name", "")) or None,
            published_year=str(raw.get("published_year", "")) or None,
            source=str(raw.get("source", ""))[:1000],
            innovation_areas=raw.get("innovation_areas", []),
        )
        session.add(problem)
        new_problems.append(problem)
        inserted_any = True

    if inserted_any:
        await session.flush()  # assigns IDs
        logger.info("Saved new problems to the database")

    # Combine DB hits + newly saved problems.
    all_problems = db_problems + new_problems
    return all_problems, "live_search"
