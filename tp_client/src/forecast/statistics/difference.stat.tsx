import React from "react";
import {FutureDataType, TickerDataType} from "../../components/types/types.tsx";
import {statStl} from "../../styles/stylebox.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.tsx";
import {useTranslation} from "react-i18next";

export const DifferenceStat: React.FC<{
    chunk: FutureDataType[],
    rowIndex: number,
    actualData: TickerDataType[]
}> = ({chunk, rowIndex, actualData}) => {

    const {isDiffPercentShow} = useSelector((state: RootState) => state.forecast);
    const {t} = useTranslation("translation");

    return (
        <div className={`${statStl.base}`}>

            <label htmlFor={`difference`} className={`${statStl.label}`}>
                {t("stats.diff")} {isDiffPercentShow ? '(%)' : ''}
            </label>

            {chunk.map((item, colIndex) => {
                const actualItem = actualData.find(d => d.time === item.time);
                let diffValue: number | null = null;
                if (actualItem) {
                    if (isDiffPercentShow) diffValue = ((item.close - actualItem.close) / actualItem.close) * 100;
                    else diffValue = item.close - actualItem.close;
                }

                const difference = diffValue !== null
                    ? isDiffPercentShow
                        ? `${diffValue.toFixed(2)}%`
                        : diffValue.toFixed(2)
                    : '0.00';

                const textColor = diffValue !== null
                    ? diffValue > 0
                        ? 'text-green-500'
                        : diffValue < 0
                            ? 'text-red-500'
                            : ''
                    : 'text-gray-300';

                return (
                    <span key={`difference-${rowIndex}-${colIndex}`}
                          className={`${statStl.diffValue} ${textColor}`}>
                        {difference}
                    </span>
                );
            })}
        </div>
    )
}
