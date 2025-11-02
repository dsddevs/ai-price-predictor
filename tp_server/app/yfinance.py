import asyncio
import logging
from typing import Dict, List, Optional

try:
    import pandas as pd
    import yfinance as yf
except Exception:
    yf = None
    pd = None


from .fallback_data import generate_synthetic_data

_logger = logging.getLogger(__name__)
_cache: Dict[str, List[Dict]] = {}


def _process_data(df: pd.DataFrame) -> pd.DataFrame:
    try:
        # Map column names
        column_mapping = {}
        for col in df.columns:
            col_lower = col.lower()
            if "open" in col_lower:
                column_mapping[col] = "open"
            elif "high" in col_lower:
                column_mapping[col] = "high"
            elif "low" in col_lower:
                column_mapping[col] = "low"
            elif "close" in col_lower:
                column_mapping[col] = "close"
            elif "volume" in col_lower:
                column_mapping[col] = "volume"

        # Rename columns
        df = df.rename(columns=column_mapping)

        # Select required columns (handle missing volume)
        required_cols = ["open", "high", "low", "close"]
        if "volume" in df.columns:
            required_cols.append("volume")
        else:
            df["volume"] = 0  # Add dummy volume if not present
            required_cols.append("volume")

        processed = df[required_cols].round(2).reset_index()
        processed.columns = ["time"] + required_cols

        # Handle different time formats
        if hasattr(processed["time"], "dt"):
            processed["time"] = processed["time"].dt.strftime("%Y-%m-%d %H:%M:%S")
        else:
            processed["time"] = pd.to_datetime(processed["time"]).dt.strftime(
                "%Y-%m-%d %H:%M:%S"
            )

        return processed
    except Exception as e:
        _logger.exception("Cannot process data: %s", e)
        raise


async def fetch_historical_data(
    ticker: str, start_date: str, end_date: str
) -> pd.DataFrame:
    cache_key = f"{ticker}_{start_date}_{end_date}"
    if cache_key in _cache:
        return pd.DataFrame(_cache[cache_key])

    if yf is None:
        raise RuntimeError(
            "yfinance is not installed. " "Please add it to requirements and install."
        )

    # Alternative tickers for problematic symbols
    ticker_alternatives = {
        "NG=F": ["NG=F", "NGZ24.NYM", "NG00.NYM"],
    }

    tickers_to_try = ticker_alternatives.get(ticker, [ticker])
    last_error = None

    for try_ticker in tickers_to_try:
        try:
            _logger.info(f"Trying to fetch data for ticker: {try_ticker}")
            data = yf.Ticker(try_ticker)
            hist_data = await asyncio.to_thread(
                data.history, start=start_date, end=end_date, interval="1d"
            )

            if hist_data is not None and not hist_data.empty:
                processed = _process_data(hist_data)
                _cache[cache_key] = processed.to_dict("records")
                _logger.info(
                    f"Successfully fetched data for "
                    f"{try_ticker} "
                    f"(original: {ticker})"
                )
                return processed
            else:
                _logger.warning(f"Empty data for ticker {try_ticker}")

        except Exception as e:
            _logger.warning(f"Failed to fetch {try_ticker}: {e}")
            last_error = e
            continue

    # If all attempts failed, use fallback synthetic data
    _logger.warning(
        f"All API attempts failed for {ticker}. " f"Using fallback synthetic data."
    )
    try:
        synthetic_data = generate_synthetic_data(ticker, start_date, end_date)
        _cache[cache_key] = synthetic_data.to_dict("records")
        return synthetic_data
    except Exception as fallback_error:
        _logger.error(f"Fallback data generation also failed: " f"{fallback_error}")
        if last_error:
            raise ValueError(
                f"Could not fetch data for {ticker}. "
                f"API error: {last_error}, Fallback error: {fallback_error}"
            )
        else:
            raise ValueError(f"No data available for ticker {ticker}")


def format_data_for_history(
    historical_data: Optional[pd.DataFrame],
) -> List[Dict]:
    try:
        if historical_data is None or historical_data.empty:
            return []
        return historical_data[["time", "open", "high", "low", "close"]].to_dict(
            "records"
        )
    except Exception as e:
        _logger.exception("Cannot format data for history: %s", e)
        return []


def format_data_for_forecast(
    historical_data: Optional[pd.DataFrame],
) -> List[Dict]:
    try:
        if historical_data is None or historical_data.empty:
            return []
        cols = ["time", "close"]

        if "volume" in historical_data.columns:
            cols.append("volume")
        return historical_data[cols].to_dict("records")

    except Exception as e:
        _logger.exception("Cannot format data for forecast: %s", e)
        return []
