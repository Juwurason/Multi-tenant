import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchRefferals = createAsyncThunk('Refferals/fetchRefferals', async (companyId) => {
    const response = await api.fetchRefferals(companyId);
    return response;
});

const RefferalsSlice = createSlice({
    name: 'Refferals',
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
            .addCase(fetchRefferals.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRefferals.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchRefferals.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { } = RefferalsSlice.actions;
export default RefferalsSlice.reducer;
