"""Pydantic schemas for Problem data validation."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ProblemBase(BaseModel):
    """Base schema for Problem fields."""
    title: str = Field(..., min_length=5, max_length=500)
    description: str = Field(..., min_length=10)
    category: str = Field(..., max_length=100)
    state: str = Field(default="India", max_length=100)
    affected_population: str = Field(..., max_length=255)
    severity: str = Field(..., pattern=r"^(Critical|High|Medium|Low)$")
    statistics: Optional[str] = None
    report_name: Optional[str] = None
    published_year: Optional[str] = None
    source: str = Field(..., max_length=1000)
    innovation_areas: list[str] = Field(default_factory=list)


class ProblemCreate(ProblemBase):
    """Schema for creating a new problem."""
    pass


class ProblemResponse(ProblemBase):
    """Schema for returning a problem."""
    id: int
    created_at: datetime
    already_in_db: bool = False

    class Config:
        from_attributes = True


class ProblemListResponse(BaseModel):
    """Paginated list of problems."""
    problems: list[ProblemResponse]
    total: int
    page: int
    page_size: int


class LiveSearchRequest(BaseModel):
    """Schema for live search request."""
    query: str = Field(..., min_length=3, max_length=500)
    bypass_db: bool = False


class LiveSearchResponse(BaseModel):
    """Schema for live search response."""
    problems: list[ProblemResponse]
    total: int
    source: str = Field(description="'database' or 'live_search'")
    query: str
