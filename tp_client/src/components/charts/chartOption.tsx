import {ColorType, CrosshairMode, IChartApi} from "lightweight-charts";

export const chartViewOptions = {
    layout: {
        background: {type: ColorType.Solid, color: '#14001a'},
        textColor: 'rgba(197, 203, 206, 0.5)',
    },
    grid: {
        vertLines: {
            color: 'rgb(19,19,37)',
        },
        horzLines: {
            color: 'rgb(19,19,37)',
        },
    },
    crosshair: {
        mode: CrosshairMode.Normal,
    },
    priceScale: {
        borderColor: 'rgba(197,203,206,0.8)',
    },
    timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
        timeVisible: true,
        secondsVisible: false,
        locale: 'en-US'
    },
};

export const setUpChartPriceScale = (chart: IChartApi) => {
    return chart.applyOptions({
        rightPriceScale: {
            scaleMargins: {
                top: 0.1,
                bottom: 0.1,
            },
            invertScale: false,
        },
    });
}

export const createChartResizeObserver = (chart: IChartApi) => {
    return new ResizeObserver(entries => {
        const {width, height} = entries[0].contentRect;
        chart?.applyOptions({width, height});
    });
}
