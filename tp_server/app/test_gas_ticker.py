"""
Test script to verify NG=F (Natural Gas) ticker data fetching.
"""

import asyncio
import logging
import traceback
from datetime import datetime, timedelta

from app.yfinance import fetch_historical_data

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)


async def test_gas_ticker() -> None:
    """Test fetching data for Natural Gas and related futures."""
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")

    tickers_to_test = ["NG=F", "CL=F", "GC=F"]

    for ticker in tickers_to_test:
        print(f"\n{'=' * 50}")
        print(f"Testing ticker: {ticker}")
        print(f"Date range: {start_date} to {end_date}")
        print("=" * 50)

        try:
            data = await fetch_historical_data(ticker, start_date, end_date)

            if data is not None and not data.empty:
                print(f"Successfully fetched {len(data)} " f"data points for {ticker}")
                print("First 3 rows:")
                print(data.head(3).to_string(index=False))
                print("\nLast 3 rows:")
                print(data.tail(3).to_string(index=False))

                if "close" in data.columns:
                    avg_price = data["close"].mean()
                    print(f"\nAverage close price: ${avg_price:.2f}")
            else:
                print(f"No data returned for {ticker}")

        except Exception as e:  # noqa: BLE001
            print(f"Error fetching {ticker}: {e}")
            traceback.print_exc()


if __name__ == "__main__":
    print("Starting Natural Gas ticker test...")
    asyncio.run(test_gas_ticker())
    print("\nTest completed!")
