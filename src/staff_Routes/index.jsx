
import StaffDashboard from '../modules/Staff/StaffDashboard';
import StaffForm from '../modules/Staff/StaffForm';
import StaffProfile from '../modules/Staff/StaffProfile';
import StaffRoster from '../modules/Staff/StaffRoster';
import StaffEditProfile from '../modules/Staff/StaffEditProfile';
import StaffChangePassword from '../modules/Staff/StaffForgettingPassword';
import StaffDocument from '../modules/Staff/StaffDocument';
import StaffAttendance from '../modules/Staff/StaffAttendance';
import StaffTable from '../modules/Staff/StaffTable';
import ProgressNote from '../modules/Staff/ProgressNote'
import EditProgressNote from '../modules/Staff/EditProgressNote';
import StaffProgressNote from '../modules/Staff/StaffProgressNote';
import AddReport from '../modules/Staff/AddReport';
import ViewTicket from '../modules/Staff/Support/viewTicket';
import RaiseTicket from '../modules/Staff/Support/raiseTicket';
import KnowledgeBase from '../modules/Staff/Support/knowledgeBase';

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
      path: 'knowledge',
      component: KnowledgeBase
  },

   {
      path: 'staff-form',
      component: StaffForm
   },

]