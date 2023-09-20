import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchUser = createAsyncThunk('User/fetchUser', async (companyId) => {
    const response = await api.fetchUserData(companyId);
    return response;
});

export const formatUser = createAsyncThunk('User/formatUser', async (companyId) => {
    const response = await api.fetchUserData(companyId);
    const formattedData = response.map((item) => ({
        label: item.email,
        value: item.email,
    }));
    return formattedData;
});

const UserSlice = createSlice({
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
            .addCase(fetchUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(formatUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(formatUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(formatUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { } = UserSlice.actions;
export default UserSlice.reducer;
