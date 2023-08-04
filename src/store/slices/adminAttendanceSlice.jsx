import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchAdminAttendance = createAsyncThunk('AdminAttendance/fetchAdminAttendance', async (companyId) => {
    const response = await api.fetchAdminAttendance(companyId);

    return response;
});
export const filterAdminAttendance = createAsyncThunk(
    'Attendance/filterAdminAttendance',
    async ({ admin, fromDate, toDate, company }) => {
        const response = await api.filterAdminAttendance(admin, fromDate, toDate, company);
        return response.adminAttendance;
    }
);

const AdminAttendanceSlice = createSlice({
    name: 'AdminAttendance',
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
            .addCase(fetchAdminAttendance.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAdminAttendance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchAdminAttendance.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(filterAdminAttendance.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(filterAdminAttendance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(filterAdminAttendance.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });


    },
});

export const { } = AdminAttendanceSlice.actions;
export default AdminAttendanceSlice.reducer;
