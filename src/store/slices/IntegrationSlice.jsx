import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchIntegration = createAsyncThunk('User/fetchIntegration', async (company) => {
    const response = await api.fetchIntegrationData(company);
    return response;
});

const IntegrationSlice = createSlice({
    name: 'User',
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
            .addCase(fetchIntegration.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchIntegration.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchIntegration.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { } = IntegrationSlice.actions;
export default IntegrationSlice.reducer;
