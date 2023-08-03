import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchTimesheet = createAsyncThunk('Timesheet/fetchTimesheet', async ({ user, sta, dateFrom, dateTo }) => {
    const response = await api.fetchTimesheet(user, sta, dateFrom, dateTo);
    return response;
});

const TimesheetSlice = createSlice({
    name: 'Timesheet',
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
            .addCase(fetchTimesheet.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTimesheet.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchTimesheet.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { } = TimesheetSlice.actions;
export default TimesheetSlice.reducer;
