import {createChart} from "lightweight-charts";
import {chartViewOptions} from "./chartOption.tsx";

export const createNewChart = (currentChart: HTMLDivElement) => {
    const newChart = createChart(currentChart, {
        ...chartViewOptions,
        localization: {
            locale: 'en-US',
        },
    });
    newChart.timeScale().fitContent();
    return newChart;
}
