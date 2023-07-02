import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchStaff = createAsyncThunk('Staff/fetchStaff', async (companyId) => {
    const response = await api.fetchStaffData(companyId);
    // const filteredData = response.filter((staff) => staff.isActive);
    return response;
});

const StaffSlice = createSlice({
    name: 'Staff',
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
            .addCase(fetchStaff.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchStaff.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchStaff.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { } = StaffSlice.actions;
export default StaffSlice.reducer;
