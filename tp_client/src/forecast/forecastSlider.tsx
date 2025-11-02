import {FutureDataType} from "../components/types/types.tsx";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface ForecastDataState {
    forecastData: FutureDataType[],
    isForecastDataShow: boolean,
    isDiffPercentShow: boolean
}

const initialState: ForecastDataState = {
    forecastData: [],
    isForecastDataShow: false,
    isDiffPercentShow: false
}

const forecastSlider = createSlice(
    {
        name: 'forecast',
        initialState,
        reducers: {
            setForecastData(state, action:PayloadAction<FutureDataType[]>) {
                state.forecastData = action.payload;
            },
            setIsForecastShow(state, action:PayloadAction<boolean>) {
                state.isForecastDataShow = action.payload;
            },
            setIsDiffPercentShow(state, action:PayloadAction<boolean>) {
                state.isDiffPercentShow = action.payload;
            }
        }
    }
);

export const {
    setForecastData,
    setIsForecastShow,
    setIsDiffPercentShow
} = forecastSlider.actions;
export default forecastSlider.reducer;
