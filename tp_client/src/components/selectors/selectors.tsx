import {useMemo} from "react";
import {
    chartLangOptValues,
    defaults,
    fDaysOptionValues,
    langOptionValues,
    newsTickerOption, tickerLangOptValues,
    tickerOptionValues,
} from "../dropdowns/tools/dropdownOption.tsx";
import {debounce} from "lodash";
import {fetchActualData, fetchTickerData} from "../../connections/api.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store.tsx";
import {startWebSocketForecast, startWebSocketNews} from "../../connections/socket.tsx";

export const useSelectedTicker = (tickerOption: string) => {
    const [selectedTicker] = useMemo(() => [
        tickerOptionValues.find(option => option.value === tickerOption),
    ], [tickerOption]);
    return selectedTicker?.value || defaults.ticker;
}

export const useSelectedLangTicker = (tickerOption: string, lang: string) => {
    const selectedTicker = useMemo(() =>
            tickerLangOptValues.find(option => option.value === tickerOption),
        [tickerOption]
    );
    return selectedTicker
        ? selectedTicker.label[lang as keyof typeof selectedTicker.label] || defaults.ticker
        : defaults.ticker;
}

export const useSelectedLangChart = (chartOption: string) => {
    return useMemo(() =>
        chartLangOptValues.find(option => option.value === chartOption),
        [chartOption]);
}

const useSelectedDays = (forecastDays: number) => {
    const [selectedDays] = useMemo(() => [
        fDaysOptionValues.find(option => option.value === forecastDays),
    ], [forecastDays]);
    return selectedDays?.value || defaults.nextDays;
}

export const useSelectedLang = (lang: string) => {
    const [selectedLang] = useMemo(() => [
        langOptionValues.find(option => option.value === lang)
    ], [lang]);
    return selectedLang?.value || defaults.lang;
};

export const useDataSelectors = (tickerOption: string) => {
    const dispatch = useDispatch<AppDispatch>();
    const {startDate, endDate, forecastDays } = useSelector((state: RootState) => state.dropdown);
    const tickerValue = useSelectedTicker(tickerOption);
    const daysValue = useSelectedDays(forecastDays);

    return useMemo(
        () => debounce(() => {
            dispatch(fetchTickerData(tickerValue, startDate, endDate, daysValue));
            dispatch(fetchActualData(tickerValue));
        }, 300),
        [dispatch, startDate, endDate, daysValue, tickerValue]
    );
}

export const useForecastSelector = (tickerOption: string) => {
    const dispatch = useDispatch<AppDispatch>();
    const {startDate, endDate, forecastDays } =
        useSelector((state: RootState) => state.dropdown);
    const tickerValue = useSelectedTicker(tickerOption);
    const daysValue = useSelectedDays(forecastDays);

    return useMemo(
        () => debounce(() => {
            dispatch(startWebSocketForecast(tickerValue, startDate, endDate, daysValue));
        }, 300),
        [dispatch, startDate, endDate, daysValue, tickerValue]
    );
}

export const useNewsSelectors = (tickerOption: string, lang: string, dispatch: AppDispatch) => {
    const tickerValue = useSelectedTicker(tickerOption);
    const tickerNews = newsTickerOption[tickerValue as keyof typeof newsTickerOption];
    const newsTicker = tickerNews && lang in tickerNews ? tickerNews[lang as keyof typeof tickerNews] : 'GENERAL';
    const newLang = useSelectedLang(lang);

    console.log('[NEWS SELECTOR] Debug:', {
        tickerOption,
        tickerValue,
        tickerNews,
        newsTicker,
        lang,
        newLang
    });

    return useMemo(
        () => debounce(() => {
            console.log(`[NEWS SELECTOR] Dispatching WebSocket news for: ${newsTicker}, lang: ${newLang}`);
            dispatch(startWebSocketNews(newsTicker, newLang));
        }, 300),
        [dispatch, newsTicker, newLang]
    );
}

