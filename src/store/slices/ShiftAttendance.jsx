import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchShiftAttendance = createAsyncThunk('ShiftAttendance/fetchShiftAttendance', async (companyId) => {
    const response = await api.fetchShiftAttendance(companyId);
    return response.shiftAttendance;
});

export const filterShiftAttendance = createAsyncThunk(
    'ShiftAttendance/filterShiftAttendance',
    async ({ fromDate, toDate, staffId, companyId }) => {
        const response = await api.filterShiftAttendance(fromDate, toDate, staffId, companyId);
        // return response.shiftAttendance;
    }
);

const ShiftAttendanceSlice = createSlice({
    name: 'ShiftAttendance',
    initialState: {
        data: {},
        isLoading: false,
        error: null,
    },
    reducers: {
        // Define any specific actions related to Admin (if needed)
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShiftAttendance.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchShiftAttendance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchShiftAttendance.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(filterShiftAttendance.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(filterShiftAttendance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(filterShiftAttendance.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });


    },
});

export const { } = ShiftAttendanceSlice.actions;
export default ShiftAttendanceSlice.reducer;
