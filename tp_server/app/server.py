import asyncio
import json
import os
import subprocess
import time
from datetime import datetime, timedelta
from typing import Optional

from fastapi import (
    FastAPI,
    HTTPException,
    Query,
    Request,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .forecast import get_forecast_data
from .news import NewsCollector
from .yfinance import fetch_historical_data, format_data_for_history

app = FastAPI(title="Trade Predictor Server", version="1.0.0")

# CORS для dev (3001) и статики (8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

static_dir = os.path.join(
    os.path.dirname(__file__),
    "..",
    "..",
    "tp_client",
    "dist",
)
print(f"[DEBUG] Static dir path: {static_dir}")
print(f"[DEBUG] Exists? {os.path.exists(static_dir)}")

if os.path.exists(static_dir):
    index_exists = os.path.exists(os.path.join(static_dir, "index.html"))
    print(f"[DEBUG] index.html exists? {index_exists}")
    assets_dir = os.path.join(static_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
        print("[INFO] Mounted /assets from dist/assets")
    else:
        print(f"[WARNING] assets dir not found: {assets_dir}")
else:
    print(
        "[ERROR] dist not found! Run 'npm run build' in tp_client first. "
        "Static serving disabled."
    )


@app.get("/health")
async def health(request: Request):
    path = request.url.path
    print(f"[HEALTH DEBUG] Health endpoint called for path: {path}")
    return {"status": "ok"}


@app.get("/api/ticker-data")
async def api_ticker_data(
    ticker: str = Query("CL=F"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    steps: int = Query(0, ge=0, le=365),
):
    try:
        if end_date is None:
            end_date = datetime.now().strftime("%Y-%m-%d")
        if start_date is None:
            start_limit = datetime.now() - timedelta(days=3650)
            start_date = start_limit.strftime("%Y-%m-%d")
        df = await fetch_historical_data(ticker, start_date, end_date)
        historical = format_data_for_history(df)
        return historical
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch ticker data: {str(e)}"
        )


@app.get("/api/actual-data")
async def api_actual_data(
    ticker: str = Query("CL=F"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
):
    try:
        if end_date is None:
            end_date = datetime.now().strftime("%Y-%m-%d")
        if start_date is None:
            start_limit = datetime.now() - timedelta(days=90)
            start_date = start_limit.strftime("%Y-%m-%d")
        df = await fetch_historical_data(ticker, start_date, end_date)
        actual = format_data_for_history(df)
        return actual
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch actual data: {str(e)}"
        )


@app.websocket("/ws/forecast_data/")
async def ws_forecast_data(websocket: WebSocket):
    await websocket.accept()
    try:
        text = await websocket.receive_text()
        payload = json.loads(text)
        params = (payload or {}).get("params", {})
        ticker = params.get("ticker", "CL=F")
        start_date = params.get("start_date")
        end_date = params.get("end_date")
        steps = int(params.get("steps", 0))

        if end_date is None:
            end_date = datetime.now().strftime("%Y-%m-%d")
        if start_date is None:
            start_date = (datetime.now() - timedelta(days=3650)).strftime("%Y-%m-%d")

        df = await fetch_historical_data(ticker, start_date, end_date)
        forecast = await get_forecast_data(df, steps)
        await websocket.send_text(json.dumps({"forecast_data": forecast}))
    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_text(json.dumps({"error": str(e)}))
        except (WebSocketDisconnect, RuntimeError, ConnectionError):
            pass


@app.websocket("/ws/news_data/")
async def ws_news_data(websocket: WebSocket):
    await websocket.accept()
    try:
        text = await websocket.receive_text()
        payload = json.loads(text)
        params = (payload or {}).get("params", {})
        ticker = params.get("ticker", "WTI")
        lang = params.get("lang", "en")

        keyword_mapping = {
            # English mappings
            "oil": "oil prices",
            "usoil": "oil prices",
            "crude": "oil prices",
            "crude oil": "oil prices",
            "gold": "gold price",
            "gas": "natural gas",
            "natural gas": "natural gas",
            "us dollar index": "dollar index",
            "usd": "dollar index",
            # Russian mappings
            "нефть": "нефть",
            "золото": "золото",
            "газ": "природный газ",
            "природный газ": "природный газ",
            "биткойн": "биткойн",
            "бтс": "биткойн",
            "индекс доллара": "индекс доллара",
            "индекс доллара сша": "индекс доллара сша",
            "идс": "индекс доллара",
            # Direct ticker mappings (Yahoo -> keyword)
            "cl=f": "oil prices",
            "gc=f": "gold price",
            "btc-usd": "bitcoin",
            "btc=f": "bitcoin",
            "ng=f": "natural gas",
            "dx=f": "dollar index",
        }

        normalized_query = ticker
        try:
            lower = str(ticker).strip().lower()
            if lower in keyword_mapping:
                normalized_query = keyword_mapping[lower]
            else:
                print(
                    f"[NEWS WS] WARNING: No mapping found for '{ticker}', "
                    f"using as-is"
                )
        except Exception as e:
            print(f"[NEWS WS] Normalization error: {e}")

        end_date = datetime.now().strftime("%Y-%m-%d")
        start_date = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")

        print("[NEWS WS] ====== NEWS REQUEST ====== ")
        print(f"[NEWS WS] Received ticker: {ticker}")
        print(f"[NEWS WS] Language: {lang}")
        print(f"[NEWS WS] Normalized query: '{normalized_query}'")
        print(f"[NEWS WS] Date range: {start_date} to {end_date}")

        collector = NewsCollector()
        items = await asyncio.to_thread(
            collector.collect_and_process_news,
            normalized_query,
            start_date,
            end_date,
        )
        print(f"[NEWS WS] Collected {len(items)} news items")
        if len(items) > 0:
            first_title = items[0].get("title", "N/A")[:60]
            print(f"[NEWS WS] First item: {first_title}...")
        elif len(items) == 0:
            print("[NEWS WS] WARNING: No news found for query " f"'{normalized_query}'")
        await websocket.send_text(json.dumps({"news_data": items}))
    except WebSocketDisconnect:
        print("[NEWS WS] Client disconnected")
    except Exception as e:
        print(f"[NEWS WS] ERROR: {type(e).__name__}: {e}")
        import traceback

        traceback.print_exc()
        try:
            await websocket.send_text(json.dumps({"error": str(e)}))
        except WebSocketDisconnect:
            pass


@app.get("/{full_path:path}")
async def serve_spa(request: Request, full_path: str):
    path = request.url.path
    print(f"[SPA DEBUG] Catch-all hit for path: {path}")

    if path.startswith("/api") or path.startswith("/ws") or path == "/health":
        print(
            "[SPA DEBUG] ERROR: API/Health path "
            f"{path} reached catch-all! Check route order."
        )
        raise HTTPException(status_code=500, detail="Misconfigured route order")

    try:
        if static_dir and os.path.exists(static_dir):
            index_path = os.path.join(static_dir, "index.html")
            print(f"[SPA DEBUG] Serving index.html from {index_path}")
            return FileResponse(index_path)
        else:
            raise HTTPException(status_code=404, detail="Frontend build not found")
    except Exception as e:
        error_message = str(e)
        print(f"[SPA ERROR] Failed to serve SPA for " f"{path}: {error_message}")
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"SPA serving error: {str(e)}")


if __name__ == "__main__":
    tp_client_dir = os.path.join(os.path.dirname(__file__), "..", "tp_client")
    if os.path.exists(tp_client_dir) and os.path.exists(
        os.path.join(tp_client_dir, "package.json")
    ):
        print("[INFO] Starting React dev server on 3001...")
        env = os.environ.copy()
        env["PORT"] = "3001"

        dev_process = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=tp_client_dir,
            shell=True,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,
        )
        print(f"[INFO] React dev PID: {dev_process.pid}")

        def read_output(pipe, label):
            for line in iter(pipe.readline, ""):
                print(f"[REACT DEV {label}] {line.strip()}")

        def read_stdout():
            return read_output(dev_process.stdout, "STDOUT")

        asyncio.create_task(asyncio.to_thread(read_stdout))

        def read_stderr():
            return read_output(dev_process.stderr, "STDERR")

        asyncio.create_task(asyncio.to_thread(read_stderr))
        time.sleep(5)
        if dev_process.poll() is not None:
            return_code = dev_process.returncode
            print(f"[WARNING] React dev process died with code {return_code}")
    else:
        print("[WARNING] tp_client not found — skipping dev server.")

    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8001, reload=True)
