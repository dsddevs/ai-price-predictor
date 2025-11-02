import React, {useEffect, useRef} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../styles/custom-calendar.css"
import {dropdownStl} from "../../../styles/stylebox.tsx";
import {setIsStartShow, setStartDate} from "../tools/dropdownSlider.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/store.tsx";
import {useMouseController} from "../tools/mouseController.tsx";
import {FaCalendarAlt} from "react-icons/fa";
import {format, parse} from "date-fns"
import {dateFormat} from "../../../data/tickerFormatter.tsx";
import {useTranslation} from "react-i18next";

export const StartedDateDD: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const {startDate, isStartShow} = useSelector((state: RootState) => state.dropdown);
    const startDateObj = parse(startDate, dateFormat, new Date);
    const calendarRef = useRef<HTMLDivElement>(null);
    const clickStartMouse = useMouseController(dispatch, calendarRef, setIsStartShow);
    const {t} = useTranslation("translation");

    const changeStartDate = (date: Date | null) => {
        if (date) {
            const startDateStr = format(date, dateFormat);
            dispatch(setStartDate(startDateStr));
            dispatch(setIsStartShow(false));
        }
    };
    const toggleCalendar = () => {
        dispatch(setIsStartShow(!isStartShow));
    };

    useEffect(() => {
        document.addEventListener('mousedown', clickStartMouse);
        return () => {
            document.removeEventListener('mousedown', clickStartMouse);
        };
    }, [clickStartMouse, dispatch]);

    return (
        <div ref={calendarRef} className={`${dropdownStl.base}`}>
            <div className={`${dropdownStl.rangeDiv}`}>
                <FaCalendarAlt className={`${dropdownStl.rangeIcon}`}/>
                <label htmlFor={`start-range-date-label`}
                       className={`${dropdownStl.rangeLabel}`}>{t("dd.start")}</label>
                <div className={`${dropdownStl.calendarDiv}`}>
                    <button className={`${dropdownStl.calendarBtn}`}
                            onClick={toggleCalendar}>
                        {startDate}
                    </button>
                    <div className={`${dropdownStl.calendar}`}>
                        {isStartShow && (
                            <DatePicker
                                selected={startDateObj}
                                onChange={changeStartDate}
                                calendarClassName="custom-calendar"
                                dayClassName={() => 'custom-day'}
                                inline

                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
