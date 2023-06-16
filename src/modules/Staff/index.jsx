

import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import EditProgressNote from './EditProgressNote';
import ProgressNote from './ProgressNote';
import StaffDashboard from './StaffDashboard';
import StaffDocument from './StaffDocument';
import StaffEditProfile from './StaffEditProfile';
import StaffChangePassword from './StaffForgettingPassword';
import StaffProgressNote from './StaffProgressNote';
import StaffRoster from './StaffRoster';
import StaffTable from './StaffTable';
import RaiseTicket from './Support/raiseTicket';
import ViewTicket from './Support/viewTicket';
import TicketDetails from './Support/ticketDetails';
import KnowledgeBase from './Support/knowledgeBase';
import StaffForm from './StaffForm';
import MessageInbox from './Message';
import StaffAttendanceReport from './StaffAttendanceReport';
import StaffAttendanceDetails from './StaffAttendanceDetails';
import StaffDailyReport from './StaffDailyReport';
import StaffNewReport from './StaffNewReport';
import StaffProfile from './StaffProfile';
import StaffAttendance from './StaffAttendance';
import AddReport from './AddReport';





const StaffRoute = ({ match }) => (
    <Switch>
       <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
       <Route path={`${match.url}/dashboard`} render={() => <StaffDashboard />} />
       <Route path={`${match.url}/document`} render={() => <StaffDocument />} />
       <Route path={`${match.url}/progressNote`} render={() => <StaffProgressNote />} />
       <Route path={`${match.url}/progressNote/:uid`} render={() => <ProgressNote />} />
       <Route path={`${match.url}/edit-progress/:uid/:pro`} render={() => <EditProgressNote />} />
       <Route path={`${match.url}/table`} render={() => <StaffTable />} />
       <Route path={`${match.url}/profile`} render={() => <StaffProfile />} />
       <Route path={`${match.url}/edit-profile`} render={() => <StaffEditProfile />} />
       <Route path={`${match.url}/changepassword`} render={() => <StaffChangePassword />} />
       <Route path={`${match.url}/attendance`} render={() => <StaffAttendance />} />
       <Route path={`${match.url}/roster`} render={() => <StaffRoster />} />
       <Route path={`${match.url}/report/:uid`} render={() => <AddReport />} />
       <Route path={`${match.url}/view-ticket`} render={() => <ViewTicket />} />
       <Route path={`${match.url}/raise-ticket`} render={() => <RaiseTicket />} />
       <Route path={`${match.url}/ticket-details/:uid`} render={() => <TicketDetails />} />
       <Route path={`${match.url}/knowledge`} render={() => <KnowledgeBase />} />
       <Route path={`${match.url}/form`} render={() => <StaffForm />} />
       <Route path={`${match.url}/messageInbox`} render={() => <MessageInbox />} />
       <Route path={`${match.url}/attendance-report/:uid`} render={() => <StaffAttendanceReport />} />
       <Route path={`${match.url}/attendance-details/:uid`} render={() => <StaffAttendanceDetails />} />
       <Route path={`${match.url}/daily-report`} render={() => <StaffDailyReport />} />
       <Route path={`${match.url}/new-report`} render={() => <StaffNewReport />} />
      
    </Switch>
 );
 
 export default StaffRoute;