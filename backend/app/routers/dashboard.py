"""Dashboard router: aggregated statistics for the frontend dashboard."""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.problem import Problem
from app.schemas.problem import ProblemResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


class ChartItem(BaseModel):
    name: str
    value: int
    color: Optional[str] = None


class DashboardResponse(BaseModel):
    total_problems: int
    total_reports: int
    total_sources: int
    states_covered: int
    categories: int
    problems_by_category: list[ChartItem]
    problems_by_state: list[ChartItem]
    problems_by_severity: list[ChartItem]
    recent_problems: list[ProblemResponse]


@router.get("", response_model=DashboardResponse)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
) -> DashboardResponse:
    """Return aggregated dashboard statistics compiled from real database records."""
    try:
        # Total count.
        total_result = await db.execute(select(func.count(Problem.id)))
        total_problems = total_result.scalar() or 0

        # Total unique reports.
        reports_result = await db.execute(select(func.count(func.distinct(Problem.report_name))))
        total_reports = reports_result.scalar() or 0

        # Total unique source URLs.
        sources_result = await db.execute(select(func.count(func.distinct(Problem.source))))
        total_sources = sources_result.scalar() or 0

        # States covered.
        states_result = await db.execute(select(func.count(func.distinct(Problem.state))))
        states_covered = states_result.scalar() or 0

        # Categories.
        categories_result = await db.execute(select(func.count(func.distinct(Problem.category))))
        categories = categories_result.scalar() or 0

        # By category.
        cat_result = await db.execute(
            select(Problem.category, func.count(Problem.id))
            .group_by(Problem.category)
            .order_by(func.count(Problem.id).desc())
        )
        problems_by_category = [
            ChartItem(name=row[0], value=row[1])
            for row in cat_result.all()
        ]

        # By state.
        state_result = await db.execute(
            select(Problem.state, func.count(Problem.id))
            .group_by(Problem.state)
            .order_by(func.count(Problem.id).desc())
        )
        problems_by_state = [
            ChartItem(name=row[0], value=row[1])
            for row in state_result.all()
        ]

        # By severity.
        sev_result = await db.execute(
            select(Problem.severity, func.count(Problem.id))
            .group_by(Problem.severity)
            .order_by(func.count(Problem.id).desc())
        )
        problems_by_severity = [
            ChartItem(name=row[0], value=row[1])
            for row in sev_result.all()
        ]

        # Recent problems (last 10).
        recent_result = await db.execute(
            select(Problem)
            .order_by(Problem.created_at.desc())
            .limit(10)
        )
        recent_problems = list(recent_result.scalars().all())

        return DashboardResponse(
            total_problems=total_problems,
            total_reports=total_reports,
            total_sources=total_sources,
            states_covered=states_covered,
            categories=categories,
            problems_by_category=problems_by_category,
            problems_by_state=problems_by_state,
            problems_by_severity=problems_by_severity,
            recent_problems=recent_problems,
        )
    except Exception as exc:
        logger.error("Dashboard query failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to load dashboard data.",
        )
