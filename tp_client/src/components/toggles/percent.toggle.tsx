import React from "react";
import {forecastBtnStl} from "../../styles/stylebox.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store.tsx";
import {setIsDiffPercentShow} from "../../forecast/forecastSlider.tsx";
import {useTranslation} from "react-i18next";

export const PercentToggle: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const {isDiffPercentShow} = useSelector((state: RootState) => state.forecast);
    const percentToggle  = () => {
        dispatch(setIsDiffPercentShow(!isDiffPercentShow));
    }
    const {t} = useTranslation("translation");

    return (
        <div className={`absolute right-4`}>
            <label className={`${forecastBtnStl.btnDiv}`}>
                <input type="checkbox"
                       checked={isDiffPercentShow}
                       onChange={percentToggle}
                       className="sr-only peer"
                />
                <div className={`${forecastBtnStl.div}`}/>
                <div className={`flex flex-row justify-center items-center space-x-2`}>
                    <span className={`${forecastBtnStl.label}`}>{t("stats.pToggle")} </span>
                    <span className={`text-[16px] text-line font-oswald`}>%</span>
                </div>
            </label>
        </div>
    )
}
