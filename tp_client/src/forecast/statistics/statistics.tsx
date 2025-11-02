import {RootState} from "../../store/store.tsx";
import {useSelector} from "react-redux";
import React, {useEffect, useMemo} from "react";
import {parseISO} from "date-fns"
import {chunk} from "lodash"
import {PeriodStat} from "./period.stat.tsx";
import {ActualPriceStat} from "./actual.price.stat.tsx";
import {FuturePriceStat} from "./future.price.stat.tsx";
import {DifferenceStat} from "./difference.stat.tsx";
import { Scrollbars } from 'react-custom-scrollbars-2';
import {useRenderThump, useRenderTrack} from "../../styles/yScrollStyle.tsx";
import {statStl} from "../../styles/stylebox.tsx";
import {ForecastToggle} from "../../components/toggles/forecast.toggle.tsx";
import {PercentToggle} from "../../components/toggles/percent.toggle.tsx";
import {ForecastDaysDd} from "../../components/dropdowns/dd/forecast.days.dd.tsx";
import {useTranslation} from "react-i18next";
import {useForecastSelector} from "../../components/selectors/selectors.tsx";

export const Statistics: React.FC = () => {
    const { yDrag } = useSelector((state: RootState) => state.drag);
    const { actualData} = useSelector((state: RootState) => state.ticker);
    const { tickerOption} = useSelector((state: RootState) => state.dropdown);
    const {forecastData, isForecastDataShow} =
        useSelector((state: RootState) => state.forecast);
    const renderThumb = useRenderThump();
    const renderTrack = useRenderTrack();

    const actualDataForForecastPeriod = useMemo(() => {
        if (!Array.isArray(actualData) || !Array.isArray(forecastData) || forecastData.length === 0) return [];
        const startDate = parseISO(forecastData[0].time);
        const endDate = parseISO(forecastData[forecastData.length - 1].time);
        return actualData?.filter(item => {
            const itemDate = parseISO(item?.time);
            return itemDate >= startDate && itemDate <= endDate;
        }) || [];
    }, [actualData, forecastData]);

    const {t} = useTranslation("translation");
    const fetchForecastData = useForecastSelector(tickerOption);
    const chunkSize = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchForecastData();
            } catch (error) {
                console.error("Error(fetching_forecast_data): ", error);
            }
        };
        fetchData().catch(e => new Error(e));
    }, [fetchForecastData]);

    return (
        <div className={`${statStl.screenBox}`}
            style={{ height: `${yDrag}px` }}>
                <div className={`${statStl.screenDiv}`}>
                    <div className={`z-50 absolute top-3 py-1 text-[20px] font-oswald bg-header max-h-full w-[1405px] text-line text-center`}>
                        <div className={`relative flex flex-row justify-center items-center `}>
                            <ForecastDaysDd/>
                            <h2>{t("stats.header")}</h2>
                            <ForecastToggle/>
                            <PercentToggle/>
                        </div>
                    </div>

                    {isForecastDataShow && forecastData && forecastData.length > 0 ? (
                        <Scrollbars
                            autoHide
                            autoHideTimeout={1000}
                            autoHideDuration={200}
                            renderThumbVertical={renderThumb}
                            renderTrackVertical={renderTrack}
                            style={{ width: '100%', height: '100%' }}
                        >
                            <div className="space-y-4 mt-12">
                                {chunk(forecastData.slice(1),
                                    chunkSize).map((chunk, rowIndex) => (
                                    <div key={rowIndex}>
                                        <PeriodStat chunk={chunk} rowIndex={rowIndex}/>
                                        <ActualPriceStat chunk={chunk} rowIndex={rowIndex}
                                                        actualData={actualDataForForecastPeriod}/>
                                        <FuturePriceStat chunk={chunk} rowIndex={rowIndex}/>
                                        <DifferenceStat chunk={chunk} rowIndex={rowIndex}
                                                        actualData={actualDataForForecastPeriod}/>
                                    </div>
                                ))}
                            </div>
                        </Scrollbars>
                    ) : (
                        <div className={`${statStl.nonScreen}`}>
                            {t("stats.default")}
                        </div>
                    )}
                </div>
        </div>
    );
};
