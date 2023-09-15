/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Admindashboard from './admindashboard';
import UserDashboard from './userDashboard';

const DashboardRoute = ({ match }) => (
   <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
      <Route path={`${match.url}/dashboard`} component={Admindashboard} />
      <Route path={`${match.url}/user-dashboard`} component={UserDashboard} />
   </Switch>

);

export default DashboardRoute;
