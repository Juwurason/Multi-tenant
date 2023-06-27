// rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import AdminSlice from '../slices/AdminSlice';
import DashboardSlice from '../slices/DashboardSlice';
import StaffSlice from '../slices/StaffSlice';
import ClientSlice from '../slices/ClientSlice';
import DocumentSlice from '../slices/DocumentSlice';
import shiftRoasterSlice from '../slices/shiftRoasterSlice';
import UserSlice from '../slices/UserSlice';
import AttendanceSlice from '../slices/AttendanceSlice';
import ChartSlice from '../slices/chartData';
import IntegrationSlice from '../slices/IntegrationSlice';
import splittedAttendance from '../slices/splittedAttendance';
import ProgressNoteSlice from '../slices/ProgressNoteSlice';

const rootReducer = combineReducers({
    dashboard: DashboardSlice,
    admin: AdminSlice,
    staff: StaffSlice,
    client: ClientSlice,
    document: DocumentSlice,
    roaster: shiftRoasterSlice,
    user: UserSlice,
    attendance: AttendanceSlice,
    chart: ChartSlice,
    integration: IntegrationSlice,
    splittedAttendance: splittedAttendance,
    progress: ProgressNoteSlice

});

export default rootReducer;
