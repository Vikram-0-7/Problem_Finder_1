"""Duplicate detection service using title similarity matching."""

import difflib
import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.problem import Problem

logger = logging.getLogger(__name__)


async def get_duplicate_problem(session: AsyncSession, title: str) -> Problem | None:
    """Find and return the existing Problem ORM object if a duplicate exists, else None."""
    result = await session.execute(select(Problem))
    existing_problems = result.scalars().all()

    title_lower = title.lower().strip()

    for problem in existing_problems:
        ratio = difflib.SequenceMatcher(
            None, title_lower, problem.title.lower().strip()
        ).ratio()
        if ratio >= settings.SIMILARITY_THRESHOLD:
            logger.info(
                "Duplicate detected (ratio=%.2f): '%s' ≈ '%s'",
                ratio,
                title[:60],
                problem.title[:60],
            )
            return problem

    return None


async def is_duplicate(session: AsyncSession, title: str) -> bool:
    """Check whether a problem with a similar *title* already exists.

    Uses ``difflib.SequenceMatcher`` to compare against every existing
    problem title.  Returns ``True`` if any title has a similarity ratio
    above ``settings.SIMILARITY_THRESHOLD`` (default 0.85).
    """
    dup = await get_duplicate_problem(session, title)
    return dup is not None
