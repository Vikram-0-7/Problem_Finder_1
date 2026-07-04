"""FastAPI application entry-point for Government Problem Finder."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.routers import chat, dashboard, problems, reports

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan (replaces deprecated @app.on_event)
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle hook."""
    logger.info("Initialising database tables …")
    try:
        await init_db()
        logger.info("Database initialised ✓")
        
        # Start background seeding of real problems from government portals
        import asyncio
        from app.database import background_live_seeder
        asyncio.create_task(background_live_seeder())
    except Exception as e:
        logger.error(
            "⚠️ Database initialisation failed! Please check if your DATABASE_URL in your backend/.env "
            "file is correct. The app will run, but database queries will fail until a valid connection is set up.\n"
            f"Connection error details: {e}"
        )
    yield
    logger.info("Shutting down …")


# ---------------------------------------------------------------------------
# Application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Government Problem Finder API",
    description=(
        "Scrapes Indian government websites, uses AI to extract real problems "
        "from official reports, and stores them in PostgreSQL for analysis."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers – all under /api
app.include_router(problems.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(chat.router, prefix="/api")


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/api/health", tags=["Health"])
async def health_check() -> dict:
    """Simple liveness probe."""
    return {"status": "healthy", "version": "1.0.0"}
