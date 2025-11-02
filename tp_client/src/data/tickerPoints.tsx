import {useCallback} from "react";
import {MouseEventParams} from "lightweight-charts";
import {TickerDataType, TickerLangPointsType} from "../components/types/types.tsx";
import {setTickerClose, setTickerHigh, setTickerLow, setTickerOpen} from "./tickerSlider.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store.tsx";

export const useCrosshairMove = (tickerData: TickerDataType[]) => {
    const dispatch = useDispatch<AppDispatch>();

    return useCallback((param: MouseEventParams) => {
        if (!param.time || !tickerData.length) {
            dispatch(setTickerOpen(null));
            dispatch(setTickerHigh(null));
            dispatch(setTickerLow(null));
            dispatch(setTickerClose(null));
            return;
        }

        const paramTime = (param.time as number) * 1000;
        const threshold = 60 * 60 * 24 * 1000;

        const dataPoint = tickerData.find(item => {
            const itemTime = new Date(item.time).getTime();
            return Math.abs(itemTime - paramTime) < threshold;
        });

        if (dataPoint) {
            dispatch(setTickerOpen(dataPoint.open));
            dispatch(setTickerHigh(dataPoint.high));
            dispatch(setTickerLow(dataPoint.low));
            dispatch(setTickerClose(dataPoint.close));
        } else {
            dispatch(setTickerOpen(null));
            dispatch(setTickerHigh(null));
            dispatch(setTickerLow(null));
            dispatch(setTickerClose(null));
        }
    }, [tickerData, dispatch]);
};

export const useTickerPoints = (): TickerLangPointsType[] => {
    const { tickerOpen, tickerHigh, tickerLow, tickerClose } = useSelector((state: RootState) => state.ticker);
    return [
        {id: 'open', label: {en: 'Open', ru: 'Открыто'}, value: tickerOpen},
        {id: 'close', label: {en: 'Close', ru: 'Закрыто'}, value: tickerClose},
        {id: 'high', label: {en: 'High', ru: 'Высокий'}, value: tickerHigh},
        {id: 'low', label: {en: 'Low', ru: 'Низкий'}, value: tickerLow},
    ];
}


