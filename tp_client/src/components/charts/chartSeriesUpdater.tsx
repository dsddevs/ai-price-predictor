import {IChartApi, ISeriesApi, LineStyle} from "lightweight-charts";
import {ChartDataType} from "../types/types.tsx";

export const updateTickerChartSeries = (
    chart: IChartApi,
    data: ChartDataType[],
    chartOption: string,
) => {

    let series: ISeriesApi<'Candlestick' | 'Line' | 'Area' | 'Histogram'>;

    switch (chartOption) {
        case 'line':
            series = chart.addLineSeries();
            break;
        case 'area':
            series = chart.addAreaSeries();
            break;
        case 'scatter': {
            const scatterOptions = {
                lineStyle: LineStyle.SparseDotted,
                crosshairMarkerVisible: false,
                lastValueVisible: false,
                color: 'white'
            };
            series = chart.addLineSeries(scatterOptions);
            break;
        }
        case 'histogram':
            series = chart.addHistogramSeries({
                color: '#26a69a',
                lastValueVisible: true,
                priceLineVisible: true,
            });
            break;
        case 'candlestick':
        default:
            series = chart.addCandlestickSeries({
                upColor: 'yellow',
                borderUpColor: 'yellow',
                wickUpColor: 'yellow',
                downColor: 'red',
                borderDownColor: 'red',
                wickDownColor: 'red'
            });
    }

    series.setData(data);
}
