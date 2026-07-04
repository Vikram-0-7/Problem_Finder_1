"""Reports router: curated list of government report sources."""

import logging

from fastapi import APIRouter
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/reports", tags=["Reports"])


from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from urllib.parse import urlparse

from app.database import get_db
from app.models.problem import Problem

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/reports", tags=["Reports"])


class ReportSource(BaseModel):
    """Schema for a government report source."""
    id: str
    name: str
    description: str
    url: str
    category: str
    problems_count: int
    icon: str


# Curated list of prominent Indian government data/report sources.
_REPORT_SOURCES: list[ReportSource] = [
    ReportSource(
        id="niti-aayog",
        name="NITI Aayog",
        description="National Institution for Transforming India — policy think tank providing strategic guidance on matters of national importance.",
        url="https://niti.gov.in",
        category="Policy",
        problems_count=0,
        icon="Landmark",
    ),
    ReportSource(
        id="who-india",
        name="WHO India",
        description="World Health Organization India country office — health data, disease surveillance, and public health policy guidance.",
        url="https://www.who.int/india",
        category="Healthcare",
        problems_count=0,
        icon="HeartPulse",
    ),
    ReportSource(
        id="world-bank",
        name="World Bank",
        description="World Bank India data and development reports covering poverty, education, infrastructure, and economic indicators.",
        url="https://www.worldbank.org/en/country/india",
        category="Development",
        problems_count=0,
        icon="Globe",
    ),
    ReportSource(
        id="education-ministry",
        name="Ministry of Education",
        description="Government of India Ministry of Education — UDISE+, AISHE data, education policies, and institutional statistics.",
        url="https://education.gov.in",
        category="Education",
        problems_count=0,
        icon="GraduationCap",
    ),
    ReportSource(
        id="health-ministry",
        name="Ministry of Health",
        description="Ministry of Health and Family Welfare — public health data, NFHS, disease surveillance, and healthcare infrastructure reports.",
        url="https://mohfw.gov.in",
        category="Healthcare",
        problems_count=0,
        icon="Stethoscope",
    ),
    ReportSource(
        id="rbi",
        name="Reserve Bank of India",
        description="Central banking institution — financial stability reports, monetary policy data, banking statistics, and economic surveys.",
        url="https://rbi.org.in",
        category="Finance",
        problems_count=0,
        icon="Banknote",
    ),
    ReportSource(
        id="ncrb",
        name="NCRB",
        description="National Crime Records Bureau — comprehensive crime statistics, cyber crime data, and law enforcement reports for India.",
        url="https://ncrb.gov.in",
        category="Safety",
        problems_count=0,
        icon="Shield",
    ),
    ReportSource(
        id="census-india",
        name="Census of India",
        description="Registrar General and Census Commissioner — population data, demographic statistics, and socio-economic indicators.",
        url="https://censusindia.gov.in",
        category="Demographics",
        problems_count=0,
        icon="Users",
    ),
]

# Map report source domain to match in the database
_REPORT_DOMAINS = {
    "NITI Aayog": "niti.gov.in",
    "WHO India": "who.int",
    "World Bank": "worldbank.org",
    "Ministry of Education": "education.gov.in",
    "Ministry of Health": "mohfw.gov.in",
    "Reserve Bank of India": "rbi.org.in",
    "NCRB": "ncrb.gov.in",
    "Census of India": "censusindia.gov.in",
}


@router.get("", response_model=list[ReportSource])
async def list_reports(db: AsyncSession = Depends(get_db)) -> list[ReportSource]:
    """Return the curated list of government report sources with real problem counts from DB."""
    reports = []
    for r in _REPORT_SOURCES:
        # Match domain in source URL
        domain = _REPORT_DOMAINS.get(r.name) or urlparse(r.url).hostname or ""
        
        # Count problems in database matching this domain in their source URL
        stmt = select(func.count()).select_from(Problem).where(Problem.source.ilike(f"%{domain}%"))
        res = await db.execute(stmt)
        count = res.scalar() or 0
        
        # Return updated report source with real DB problem count
        reports.append(ReportSource(
            id=r.id,
            name=r.name,
            description=r.description,
            url=r.url,
            category=r.category,
            problems_count=count,
            icon=r.icon
        ))
    logger.info("Serving %d report sources with real database problem counts", len(reports))
    return reports
