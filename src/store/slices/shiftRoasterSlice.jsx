import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchRoaster = createAsyncThunk('Roaster/fetchRoaster', async (companyId) => {
    const response = await api.fetchShiftRoaster(companyId);
    return response;
});
export const filterRoaster = createAsyncThunk(
    'Roaster/filterRoaster',
    async ({ dateFrom, dateTo, sta, cli, companyId }) => {
        const response = await api.getShiftsByUser(dateFrom, dateTo, sta, cli, companyId);
        return response;
    }
);

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
            })
            .addCase(filterRoaster.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(filterRoaster.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(filterRoaster.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });


    },
});

export const { } = RoasterSlice.actions;
export default RoasterSlice.reducer;
