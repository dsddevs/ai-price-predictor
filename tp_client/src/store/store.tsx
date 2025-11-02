import {configureStore} from '@reduxjs/toolkit';
import dragReducer from '../components/drags/dragSlicer.tsx';
import screenReducer from '../components/screens/screenSlider.tsx';
import dropdownReducer from '../components/dropdowns/tools/dropdownSlider.tsx';
import tickerReducer from '../data/tickerSlider.tsx';
import forecastReducer from '../forecast/forecastSlider.tsx';
import newsReducer from '../news/newsSlider.tsx'
import utilsReducer from '../components/utils/utilsSlider.tsx'


const store = configureStore({
    reducer: {
        drag: dragReducer,
        screen: screenReducer,
        dropdown: dropdownReducer,
        ticker: tickerReducer,
        forecast: forecastReducer,
        news: newsReducer,
        utils: utilsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store;

