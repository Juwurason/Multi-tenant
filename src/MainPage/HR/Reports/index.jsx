
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AttendanceReport from './attendancereport';
import ProgressReport from './progressreport';
import ProgressReportDetails from '../../../_components/reports/ProgressReportDetails';
import Invoice from './invoice';
import EditAttendance from '../../../_components/forms/EditAttendance';
import AttendanceReportDetails from './attendancedetails';
import ShiftAttendanceReport from './shiftAttendanceReport';
import StaffDailyReport from './staffDailyReport';
import StaffReportDetails from './staffReportDetails';
import EditStaffAttendance from '../../../_components/forms/EditStaffAttendance';
import AdminDailyReport from './adminDailyReport';
import AdminClockOutReport from '../../../_components/reports/AdminClockOutReport';
import AdminReportDetails from './adminReportDetails';
import EditAdminAttendance from '../../../_components/forms/EditAdminAttendance';



const ReportsRoute = ({ match }) => (
   <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/progress-reports`} />
      <Route path={`${match.url}/attendance-reports`} component={AttendanceReport} />
      <Route path={`${match.url}/shift-reports`} component={ShiftAttendanceReport} />
      <Route path={`${match.url}/staff-reports`} component={StaffDailyReport} />
      <Route path={`${match.url}/administrator-reports`} component={AdminDailyReport} />
      <Route path={`${match.url}/progress-reports`} component={ProgressReport} />
      <Route path={`${match.url}/invoice`} component={Invoice} />
      <Route path={`${match.url}/progress-reportsDetails/:uid`} component={ProgressReportDetails} />
      <Route path={`${match.url}/adminAttendances-clockOut/:uid`} component={AdminClockOutReport} />
      <Route path={`${match.url}/edit-attendance/:uid`} component={EditAttendance} />
      <Route path={`${match.url}/edit-staffAttendance/:uid`} component={EditStaffAttendance} />
      <Route path={`${match.url}/edit-AdminAttendance/:uid`} component={EditAdminAttendance} />
      <Route path={`${match.url}/attendance-details/:uid`} component={AttendanceReportDetails} />
      <Route path={`${match.url}/staffReport-details/:uid`} component={StaffReportDetails} />
      <Route path={`${match.url}/administratorReport-details/:uid`} component={AdminReportDetails} />

   </Switch>
);

export default ReportsRoute;
