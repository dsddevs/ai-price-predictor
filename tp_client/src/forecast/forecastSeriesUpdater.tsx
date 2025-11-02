import {IChartApi, ISeriesApi, LineStyle} from "lightweight-charts";
import {ChartFutureDataType} from "../components/types/types.tsx";

export const updateForecastChartSeries = (
    chart: IChartApi,
    futureData: ChartFutureDataType[],
    chartOption: string,
    showForecast: boolean
) => {

    let forecastSeries: ISeriesApi<'Line' | 'Area'>;

    if (showForecast) {
        switch (chartOption) {
            case 'line':
                forecastSeries = chart.addLineSeries({
                    color: '#b26d35',
                    lineWidth: 4
                });
                break;
            case 'scatter': {
                const scatterOptions = {
                    lineStyle: LineStyle.SparseDotted,
                    crosshairMarkerVisible: false,
                    lastValueVisible: false,
                    color: '#f87104'
                };
                forecastSeries = chart.addLineSeries(scatterOptions);
                break;
            }
            case 'area':
                forecastSeries = chart.addAreaSeries({
                    lineColor: '#fc6f00',
                    topColor: '#ad5c20',
                    lineWidth: 4
                });
                break
            default:
                return
        }
        forecastSeries.setData(futureData);
    }

}
