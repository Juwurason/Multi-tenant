
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import KnowledgeBase from './knowledgeBase';
import RaiseTicket from './raiseTicket';
import ViewTicket from './viewTicket';
import ticketDetails from './ticketDetails';
import KnowledgeBaseDetails from './knowledgeBaseDetails';
import KnowledgeBaseVideo from './knowledgeBaseVideo';


const SupportRoute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/view-tickets`} />
        <Route path={`${match.url}/view-tickets`} component={ViewTicket} />
        <Route path={`${match.url}/raise-ticket`} component={RaiseTicket} />
        <Route path={`${match.url}/knowledge-base`} component={KnowledgeBase} />
        <Route path={`${match.url}/ticket-details/:uid`} component={ticketDetails} />
        <Route path={`${match.url}/knowledge-details/:uid`} component={KnowledgeBaseDetails} />
        <Route path={`${match.url}/knowledge-video/:uid`} component={KnowledgeBaseVideo} />


    </Switch>
);

export default SupportRoute;
