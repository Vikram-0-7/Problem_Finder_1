"""Problem model for SQLAlchemy."""

from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Problem(Base):
    """Represents a government problem extracted from official reports."""

    __tablename__ = "problems"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    state: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    affected_population: Mapped[str] = mapped_column(String(255), nullable=False)
    severity: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    statistics: Mapped[str] = mapped_column(Text, nullable=True)
    report_name: Mapped[str] = mapped_column(String(500), nullable=True)
    published_year: Mapped[str] = mapped_column(String(10), nullable=True)
    source: Mapped[str] = mapped_column(String(1000), nullable=False)
    innovation_areas: Mapped[list[str]] = mapped_column(JSON, nullable=True, default=list)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<Problem(id={self.id}, title='{self.title[:50]}...')>"
