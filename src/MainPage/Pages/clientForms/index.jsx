import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ClientSchedule from './ClientSchedule';

const ClientForms = ({ match }) => (
   <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/client-schedule`} />
      <Route path={`${match.url}/client-schedule`} component={ClientSchedule} />
   </Switch>

);

export default ClientForms;