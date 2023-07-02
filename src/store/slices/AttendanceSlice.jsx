import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchAttendance = createAsyncThunk('Attendance/fetchAttendance', async (companyId) => {
    const response = await api.fetchAttendance(companyId);
    return response;
});
export const filterAttendance = createAsyncThunk(
    'Attendance/filterAttendance',
    async ({ fromDate, toDate, staffId, companyId }) => {
        const response = await api.filterAttendance(fromDate, toDate, staffId, companyId);
        return response;
    }
);

const AttendanceSlice = createSlice({
    name: 'Attendance',
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
            .addCase(fetchAttendance.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAttendance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchAttendance.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(filterAttendance.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(filterAttendance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(filterAttendance.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });


    },
});

export const { } = AttendanceSlice.actions;
export default AttendanceSlice.reducer;
