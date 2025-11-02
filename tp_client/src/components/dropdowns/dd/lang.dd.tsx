import React, {useEffect, useRef} from "react";
import {dropdownStl} from "../../../styles/stylebox.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/store.tsx";
import {useMouseController} from "../tools/mouseController.tsx";
import {setIsLangShow, setLang,} from "../tools/dropdownSlider.tsx";
import {defaults, langOptionValues} from "../tools/dropdownOption.tsx";
import {useTranslation} from "react-i18next";

export const LangDd: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const {lang, isLangShow} = useSelector((state: RootState) => state.dropdown);
    const langRef = useRef<HTMLDivElement>(null);
    const selectedLang =
        langOptionValues.find(option => option.value === lang);
    const selectedLangIcon = selectedLang?.icon || defaults.langIcon;
    const selectedLangLabel = selectedLang?.label || defaults.lang;
    const clickLangMouse = useMouseController(dispatch, langRef, setIsLangShow);
    const { i18n } = useTranslation();

    useEffect(() => {
        document.addEventListener('mousedown', clickLangMouse);
        return () => {
            document.removeEventListener('mousedown', clickLangMouse);
        };
    }, [clickLangMouse, dispatch]);

    useEffect(() => {
        i18n.changeLanguage(lang)
            .catch(e => new Error(e));
    }, [lang, i18n]);

    return (
        <div ref={langRef} className={`${dropdownStl.base}`}>
            <div onClick={() => dispatch(setIsLangShow(!isLangShow))}
                 className={`${dropdownStl.selectionDiv}`}
            >
                <div className={`${dropdownStl.selection}`}>
                    {selectedLangIcon &&
                        <img src={selectedLangIcon}
                             alt="Selected Language Flag"
                             className={`${dropdownStl.langSelectedIcon}`}/>
                    }
                    {selectedLangLabel &&
                        <span className={`${dropdownStl.selectedLabel}`}>
                            {selectedLangLabel}
                        </span>
                    }
                </div>
            </div>

            {isLangShow && (
                <div className={`${dropdownStl.langOptionDiv}`}>
                    {langOptionValues.map((option) => (
                        <div key={option.value}
                             onClick={() => {
                                 dispatch(setLang(option.value));
                                 dispatch(setIsLangShow(false));
                             }}
                             className={`${dropdownStl.chartOption}`}
                        >
                            <img src={option.icon}
                                 alt={`${option.label} Flag`}
                                 className={`${dropdownStl.langOptionIcon}`}/>
                            <span className={`${dropdownStl.optionLabel}`}>
                                {option.label}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
