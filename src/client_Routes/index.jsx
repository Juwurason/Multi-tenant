
//main
import Dashboard from '../modules/Client/ClientDashboard/index';
import ClientChangePassword from '../modules/Client/ClientChangePassword';
import ClientProfile from '../modules/Client/ClientProfile';
import ClientEditProfile from '../modules/Client/ClientEditProfile';
import ClientDocument from '../modules/Client/ClientDocument';
import ClientRoster from '../modules/Client/ClientRoster';

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
    {
        path: 'client-document',
        component: ClientDocument
    },
    {
        path: 'client-roster',
        component: ClientRoster
    },

]