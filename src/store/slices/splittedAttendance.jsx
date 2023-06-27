import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';


export const fetchSplittedAttendance = createAsyncThunk(
    'SplittedAttendance/fetchSplittedAttendance',
    async ({ value }) => {
        const response = await api.getSplittedAttendance(value);

        return response.splittedAttendance;
    }
);

const SplittedAttendanceSlice = createSlice({
    name: 'SplittedAttendance',
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
            .addCase(fetchSplittedAttendance.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSplittedAttendance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchSplittedAttendance.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });



    },
});

export const { } = SplittedAttendanceSlice.actions;
export default SplittedAttendanceSlice.reducer;
