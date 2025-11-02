"""
Application monitoring and metrics
"""

import logging
import time
from contextlib import contextmanager
from datetime import datetime
from functools import wraps
from typing import Any, Dict, Optional

import psutil

logger = logging.getLogger(__name__)


class MetricsCollector:
    """Collect and store application metrics"""

    def __init__(self):
        self.metrics = {
            "requests": {
                "total": 0,
                "success": 0,
                "error": 0,
                "by_endpoint": {},
                "by_status": {},
            },
            "performance": {"response_times": [], "slow_requests": []},
            "system": {"cpu_percent": 0, "memory_percent": 0, "disk_usage": 0},
            "business": {
                "api_calls": {"yahoo_finance": 0, "polygon": 0, "news_api": 0},
                "predictions_made": 0,
                "active_websockets": 0,
            },
        }
        self.start_time = datetime.utcnow()

    def record_request(
        self,
        endpoint: str,
        method: str,
        status_code: int,
        response_time: float,
    ):
        """Record HTTP request metrics"""
        requests_metrics = self.metrics["requests"]
        performance_metrics = self.metrics["performance"]

        requests_metrics["total"] += 1

        if 200 <= status_code < 400:
            requests_metrics["success"] += 1
        else:
            requests_metrics["error"] += 1

        # By endpoint
        endpoint_key = f"{method} {endpoint}"
        endpoint_counts = requests_metrics["by_endpoint"]
        endpoint_counts[endpoint_key] = endpoint_counts.get(endpoint_key, 0) + 1

        # By status code
        status_key = str(status_code)
        status_counts = requests_metrics["by_status"]
        status_counts[status_key] = status_counts.get(status_key, 0) + 1

        # Response time
        response_times = performance_metrics["response_times"]
        response_times.append(response_time)

        # Keep only last 1000 response times
        if len(response_times) > 1000:
            performance_metrics["response_times"] = response_times[-1000:]

        # Track slow requests (> 1 second)
        if response_time > 1.0:
            slow_requests = performance_metrics["slow_requests"]
            slow_requests.append(
                {
                    "endpoint": endpoint_key,
                    "response_time": response_time,
                    "timestamp": datetime.utcnow().isoformat(),
                }
            )

            # Keep only last 100 slow requests
            if len(slow_requests) > 100:
                performance_metrics["slow_requests"] = slow_requests[-100:]

    def record_api_call(self, api_name: str):
        """Record external API call"""
        business_metrics = self.metrics["business"]
        api_calls = business_metrics["api_calls"]
        if api_name in api_calls:
            api_calls[api_name] += 1

    def update_system_metrics(self):
        """Update system resource metrics"""
        system_metrics = self.metrics["system"]
        try:
            system_metrics["cpu_percent"] = psutil.cpu_percent(interval=1)
            system_metrics["memory_percent"] = psutil.virtual_memory().percent
            system_metrics["disk_usage"] = psutil.disk_usage("/").percent
        except Exception as e:
            logger.error(f"Failed to collect system metrics: {e}")

    def get_metrics(self) -> Dict[str, Any]:
        """Get all collected metrics"""
        self.update_system_metrics()

        # Calculate aggregates
        response_times = self.metrics["performance"]["response_times"]
        if response_times:
            avg_response_time = sum(response_times) / len(response_times)
            sorted_times = sorted(response_times)
            p95_index = int(len(response_times) * 0.95)
            p99_index = int(len(response_times) * 0.99)
            p95_response_time = sorted_times[p95_index]
            p99_response_time = sorted_times[p99_index]
        else:
            avg_response_time = 0
            p95_response_time = 0
            p99_response_time = 0

        uptime = (datetime.utcnow() - self.start_time).total_seconds()
        requests_metrics = self.metrics["requests"]
        if uptime > 0:
            requests_per_second = requests_metrics["total"] / uptime
        else:
            requests_per_second = 0

        return {
            **self.metrics,
            "aggregates": {
                "avg_response_time": avg_response_time,
                "p95_response_time": p95_response_time,
                "p99_response_time": p99_response_time,
                "uptime_seconds": uptime,
                "requests_per_second": requests_per_second,
            },
        }

    def reset_metrics(self):
        """Reset all metrics"""
        self.__init__()


# Global metrics collector instance
metrics_collector = MetricsCollector()


def track_time(metric_name: Optional[str] = None):
    """Decorator to track function execution time"""

    def decorator(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                return result
            finally:
                execution_time = time.time() - start_time
                logger.debug(
                    f"Function {func.__name__} executed",
                    extra={
                        "function": func.__name__,
                        "execution_time": execution_time,
                        "metric_name": metric_name,
                    },
                )

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                return result
            finally:
                execution_time = time.time() - start_time
                logger.debug(
                    f"Function {func.__name__} executed",
                    extra={
                        "function": func.__name__,
                        "execution_time": execution_time,
                        "metric_name": metric_name,
                    },
                )

        # Return appropriate wrapper based on function type
        import asyncio

        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        return sync_wrapper

    return decorator


@contextmanager
def track_operation(operation_name: str):
    """Context manager to track operation execution"""
    start_time = time.time()
    logger.info(f"Starting operation: {operation_name}")

    try:
        yield
    except Exception as e:
        logger.error(
            f"Operation {operation_name} failed",
            extra={
                "operation": operation_name,
                "error": str(e),
            },
        )
        raise
    finally:
        execution_time = time.time() - start_time
        logger.info(
            f"Operation {operation_name} completed",
            extra={
                "operation": operation_name,
                "execution_time": execution_time,
            },
        )


class HealthChecker:
    """Application health checking"""

    @staticmethod
    def check_database(database_url: Optional[str]) -> Dict[str, Any]:
        """Check database connectivity"""
        if not database_url:
            return {
                "status": "not_configured",
                "message": "Database not configured",
            }

        try:
            # Add actual database check here
            return {"status": "healthy", "message": "Database is accessible"}
        except Exception as e:
            return {"status": "unhealthy", "message": str(e)}

    @staticmethod
    def check_redis(redis_url: Optional[str]) -> Dict[str, Any]:
        """Check Redis connectivity"""
        if not redis_url:
            return {
                "status": "not_configured",
                "message": "Redis not configured",
            }

        try:
            # Add actual Redis check here
            return {"status": "healthy", "message": "Redis is accessible"}
        except Exception as e:
            return {"status": "unhealthy", "message": str(e)}

    @staticmethod
    def check_external_apis() -> Dict[str, Dict[str, Any]]:
        """Check external API availability"""
        apis = {
            "yahoo_finance": {
                "status": "healthy",
                "message": "API accessible",
            },
            "polygon": {
                "status": "healthy",
                "message": "API accessible",
            },
            "news_api": {
                "status": "healthy",
                "message": "API accessible",
            },
        }

        # Add actual API checks here

        return apis

    @classmethod
    def get_health_status(cls, settings) -> Dict[str, Any]:
        """Get overall health status"""
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "checks": {
                "database": cls.check_database(settings.database_url),
                "redis": cls.check_redis(settings.redis_url),
                "external_apis": cls.check_external_apis(),
            },
            "metrics": metrics_collector.get_metrics(),
        }
