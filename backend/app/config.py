"""Application configuration loaded from environment variables."""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings."""

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://user:password@host/dbname?ssl=require"
    )

    def __init__(self):
        # Automatically clean database URI for asyncpg driver compatibility
        if self.DATABASE_URL.startswith("postgresql://") or self.DATABASE_URL.startswith("postgresql+asyncpg://"):
            from urllib.parse import urlparse, parse_qsl, urlencode, urlunparse
            
            url = self.DATABASE_URL
            if url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
                
            parsed = urlparse(url)
            params = dict(parse_qsl(parsed.query))
            
            # Map sslmode -> ssl (asyncpg uses ssl instead of sslmode)
            if "sslmode" in params:
                params["ssl"] = params.pop("sslmode")
                
            # Keep only arguments supported by asyncpg
            allowed_keys = {"ssl", "timeout", "command_timeout"}
            filtered_params = {k: v for k, v in params.items() if k in allowed_keys}
            
            new_query = urlencode(filtered_params)
            parsed = parsed._replace(query=new_query)
            self.DATABASE_URL = urlunparse(parsed)

    # Groq AI
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

    # Search settings
    MAX_SEARCH_RESULTS: int = 5
    MAX_CONTENT_LENGTH: int = 5000
    MIN_CONTENT_LENGTH: int = 500
    SIMILARITY_THRESHOLD: float = 0.85
    MIN_DB_RESULTS: int = 5

    # Government domains whitelist
    GOV_DOMAINS: list[str] = [
        ".gov.in",
        ".gov",
        ".nic.in",
        "data.gov.in",
        "niti.gov.in",
        "mohfw.gov.in",
        "education.gov.in",
        "rbi.org.in",
        "ncrb.gov.in",
        "censusindia.gov.in",
    ]

    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]


settings = Settings()
