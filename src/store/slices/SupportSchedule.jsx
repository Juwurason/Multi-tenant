import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchSupportSchedule = createAsyncThunk('SupportSchedule/fetchSupportSchedule', async (companyId) => {
    const response = await api.fetchSupportSchedule(companyId);
    return response;
});

const SupportScheduleSlice = createSlice({
    name: 'SupportSchedule',
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
            .addCase(fetchSupportSchedule.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSupportSchedule.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchSupportSchedule.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { } = SupportScheduleSlice.actions;
export default SupportScheduleSlice.reducer;
