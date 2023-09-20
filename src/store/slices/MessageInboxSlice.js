import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchInbox = createAsyncThunk('Inbox/fetchInbox', async (user) => {
    const response = await api.fetchInboxData(user);
    return response.message;
});

const InboxSlice = createSlice({
    name: 'Inbox',
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
            .addCase(fetchInbox.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchInbox.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchInbox.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { } = InboxSlice.actions;
export default InboxSlice.reducer;
