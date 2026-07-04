"""Chat router: AI-powered chat endpoint."""

import logging

from fastapi import APIRouter, HTTPException, status

from app.schemas.chat import ChatRequest, ChatResponse
from app.services import ai_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def chat(body: ChatRequest) -> ChatResponse:
    """Send a message to the AI assistant and receive a reply."""
    try:
        reply = await ai_service.chat_with_ai(body.message)
        return ChatResponse(reply=reply, sources=[])
    except Exception as exc:
        logger.error("Chat endpoint error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Chat service encountered an error.",
        )
