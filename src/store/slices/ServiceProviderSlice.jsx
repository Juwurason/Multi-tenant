import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fectchServiceProvider = createAsyncThunk('Refferals/fectchServiceProvider', async (companyId) => {
    const response = await api.fectchServiceProvider(companyId);
    return response;
});

const ServiceProviderSlice = createSlice({
    name: 'ServiceProvider',
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
            .addCase(fectchServiceProvider.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fectchServiceProvider.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fectchServiceProvider.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { } = ServiceProviderSlice.actions;
export default ServiceProviderSlice.reducer;
