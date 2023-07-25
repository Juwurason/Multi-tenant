
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
import ResponseUrl from '../MainPage/Employees/report';
import Account from '../MainPage/Employees/Accounts'
import Setup from '../MainPage/Employees/Setup'
import Support from '../MainPage/Employees/Support'
//Employees
import Employee from '../MainPage/Employees/Employees';
//Messages
import Message from '../MainPage/HR/Message'
import StaffRoute from '../modules/Staff';
import ClientRoute from '../modules/Client';
import ErrorRoute from '../MainPage/Pages/ErrorPage';

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
      path: 'error',
      component: ErrorRoute
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
      path: 'report',
      component: ResponseUrl
   },
   {
      path: 'staff',
      component: StaffRoute
   },
   {
      path: 'app',
      component: ClientRoute
   },

]