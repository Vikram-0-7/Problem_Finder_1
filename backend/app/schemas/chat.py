"""Pydantic schemas for AI Chat."""

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Schema for chat request."""
    message: str = Field(..., min_length=1, max_length=2000)


class ChatResponse(BaseModel):
    """Schema for chat response."""
    reply: str
    sources: list[str] = []
