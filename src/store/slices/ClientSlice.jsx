import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchClient = createAsyncThunk('Client/fetchClient', async (companyId) => {
    const response = await api.fetchClientData(companyId);
    return response;
});
export const formatClient = createAsyncThunk('Client/formatClient', async (companyId) => {
    const response = await api.fetchClientData(companyId);
    const formattedData = response.map((item) => ({
        label: item.fullName,
        value: item.fullName,
    }));
    return formattedData;
});
export const filterClient = createAsyncThunk('Client/filterClient', async ({ companyId, status }) => {
    const response = await api.filterClientData(companyId, status);
    return response
});

const ClientSlice = createSlice({
    name: 'Client',
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
            .addCase(fetchClient.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchClient.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchClient.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(formatClient.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(formatClient.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(formatClient.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(filterClient.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(filterClient.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(filterClient.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { } = ClientSlice.actions;
export default ClientSlice.reducer;
