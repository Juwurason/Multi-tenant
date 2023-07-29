import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ClientAidEquip from './ClientAid';
import ClientSchedule from './ClientSchedule';

const ClientForms = ({ match }) => (
   <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/client-schedule`} />
      <Route path={`${match.url}/client-schedule/:uid`} component={ClientSchedule} />
      <Route path={`${match.url}/client-aids/:uid`} component={ClientAidEquip} />
   </Switch>

);

export default ClientForms;