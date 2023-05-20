
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import KnowledgeBase from './knowledgeBase';
import RaiseTicket from './raiseTicket';
import ViewTicket from './viewTicket';


const SupportRoute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/view-tickets`} />
        <Route path={`${match.url}/view-tickets`} component={ViewTicket} />
        <Route path={`${match.url}/raise-ticket`} component={RaiseTicket} />
        <Route path={`${match.url}/knowledge-base`} component={KnowledgeBase} />


    </Switch>
);

export default SupportRoute;
