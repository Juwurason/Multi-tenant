// attendanceSlice.js

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { setShiftRosterCount, setAttendanceCount, setProgressNoteCount, setLoading, setError } from '../slices/DashboardSlice';
import axiosInstance from '../axiosInstance';


export const fetchShiftRosterCount = createAsyncThunk(
    'attendance/fetchShiftRosterCount',
    async (companyId, { dispatch }) => {
        try {
            const response = await axiosInstance.get(`/CompanyAdmins/get_all_shift_rosters_count?companyId=${companyId}`);
            dispatch(setShiftRosterCount(response.data));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false)); // Set loading to false after fetching, whether successful or not
        }
    }
);

export const fetchAttendanceCount = createAsyncThunk(
    'attendance/fetchAttendanceCount',
    async (companyId, { dispatch }) => {
        try {
            const response = await axiosInstance.get(`/CompanyAdmins/get_all_attendances_count?companyId=${companyId}`);
            dispatch(setAttendanceCount(response.data));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false)); // Set loading to false after fetching, whether successful or not
        }
    }
);

export const fetchProgressNoteCount = createAsyncThunk(
    'attendance/fetchAttendanceCount',
    async (companyId, { dispatch }) => {
        try {
            const response = await axiosInstance.get(`/CompanyAdmins/get_all_progressnote_count?companyId=${companyId}`);
            dispatch(setProgressNoteCount(response.data));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false)); // Set loading to false after fetching, whether successful or not
        }
    }
);

// Rest of the code...



// Rest of the code...

