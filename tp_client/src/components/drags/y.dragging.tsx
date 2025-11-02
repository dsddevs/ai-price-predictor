import {AppDispatch, RootState} from "../../store/store.tsx";
import {useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect} from "react";
import {setIsYDrag} from "./dragSlicer.tsx";
import {dragStl} from "../../styles/stylebox.tsx";

export const YDragging = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { yDrag } = useSelector((state: RootState) => state.drag);
    const stopYMouseUp = useCallback(() => dispatch(setIsYDrag(false)), [dispatch]);
    const startYMouseDown = useCallback(() => dispatch(setIsYDrag(true)), [dispatch]);

    useEffect(() => {
        document.addEventListener('mouseup', stopYMouseUp);
        return () => {
            document.removeEventListener('mouseup', stopYMouseUp);
        };
    }, [stopYMouseUp]);

    return (
        <div
            id={"y-drag"}
            className={`${dragStl.yPos}`}
            style={{ bottom: `${yDrag}px` }}
            onMouseDown={startYMouseDown}
        />
    );
};
