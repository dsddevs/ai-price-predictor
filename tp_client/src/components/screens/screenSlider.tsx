import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface ScreenState {
    screenWidth: number,
    screenHeight: number,
    xPosition: number,
    yPosition: number
}

const initialState: ScreenState = {
    screenWidth: 0,
    screenHeight: 0,
    xPosition: 0,
    yPosition: 0
}

const screenSlice = createSlice({
    name: 'screen',
    initialState,
    reducers: {
        setScreenWidth: (state, action: PayloadAction<number>) => {
            state.screenWidth = action.payload;
        },
        setScreenHeight: (state, action: PayloadAction<number>) => {
            state.screenHeight = action.payload;
        },
        calculateNewXPosition: (state, action: PayloadAction<{clientX: number}>) => {
            const {clientX} = action.payload;
            state.xPosition = Math.min(Math.max(state.screenWidth - clientX, 13), state.screenWidth);
        },
        calculateNewYPosition: (state, action: PayloadAction<{ clientY: number }>) => {
            const { clientY } = action.payload;
            state.yPosition = Math.min(Math.max(state.screenHeight - clientY, 0), state.screenHeight);
        }
    }
});

export const {
    setScreenWidth,
    setScreenHeight,
    calculateNewXPosition,
    calculateNewYPosition
} = screenSlice.actions;

export default screenSlice.reducer;
