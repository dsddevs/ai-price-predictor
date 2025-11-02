"""
Fallback data provider for when external APIs fail
"""

import logging

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


def generate_synthetic_data(
    ticker: str, start_date: str, end_date: str
) -> pd.DataFrame:
    """
    Generate synthetic market data when real data is unavailable
    """
    logger.warning(
        "Generating synthetic data for %s from %s to %s",
        ticker,
        start_date,
        end_date,
    )

    # Base prices for different assets
    base_prices = {
        "NG=F": 3.5,  # Natural Gas
        "CL=F": 75.0,  # Oil
        "GC=F": 1950.0,  # Gold
        "BTC-USD": 35000.0,  # Bitcoin
        "DX=F": 105.0,  # Dollar Index
    }

    base_price = base_prices.get(ticker, 100.0)

    # Generate date range
    start = pd.to_datetime(start_date)
    end = pd.to_datetime(end_date)
    dates = pd.date_range(start=start, end=end, freq="D")

    # Generate synthetic price data with realistic patterns
    num_days = len(dates)

    # Add trend
    trend = np.linspace(0, np.random.uniform(-0.1, 0.1) * base_price, num_days)

    # Add seasonality
    seasonal = base_price * 0.05 * np.sin(np.linspace(0, 4 * np.pi, num_days))

    # Add random walk
    random_walk = np.cumsum(np.random.randn(num_days) * base_price * 0.01)

    # Combine components
    close_prices = base_price + trend + seasonal + random_walk

    # Ensure positive prices
    close_prices = np.maximum(close_prices, base_price * 0.5)

    # Generate OHLC data
    data = []
    for i, date in enumerate(dates):
        close = close_prices[i]

        # Generate realistic OHLC values
        daily_range = close * np.random.uniform(0.01, 0.03)

        high = close + daily_range * np.random.uniform(0.3, 0.7)
        low = close - daily_range * np.random.uniform(0.3, 0.7)

        # Open is previous close with small gap
        if i > 0:
            open_price = close_prices[i - 1] * np.random.uniform(0.995, 1.005)
        else:
            open_price = close * np.random.uniform(0.995, 1.005)

        # Ensure logical OHLC relationship
        high = max(high, open_price, close)
        low = min(low, open_price, close)

        # Generate volume (higher for more liquid assets)
        volume_multiplier = {
            "BTC-USD": 1000000000,
            "CL=F": 500000,
            "GC=F": 300000,
            "NG=F": 200000,
            "DX=F": 100000,
        }.get(ticker, 100000)

        volume = int(volume_multiplier * np.random.uniform(0.5, 1.5))

        data.append(
            {
                "time": date.strftime("%Y-%m-%d %H:%M:%S"),
                "open": round(open_price, 2),
                "high": round(high, 2),
                "low": round(low, 2),
                "close": round(close, 2),
                "volume": volume,
            }
        )

    df = pd.DataFrame(data)
    logger.info(f"Generated {len(df)} synthetic data points for {ticker}")
    return df


def get_last_known_price(ticker: str) -> float:
    """
    Get last known price for a ticker
    """
    last_known = {
        "NG=F": 3.45,  # Natural Gas ~$3.45
        "CL=F": 78.50,  # WTI Oil ~$78.50
        "GC=F": 1985.30,  # Gold ~$1985.30
        "BTC-USD": 35250.00,  # Bitcoin ~$35,250
        "DX=F": 105.85,  # Dollar Index ~105.85
    }

    return last_known.get(ticker, 100.0)
