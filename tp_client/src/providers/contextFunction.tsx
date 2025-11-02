import {useContext} from "react";
import {AllContext} from "./contextCreator.tsx";

export const useAllContext = () => {
    const context = useContext(AllContext);
    if (context === undefined) {
        throw new Error('useAllContext must be used within Provider');
    }
    return context;
};
