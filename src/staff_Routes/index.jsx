
import StaffDashboard from '../modules/Staff/StaffDashboard';
import StaffForm from '../modules/Staff/StaffForm';
import StaffProfile from '../modules/Staff/StaffProfile';
import StaffRoster from '../modules/Staff/StaffRoster';
import StaffEditProfile from '../modules/Staff/StaffEditProfile';
import StaffChangePassword from '../modules/Staff/StaffForgettingPassword';
import StaffDocument from '../modules/Staff/StaffDocument';
import StaffAttendance from '../modules/Staff/StaffAttendance';
import StaffAttendanceReport from '../modules/Staff/StaffAttendanceReport';
import StaffAttendanceDetails from '../modules/Staff/StaffAttendanceDetails';
import StaffTable from '../modules/Staff/StaffTable';
import ProgressNote from '../modules/Staff/ProgressNote'
import EditProgressNote from '../modules/Staff/EditProgressNote';
import StaffProgressNote from '../modules/Staff/StaffProgressNote';
import StaffDailyReport from '../modules/Staff/StaffDailyReport';
import StaffNewReport from '../modules/Staff/StaffNewReport';
import AddReport from '../modules/Staff/AddReport';
import ViewTicket from '../modules/Staff/Support/viewTicket';
import RaiseTicket from '../modules/Staff/Support/raiseTicket';
import KnowledgeBase from '../modules/Staff/Support/knowledgeBase';
import MessageInbox from '../modules/Staff/Message';
import TicketDetails from '../modules/Staff/Support/ticketDetails';

export default [

   {
      path: 'staff',
      component: StaffDashboard
   },
   {
      path: 'staff-document',
      component: StaffDocument
   },
   {
      path: 'staff-progress/:uid',
      component: ProgressNote
   },
   {
      path: 'staff-progressNote',
      component: StaffProgressNote
   },
   {
      path: 'staff-edit-progress/:uid/:pro',
      component: EditProgressNote
   },
   {
      path: 'staff-table',
      component: StaffTable
   },
   {
      path: 'staff-edit-profile',
      component: StaffEditProfile
   },
   {
      path: 'staffchangepassword',
      component: StaffChangePassword
   },
   {
      path: 'staff-attendance',
      component: StaffAttendance
   },
   {
      path: 'staff-roster',
      component: StaffRoster
   },
   {
      path: 'staff-report/:uid',
      component: AddReport
   },

   {
      path: 'staffprofile',
      component: StaffProfile
   },

   {
      path: 'view-ticket',
      component: ViewTicket
  },

  {
      path: 'raise-ticket',
      component: RaiseTicket
  },

  {
      path: 'ticket-details/:uid',
      component: TicketDetails
  },

  {
      path: 'knowledge',
      component: KnowledgeBase
  },

   {
      path: 'staff-form',
      component: StaffForm
   },

   {
      path: 'messageInbox',
      component: MessageInbox
   },

   {
      path: 'attendance-report/:uid',
      component: StaffAttendanceReport
   },

   {
      path: 'attendance-details/:uid',
      component: StaffAttendanceDetails
   },

   {
      path: 'staff-daily-report',
      component: StaffDailyReport
   },

   {
      path: 'staff-new-report',
      component: StaffNewReport
   },

]