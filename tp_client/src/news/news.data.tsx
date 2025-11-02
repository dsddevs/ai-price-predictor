import React, {useState} from "react";
import {newsStl} from "../styles/stylebox.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../store/store.tsx";
import {useSelectedTicker} from "../components/selectors/selectors.tsx";
import {tickerImages} from "./newsUrls.tsx";
import {NewsDataProps} from "../components/types/types.tsx";


export const NewsData: React.FC<NewsDataProps> = ({item}) => {
    const [expanded, setExpanded] = useState(false);
    const {tickerOption} = useSelector((state: RootState) => state.dropdown);
    const tickerValue = useSelectedTicker(tickerOption);
    
    const getTickerImage = (ticker: string) => {
        const tickerImg = tickerImages[ticker as keyof typeof tickerImages];
        const itemImg = item.image_url;
        return itemImg || tickerImg || 'https://via.placeholder.com/400x200?text=No+Image';
    };

    const hasDescription = item.description && item.description.trim().length > 0;

    return (
        <div className={`${newsStl.base}`}>
            <img src={getTickerImage(tickerValue)} alt={item.title} className={newsStl.img} />
            <div className="p-4">
                <h2 className={`${newsStl.title}`}>{item.title}</h2>
                <p className={newsStl.time}>{item.local_time}</p>
                {hasDescription && (
                    <>
                        {expanded ? (
                            <p className={`${newsStl.descOpen}`}>{item.description}</p>
                        ) : (
                            <p className={`${newsStl.descClose}`}>{item.description}</p>
                        )}
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className={`${newsStl.btn}`}
                        >
                            {expanded ? 'Read less' : 'Read more'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
