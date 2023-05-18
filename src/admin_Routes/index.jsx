
import AdminDashboard from '../modules/Admin/AdminDashboard';
import AllClients from '../modules/Admin/AllClient';
import AllStaff from '../modules/Admin/AllStaff';
import AllUsers from '../modules/Admin/AllUsers';
import AttendanceReport from '../modules/Admin/AttendanceReport';
import ClientDocum from '../modules/Admin/ClientDocum';
import ClientsProfile from '../modules/Admin/ClientsProfile';
import AdminProfile from '../modules/Admin/Components/AdminProfile';
import CreateClient from '../modules/Admin/CreateClient';
import CreateShift from '../modules/Admin/CreateShift';
import CreateStaff from '../modules/Admin/CreateStaff';
import EditClientPro from '../modules/Admin/EditClientPro';
import EditShiftRoaster from '../modules/Admin/EditShiftRoster';
import EditStaffProfile from '../modules/Admin/EditStaffProfile';
import EditUsers from '../modules/Admin/EditUsers';
import ProgressReport from '../modules/Admin/ProgressReport';
import ProgressReportDetails from '../modules/Admin/ProgressReportDetails';
import PublicHoliday from '../modules/Admin/PublicHoliday';
import Referrals from '../modules/Admin/Referal';
import ScheduleSupport from '../modules/Admin/ScheduleSupport';
import ShiftRoster from '../modules/Admin/ShiftRoster';
import StaffDocum from '../modules/Admin/StaffDocum';
import StaffProfile from '../modules/Admin/StaffProfile.jsx';
import SupportType from '../modules/Admin/SupportType';


export default [

    {
        path: 'administrator',
        component: AdminDashboard
    },
    {
        path: 'profile',
        component: AdminProfile
    },
    {
        path: 'allStaff',
        component: AllStaff
    },
    {
        path: 'staffProfile/:uid',
        component: StaffProfile
    },
    {
        path: 'editStaffProfile/:uid',
        component: EditStaffProfile
    },
    {
        path: 'createStaff',
        component: CreateStaff
    },
    {
        path: 'staffDocum/:uid',
        component: StaffDocum
    },
    {
        path: 'allClient',
        component: AllClients
    },
    {
        path: 'clientProfile/:uid',
        component: ClientsProfile
    },
    {
        path: 'editClientPro/:uid',
        component: EditClientPro
    },
    {
        path: 'createClient',
        component: CreateClient
    },
    {
        path: 'clientDocum/:uid',
        component: ClientDocum
    },
    {
        path: 'allUsers',
        component: AllUsers
    },
    {
        path: 'editUsers/:uid',
        component: EditUsers
    },
    {
        path: 'referrals',
        component: Referrals
    },
    {
        path: 'publicHoliday',
        component: PublicHoliday
    },
    {
        path: 'scheduleSupport',
        component: ScheduleSupport
    },
    {
        path: 'supportType',
        component: SupportType
    },
    {
        path: 'shiftRoster',
        component: ShiftRoster
    },
    {
        path: 'editShiftRoster/:uid',
        component: EditShiftRoaster
    },
    {
        path: 'createshift',
        component: CreateShift
    },
    {
        path: 'attendanceReport',
        component: AttendanceReport
    },
    {
        path: 'progressReport',
        component: ProgressReport
    },
    {
        path: 'progressReportDetails/:uid',
        component: ProgressReportDetails
    },

]