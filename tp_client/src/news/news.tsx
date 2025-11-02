import {AppDispatch, RootState} from "../store/store.tsx";
import {useDispatch, useSelector} from 'react-redux';
import React, {useEffect} from "react";
import {Scrollbars} from "react-custom-scrollbars-2";
import {useRenderThump, useRenderTrack} from "../styles/yScrollStyle.tsx";
import {NewsData} from "./news.data.tsx";
import {newsStl} from "../styles/stylebox.tsx";
import {useTranslation} from "react-i18next";
import {useNewsSelectors} from "../components/selectors/selectors.tsx";
import {useAllContext} from "../providers/contextFunction.tsx";
import {Loader} from "../components/loader/loader.tsx";

export const News: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>()
    const {xDrag} = useSelector((state: RootState) => state.drag);
    const {news} = useSelector((state: RootState) => state.news);
    const {tickerOption, lang} = useSelector((state: RootState) => state.dropdown);
    const renderThumb = useRenderThump();
    const renderTrack = useRenderTrack();
    const {t} = useTranslation("translation");
    const fetchNewsData = useNewsSelectors(tickerOption, lang, dispatch);
    const {isLoading, setIsLoading} = useAllContext().payload;

    console.log('[NEWS COMPONENT] Current state:', {
        tickerOption,
        lang,
        newsCount: news.length,
        news: news.slice(0, 2)
    });

    useEffect(() => {
        const fetchData = async () => {
            console.log('[NEWS COMPONENT] Starting fetch for ticker:', tickerOption, 'lang:', lang);
            setIsLoading(true);
            try {
                await fetchNewsData();
                console.log('[NEWS COMPONENT] Fetch completed');
            } catch (error) {
                console.error("[NEWS COMPONENT] Error(fetching_news_data): ", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData().catch(e => new Error(e));
    }, [fetchNewsData, setIsLoading, lang, tickerOption]);

    return (
        <div
            id="right-container"
            className={`${newsStl.newsDiv}`}
            style={{width: `${xDrag}px`}}
        >
            <label htmlFor={`news`} className={`${newsStl.newsLabel}`}>
                {t("news.header")}
            </label>
            {isLoading
                ? (<Loader/>)
                : (
                    <div className={`${newsStl.scrollDiv}`}>
                        <Scrollbars
                            autoHide
                            autoHideTimeout={1000}
                            autoHideDuration={200}
                            renderThumbVertical={renderThumb}
                            renderTrackVertical={renderTrack}
                            style={{width: '100%', height: '100%'}}
                        >
                            <div className={`${newsStl.newsItems}`}>
                                {news.length === 0 ? (
                                    <div style={{padding: '20px', textAlign: 'center', color: '#888'}}>
                                        No news available for this ticker
                                    </div>
                                ) : (
                                    news.map((item, index) => (
                                        <NewsData key={index} item={item}/>
                                    ))
                                )}
                            </div>
                        </Scrollbars>
                    </div>
                )
            }
        </div>
    );
};
