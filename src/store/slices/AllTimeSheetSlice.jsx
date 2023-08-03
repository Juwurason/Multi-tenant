import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchAllTimesheet = createAsyncThunk('AllTimesheet/fetchAllTimesheet', async ({ user, dateFrom, dateTo }) => {
    const response = await api.fetchAllTimesheet(user, dateFrom, dateTo);
    return response;
});

const AllTimesheetSlice = createSlice({
    name: 'AllTimesheet',
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
            .addCase(fetchAllTimesheet.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllTimesheet.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchAllTimesheet.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { } = AllTimesheetSlice.actions;
export default AllTimesheetSlice.reducer;
