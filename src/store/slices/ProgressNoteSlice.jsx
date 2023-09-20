import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchProgress = createAsyncThunk('Progress/fetchProgress', async (company) => {
    const response = await api.fetchProgressNotes(company);
    return response;
});
export const filterProgress = createAsyncThunk(
    'Progress/filterProgress',
    async ({ dateTo, dateFrom, sta, cli, company }) => {
        const response = await api.filterProgressNotes(dateTo, dateFrom, sta, cli, company);
        return response.progressNote;
    }
);

const ProgressSlice = createSlice({
    name: 'Progress',
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
            .addCase(fetchProgress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProgress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchProgress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(filterProgress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(filterProgress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(filterProgress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });


    },
});

export const { } = ProgressSlice.actions;
export default ProgressSlice.reducer;
