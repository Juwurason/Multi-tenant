
//main
import Dashboard from '../modules/Client/ClientDashboard/index';
import ClientChangePassword from '../modules/Client/ClientChangePassword';
import ClientProfile from '../modules/Client/ClientProfile';
import ClientEditProfile from '../modules/Client/ClientEditProfile';


export default [

    {
        path: 'client',
        component: Dashboard
    },
    {
        path: 'change-password',
        component: ClientChangePassword
    },
    {
        path: 'client-profile',
        component: ClientProfile
    },
    {
        path: 'client-edit-profile',
        component: ClientEditProfile
    },

]