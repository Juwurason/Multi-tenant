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
import TicketSlice from '../slices/TicketSlice';
import ActivitySlice from '../slices/ActivitySlice';
import FormTemplateSlice from '../slices/FormTemplateSlice';
import staffAttendanceSlice from '../slices/staffAttendanceSlice';
import adminAttendanceSlice from '../slices/adminAttendanceSlice';
import TimeSheetSlice from '../slices/TimeSheetSlice';
import AllTimeSheetSlice from '../slices/AllTimeSheetSlice';
import SupportSchedule from '../slices/SupportSchedule';
import RefferalsSlice from '../slices/RefferalsSlice';
import ServiceProviderSlice from '../slices/ServiceProviderSlice';
import MessageInboxSlice from '../slices/MessageInboxSlice';
import MessageSent from '../slices/MessageSent';


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
    progress: ProgressNoteSlice,
    ticket: TicketSlice,
    timesheet: TimeSheetSlice,
    allTimesheet: AllTimeSheetSlice,
    activity: ActivitySlice,
    template: FormTemplateSlice,
    staffAttendance: staffAttendanceSlice,
    adminAttendance: adminAttendanceSlice,
    supportSchedule: SupportSchedule,
    refferals: RefferalsSlice,
    serviceProvider: ServiceProviderSlice,
    inbox: MessageInboxSlice,
    sent: MessageSent
});

export default rootReducer;
