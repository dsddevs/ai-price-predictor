import {ChartFutureDataType, FutureDataType} from "../components/types/types.tsx";
import {UTCTimestamp} from "lightweight-charts";

export const formatFutureData = (
    forecastData: FutureDataType[],
    chartType: string) : ChartFutureDataType[] => {
    const formatData = (item: FutureDataType) => {
        const baseData = {
            time: (Date.parse(item.time) / 1000) as UTCTimestamp,
        };
        switch (chartType) {
            case 'scatter':
            case 'line':
            case 'area':
            default:
                return {
                    ...baseData,
                    value: item.close,
                };
        }
    };
    return forecastData.map(formatData);

}


