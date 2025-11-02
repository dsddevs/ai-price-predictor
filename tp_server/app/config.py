"""
Configuration management for different environments
"""

import os
from functools import lru_cache
from typing import List, Optional

from pydantic import Field, validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings with environment-based configuration"""

    # Application
    app_name: str = "Trade Price Predictor"
    app_version: str = "1.0.0"
    environment: str = Field(default="development", env="ENVIRONMENT")
    debug: bool = Field(default=False, env="DEBUG")

    # Server
    host: str = Field(default="0.0.0.0", env="HOST")
    port: int = Field(default=8000, env="PORT")
    workers: int = Field(default=4, env="WORKERS")

    # Security
    secret_key: str = Field(..., env="SECRET_KEY")
    jwt_secret_key: str = Field(..., env="JWT_SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", env="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(
        default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES"
    )

    # CORS
    allowed_origins: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:3001"],
        env="ALLOWED_ORIGINS",
    )

    # API Keys
    polygon_api_key: Optional[str] = Field(default=None, env="POLYGON_API_KEY")
    news_api_key: Optional[str] = Field(default=None, env="NEWS_API_KEY")
    alpha_vantage_api_key: Optional[str] = Field(
        default=None, env="ALPHA_VANTAGE_API_KEY"
    )

    # Database
    database_url: Optional[str] = Field(default=None, env="DATABASE_URL")
    redis_url: Optional[str] = Field(
        default="redis://localhost:6379/0", env="REDIS_URL"
    )

    # Logging
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    log_file: Optional[str] = Field(default=None, env="LOG_FILE")

    # Rate Limiting
    rate_limit_requests: int = Field(default=100, env="RATE_LIMIT_REQUESTS")
    rate_limit_period: int = Field(default=60, env="RATE_LIMIT_PERIOD")

    # Cache
    cache_ttl: int = Field(default=300, env="CACHE_TTL")
    enable_cache: bool = Field(default=True, env="ENABLE_CACHE")

    # External Services
    yahoo_finance_timeout: int = Field(default=30, env="YAHOO_FINANCE_TIMEOUT")
    news_api_timeout: int = Field(default=30, env="NEWS_API_TIMEOUT")

    # Monitoring
    sentry_dsn: Optional[str] = Field(default=None, env="SENTRY_DSN")
    prometheus_enabled: bool = Field(default=False, env="PROMETHEUS_ENABLED")

    # Email
    smtp_host: Optional[str] = Field(default=None, env="SMTP_HOST")
    smtp_port: int = Field(default=587, env="SMTP_PORT")
    smtp_user: Optional[str] = Field(default=None, env="SMTP_USER")
    smtp_password: Optional[str] = Field(default=None, env="SMTP_PASSWORD")
    from_email: str = Field(default="noreply@tradepredictor.com", env="FROM_EMAIL")

    @validator("allowed_origins", pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    @validator("environment")
    def validate_environment(cls, v):
        allowed = ["development", "staging", "production", "testing"]
        if v not in allowed:
            raise ValueError(f"Environment must be one of {allowed}")
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


class DevelopmentSettings(Settings):
    """Development environment settings"""

    debug: bool = True
    log_level: str = "DEBUG"


class ProductionSettings(Settings):
    """Production environment settings"""

    debug: bool = False
    log_level: str = "INFO"

    @validator("secret_key")
    def validate_secret_key(cls, v):
        if v == "your-secret-key-here-change-in-production":
            raise ValueError("You must set a secure SECRET_KEY in production!")
        return v


class TestingSettings(Settings):
    """Testing environment settings"""

    environment: str = "testing"
    database_url: str = "sqlite:///:memory:"
    redis_url: str = "redis://localhost:6379/1"


@lru_cache()
def get_settings() -> Settings:
    """
    Get settings based on environment

    Returns:
        Settings: Configuration object for current environment
    """
    env = os.getenv("ENVIRONMENT", "development").lower()

    settings_map = {
        "development": DevelopmentSettings,
        "production": ProductionSettings,
        "testing": TestingSettings,
        "staging": Settings,
    }

    settings_class = settings_map.get(env, Settings)
    return settings_class()


# Create a global settings instance
settings = get_settings()
