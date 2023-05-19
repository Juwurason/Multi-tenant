/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import MessageInbox from './messageInbox';



const MessageRoute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/message`} />
        <Route path={`${match.url}/inbox`} component={MessageInbox} />

    </Switch>
);

export default MessageRoute;
