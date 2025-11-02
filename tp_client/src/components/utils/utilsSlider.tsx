import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UtilsState {
    isLoading: boolean;
}

const initialState: UtilsState = {
    isLoading: false,
};

const loaderSlice = createSlice({
    name: 'utils',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setLoading } = loaderSlice.actions;
export default loaderSlice.reducer;
