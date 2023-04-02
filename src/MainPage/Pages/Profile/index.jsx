/**
 * Tables Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import EmployeeProfile from "./employeeprofile"
import ClientProfile from "./clientprofile"
import editStaff from '../../Employees/Employees/editStaff';


const subscriptionroute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/employee-profile`} />
        <Route path={`${match.url}/employee-profile/:uid/*`} component={EmployeeProfile} />
        <Route path={`${match.url}/client-profile`} component={ClientProfile} />
        <Route path={`${match.url}/edit-profile/:uid`} component={editStaff} />
    </Switch>
);

export default subscriptionroute;
