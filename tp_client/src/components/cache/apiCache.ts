import localforage from 'localforage';
import {v4 as uuidv4} from 'uuid';
import {CachedItem} from "../types/types.tsx";

const CACHE_VERSION = 'v1';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

export const generateCacheKey =
    (
        ticker: string,
        start_date: string,
        end_date: string,
        steps: number
    ) => {
        return `ticker_data_${CACHE_VERSION}_${ticker}_${start_date}_${end_date}_${steps}_${uuidv4()}`;
    };

export const setCachedData =
    async <T>(key: string, data: T) => {
        const item: CachedItem<T> = { data, timestamp: Date.now()};
        await localforage.setItem(key, item);
    };

export const getCachedData =
    async <T>(key: string): Promise<T | null> => {
        const cachedItem = await localforage.getItem<CachedItem<T>>(key);
        if (cachedItem && (Date.now() - cachedItem.timestamp) < CACHE_EXPIRATION) {
            return cachedItem.data;
        }
        return null;
    };

