import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchAdmin = createAsyncThunk('Admin/fetchAdmin', async (companyId) => {
    const response = await api.fetchAdminData(companyId);
    // const filteredData = response.filter((admin) => admin.isActive);
    return response;
});

const AdminSlice = createSlice({
    name: 'Admin',
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
            .addCase(fetchAdmin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { } = AdminSlice.actions;
export default AdminSlice.reducer;
