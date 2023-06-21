import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchClient = createAsyncThunk('Client/fetchClient', async () => {
    const response = await api.fetchClientData();
    const filteredData = response.filter((client) => client.isActive);
    return filteredData;
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
            });
    },
});

export const { } = ClientSlice.actions;
export default ClientSlice.reducer;
