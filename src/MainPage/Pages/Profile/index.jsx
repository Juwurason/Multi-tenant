/**
 * Tables Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import EmployeeProfile from "./employeeprofile"
import ClientProfile from "./clientprofile"
import EditStaff from '../../Employees/Employees/editStaff';


const subscriptionroute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/employee-profile`} />
        <Route path={`${match.url}/employee-profile/:uid/*`} component={EmployeeProfile} />
        <Route path={`${match.url}/client-profile/:uid/*`} component={ClientProfile} />
        <Route path={`${match.url}/edit-profile/:uid`} component={EditStaff} />
    </Switch>
);

export default subscriptionroute;
