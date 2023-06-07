/**
 * Tables Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import basictable from "./basic"


const Pages = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/basic`} />
        <Route path={`${match.url}/basic`} component={basictable} />
    </Switch>
);

export default Pages;
