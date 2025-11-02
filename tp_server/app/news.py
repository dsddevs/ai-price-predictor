import logging
import os
import re
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List

import requests
from requests.exceptions import RequestException

try:
    from dotenv import load_dotenv

    load_dotenv()
    this_dir_env = Path(__file__).resolve().parent / ".env"
    if this_dir_env.exists():
        load_dotenv(dotenv_path=this_dir_env, override=True)
    project_root_env = Path(__file__).resolve().parent.parent / ".env"
    if project_root_env.exists():
        load_dotenv(dotenv_path=project_root_env, override=True)
except Exception as e:
    logging.warning(f"Failed to load .env file: {e}")

from polygon.rest import RESTClient

_TICKER_REGEX = re.compile(r"^[A-Z]{1,5}(=[A-Z])?$")
_NEWS_CACHE: Dict[str, tuple[List[dict], float]] = {}
_CACHE_TTL = 300  # 5 minutes


class NewsCollector:
    def __init__(self):
        self.POLYGON_API = os.getenv("POLYGON_API", "")

        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s",
        )
        self.logger = logging.getLogger(__name__)
        masked = (
            (self.POLYGON_API[:4] + "***" + self.POLYGON_API[-4:])
            if self.POLYGON_API
            else "<empty>"
        )
        self.logger.info(
            "NewsCollector ENV: POLYGON_API=%s "
            "| cwd=%s "
            "| this_env=%s "
            "| root_env=%s",
            masked,
            os.getcwd(),
            str(this_dir_env) if "this_dir_env" in globals() else "",
            str(project_root_env) if "project_root_env" in globals() else "",
        )

        if not self.POLYGON_API:
            raise RuntimeError("POLYGON_API must be set in environment" " or .env file")
        if RESTClient is None:
            raise RuntimeError(
                "polygon-api-client is not installed. "
                "Please add it to requirements and install."
            )

        self.client = RESTClient(self.POLYGON_API)
        self.CATEGORY_TICKERS: Dict[str, str] = {
            "oil": "XOM",
            "oil prices": "XOM",
            "crude oil": "XOM",
            "нефть": "XOM",
            "gold": "XAUUSD",
            "gold prices": "GOLD",
            "золото": "GOLD",
            "natural gas": "LNG",
            "природный газ": "LNG",
            "газ": "LNG",
            "dollar index": "UUP",
            "us dollar index": "UUP",
            "индекс доллара": "UUP",
            "индекс доллара сша": "UUP",
            "bitcoin": "BTC-USD",
            "btc": "BTC-USD",
            "биткойн": "BTC-USD",
            "бтс": "BTC-USD",
        }

    def _clamp_dates(self, start_date: str, end_date: str) -> tuple[str, str]:
        """Clamp dates to valid past range."""
        now = datetime.now()
        try:
            start_dt = datetime.strptime(start_date, "%Y-%m-%d")
            end_dt = datetime.strptime(end_date, "%Y-%m-%d")
        except ValueError:
            self.logger.warning("Invalid date format, using default 100 days.")
            start_dt = now - timedelta(days=200)
            end_dt = now

        max_end = now
        min_start = datetime(2000, 1, 1)

        if end_dt > max_end:
            self.logger.info(f"Clamping end_date {end_dt} " f"to {max_end}")
            end_dt = max_end

        if start_dt > end_dt:
            self.logger.info(
                f"Swapping start_date {start_dt} " f"and end_date {end_dt}"
            )
            start_dt, end_dt = end_dt, start_dt

        if start_dt < min_start:
            self.logger.info(f"Clamping start_date {start_dt} " f"to {min_start}")
            start_dt = min_start

        return (start_dt.strftime("%Y-%m-%d"), end_dt.strftime("%Y-%m-%d"))

    def _is_probable_ticker(self, value: str) -> bool:
        """Check if the input string is likely a ticker symbol."""
        if not value:
            return False
        return bool(_TICKER_REGEX.match(value))

    def collect_news_data(
        self, ticker_or_query: str, start_date: str, end_date: str
    ) -> List[dict]:
        """Collect news data for a ticker or keyword query."""
        cache_key = f"{ticker_or_query}_{start_date}_{end_date}"
        if cache_key in _NEWS_CACHE:
            cached_data, cached_time = _NEWS_CACHE[cache_key]
            if time.time() - cached_time < _CACHE_TTL:
                self.logger.info(f"Returning cached news for " f"{ticker_or_query}")
                return cached_data

        start_date, end_date = self._clamp_dates(start_date, end_date)
        news_items: List[dict] = []

        try:
            if self._is_probable_ticker(ticker_or_query):
                self.logger.info(f"Fetching ticker news for: " f"{ticker_or_query}")
                iterator = self.client.list_ticker_news(
                    ticker=ticker_or_query,
                    published_utc_gte=start_date,
                    published_utc_lte=end_date,
                    sort="published_utc",
                    order="desc",
                    limit=50,
                )
                for item in iterator:
                    title = getattr(item, "title", "") or ""
                    description = getattr(item, "description", None)
                    published = getattr(item, "published_utc", None)
                    image_url = getattr(item, "image_url", None)
                    news_items.append(
                        {
                            "title": title,
                            "description": description,
                            "published_utc": published,
                            "image_url": image_url,
                        }
                    )
                    if len(news_items) >= 50:
                        break
                if news_items:
                    self.logger.info(
                        f"Collected {len(news_items)} " f"ticker news items"
                    )
                    _NEWS_CACHE[cache_key] = (news_items, time.time())
                    return news_items

            query_lower = ticker_or_query.lower()
            self.logger.info(f"Fetching news for keyword: {ticker_or_query}")
            url = "https://api.polygon.io/v2/reference/news"
            params = {
                "apiKey": self.POLYGON_API,
                "order": "desc",
                "sort": "published_utc",
                "limit": 50,
                "published_utc.gte": start_date,
                "published_utc.lte": end_date,
            }
            try:
                resp = requests.get(url, params=params, timeout=10)
                if resp.status_code == 429:
                    self.logger.warning("Rate limit hit, " "using fallback immediately")
                    raise RequestException("Rate limit")
                resp.raise_for_status()
                data = resp.json()
                results = data.get("results", [])
                for item in results:
                    title_lower = (item.get("title", "") or "").lower()
                    description_lower = (item.get("description", "") or "").lower()
                    if query_lower in title_lower or query_lower in description_lower:
                        news_items.append(
                            {
                                "title": item.get("title", ""),
                                "description": item.get("description"),
                                "published_utc": item.get("published_utc"),
                                "image_url": item.get("image_url"),
                            }
                        )
                        if len(news_items) >= 50:
                            break
                self.logger.info(
                    f"Found {len(news_items)} " f"news items matching keyword"
                )
            except Exception as e:
                self.logger.warning(f"Keyword search failed: {e}")

            # Fallback to category ticker
            if not news_items:
                ticker = self.CATEGORY_TICKERS.get(query_lower)
                if ticker:
                    self.logger.info(f"Using fallback ticker: {ticker}")
                    try:
                        iterator = self.client.list_ticker_news(
                            ticker=ticker,
                            published_utc_gte=start_date,
                            published_utc_lte=end_date,
                            sort="published_utc",
                            order="desc",
                            limit=50,
                        )
                        for item in iterator:
                            title = getattr(item, "title", "") or ""
                            description = getattr(item, "description", None)
                            published = getattr(item, "published_utc", None)
                            image_url = getattr(item, "image_url", None)
                            news_items.append(
                                {
                                    "title": title,
                                    "description": description,
                                    "published_utc": published,
                                    "image_url": image_url,
                                }
                            )
                            if len(news_items) >= 50:
                                break
                        self.logger.info(
                            f"Fallback collected " f"{len(news_items)} items"
                        )
                    except Exception as e:
                        self.logger.warning(f"Fallback ticker news error: {e}")

        except Exception as e:
            self.logger.error(f"News fetch error: {e}")

        _NEWS_CACHE[cache_key] = (news_items, time.time())
        return news_items

    def process_news_data(self, news_data: List[dict]) -> List[Dict[str, str]]:
        processed: List[Dict[str, str]] = []

        for item in news_data:
            try:
                published_utc = item.get("published_utc")
                if not published_utc:
                    continue
                published_utc_parsed = datetime.fromisoformat(
                    str(published_utc).replace("Z", "+00:00")
                )
                local_time = (published_utc_parsed + timedelta(hours=5)).strftime(
                    "%Y-%m-%d %H:%M:%S"
                )

                news_item: Dict[str, str] = {
                    "title": item.get("title", ""),
                    "local_time": local_time,
                }
                if desc := item.get("description"):
                    news_item["description"] = str(desc)
                if img := item.get("image_url"):
                    news_item["image_url"] = str(img)

                processed.append(news_item)
            except Exception as e:
                self.logger.warning(f"Skipped news item due to error: {e}")

        try:
            processed.sort(
                key=lambda x: datetime.strptime(x["local_time"], "%Y-%m-%d %|H:%M:%S"),
                reverse=True,
            )
        except Exception as e:
            self.logger.warning(f"Failed to sort news items: {e}")

        return processed

    def collect_and_process_news(
        self, ticker_or_query: str, start_date: str, end_date: str
    ) -> List[Dict[str, str]]:
        """Collect and process news data for a ticker or query."""
        raw = self.collect_news_data(ticker_or_query, start_date, end_date)
        return self.process_news_data(raw)
