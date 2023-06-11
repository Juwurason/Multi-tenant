/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AttendanceReport from './attendancereport';
import ProgressReport from './progressreport';
import ProgressReportDetails from '../../../_components/reports/ProgressReportDetails';
import Invoice from './invoice';
import Timesheet from './timesheet';
import TimesheetForAll from './timesheetForAll';

const ReportsRoute = ({ match }) => (
   <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/progress-reports`} />
      <Route path={`${match.url}/attendance-reports`} component={AttendanceReport} />
      <Route path={`${match.url}/progress-reports`} component={ProgressReport} />
      <Route path={`${match.url}/invoice`} component={Invoice} />
      <Route path={`${match.url}/progress-reportsDetails/:uid`} component={ProgressReportDetails} />
      <Route path={`${match.url}/staff-timesheet/:sta/:dateFrom/:dateTo`} component={Timesheet} />
      <Route path={`${match.url}/Allstaff-timesheet/:dateFrom/:dateTo`} component={TimesheetForAll} />
   </Switch>
);

export default ReportsRoute;
