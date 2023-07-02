import React, { useState, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';

import ClientDashboard from './ClientDashboard';
import ClientProfile from './ClientProfile';


const ClientRoute = ({ match }) => {

    <Switch>
      {/* <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
      <Route path={`${match.url}/dashboard`} render={() => <ClientDashboard />} />
      <Route path={`${match.url}/profile`} render={() => <ClientProfile />} /> */}
    



  </Switch>

}

export default ClientRoute;