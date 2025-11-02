import {AppDispatch} from "../store/store.tsx";
import {setForecastData} from "../forecast/forecastSlider.tsx";
import {FutureDataType, NewsDataType, WebSocketData, WebSocketParams} from "../components/types/types.tsx";
import {setNews} from "../news/newsSlider.tsx";


const createWebSocketConnection = <T,>(
    url: string,
    params: WebSocketParams,
    onData: (data: T) => void
) => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
        socket.send(JSON.stringify({ params }));
    };

    socket.onmessage = (e) => {
        console.log(`[WS] Received message from ${url}:`, e.data);
        const data: WebSocketData<T> = JSON.parse(e.data);
        if (data.error) {
            console.error('[WS] WebSocket error:', data.error);
        } else if (data.forecast_data || data.news_data) {
            const receivedData = data.forecast_data || data.news_data as T;
            onData(receivedData);
        }
    };

    socket.onerror = (error) => {
        console.error('[WS] WebSocket Error:', error);
    };

    return () => {
        socket.close();
    };
};

export const startWebSocketForecast = (
    ticker: string,
    startDate: string,
    endDate: string,
    steps: number
) => (dispatch: AppDispatch) => {
    return createWebSocketConnection<FutureDataType[]>(
        'ws://localhost:8001/ws/forecast_data/',
        { ticker, start_date: startDate, end_date: endDate, steps },
        (data) => dispatch(setForecastData(data))
    );
};

export const startWebSocketNews = (
    ticker: string,
    lang: string
) => (dispatch: AppDispatch) => {
    console.log(`[WS NEWS] Starting WebSocket for ticker: ${ticker}, lang: ${lang}`);
    return createWebSocketConnection<NewsDataType[]>(
        'ws://localhost:8001/ws/news_data/',
        { ticker, lang },
        (data) => {
            console.log(`[WS NEWS] Received ${data?.length || 0} news items`);
            dispatch(setNews(data));
        }
    );
};
