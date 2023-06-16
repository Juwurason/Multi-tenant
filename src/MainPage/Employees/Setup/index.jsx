
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PublicHoliday from './publicHoliday';
import ScheduleSupport from './scheduleSupport';
import SupportType from './supportType';
import Integration from './Integration';

const SetupRoute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/public-holiday`} />
        <Route path={`${match.url}/public-holiday`} component={PublicHoliday} />
        <Route path={`${match.url}/schedule-support`} component={ScheduleSupport} />
        <Route path={`${match.url}/support-type`} component={SupportType} />
        <Route path={`${match.url}/integrations`} component={Integration} />

    </Switch>
);

export default SetupRoute;
