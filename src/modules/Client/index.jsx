import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import ClientDashboard from './ClientDashboard';
import ClientChangePassword from './ClientChangePassword';
import ClientProfile from './ClientProfile';
import ClientEditProfile from './ClientEditProfile';
import ClientDocument from './ClientDocument';
import ClientRoster from './ClientRoster';
import ClientRep from './ClientRep';
import ClientDisability from './ClientDisability';
import ClientAidEquip from './ClientAidEquip';
import ClientDailyLiving from './ClientDailyLiving';
import ClientHealth from './ClientHealth';
import ClientBehaviuor from './ClientBehaviuor';
import ClientMessage from './ClientSupport/Message/messageInbox';
import ClientSchedule from './ClientSchedule';
import ClientViewTicket from './ClientSupport/Support/viewTicket';
import ClientRaiseTicket from './ClientSupport/Support/raiseTicket';
import ClientKnowledgeBase from './ClientSupport/Support/knowledgeBase';
import ClientComunitySupport from './ClientComunitySupport';
import PrivacyStatement from './PrivacyStatement';
import ClientEditHealth from './ClientEditHealth';
import ClientBehaviuorEdit from './ClientBehaviuorEdit';



const ClientRoute = ({ match }) => {

  return (


    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
      <Route path={`${match.url}/dashboard`} render={() => <ClientDashboard />} />
      <Route path={`${match.url}/change-password`} render={() => <ClientChangePassword />} />
      <Route path={`${match.url}/client-profile`} render={() => <ClientProfile />} />
      <Route path={`${match.url}/client-edit-profile`} render={() => <ClientEditProfile />} />
      <Route path={`${match.url}/client-document`} render={() => <ClientDocument />} />
      <Route path={`${match.url}/client-roster`} render={() => <ClientRoster />} />
      <Route path={`${match.url}/client-rep`} render={() => <ClientRep />} />
      <Route path={`${match.url}/client-disability`} render={() => <ClientDisability />} />
      <Route path={`${match.url}/client-aid-equip`} render={() => <ClientAidEquip />} />
      <Route path={`${match.url}/client-daily-living`} render={() => <ClientDailyLiving />} />
      <Route path={`${match.url}/client-health`} render={() => <ClientHealth />} />
      <Route path={`${match.url}/client-edit-health/:uid`} render={() => <ClientEditHealth />} />
      <Route path={`${match.url}/client-behaviuor`} render={() => <ClientBehaviuor />} />
      <Route path={`${match.url}/client-behaviuor-edit/:uid`} render={() => <ClientBehaviuorEdit />} />
      <Route path={`${match.url}/client-message`} render={() => <ClientMessage />} />
      <Route path={`${match.url}/client-view_ticket`} render={() => <ClientViewTicket />} />
      <Route path={`${match.url}/client-raise_ticket`} render={() => <ClientRaiseTicket />} />
      <Route path={`${match.url}/client-knowledge_base`} render={() => <ClientKnowledgeBase />} />
      <Route path={`${match.url}/client-schedule`} render={() => <ClientSchedule />} />
      <Route path={`${match.url}/client-community`} render={() => <ClientComunitySupport />} />
      <Route path={`${match.url}/privacy-statement`} render={() => <PrivacyStatement />} />

    </Switch>
  )


}

export default ClientRoute;