import axios from 'axios';
import {ActualDataType, TickerDataType} from "../components/types/types.tsx";
import {AppDispatch} from "../store/store.tsx";
import {setActualData, setTickerData} from "../data/tickerSlider.tsx";
import {format, parse} from "date-fns"
import {dateFormat} from "../data/tickerFormatter.tsx";
import {generateCacheKey, getCachedData, setCachedData} from "../components/cache/apiCache.ts";

export const fetchTickerData = (ticker: string, start_date: string, end_date: string, steps: number) =>
    async (dispatch: AppDispatch) => {

        const cacheKey = generateCacheKey(ticker, start_date, end_date, steps);
        try {

            const cachedData = await getCachedData<TickerDataType[]>(cacheKey);
            if (cachedData) {
                dispatch(setTickerData(cachedData));
                return;
            }

            const res = await axios.get<TickerDataType[]>('http://localhost:8001/api/ticker-data', {
                params: {
                    ticker,
                    start_date: format(parse(start_date, dateFormat, new Date()), dateFormat),
                    end_date: format(parse(end_date, dateFormat, new Date()), dateFormat),
                    steps
                },
            });
            await setCachedData(cacheKey, res.data);
            dispatch(setTickerData(res.data));
        } catch (error) {
            console.error('Error: fetching ticker data:', error);
            throw error;
        }
    };

export const fetchActualData = (
    ticker: string,
) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.get<ActualDataType[]>('http://localhost:8001/api/actual-data', {
            params: {ticker},
        })
        dispatch(setActualData(res.data));
    } catch (error) {
        console.error('Error: fetching actual ticker data:', error);
        throw error;
    }
};
