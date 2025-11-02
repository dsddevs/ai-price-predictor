import {TickerPointsType, TickerDataType, ActualDataType} from "../components/types/types.tsx";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface TickerDataState {
    tickerData: TickerDataType[],
    tickerOpen: TickerPointsType,
    tickerHigh: TickerPointsType,
    tickerLow: TickerPointsType,
    tickerClose: TickerPointsType,
    actualData: ActualDataType[],
}

const initialState: TickerDataState = {
    tickerData: [],
    tickerOpen: 0.0,
    tickerHigh: 0.0,
    tickerLow: 0.0,
    tickerClose: 0.0,
    actualData: [],
}

const tickerSlider = createSlice(
    {
        name: 'ticker',
        initialState,
        reducers: {
            setTickerData(state, action: PayloadAction<TickerDataType[]>) {
                state.tickerData = action.payload;
            },
            setTickerOpen(state, action: PayloadAction<TickerPointsType>) {
                state.tickerOpen = action.payload;
            },
            setTickerHigh(state, action: PayloadAction<TickerPointsType>) {
                state.tickerHigh = action.payload;
            },
            setTickerLow(state, action: PayloadAction<TickerPointsType>) {
                state.tickerLow = action.payload;
            },
            setTickerClose(state, action: PayloadAction<TickerPointsType>) {
                state.tickerClose = action.payload;
            },
            setActualData(state, action: PayloadAction<ActualDataType[]>){
                state.actualData = action.payload;
            }
        }
    }
);

export const {
    setTickerData,
    setTickerOpen,
    setTickerHigh,
    setTickerLow,
    setTickerClose,
    setActualData
} = tickerSlider.actions;
export default tickerSlider.reducer;
