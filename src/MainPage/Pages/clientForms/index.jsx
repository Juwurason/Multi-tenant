import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ClientAidEquip from './ClientAid';
import ClientBehaviuor from './ClientBehaviour';
import ClientComunitySupport from './ClientComminitySupport';
import ClientDailyLiving from './ClientDailyNightAndLiving';
import ClientHealth from './ClientHealthSupport';
import ClientSchedule from './ClientSchedule';

const ClientForms = ({ match }) => (
   <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/client-schedule`} />
      <Route path={`${match.url}/client-schedule/:uid`} component={ClientSchedule} />
      <Route path={`${match.url}/client-aids/:uid`} component={ClientAidEquip} />
      <Route path={`${match.url}/client-daily-living/:uid`} component={ClientDailyLiving} />
      <Route path={`${match.url}/client-health/:uid`} component={ClientHealth} />
      <Route path={`${match.url}/client-behaviour/:uid`} component={ClientBehaviuor} />
      <Route path={`${match.url}/client-community-support/:uid`} component={ClientComunitySupport} />
   </Switch>

);

export default ClientForms;