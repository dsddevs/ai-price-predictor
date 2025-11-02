import {TickerDataType, ChartDataType} from '../components/types/types.tsx';
import {UTCTimestamp} from "lightweight-charts";

export const formatTickerData = (
    data: TickerDataType[],
    chartType: string
): ChartDataType[] => {
    const formatData = (item: TickerDataType) => {

        const baseData = {
            time: (Date.parse(item.time) / 1000) as UTCTimestamp,
        };
        const difference = item.close - item.open;
        switch (chartType) {
            case 'line':
            case 'scatter':
            case 'area':
                return {
                    ...baseData,
                    value: item.close,
                };
            case 'histogram':
                return {
                    ...baseData,
                    value: difference,
                    color: difference >= 0 ? '#19ff00' : '#e42713',
                    text: `${difference >= 0 ? '+' : ''}${difference.toFixed(2)}`,
                };
            case 'candlestick':
            default:
                return {
                    ...baseData,
                    open: item.open,
                    high: item.high,
                    low: item.low,
                    close: item.close,
                };
        }
    };

    return data.map(formatData);
};

export const dateFormat = 'yyyy-MM-dd';
