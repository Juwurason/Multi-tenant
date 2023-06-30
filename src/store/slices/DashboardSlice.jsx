// dashboardSlice.js
import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        shiftRosterCount: 0,
        attendanceCount: 0,
        progressNoteCount: 0,
        shiftForMonth: 0,
        shiftForDay: 0,
        monthPercentage: 0,
        weekCount: 0,
        weekPercentage: 0,
        dayPercentage: 0,
        month: "",
        fromWeek: "",
        toWeek: "",
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
        setShiftForMonth: (state, action) => {
            state.shiftForMonth = action.payload;
        },
        setShiftForDay: (state, action) => {
            state.shiftForDay = action.payload;
        },
        setMonthPercentage: (state, action) => {
            state.monthPercentage = action.payload;
        },
        setMonth: (state, action) => {
            state.month = action.payload;
        },
        setWeekCount: (state, action) => {
            state.weekCount = action.payload;
        },
        setWeekPercentage: (state, action) => {
            state.weekPercentage = action.payload;
        },
        setDayPercentage: (state, action) => {
            state.dayPercentage = action.payload;
        },
        setFromWeek: (state, action) => {
            state.fromWeek = action.payload;
        },
        setToWeek: (state, action) => {
            state.toWeek = action.payload;
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
    setShiftForMonth,
    setShiftForDay,
    setMonthPercentage,
    setMonth,
    setFromWeek,
    setToWeek,
    setWeekCount,
    setDayPercentage,
    setWeekPercentage,
    setLoading,
    setError,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
