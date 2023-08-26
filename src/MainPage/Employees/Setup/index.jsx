
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PublicHoliday from './publicHoliday';
import ScheduleSupport from './scheduleSupport';
import SupportType from './supportType';
import Integration from './Integration';
import FormTemplate from './formTemplate';
import AddFormTemplate from '../../../_components/forms/AddFormTemplate';
import TimePeriod from './timePeriod';
import ViewStep from '../../../_components/client-referrals-form/viewStep';

const SetupRoute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/public-holiday`} />
        <Route path={`${match.url}/public-holiday`} component={PublicHoliday} />
        <Route path={`${match.url}/schedule-support`} component={ScheduleSupport} />
        <Route path={`${match.url}/support-type`} component={SupportType} />
        <Route path={`${match.url}/integrations`} component={Integration} />
        <Route path={`${match.url}/form-template`} component={FormTemplate} />
        <Route path={`${match.url}/create-template`} component={AddFormTemplate} />
        <Route path={`${match.url}/time-period`} component={TimePeriod} />
        <Route path={`${match.url}/client-referrals-form`} component={ViewStep} />

    </Switch>
);

export default SetupRoute;
