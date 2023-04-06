
//main
import Dashboard from '../modules/Client/ClientDashboard/index';
import ClientChangePassword from '../modules/Client/ClientChangePassword';


export default [

    {
        path: 'client',
        component: Dashboard
    },
    {
        path: 'change-password',
        component: ClientChangePassword
    }

]