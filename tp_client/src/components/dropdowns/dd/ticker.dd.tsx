import {FiAlignJustify} from "react-icons/fi";
import {dropdownStl} from "../../../styles/stylebox.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/store.tsx";
import React, {useEffect, useRef} from "react";
import {tickerLangOptValues} from "../tools/dropdownOption.tsx";
import {setTickerOption, setIsTickerOptionShow} from "../tools/dropdownSlider.tsx";
import {useMouseController} from "../tools/mouseController.tsx";
import {useSelectedLang, useSelectedLangTicker} from "../../selectors/selectors.tsx";

export const TickerDd: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const {lang, tickerOption, isTickerOptionShow} = useSelector((state: RootState) => state.dropdown);
    const tickerRef = useRef<HTMLDivElement>(null);
    const clickTickerMouse = useMouseController(dispatch, tickerRef, setIsTickerOptionShow);
    const newLang = useSelectedLang(lang);
    const SelectedTickerLabel = useSelectedLangTicker(tickerOption, newLang);

    useEffect(() => {
        document.addEventListener('mousedown', clickTickerMouse);
        return () => {
            document.removeEventListener('mousedown', clickTickerMouse);
        };
    }, [clickTickerMouse, dispatch]);

    return (
        <div ref={tickerRef} className={`${dropdownStl.base}`}>
            <div onClick={() => dispatch(setIsTickerOptionShow(!isTickerOptionShow))}
                 className={`${dropdownStl.selectionDiv}`}
            >
                <FiAlignJustify className={`${dropdownStl.icon}`}/>
                <div className={`${dropdownStl.selection}`}>
                    {SelectedTickerLabel &&
                        <span className={`${dropdownStl.selectedLabel}`}>
                            {SelectedTickerLabel}
                        </span>}
                </div>
            </div>

            {isTickerOptionShow && (
                <div className={`${dropdownStl.tickerOptionDiv}`}>
                    {tickerLangOptValues.map((option) => (
                        <div key={option.value}
                             onClick={() => {
                                 dispatch(setTickerOption(option.value));
                                 dispatch(setIsTickerOptionShow(false));
                             }}
                             className={`${dropdownStl.tickerOption}`}
                        >
                            <span className={`${dropdownStl.optionLabel}`}>
                                 {option.label[newLang as keyof typeof option.label]}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
