"""Problems router: CRUD and live-search endpoints."""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.problem import Problem
from app.schemas.problem import (
    LiveSearchRequest,
    LiveSearchResponse,
    ProblemListResponse,
    ProblemResponse,
)
from app.services import search_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/problems", tags=["Problems"])


@router.get("", response_model=ProblemListResponse)
async def list_problems(
    category: Optional[str] = Query(None, description="Filter by category"),
    state: Optional[str] = Query(None, description="Filter by state"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    year: Optional[str] = Query(None, description="Filter by published year"),
    search: Optional[str] = Query(None, description="Free-text search"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> ProblemListResponse:
    """Return a paginated, filterable list of problems."""
    try:
        stmt = select(Problem)
        count_stmt = select(func.count(Problem.id))

        # Apply filters.
        conditions = []
        if category:
            conditions.append(Problem.category.ilike(f"%{category}%"))
        if state and state.lower() != "all_india" and state.lower() != "all india":
            conditions.append(Problem.state.ilike(f"%{state}%"))
        if severity:
            conditions.append(Problem.severity == severity)
        if year:
            conditions.append(Problem.published_year == year)
        if search:
            pattern = f"%{search}%"
            conditions.append(
                or_(
                    Problem.title.ilike(pattern),
                    Problem.description.ilike(pattern),
                )
            )

        if conditions:
            for cond in conditions:
                stmt = stmt.where(cond)
                count_stmt = count_stmt.where(cond)

        # Total count.
        total_result = await db.execute(count_stmt)
        total = total_result.scalar() or 0

        # Paginate.
        offset = (page - 1) * page_size
        stmt = stmt.order_by(Problem.created_at.desc()).offset(offset).limit(page_size)

        result = await db.execute(stmt)
        problems = list(result.scalars().all())

        return ProblemListResponse(
            problems=problems,
            total=total,
            page=page,
            page_size=page_size,
        )
    except Exception as exc:
        logger.error("Error listing problems: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve problems.",
        )


@router.get("/{problem_id}", response_model=ProblemResponse)
async def get_problem(
    problem_id: int,
    db: AsyncSession = Depends(get_db),
) -> ProblemResponse:
    """Return a single problem by its ID."""
    try:
        result = await db.execute(
            select(Problem).where(Problem.id == problem_id)
        )
        problem = result.scalar_one_or_none()
        if problem is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Problem with id {problem_id} not found.",
            )
        return problem
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Error fetching problem %d: %s", problem_id, exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve the problem.",
        )


@router.post("/live-search", response_model=LiveSearchResponse)
async def live_search(
    body: LiveSearchRequest,
    db: AsyncSession = Depends(get_db),
) -> LiveSearchResponse:
    """Trigger the full live-search pipeline (DB → scrape → AI → store)."""
    try:
        problems, source = await search_service.live_search(db, body.query, body.bypass_db)
        return LiveSearchResponse(
            problems=problems,
            total=len(problems),
            source=source,
            query=body.query,
        )
    except Exception as exc:
        logger.error("Live search failed for '%s': %s", body.query, exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Live search encountered an error. Please try again.",
        )
