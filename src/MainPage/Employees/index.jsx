/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AddClients from '../../_components/forms/AddClients';
import Clients from './clients';


const EmployeeRoute = ({ match }) => (
   <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/clients`} />
      <Route path={`${match.url}/clients`} component={Clients} />
      <Route path={`${match.url}/addclients`} component={AddClients} />

   </Switch>
);

export default EmployeeRoute;
