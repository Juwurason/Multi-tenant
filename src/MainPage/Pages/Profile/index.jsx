/**
 * Tables Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import EmployeeProfile from "./employeeprofile"
import AdminProfile from './adminProfile';
import ClientProfiles from './clientprofiles';


const ProfileRoute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/employee-profile`} />
        <Route path={`${match.url}/employee-profile/:uid/*`} component={EmployeeProfile} />
        <Route path={`${match.url}/client-profile/:uid/*`} component={ClientProfiles} />
        <Route path={`${match.url}/admin-profile/:uid/*`} component={AdminProfile} />

    </Switch>
);

export default ProfileRoute;
