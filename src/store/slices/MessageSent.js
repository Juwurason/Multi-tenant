import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchSent = createAsyncThunk('Sent/fetchSent', async (user) => {
    const response = await api.fetchSentMessage(user);
    return response.message;
});

const SentSlice = createSlice({
    name: 'Sent',
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
            .addCase(fetchSent.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchSent.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { } = SentSlice.actions;
export default SentSlice.reducer;
