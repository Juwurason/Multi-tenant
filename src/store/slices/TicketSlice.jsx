import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchTicket = createAsyncThunk('Ticket/fetchTicket', async () => {
    const response = await api.fetchTicket();
    return response;
});

const TicketSlice = createSlice({
    name: 'Ticket',
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
            .addCase(fetchTicket.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTicket.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchTicket.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { } = TicketSlice.actions;
export default TicketSlice.reducer;
