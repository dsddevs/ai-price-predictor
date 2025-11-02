import {useSelector} from "react-redux";
import {RootState} from "../../store/store.tsx";
import {screenStl, tickerPointsStl} from "../../styles/stylebox.tsx";
import {IChartApi} from 'lightweight-charts';
import React, {useCallback, useEffect, useRef} from "react";
import {useDataSelectors, useSelectedLang} from "../selectors/selectors.tsx";
import {Loader} from "../loader/loader.tsx";
import {useAllContext} from "../../providers/contextFunction.tsx";
import {useCrosshairMove, useTickerPoints} from "../../data/tickerPoints.tsx";
import {formatTickerData} from "../../data/tickerFormatter.tsx";
import {formatFutureData} from "../../forecast/forcastFormatter.tsx";
import {createNewChart} from "./chartCreation.tsx";
import {updateTickerChartSeries} from "./chartSeriesUpdater.tsx";
import {updateForecastChartSeries} from "../../forecast/forecastSeriesUpdater.tsx";
import {createChartResizeObserver, setUpChartPriceScale} from "./chartOption.tsx";

export const Chart: React.FC = () => {
    const {screenHeight} = useSelector((state: RootState) => state.screen);
    const {yDrag} = useSelector((state: RootState) => state.drag);
    const {tickerOption, lang} = useSelector((state: RootState) => state.dropdown);
    const chartRef = useRef<HTMLDivElement | null>(null);
    const chart = useRef<IChartApi | null>(null);
    const {chartOption} = useSelector((state: RootState) => state.dropdown);
    const {tickerData} = useSelector((state: RootState) => state.ticker);
    const {forecastData, isForecastDataShow} =
        useSelector((state: RootState) => state.forecast);
    const handleCrosshairMove = useCrosshairMove(tickerData);
    const resizeObserver = useRef<ResizeObserver | null>(null);
    const fetchTickerData = useDataSelectors(tickerOption);
    const {isLoading, setIsLoading} = useAllContext().payload;
    const tickerPoints = useTickerPoints();
    const newLang = useSelectedLang(lang);


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await fetchTickerData();
            } catch (error) {
                console.error("Error fetching ticker data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData().catch(e => new Error(e));
    }, [fetchTickerData, setIsLoading]);

    const initChart = useCallback(() => {
        if (!chartRef.current || !tickerData) return;
        const formattedTickerData = formatTickerData(tickerData, chartOption);
        const formattedFutureData = formatFutureData(forecastData, chartOption)

        if (!chart.current) {
            chart.current = createNewChart(chartRef.current);
            chart.current.subscribeCrosshairMove(handleCrosshairMove);
        }
        if (chart.current) {
            try {
                updateTickerChartSeries(chart.current, formattedTickerData, chartOption);
                updateForecastChartSeries(chart.current, formattedFutureData, chartOption, isForecastDataShow);
                setUpChartPriceScale(chart.current);
                resizeObserver.current = createChartResizeObserver(chart.current);
                resizeObserver.current.observe(chartRef.current);
            } catch (error) {
                console.error('Error updating chart:', error);
            }
        }
    }, [tickerData, chartOption, forecastData, handleCrosshairMove, isForecastDataShow, resizeObserver])

    useEffect(() => {
        initChart();
        return () => {
            resizeObserver.current?.disconnect();
            if (chart.current) {
                chart.current?.remove();
                chart.current = null;
            }
        };
    }, [initChart]);


    return (
        <div className={`${screenStl.chart}}`}
             style={{height: `${screenHeight - yDrag}px`}}
        >
            {isLoading
                ? ( <Loader/>)
                : (<div style={{height: `${screenHeight - yDrag}px`}} ref={chartRef}>
                    <div className={`${tickerPointsStl.base}`}>
                        <div className={`${tickerPointsStl.indicatorsDiv}`}>
                            {tickerPoints.map(({id, label, value}) =>
                                    value !== null && (
                                        <div key={id} className={tickerPointsStl.indicators}>
                                            <span className={`${tickerPointsStl.label}`}>
                                                {label[newLang as keyof typeof label]}:
                                            </span>
                                            <span className={tickerPointsStl.digit}>
                                                {value.toFixed(2)}
                                            </span>
                                        </div>
                                    )
                            )}
                        </div>
                    </div>
                </div>)}
        </div>
    );
};

