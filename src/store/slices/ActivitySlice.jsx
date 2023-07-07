import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchActivity = createAsyncThunk('User/fetchActivity', async (companyId) => {
    const response = await api.fetchActivityLog(companyId);
    return response.activityLogs;
});
export const filterActivityLogs = createAsyncThunk(
    'User/filterActivity',
    async ({ company, fromDate, toDate, user }) => {
        const response = await api.filterActivityLogs(company, fromDate, toDate, user);
        return response.activityLogs
            ;
    }
);

const ActivitySlice = createSlice({
    name: 'Activity',
    initialState: {
        data: [],
        isLoading: false,
        error: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActivity.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchActivity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchActivity.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(filterActivityLogs.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(filterActivityLogs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(filterActivityLogs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { } = ActivitySlice.actions;
export default ActivitySlice.reducer;
