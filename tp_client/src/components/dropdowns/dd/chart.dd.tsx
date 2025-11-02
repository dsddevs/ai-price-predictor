import React, {useRef, useEffect} from 'react';
import {BsChevronDown} from "react-icons/bs";
import {dropdownStl} from "../../../styles/stylebox.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/store.tsx";
import {setChartOption, setIsChartOptionShow} from "../tools/dropdownSlider.tsx";
import {chartLangOptValues, chartOptionValues} from "../tools/dropdownOption.tsx";
import {useMouseController} from "../tools/mouseController.tsx";
import {useSelectedLang} from "../../selectors/selectors.tsx";

export const ChartDd: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const {chartOption, isChartOptionShow, lang} = useSelector((state: RootState) => state.dropdown);
    const chartRef = useRef<HTMLDivElement>(null);
    const selectedChart =
        chartOptionValues.find(option => option.value === chartOption);
    const ChartIconOn = selectedChart?.icon;
    const clickChartMouse = useMouseController(dispatch, chartRef, setIsChartOptionShow);
    const newLang = useSelectedLang(lang);

    useEffect(() => {
        document.addEventListener('mousedown', clickChartMouse);
        return () => {
            document.removeEventListener('mousedown', clickChartMouse);
        };
    }, [clickChartMouse, dispatch]);


    return (
        <div ref={chartRef} className={`${dropdownStl.base}`}>
            <div onClick={() => dispatch(setIsChartOptionShow(!isChartOptionShow))}
                 className={`${dropdownStl.selectionDiv}`}
            >
                <div className={`${dropdownStl.selection}`}>
                    {ChartIconOn && <ChartIconOn className={`${dropdownStl.chartSelectedIcon}`}/>}
                </div>
                <BsChevronDown className={`${dropdownStl.chartSelectionIcon}`}/>
            </div>

            {isChartOptionShow && (
                <div className={`${dropdownStl.chartOptionDiv}`}>
                    {chartLangOptValues.map((option) => (
                        <div key={option.value}
                             onClick={() => {
                                 dispatch(setChartOption(option.value));
                                 dispatch(setIsChartOptionShow(false));
                             }}
                             className={`${dropdownStl.chartOption}`}
                        >
                            <option.icon className={`${dropdownStl.chartOptionIcon}`}/>
                            <span className={`${dropdownStl.optionLabel}`}>
                              {option.label[newLang as keyof typeof option.label]}
                            </span>
                        </div>

                    ))}
                </div>
            )}
        </div>
    );
};


