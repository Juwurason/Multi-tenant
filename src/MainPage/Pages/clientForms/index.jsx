import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ClientAidEquip from './ClientAid';
import ClientDailyLiving from './ClientDailyNightAndLiving';
import ClientSchedule from './ClientSchedule';

const ClientForms = ({ match }) => (
   <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/client-schedule`} />
      <Route path={`${match.url}/client-schedule/:uid`} component={ClientSchedule} />
      <Route path={`${match.url}/client-aids/:uid`} component={ClientAidEquip} />
      <Route path={`${match.url}/client-daily-living/:uid`} component={ClientDailyLiving} />
   </Switch>

);

export default ClientForms;