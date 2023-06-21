import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchRoaster = createAsyncThunk('Roaster/fetchRoaster', async () => {
    const response = await api.fetchShiftRoaster();
    return response;
});

const RoasterSlice = createSlice({
    name: 'Roaster',
    initialState: {
        data: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        // Define any specific actions related to Admin (if needed)
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoaster.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRoaster.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchRoaster.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { } = RoasterSlice.actions;
export default RoasterSlice.reducer;
