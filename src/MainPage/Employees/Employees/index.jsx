/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import AllEmployees from './allemployees';
import Department from './department';
import Timesheet from './timesheet';
import ShiftScheduling from './shiftscheduling';
import Document from './document';
import Refferal from './refferals';
import AllAdmin from './Admin';
import AddStaff from '../../../_components/forms/AddStaff';
import AddAdministrator from '../../../_components/forms/AddAdmin';
import AddShiftRoaster from '../../../_components/forms/AddShiftRoaster';
import EditShiftRoaster from '../../../modules/Admin/EditShiftRoster';

const EmployeesRoute = ({ match }) => (
   <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/allemployees`} />
      <Route path={`${match.url}/allstaff`} component={AllEmployees} />
      <Route path={`${match.url}/alladmin`} component={AllAdmin} />
      <Route path={`${match.url}/addadmin`} component={AddAdministrator} />
      <Route path={`${match.url}/addstaff`} component={AddStaff} />
      <Route path={`${match.url}/document`} component={Document} />
      <Route path={`${match.url}/refferals`} component={Refferal} />
      <Route path={`${match.url}/departments`} component={Department} />
      <Route path={`${match.url}/timesheet`} component={Timesheet} />
      <Route path={`${match.url}/shift-scheduling`} component={ShiftScheduling} />
      <Route path={`${match.url}/add-shift`} component={AddShiftRoaster} />
      <Route path={`${match.url}/edit-shift/:uid`} component={EditShiftRoaster} />
   </Switch>
);

export default EmployeesRoute;
