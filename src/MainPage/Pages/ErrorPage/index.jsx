/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Error500 from './error500';
const ErrorRoute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/500`} />
        <Route path={`${match.url}/500`} component={Error500} />
    </Switch>

);

export default ErrorRoute;
