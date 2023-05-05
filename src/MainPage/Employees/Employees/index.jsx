/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import AllEmployees from './allemployees';
import Holidays from './holidays';
import LeaveAdmin from './leave_admin';
import LeaveEmployee from './leaveemployee';
import Leavesetting from './leavesettings';
import AttendanceAdmin from './attendanceadmin';
import AttendanceEmployee from './attendanceemployee';
import Department from './department';
import Designation from './designation';
import Timesheet from './timesheet';
import Overtime from './overtime';
import ShiftScheduling from './shiftscheduling';
import ShiftList from './shiftlist';
import DeleteStaff from './deleteStaff';
import ChangePassword from '../../Administration/Settings/changepassword';
import Document from './document';
import Refferal from './refferals';
import AllAdmin from './Admin';
import AddStaff from '../../../_components/forms/AddStaff';
import AddAdministrator from '../../../_components/forms/AddAdmin';
import AddShiftRoaster from '../../../_components/forms/AddShiftRoaster';

const EmployeesRoute = ({ match }) => (
   <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/allemployees`} />
      <Route path={`${match.url}/allemployees`} component={AllEmployees} />
      <Route path={`${match.url}/alladmin`} component={AllAdmin} />
      <Route path={`${match.url}/addadmin`} component={AddAdministrator} />
      <Route path={`${match.url}/addstaff`} component={AddStaff} />
      <Route path={`${match.url}/changePassword`} component={ChangePassword} />
      <Route path={`${match.url}/delete-staff`} component={DeleteStaff} />
      <Route path={`${match.url}/holidays`} component={Holidays} />

      <Route path={`${match.url}/document`} component={Document} />
      <Route path={`${match.url}/refferals`} component={Refferal} />
      <Route path={`${match.url}/leaves-admin`} component={LeaveAdmin} />
      <Route path={`${match.url}/leaves-employee`} component={LeaveEmployee} />
      <Route path={`${match.url}/leave-settings`} component={Leavesetting} />
      <Route path={`${match.url}/attendance-admin`} component={AttendanceAdmin} />
      <Route path={`${match.url}/attendance-employee`} component={AttendanceEmployee} />
      <Route path={`${match.url}/departments`} component={Department} />
      <Route path={`${match.url}/designations`} component={Designation} />
      <Route path={`${match.url}/timesheet`} component={Timesheet} />
      <Route path={`${match.url}/overtime`} component={Overtime} />
      <Route path={`${match.url}/shift-scheduling`} component={ShiftScheduling} />
      <Route path={`${match.url}/add-shift`} component={AddShiftRoaster} />
      <Route path={`${match.url}/shift-list`} component={ShiftList} />
   </Switch>
);

export default EmployeesRoute;
