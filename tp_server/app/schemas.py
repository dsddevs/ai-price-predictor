from typing import List, Optional

from pydantic import BaseModel


class HistoryItem(BaseModel):
    time: str
    open: Optional[float] = None
    high: Optional[float] = None
    low: Optional[float] = None
    close: float


class ForecastItem(BaseModel):
    time: str
    close: float


class NewsItem(BaseModel):
    title: str
    local_time: str
    description: Optional[str] = None
    image_url: Optional[str] = None


class HistoryResponse(BaseModel):
    historical: List[HistoryItem]


class ForecastResponse(BaseModel):
    historical: List[HistoryItem]
    forecast: List[ForecastItem]


class NewsResponse(BaseModel):
    news: List[NewsItem]
