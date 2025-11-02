import {AppDispatch} from "../../../store/store.tsx";
import React from "react";
import {ActionCreatorWithPayload} from "@reduxjs/toolkit";

export const useMouseController = (
    dispatch: AppDispatch,
    calendarRef: React.RefObject<HTMLDivElement>,
    setShow: ActionCreatorWithPayload<boolean>
) => {
    return (event: MouseEvent) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
            dispatch(setShow(false));
        }
    };
}

