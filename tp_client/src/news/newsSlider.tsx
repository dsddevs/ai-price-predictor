import {NewsDataType} from "../components/types/types.tsx";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface NewsDataState {
    news: NewsDataType[]
}

const initialState: NewsDataState = {
    news: [],
}

const forecastSlider = createSlice(
    {
        name: 'news',
        initialState,
        reducers: {
            setNews(state, action:PayloadAction<NewsDataType[]>) {
                state.news = action.payload;
            },
        }
    }
);

export const {
    setNews,
} = forecastSlider.actions;
export default forecastSlider.reducer;
