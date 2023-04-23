
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';


import AllUser from './alluser';

const AccountRoute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/all-user`} />
        <Route path={`${match.url}/alluser`} component={AllUser} />

    </Switch>
);

export default AccountRoute;
