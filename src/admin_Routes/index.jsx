
import AdminDashboard from '../modules/Admin/AdminDashboard';
import AllStaff from '../modules/Admin/AllStaff';
import AdminProfile from '../modules/Admin/Components/AdminProfile';
import CreateStaff from '../modules/Admin/CreateStaff';
import EditStaffProfile from '../modules/Admin/EditStaffProfile';
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


]