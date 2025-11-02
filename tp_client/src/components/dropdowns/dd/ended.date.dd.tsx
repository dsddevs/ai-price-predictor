import React, {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/store.tsx";
import {setEndDate, setIsEndShow} from "../tools/dropdownSlider.tsx";
import {dropdownStl} from "../../../styles/stylebox.tsx";
import DatePicker from "react-datepicker";
import "../../../styles/custom-calendar.css"
import "react-datepicker/dist/react-datepicker.css";
import {format, parse} from "date-fns";
import {useMouseController} from "../tools/mouseController.tsx";
import {FaCalendarAlt} from "react-icons/fa";
import {dateFormat} from "../../../data/tickerFormatter.tsx";
import {useTranslation} from "react-i18next";


export const EndedDateDd: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const {endDate, isEndShow} = useSelector((state: RootState) => state.dropdown);
    const endDateObj = parse(endDate, dateFormat, new Date());
    const calendarRef = useRef<HTMLDivElement>(null);
    const clickEndMouse = useMouseController(dispatch, calendarRef, setIsEndShow);
    const {t} = useTranslation("translation");

    const changeEndDate = (date: Date | null) => {
        if (date) {
            const endDateStr = format(date, dateFormat);
            dispatch(setEndDate(endDateStr));
            dispatch(setIsEndShow(false));
        }
    };
    const toggleCalendar = () => {
        dispatch(setIsEndShow(!isEndShow));
    };

    useEffect(() => {
        document.addEventListener('mousedown', clickEndMouse);
        return () => {
            document.removeEventListener('mousedown', clickEndMouse);
        };
    }, [clickEndMouse, dispatch]);

    return (
        <div className={`${dropdownStl.base}`}>
            <div className={`${dropdownStl.rangeDiv}`}>
                <FaCalendarAlt className={`${dropdownStl.rangeIcon}`}/>
                <label htmlFor={`end-range-date-label`}
                       className={`${dropdownStl.rangeLabel}`}>{t("dd.end")}</label>
                <div ref={calendarRef}
                     className={`${dropdownStl.calendarDiv}`}>
                    <button className={`${dropdownStl.calendarBtn}`}
                            onClick={toggleCalendar}>
                        {endDate}
                    </button>
                    <div className={`${dropdownStl.calendar}`}>
                        {isEndShow && (
                            <DatePicker
                                selected={endDateObj}
                                onChange={changeEndDate}
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
