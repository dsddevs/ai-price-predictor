import {RootState} from "../../store/store.tsx";
import {useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect} from "react";
import {setIsXDrag} from "./dragSlicer.tsx";
import {dragStl} from "../../styles/stylebox.tsx";

export const XDragging = () => {

    const dispatch = useDispatch();
    const {xDrag} = useSelector((state: RootState) => state.drag);
    const stopXMouseUp = useCallback(() => dispatch(setIsXDrag(false)), [dispatch]);
    const startXMouseDown = useCallback(() => dispatch(setIsXDrag(true)), [dispatch]);

    useEffect(() => {
        document.addEventListener("mouseup", stopXMouseUp);
        return () => {
            document.removeEventListener("mouseup", stopXMouseUp);
        };
    }, [stopXMouseUp]);


    return (
        <div
            id={"x-drag"}
            className={`${dragStl.xPos}`}
            style={{right: `${xDrag}px`}}
            onMouseDown={startXMouseDown}
        />
    )
}
