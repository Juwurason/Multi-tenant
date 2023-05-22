/**
 * Tables Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import EmployeeProfile from "./employeeprofile"
import ClientProfile from "./clientprofile"
import ClientDoc from '../../../_components/forms/ClientsDoc';
import EditClient from '../../Employees/editclient';
import StaffDoc from '../../../_components/forms/StaffDoc';
import AdminProfile from './adminProfile';
import EditAdmin from '../../Employees/Employees/editAdmin';
import AdminDoc from '../../../_components/forms/AdminDoc';


const ProfileRoute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/employee-profile`} />
        <Route path={`${match.url}/employee-profile/:uid/*`} component={EmployeeProfile} />
        <Route path={`${match.url}/client-profile/:uid/*`} component={ClientProfile} />
        <Route path={`${match.url}/admin-profile/:uid/*`} component={AdminProfile} />
        <Route path={`${match.url}/edit-client/:uid`} component={EditClient} />
        <Route path={`${match.url}/client-docUpload/:uid`} component={ClientDoc} />
        <Route path={`${match.url}/staff-docUpload/:uid`} component={StaffDoc} />
        <Route path={`${match.url}/admin-docUpload/:uid`} component={AdminDoc} />
        <Route path={`${match.url}/edit-admin/:uid`} component={EditAdmin} />
    </Switch>
);

export default ProfileRoute;
