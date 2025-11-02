import React, {useCallback, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setXDrag} from "../drags/dragSlicer.tsx";
import {setScreenWidth, setScreenHeight, calculateNewXPosition} from "./screenSlider.tsx";
import {AppDispatch, RootState} from "../../store/store.tsx";
import {News} from "../../news/news.tsx";
import {XDragging} from "../drags/x.dragging.tsx";
import {ScreenLeft} from "./screen.left.tsx";
import {screenStl} from "../../styles/stylebox.tsx";

export const Screen = React.memo(() => {

        const dispatch = useDispatch<AppDispatch>();
        const screenRef = useRef<HTMLDivElement>(null);
        const {isXDrag} = useSelector((state: RootState) => state.drag);
        const {xPosition} = useSelector((state: RootState) => state.screen);


        const doXMouseMove = useCallback(
            (e: React.MouseEvent) => {
                if (!isXDrag) return;
                dispatch(calculateNewXPosition({clientX: e.clientX}));
                dispatch(setXDrag(xPosition));
            },
            [isXDrag, dispatch, xPosition]
        );

        useEffect(() => {
            const resizeWindow = () => {
                if (screenRef.current) {
                    const offsetX = screenRef.current.offsetWidth;
                    const offsetY = screenRef.current.offsetHeight;
                    dispatch(setScreenWidth(offsetX));
                    dispatch(setScreenHeight(offsetY));
                }
            };
            resizeWindow();
            window.addEventListener('resize', resizeWindow);
            return () => window.removeEventListener('resize', resizeWindow);
        }, [dispatch]);


        return (
            <div
                className={`${screenStl.screen}`}
                ref={screenRef}
                onMouseMove={doXMouseMove}
            >
                <ScreenLeft/>
                <XDragging/>
                <News/>
            </div>
        );
    }
);
