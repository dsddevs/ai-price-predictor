import {AreaData, CandlestickData, LineData} from "lightweight-charts";
import {IconType} from "react-icons";

export interface TickerDataType {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface ActualDataType {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface FutureDataType {
    time: string,
    close: number
}

export interface NewsDataType {
    "title": string,
    "local_time": string,
    "description"?: string,
    "image_url"?: string
}

export interface NewsDataProps {
    item: {
        title: string;
        local_time: string;
        description?: string;
        image_url?: string;
    };
}

export interface WebSocketParams {
    ticker: string;
    start_date?: string;
    end_date?: string;
    steps?: number;
    lang?: string;
}

export type WebSocketData<T> = {
    error?: string;
    forecast_data?: T;
    news_data?: T;
}

export interface CachedItem<T> {
    data: T;
    timestamp: number;
}

export interface AllContextType {
    payload: {
        isLoading: boolean;
        setIsLoading: (newValue: boolean) => void;
    };
}

export type TickerPointsType = number | null;
export type ChartDataType = LineData | AreaData | CandlestickData;
export type ChartFutureDataType = LineData | AreaData
export type TickerValuesType = {
    value: string;
    label: {
        en: string;
        ru: string;
    };
};
export type TickerLangPointsType = {
    id: string;
    label: {
        en: string;
        ru: string;
    },
    value: TickerPointsType;
};


export type ChartOptType = {
    value: string;
    label: {
        en: string;
        ru: string;
    };
    icon: IconType
};
