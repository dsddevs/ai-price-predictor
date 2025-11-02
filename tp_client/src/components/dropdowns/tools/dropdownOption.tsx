import {GiCandleHolder} from "react-icons/gi";
import {MdAreaChart, MdOutlineShowChart, MdScatterPlot} from "react-icons/md";
import {ImStatsBars2} from "react-icons/im";
import flagEn from "../../../assets/en.ico"
import flagRu from "../../../assets/ru.ico"
import {ChartOptType, TickerValuesType} from "../../types/types.tsx";


export const defaults = (() => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 4)).toISOString().split('T')[0];

    return {
        chart: 'candlestick',
        ticker: 'CL=F',
        start: startDate,
        end: endDate,
        nextDays: 90,
        lang: 'en',
        langIcon: flagEn
    };
})();

export const tickerOptionValues = [
    {value: 'CL=F', label: 'USOIL'},
    {value: 'GC=F', label: 'GOLD'},
    {value: 'NGZ24.NYM', label: 'GAS'},
    {value: 'BTC-USD', label: 'BTC'},
    {value: 'DX=F', label: 'USD'},
]
export const tickerLangOptValues: TickerValuesType[] = [
    {value: 'CL=F', label: {en: 'USOIL', ru: 'Нефть'}},
    {value: 'GC=F', label: {en: 'GOLD', ru: 'Золото'}},
    {value: 'NG=F', label: {en: 'GAS', ru: 'Газ'}},
    {value: 'BTC-USD', label: {en: 'BTC', ru: 'БТС'}},
    {value: 'DX=F', label: {en: 'USD', ru: 'ИДС'}},
];


export const newsTickerOption = {
    'CL=F': {
        en: 'oil prices',
        ru: 'нефть',
    },
    'GC=F': {
        en: 'gold prices',
        ru: 'золото',
    },
    'NG=F': {
        en: 'natural gas',
        ru: 'природный газ',
    },
    'BTC-USD': {
        en: 'bitcoin',
        ru: 'Биткойн',
    },
    'DX=F': {
        en: 'dollar index',
        ru: 'индекс доллара США',
    },
};

export const chartOptionValues = [
    {value: 'candlestick', label: 'Candlestick', icon: GiCandleHolder},
    {value: 'line', label: 'Line', icon: MdOutlineShowChart},
    {value: 'area', label: 'Area', icon: MdAreaChart},
    {value: 'scatter', label: 'Scatter', icon: MdScatterPlot},
    {value: 'histogram', label: 'Histogram', icon: ImStatsBars2},
];

export const chartLangOptValues: ChartOptType[] = [
    {value: 'candlestick', label: {en: 'Candlestick', ru: 'Свечка'}, icon: GiCandleHolder},
    {value: 'line', label: {en: 'Line', ru: 'Линия'}, icon: MdOutlineShowChart},
    {value: 'area', label: {en: 'Area', ru: 'Площадь'}, icon: MdAreaChart},
    {value: 'scatter', label: {en: 'Scatter', ru: 'Скаттер'}, icon: MdScatterPlot},
    {value: 'histogram', label: {en: 'Histogram', ru: "Гиксограмма"}, icon: ImStatsBars2},
];

export const langOptionValues = [
    {value: 'en', label: 'EN', icon: flagEn},
    {value: 'ru', label: 'RU', icon: flagRu},
];

export const fDaysOptionValues = [
    {value: 20, label: '20'},
    {value: 30, label: '30'},
    {value: 40, label: '40'},
    {value: 50, label: '50'},
    {value: 60, label: '60'},
    {value: 90, label: '90'},
]
