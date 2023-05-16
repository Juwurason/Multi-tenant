
import AdminDashboard from '../modules/Admin/AdminDashboard';
import AllClients from '../modules/Admin/AllClient';
import AllStaff from '../modules/Admin/AllStaff';
import AllUsers from '../modules/Admin/AllUsers';
import ClientDocum from '../modules/Admin/ClientDocum';
import ClientsProfile from '../modules/Admin/ClientsProfile';
import AdminProfile from '../modules/Admin/Components/AdminProfile';
import CreateClient from '../modules/Admin/CreateClient';
import CreateStaff from '../modules/Admin/CreateStaff';
import EditClientPro from '../modules/Admin/EditClientPro';
import EditStaffProfile from '../modules/Admin/EditStaffProfile';
import EditUsers from '../modules/Admin/EditUsers';
import PublicHoliday from '../modules/Admin/PublicHoliday';
import Referrals from '../modules/Admin/Referal';
import StaffDocum from '../modules/Admin/StaffDocum';
import StaffProfile from '../modules/Admin/StaffProfile.jsx';


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

]