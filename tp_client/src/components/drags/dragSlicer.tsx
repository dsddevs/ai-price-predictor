import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DragState {
    xDrag: number;
    yDrag: number;
    isXDrag: boolean;
    isYDrag: boolean;
}

const initialState: DragState = {
    xDrag: 13,
    yDrag: 0,
    isXDrag: false,
    isYDrag: false
};

const dragSlice = createSlice({
    name: 'drag',
    initialState,
    reducers: {
        setXDrag: (state, action: PayloadAction<number>) => {
            state.xDrag = action.payload;
        },
        setYDrag: (state, action: PayloadAction<number>) => {
            state.yDrag = action.payload;
        },
        setIsXDrag: (state, action: PayloadAction<boolean>) => {
            state.isXDrag = action.payload;
        },
        setIsYDrag: (state, action: PayloadAction<boolean>) => {
            state.isYDrag = action.payload;
        }
    },
});

export const {
    setXDrag,
    setYDrag,
    setIsXDrag,
    setIsYDrag
} = dragSlice.actions;

export default dragSlice.reducer;
