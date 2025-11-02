import {CSSProperties, useCallback} from "react";


export const useRenderThump = () => {
    return useCallback(
        ({ style, ...props }: { style: CSSProperties }) => {
            const thumbStyle: CSSProperties = {
                backgroundColor: '#b26d35',
                borderRadius: '4px'
            };
            return <div style={{ ...style, ...thumbStyle }} {...props} />;
        },
        []
    );
};

export const useRenderTrack = () => {
    return useCallback(({style, ...props}: { style: CSSProperties }) => {
        const trackStyle: CSSProperties = {
            backgroundColor: '#331806',
            right: 2,
            bottom: 2,
            top: 2,
            borderRadius: '4px'
        };
        return <div style={{...style, ...trackStyle}} {...props} />;
    }, []);
}
