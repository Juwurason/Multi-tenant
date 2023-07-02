
//main
import Dashboard from '../MainPage/Main/Dashboard';
import Apps from '../MainPage/Main/Apps';
//UI Interface
import UIinterface from '../MainPage/UIinterface';
//Pages
import ProfilePage from '../MainPage/Pages/Profile';
//Performance
//HR
import Reports from '../MainPage/HR/Reports';
import Account from '../MainPage/Employees/Accounts'
import Setup from '../MainPage/Employees/Setup'
import Support from '../MainPage/Employees/Support'
//Employees
import Employee from '../MainPage/Employees/Employees';
//Messages
import Message from '../MainPage/HR/Message'
import StaffRoute from '../modules/Staff';

export default [
   {
      path: 'main',
      component: Dashboard
   },

   {
      path: 'apps',
      component: Apps
   },
   {
      path: 'employee',
      component: Employee
   },
   {
      path: 'account',
      component: Account,
   },


   {
      path: 'ui-interface',
      component: UIinterface
   },
   {
      path: 'profile',
      component: ProfilePage
   },


   {
      path: 'support',
      component: Support
   },



   {
      path: 'reports',
      component: Reports
   },

   {
      path: 'message',
      component: Message
   },

   {
      path: 'setup',
      component: Setup
   },
   {
      path: 'staff',
      component: StaffRoute
   },


]