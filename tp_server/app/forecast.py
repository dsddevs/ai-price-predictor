import logging
from typing import Dict, List

import numpy as np
import pandas as pd
from pandas.tseries.offsets import CustomBusinessDay

_logger = logging.getLogger(__name__)


def _prepare_dataframe(data: pd.DataFrame) -> pd.DataFrame:
    if data is None or data.empty:
        return pd.DataFrame()
    df = data.copy()
    df["ds"] = pd.to_datetime(df["time"])
    df = df.rename(columns={"close": "y"})
    return df


def _advanced_arima_forecast(
    df: pd.DataFrame,
    steps: int,
    confidence_interval: float = 0.95,
    use_random_seed: bool = False,
) -> pd.DataFrame:
    """
    Advanced ARIMA-like forecasting model

    Args:
        df: DataFrame with historical data
        steps: Number of forecast steps
        confidence_interval: Confidence interval (0.95 = 95%)
        use_random_seed: Use fixed seed (for testing only)
    """
    if df.empty or steps <= 0:
        return pd.DataFrame(columns=["ds", "yhat", "yhat_lower", "yhat_upper"])

    # Adaptive lookback period
    lookback = min(180, len(df))  # Increased to 180 days
    tail = df.tail(lookback).reset_index(drop=True)
    y = tail["y"].astype(float).values

    # Calculate first difference (stationarity)
    diff = np.diff(y)

    # Determine optimal AR model order
    max_ar_order = min(10, len(diff) - 1)  # Up to 10 lags
    best_ar_order = _select_best_ar_order(diff, max_ar_order)

    _logger.info(f"Selected AR order: {best_ar_order}")

    # Train AR model
    ar_weights = np.zeros(best_ar_order)
    if len(diff) > best_ar_order:
        X = np.array(
            [diff[i : i + best_ar_order] for i in range(len(diff) - best_ar_order)]
        )
        y_target = diff[best_ar_order:]

        try:
            # Use Ridge regression for stability
            from sklearn.linear_model import Ridge

            model = Ridge(alpha=1.0)
            model.fit(X, y_target)
            ar_weights = model.coef_
        except ImportError:
            # Fallback to ordinary least squares
            try:
                ar_weights = np.linalg.lstsq(X, y_target, rcond=None)[0]
            except np.linalg.LinAlgError:
                ar_weights = np.ones(best_ar_order) * 0.05
            except (ValueError, TypeError):
                ar_weights = np.ones(best_ar_order) * 0.05
    else:
        ar_weights = np.ones(best_ar_order) * 0.05

    # Calculate volatility with emphasis on recent data
    residuals = diff - np.mean(diff)
    recent_volatility = np.std(diff[-30:]) if len(diff) >= 30 else np.std(diff)
    overall_volatility = np.std(residuals)

    # Weighted volatility (more weight on recent data)
    volatility = 0.7 * recent_volatility + 0.3 * overall_volatility

    # Generate forecast
    forecast_prices = []
    forecast_lower = []
    forecast_upper = []
    recent_diffs = list(diff[-best_ar_order:])

    # Remove fixed seed for real forecasts
    if use_random_seed:
        np.random.seed(42)

    last_price = y[-1]
    current_price = last_price

    for i in range(steps):
        # AR component
        ar_component = np.dot(ar_weights, recent_diffs[-best_ar_order:])

        # Adaptive noise with decay over time
        noise_scale = volatility * (0.3 + 0.2 * np.exp(-i / 10))
        ma_noise = np.random.normal(0, noise_scale)

        # Forecast change
        next_diff = ar_component + ma_noise

        # Adaptive decay (smoother)
        decay = 0.98 ** (i / 5)
        next_diff *= decay

        # Next price
        next_price = current_price + next_diff

        # Softer constraints (±30% per step)
        step_lower = current_price * 0.7
        step_upper = current_price * 1.3
        next_price = max(step_lower, min(step_upper, next_price))

        # Confidence interval
        std_multiplier = 1.96 if confidence_interval == 0.95 else 2.58
        interval_width = volatility * np.sqrt(i + 1) * std_multiplier

        forecast_prices.append(next_price)
        forecast_lower.append(max(0, next_price - interval_width))
        forecast_upper.append(next_price + interval_width)

        # Update for next iteration
        recent_diffs.append(next_diff)
        recent_diffs.pop(0)
        current_price = next_price

    # Create results dataframe
    last_time = pd.to_datetime(df["ds"].iloc[-1])
    business_day = CustomBusinessDay(weekmask="Mon Tue Wed Thu Fri")
    future_index = pd.date_range(
        last_time, periods=steps + 1, freq=business_day, inclusive="both"
    )[1:]

    return pd.DataFrame(
        {
            "ds": future_index,
            "yhat": forecast_prices,
            "yhat_lower": forecast_lower,
            "yhat_upper": forecast_upper,
        }
    )


def _select_best_ar_order(diff: np.ndarray, max_order: int) -> int:
    """
    Select optimal AR model order using AIC
    """
    if len(diff) < max_order + 1:
        return min(5, len(diff) - 1)

    best_aic = float("inf")
    best_order = 5

    for order in range(1, max_order + 1):
        if len(diff) <= order:
            break

        X = np.array([diff[i : i + order] for i in range(len(diff) - order)])
        y_target = diff[order:]

        try:
            weights = np.linalg.lstsq(X, y_target, rcond=None)[0]
            predictions = X @ weights
            residuals = y_target - predictions

            # Calculate AIC
            n = len(y_target)
            mse = np.mean(residuals**2)
            if mse <= 0:
                aic = float("inf")
            else:
                aic = n * np.log(mse) + 2 * order

            if aic < best_aic:
                best_aic = aic
                best_order = order
        except (np.linalg.LinAlgError, ValueError, OverflowError):
            continue

    return best_order


def _prepare_future_response(
    df: pd.DataFrame,
    forecast: pd.DataFrame,
    steps: int,
    include_confidence: bool = True,
) -> List[Dict]:
    """
    Prepare forecast response
    """
    if forecast is None or forecast.empty:
        return []

    future_data = pd.concat(
        [
            pd.DataFrame(
                {
                    "time": [df["ds"].iloc[-1]],
                    "close": [df["y"].iloc[-1]],
                    "lower": [df["y"].iloc[-1]],
                    "upper": [df["y"].iloc[-1]],
                }
            ),
            forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]]
            .tail(steps)
            .rename(
                columns={
                    "ds": "time",
                    "yhat": "close",
                    "yhat_lower": "lower",
                    "yhat_upper": "upper",
                }
            ),
        ]
    ).reset_index(drop=True)

    future_data["time"] = pd.to_datetime(future_data["time"]).dt.strftime(
        "%Y-%m-%d %H:%M:%S"
    )
    future_data["close"] = future_data["close"].astype(float).round(2)

    if include_confidence:
        future_data["lower"] = future_data["lower"].astype(float).round(2)
        future_data["upper"] = future_data["upper"].astype(float).round(2)
    else:
        future_data = future_data.drop(columns=["lower", "upper"])

    return future_data.to_dict("records")


async def get_forecast_data(
    historical_df: pd.DataFrame,
    steps: int,
    confidence_interval: float = 0.95,
    include_confidence: bool = True,
    use_random_seed: bool = False,
) -> List[Dict]:
    """
    Generate price forecast

    Args:
        historical_df: Historical data
        steps: Number of days to forecast
        confidence_interval: Confidence interval (0.95 or 0.99)
        include_confidence: Include upper/lower bounds
        use_random_seed: Fixed seed (for testing only)
    """
    if steps <= 0:
        return []

    df = _prepare_dataframe(historical_df)
    if df.empty:
        return []

    _logger.info(f"Generating advanced ARIMA forecast for {steps} steps")

    forecast_df = _advanced_arima_forecast(
        df,
        steps,
        confidence_interval=confidence_interval,
        use_random_seed=use_random_seed,
    )

    return _prepare_future_response(
        df, forecast_df, steps, include_confidence=include_confidence
    )
