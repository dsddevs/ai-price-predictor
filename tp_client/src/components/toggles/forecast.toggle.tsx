import React from "react";
import {forecastBtnStl} from "../../styles/stylebox.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store.tsx";
import {setIsForecastShow} from "../../forecast/forecastSlider.tsx";
import {useTranslation} from "react-i18next";

export const ForecastToggle: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const {isForecastDataShow} = useSelector((state: RootState) => state.forecast);
    const forecastToggle = () => {
        dispatch(setIsForecastShow(!isForecastDataShow));
    }
    const {t} = useTranslation("translation");

    return (
        <div className={`absolute right-[150px]`}>
            <label className={`${forecastBtnStl.btnDiv}`}>
                <input type="checkbox"
                       checked={isForecastDataShow}
                       onChange={forecastToggle}
                       className="sr-only peer"
                />
                <div className={`${forecastBtnStl.div}`}/>
                <span className={`${forecastBtnStl.label}`}>{t("stats.fToggle")}</span>
            </label>
        </div>
    )
}
