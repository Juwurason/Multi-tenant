import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchStaffAttendance = createAsyncThunk('StaffAttendance/fetchStaffAttendance', async (companyId) => {
    const response = await api.fetchStaffAttendance(companyId);
    return response;
});
export const filterStaffAttendance = createAsyncThunk(
    'Attendance/filterStaffAttendance',
    async ({ fromDate, toDate, staffId, companyId }) => {
        const response = await api.filterStaffAttendance(fromDate, toDate, staffId, companyId);
        return response;
    }
);

const StaffAttendanceSlice = createSlice({
    name: 'StaffAttendance',
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
            .addCase(fetchStaffAttendance.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchStaffAttendance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchStaffAttendance.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(filterStaffAttendance.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(filterStaffAttendance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(filterStaffAttendance.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });


    },
});

export const { } = StaffAttendanceSlice.actions;
export default StaffAttendanceSlice.reducer;
