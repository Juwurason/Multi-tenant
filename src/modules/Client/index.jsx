import React, { useState, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from '../Client/ClientDashboard/index';


const ClientRoute = ({ match }) => {

    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
      <Route
        path={`${match.url}/dashboard`}
        render={() => <Dashboard />} />
      
      {/* <Route path={`${match.url}/new-report`} render={() => <StaffNewReport />} /> */}

    </Switch>

}

export default ClientRoute;