"""Database connection and session management for Neon DB (PostgreSQL)."""

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
)

async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


async def get_db() -> AsyncSession:
    """Dependency that yields an async database session."""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """Create all database tables and seed initial problems if empty."""
    from sqlalchemy import text
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        try:
            await conn.execute(text("ALTER TABLE problems ADD COLUMN IF NOT EXISTS innovation_areas JSON DEFAULT '[]'::json"))
        except Exception:
            pass

    # Seed initial problems
    async with async_session() as session:
        try:
            from sqlalchemy import select
            from app.models.problem import Problem
            
            result = await session.execute(select(Problem))
            existing = result.scalars().first()
            if not existing:
                import logging
                logger = logging.getLogger(__name__)
                logger.info("Database is empty. Seeding initial government problems...")
                
                seed_problems = [
                    Problem(
                        title="Over 1.06 million teacher vacancies in government schools nationwide",
                        description="Official UDISE+ reports highlight severe teacher shortages in government schools, leading to high pupil-teacher ratios and sub-optimal educational outcomes across multiple states.",
                        category="Education",
                        state="India",
                        affected_population="150 Million Students",
                        severity="Critical",
                        statistics="1.06 million vacant teaching positions across whitelisted states.",
                        report_name="UDISE+ Annual Report",
                        published_year="2023",
                        source="https://education.gov.in/udise",
                        innovation_areas=[
                            "State-level digital teacher recruitment and merit-based transfer portals",
                            "Automated district-wise teacher demand forecasting and matching system",
                            "Virtual classroom and hybrid learning hubs in low-resource rural schools"
                        ]
                    ),
                    Problem(
                        title="Acute shortage of specialist doctors at rural Community Health Centres (CHCs)",
                        description="The Rural Health Statistics report indicates a 30% vacancy rate in specialist doctors at rural community health centers, forcing rural citizens to travel long distances for primary and critical healthcare.",
                        category="Healthcare",
                        state="Uttar Pradesh",
                        affected_population="80 Million Rural Residents",
                        severity="High",
                        statistics="30% specialist doctor vacancy across rural community health centers.",
                        report_name="Rural Health Statistics 2023-24",
                        published_year="2024",
                        source="https://mohfw.gov.in/rhs",
                        innovation_areas=[
                            "Telemedicine kiosks and AI-assisted diagnostic support systems at CHCs",
                            "Mobile Medical Units (MMUs) equipped with portable ultrasound and scanning",
                            "Performance-linked incentive structures for rural medical residency placements"
                        ]
                    ),
                    Problem(
                        title="Groundwater over-exploitation and depleting water tables in agricultural blocks",
                        description="The Central Ground Water Board report reveals that over 1,186 blocks in India are classified as over-exploited, threatening drinking water security and sustainable farming irrigation systems.",
                        category="Agriculture",
                        state="Punjab",
                        affected_population="30 Million Farmers",
                        severity="Critical",
                        statistics="1,186 groundwater blocks classified as severely over-exploited.",
                        report_name="CGWB National Groundwater Assessment",
                        published_year="2023",
                        source="https://cgwb.gov.in/assessment",
                        innovation_areas=[
                            "Smart drip and sprinkler micro-irrigation systems linked to weather forecasts",
                            "IoT-based telemetry sensors for real-time aquifer extraction monitoring",
                            "Community-managed artificial aquifer recharge wells and check dams"
                        ]
                    ),
                    Problem(
                        title="Severe air pollution levels and high particulate matter index in winter",
                        description="Central Pollution Control Board data indicates that winter AQI in the Indo-Gangetic plain consistently exceeds 400+, causing public health emergencies and chronic respiratory illnesses.",
                        category="Environment",
                        state="Delhi",
                        affected_population="20 Million Citizens",
                        severity="Critical",
                        statistics="Winter AQI levels peaking beyond 450+ PM2.5 parameters.",
                        report_name="CPCB Air Quality Report",
                        published_year="2024",
                        source="https://cpcb.nic.in/airquality",
                        innovation_areas=[
                            "Bio-decomposer packaging and straw-pelletizing units for crop residue management",
                            "Hyperlocal IoT air quality sensor grid to detect open burning incidents",
                            "AI-driven traffic flow optimization and dynamic low-emission zone routing"
                        ]
                    ),
                    Problem(
                        title="Inadequate municipal solid waste processing and landfill overflows in tier-2 cities",
                        description="Swachh Bharat Mission reports point out that only 22% of municipal solid waste is scientifically processed in tier-2 cities, leading to toxic waste dumps and localized pollution.",
                        category="Infrastructure",
                        state="Maharashtra",
                        affected_population="15 Million Residents",
                        severity="Medium",
                        statistics="78% of municipal waste is dumped unprocessed in landfills.",
                        report_name="SBM-Urban Annual Review",
                        published_year="2023",
                        source="https://sbmurban.gov.in/reports",
                        innovation_areas=[
                            "Waste-to-energy gasification units and decentralized wet-waste composting",
                            "Smart bin level telemetry and route optimization engines for sanitation trucks",
                            "Automated optical sorting conveyors for high-throughput material recovery facilities"
                        ]
                    )
                ]
                session.add_all(seed_problems)
                await session.commit()
                logger.info("Database seeding completed successfully ✓")
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"⚠️ Failed to seed initial database records: {e}")


async def background_live_seeder() -> None:
    """Background task to scrape and seed database with real problems on startup."""
    import asyncio
    import logging
    from sqlalchemy import func, select
    from app.models.problem import Problem
    from app.services import search_service
    
    logger = logging.getLogger(__name__)
    
    # Wait 8 seconds to allow server to boot fully
    await asyncio.sleep(8)
    logger.info("🤖 Background Live Seeder: Starting real-time scraper pipeline...")
    
    queries = [
        "NITI Aayog policy index development challenge",
        "WHO India public healthcare disease report",
        "World Bank poverty development report India",
        "Ministry of Education UDISE school learning",
        "Ministry of Health NFHS doctor vacancy statistics",
        "Reserve Bank of India banking financial stability NPA",
        "National Crime Records Bureau NCRB cybercrime safety statistics",
        "Census of India demographic population indicator challenge",
    ]
    
    for query in queries:
        async with async_session() as session:
            try:
                # Check if we already have enough problems for this keyword
                keyword = query.split()[0]
                stmt = select(func.count()).select_from(Problem).where(
                    Problem.title.ilike(f"%{keyword}%")
                )
                res = await session.execute(stmt)
                count = res.scalar() or 0
                
                if count >= 3:
                    logger.info("🤖 Background Live Seeder: Skipping '%s' (already has %d results)", query, count)
                    continue
                
                logger.info("🤖 Background Live Seeder: Scraping & extracting live problems for '%s'...", query)
                await search_service.live_search(session, query)
                await session.commit()
                
                # Grace period between crawls
                await asyncio.sleep(6)
            except Exception as e:
                logger.error(f"🤖 Background Live Seeder: Failed scraping for '{query}': {e}")
                
    logger.info("🤖 Background Live Seeder: Real-time background extraction completed ✓")
