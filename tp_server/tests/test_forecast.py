import pandas as pd
import pytest
from app.forecast import get_forecast_data


@pytest.mark.anyio
async def test_get_forecast_data_basic():
    dates = pd.date_range("2024-01-01", periods=10, freq="B")
    df = pd.DataFrame(
        {
            "time": dates.strftime("%Y-%m-%d %H:%M:%S"),
            "close": [100 + i for i in range(10)],
        }
    )

    result = await get_forecast_data(df, steps=5)
    assert isinstance(result, list)
    # last historical + 5 forecast points
    assert len(result) == 6
    # each item has required keys
    for item in result:
        assert "time" in item and "close" in item
