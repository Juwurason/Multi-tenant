
//main
import StaffDashboard from '../modules/Staff/StaffDashboard';
import Dashboard from '../MainPage/Main/Dashboard';
import Apps from '../MainPage/Main/Apps';
//UI Interface
import UIinterface from '../MainPage/UIinterface';
import StaffForm from '../modules/Staff/StaffForm';
//Pages
import StaffProfile from '../modules/Staff/StaffProfile';
import StaffRoster from '../modules/Staff/StaffRoster';
import Subscription from '../MainPage/Pages/Subscription';
import Pages from '../MainPage/Pages/Pages';
import StaffEditProfile from '../modules/Staff/StaffEditProfile';
//Administrator
import Administrator from '../MainPage/Administration';
import StaffChangePassword from '../modules/Staff/StaffForgettingPassword';
//Performance
import Performance from '../MainPage/Performance';
import Goals from '../MainPage/Performance/Goals';
import Performances from '../MainPage/Performance/Performance';
import Training from '../MainPage/Performance/Training';
//HR
import HR from '../MainPage/HR';
import Reports from '../MainPage/HR/Reports';
import Sales from '../MainPage/HR/Sales';
import Accounts from '../MainPage/HR/Accounts'
import Payroll from '../MainPage/HR/Payroll';
import StaffDocument from '../modules/Staff/StaffDocument';
//Employees
import Employees from '../MainPage/Employees';
import Projects from '../MainPage/Employees/Projects';
import Employee from '../MainPage/Employees/Employees';
import ProjectList from '../MainPage/Employees/Projects/projectlist'
import StaffAttendance from '../modules/Staff/StaffAttendance';

export default [
   {
      path: 'main',
      component: Dashboard
   },
   {
      path: 'staff',
      component: StaffDashboard
   },
   {
      path: 'staff-document',
      component: StaffDocument
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
      path: 'apps',
      component: Apps
   },
   {
      path: 'employee',
      component: Employee
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
      path: 'staffprofile',
      component: StaffProfile
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
      path: 'administrator',
      component: Administrator
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
      path: 'performances',
      component: Performances
   },
   {
      path: 'training',
      component: Training
   },
   {
      path: 'hr',
      component: HR
   },
   {
      path: 'reports',
      component: Reports
   },
   {
      path: 'sales',
      component: Sales
   },
   {
      path: 'accounts',
      component: Accounts
   },
   {
      path: 'payroll',
      component: Payroll
   },
   {
      path: 'staff-form',
      component: StaffForm
   },
   {
      path: 'projectlist',
      component: ProjectList
   }
]