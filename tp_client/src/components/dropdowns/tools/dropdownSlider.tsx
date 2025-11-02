import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {defaults} from "./dropdownOption.tsx";


interface dropdownState {
    chartOption: string,
    isChartOptionShow: boolean,

    tickerOption: string,
    isTickerOptionShow: boolean

    startDate: string,
    isStartShow: boolean

    endDate: string,
    isEndShow: boolean

    forecastDays: number,
    isForecastDaysShow: boolean

    lang: string,
    isLangShow: boolean
}



const initialState: dropdownState = {
    chartOption: defaults.chart,
    isChartOptionShow: false,

    tickerOption: defaults.ticker,
    isTickerOptionShow: false,

    startDate: defaults.start,
    isStartShow: false,

    endDate: defaults.end,
    isEndShow: false,

    forecastDays: defaults.nextDays,
    isForecastDaysShow: false,

    lang: defaults.lang,
    isLangShow: false
}

const dropdownSlider = createSlice({
    name: 'dropdown',
    initialState,
    reducers: {
        setChartOption(state, action: PayloadAction<string>) {
            state.chartOption = action.payload;
        },
        setIsChartOptionShow(state, action: PayloadAction<boolean>) {
            state.isChartOptionShow = action.payload;
        },
        setTickerOption(state, action: PayloadAction<string>) {
            state.tickerOption = action.payload;
        },
        setIsTickerOptionShow(state, action: PayloadAction<boolean>) {
            state.isTickerOptionShow = action.payload;
        },
        setStartDate(state, action: PayloadAction<string>) {
            state.startDate = action.payload;
        },
        setIsStartShow(state, action: PayloadAction<boolean>) {
            state.isStartShow = action.payload;
        },
        setEndDate(state, action: PayloadAction<string>) {
            state.endDate = action.payload;
        },
        setIsEndShow(state, action: PayloadAction<boolean>) {
            state.isEndShow = action.payload;
        },
        setForecastDays(state, action: PayloadAction<number>){
            state.forecastDays = action.payload;
        },
        setIsForecastDaysShow(state, action: PayloadAction<boolean>) {
            state.isForecastDaysShow = action.payload;
        },
        setLang(state, action: PayloadAction<string>) {
            state.lang = action.payload;
        },
        setIsLangShow(state, action: PayloadAction<boolean>){
            state.isLangShow = action.payload;
        }
    }
});

export const {
    setChartOption,
    setIsChartOptionShow,

    setTickerOption,
    setIsTickerOptionShow,

    setStartDate,
    setIsStartShow,

    setEndDate,
    setIsEndShow,

    setForecastDays,
    setIsForecastDaysShow,

    setLang,
    setIsLangShow
}
    = dropdownSlider.actions;
export default dropdownSlider.reducer;
