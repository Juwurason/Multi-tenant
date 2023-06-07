
//main
import Dashboard from '../MainPage/Main/Dashboard';
import Apps from '../MainPage/Main/Apps';
//UI Interface
import UIinterface from '../MainPage/UIinterface';
//Pages
import ProfilePage from '../MainPage/Pages/Profile';
import Subscription from '../MainPage/Pages/Subscription';
import Pages from '../MainPage/Pages/Pages';
//Performance
import Performance from '../MainPage/Performance';
import Goals from '../MainPage/Performance/Goals';
import Performances from '../MainPage/Performance/Performance';
import Training from '../MainPage/Performance/Training';
//HR
import Reports from '../MainPage/HR/Reports';
import Account from '../MainPage/Employees/Accounts'
import Setup from '../MainPage/Employees/Setup'
import Support from '../MainPage/Employees/Support'
//Employees
import Employees from '../MainPage/Employees';
import Projects from '../MainPage/Employees/Projects';
import Employee from '../MainPage/Employees/Employees';
import ProjectList from '../MainPage/Employees/Projects/projectlist'
//Messages
import Message from '../MainPage/HR/Message'

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
      path: 'employees',
      component: Employees
   },
   {
      path: 'projects',
      component: Projects
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
      path: 'subscription',
      component: Subscription
   },
   {
      path: 'pages',
      component: Pages
   },

   {
      path: 'performance',
      component: Performance
   },
   {
      path: 'goals',
      component: Goals
   },
   {
      path: 'support',
      component: Support
   },
   {
      path: 'performances',
      component: Performances
   },
   {
      path: 'training',
      component: Training
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
      path: 'projectlist',
      component: ProjectList
   }
]