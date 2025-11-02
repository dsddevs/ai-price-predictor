import {YDragging} from "../drags/y.dragging.tsx";
import React, {useCallback, useRef} from "react";
import {calculateNewYPosition} from "./screenSlider.tsx";
import {setYDrag} from "../drags/dragSlicer.tsx";
import {AppDispatch, RootState} from "../../store/store.tsx";
import {useDispatch, useSelector} from "react-redux";
import {Chart} from "../charts/chart.tsx";
import {Statistics} from "../../forecast/statistics/statistics.tsx";
import {screenStl} from "../../styles/stylebox.tsx";

export const ScreenLeft = React.memo(() => {
    const dispatch = useDispatch<AppDispatch>();
    const screenLeftRef = useRef<HTMLDivElement>(null);
    const { xDrag, isYDrag } = useSelector((state: RootState) => state.drag);
    const { screenWidth, yPosition } = useSelector((state: RootState) => state.screen);

    const doYMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!isYDrag) return;
            dispatch(calculateNewYPosition({ clientY: e.clientY }));
            dispatch(setYDrag(yPosition));
        },
        [isYDrag, dispatch, yPosition]
    );

    return (
        <div
            className={`${screenStl.left}`}
            ref={screenLeftRef}
            onMouseMove={doYMouseMove}
            style={{ width: `${screenWidth - xDrag}px` }}
        >
            <Chart />
            <Statistics />
            <YDragging />
        </div>
    );
});
