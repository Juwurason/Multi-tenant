
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ResponsePage from './ResponsePage';


const ResponseUrl = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/auth`} />
        <Route path={`${match.url}/auth`} component={ResponsePage} />


    </Switch>
);

export default ResponseUrl;
