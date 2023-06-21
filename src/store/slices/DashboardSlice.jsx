// dashboardSlice.js
import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        shiftRosterCount: 0,
        attendanceCount: 0,
        progressNoteCount: 0,
        isLoading: true,
        error: null,
    },
    reducers: {
        setShiftRosterCount: (state, action) => {
            state.shiftRosterCount = action.payload;
        },
        setAttendanceCount: (state, action) => {
            state.attendanceCount = action.payload;
        },
        setProgressNoteCount: (state, action) => {
            state.progressNoteCount = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    setShiftRosterCount,
    setAttendanceCount,
    setProgressNoteCount,
    setLoading,
    setError,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
