import React, {ReactNode, useState} from "react";
import {AllContext} from "./contextCreator.tsx";
import {AllContextType} from "../components/types/types.tsx";

interface CustomProviderProps {
    children: ReactNode;
}

export const CustomProvider: React.FC<CustomProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const contextValue: AllContextType = {
        payload: {
            isLoading,
            setIsLoading
        }
    };

    return (
        <AllContext.Provider value={contextValue}>
            {children}
        </AllContext.Provider>
    );
};

