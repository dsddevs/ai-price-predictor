import React from "react";
import {FutureDataType} from "../../components/types/types.tsx";
import {statStl} from "../../styles/stylebox.tsx";
import {useTranslation} from "react-i18next";


export const FuturePriceStat: React.FC<{
    chunk: FutureDataType[],
    rowIndex: number
}> = ({chunk, rowIndex}) => {

    const {t} = useTranslation("translation");

    return(
        <div className={`${statStl.base}`}>
            <label htmlFor={`future-prices`}
                   className={`${statStl.label}`}>
                {t("stats.fPrice")}
            </label>
            {chunk.map((item, colIndex) => (
                <span key={`forecast-${rowIndex}-${colIndex}`}
                      className={`${statStl.values}`}>
                    {item.close.toFixed(2)}
                </span>
            ))}
        </div>
    )
}
