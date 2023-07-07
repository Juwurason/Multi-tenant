
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import EditAccount from '../../../_components/forms/EditUser';
import AllUser from './alluser';
import ChangePassword from './changePassword';
import UserRoles from './userroles';
import EditRole from '../../../_components/forms/EditRole';
import RoleList from './roleList';
import PriviledgesList from './priviledgesList';
import CompanyProfile from './CompanyProfile';
import ActivityLog from './activityLog';

const AccountRoute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/all-user`} />
        <Route path={`${match.url}/alluser`} component={AllUser} />
        <Route path={`${match.url}/activity-log`} component={ActivityLog} />
        <Route path={`${match.url}/user-roles`} component={UserRoles} />
        <Route path={`${match.url}/change-password`} component={ChangePassword} />
        <Route path={`${match.url}/edituser/:uid`} component={EditAccount} />
        <Route path={`${match.url}/editrole/:uid`} component={EditRole} />
        <Route path={`${match.url}/role-list/:uid`} component={RoleList} />
        <Route path={`${match.url}/company-profile`} component={CompanyProfile} />
        <Route path={`${match.url}/priviledges-list/:uid`} component={PriviledgesList} />

    </Switch>
);

export default AccountRoute;
