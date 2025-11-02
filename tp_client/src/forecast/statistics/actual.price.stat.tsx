import React from "react";
import {ActualDataType, FutureDataType} from "../../components/types/types.tsx";
import {statStl} from "../../styles/stylebox.tsx";
import {useTranslation} from "react-i18next";


export const ActualPriceStat: React.FC<{
    chunk: FutureDataType[],
    rowIndex: number,
    actualData: ActualDataType[]
}> = ({chunk, rowIndex, actualData}) => {

    const {t} = useTranslation("translation");

    return(
        <div className={`${statStl.base}`}>
            <label htmlFor={`actual-prices`}
                className={`${statStl.label}`}>
                {t("stats.aPrice")}
            </label>
            {chunk.map((item, colIndex) => {
                const actualItem = actualData.find(d => d.time === item.time);
                return (
                    <span key={`actual-${rowIndex}-${colIndex}`}
                        className={`${statStl.values}`}>
                                {actualItem ? actualItem.close.toFixed(2) : '0.00'}
                    </span>
                );
            })}
        </div>
    )
}
