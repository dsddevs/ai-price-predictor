import {format, parseISO} from "date-fns";
import {FutureDataType} from "../../components/types/types.tsx";
import React from "react";
import {statStl} from "../../styles/stylebox.tsx";
import {useTranslation} from "react-i18next";

export const PeriodStat: React.FC<{
    chunk: FutureDataType[];
    rowIndex: number
}> = ({chunk, rowIndex}) => {

    const {t} = useTranslation("translation");

    return (
        <div className={`${statStl.base}`}>
            <label htmlFor={`price_period`}
                className={`${statStl.periodLabel}`}>
                {t("stats.period")} {rowIndex + 1}
            </label>
            {chunk.map((item, colIndex) => (
                <span key={`date-${rowIndex}-${colIndex}`}
                    className={`${statStl.periodValue}`}>
                    {format(parseISO(item.time), 'dd-MM-yy')}
                </span>
            ))}
        </div>
    );
};
