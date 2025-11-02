import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/store.tsx";
import React, {useEffect, useRef} from "react";
import {fDaysOptionValues} from "../tools/dropdownOption.tsx";
import {setForecastDays, setIsForecastDaysShow} from "../tools/dropdownSlider.tsx";
import {dropdownStl} from "../../../styles/stylebox.tsx";
import {FaCalendarWeek} from "react-icons/fa";
import {useTranslation} from "react-i18next";

export const ForecastDaysDd: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const {forecastDays, isForecastDaysShow} = useSelector((state: RootState) => state.dropdown);
    const daysDropdownRef = useRef<HTMLDivElement>(null);
    const selectedDay =
        fDaysOptionValues.find(option => option.value === forecastDays);
    const selectedDaysLabel = selectedDay?.label;
    const {t} = useTranslation("translation");


    useEffect(() => {
        const clickOutsideDays = (e: MouseEvent) => {
            if (daysDropdownRef.current && !daysDropdownRef.current.contains(e.target as Node)) {
                dispatch(setIsForecastDaysShow(false));
            }
        };
        document.addEventListener('mousedown', clickOutsideDays);
        return () => {
            document.removeEventListener('mousedown', clickOutsideDays);
        };
    }, [dispatch]);

    return (
        <div ref={daysDropdownRef} className={`${dropdownStl.dayBase}`}>

            <div onClick={() => dispatch(setIsForecastDaysShow(!isForecastDaysShow))}
                 className={`${dropdownStl.daySelectDiv}`}
            >
                <FaCalendarWeek className={`${dropdownStl.daysIcon}`}/>
                <div className={`${dropdownStl.daySelection}`}>
                    {selectedDaysLabel &&
                        <span className={`${dropdownStl.daySelectedLabel}`}>
                            {selectedDaysLabel} {t("stats.day")}
                        </span>}
                </div>
            </div>

            {isForecastDaysShow && (
                <div className={`${dropdownStl.dayOptionDiv}`}>
                    <div className={`${dropdownStl.dayOptionTable}`}>
                        {fDaysOptionValues.map((option) => (
                            <div key={option.value}
                                 className={`${dropdownStl.dayOption}`}
                                 onClick={() => {
                                     dispatch(setForecastDays(option.value));
                                     dispatch(setIsForecastDaysShow(false));
                                 }}
                            >
                                <span className={`${dropdownStl.optionLabel}`}>{option.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
