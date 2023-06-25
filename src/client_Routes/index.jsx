
//main
import Dashboard from '../modules/Client/ClientDashboard/index';
import ClientChangePassword from '../modules/Client/ClientChangePassword';
import ClientProfile from '../modules/Client/ClientProfile';
import ClientEditProfile from '../modules/Client/ClientEditProfile';
import ClientDocument from '../modules/Client/ClientDocument';
import ClientRoster from '../modules/Client/ClientRoster';
import ClientSchedule from '../modules/Client/ClientSchedule';
import ClientMessage from '../modules/Client/ClientSupport/Message/messageInbox';
import ClientViewTicket from '../modules/Client/ClientSupport/Support/viewTicket';
import ClientRaiseTicket from '../modules/Client/ClientSupport/Support/raiseTicket';
import ClientKnowledgeBase from '../modules/Client/ClientSupport/Support/knowledgeBase';
import ClientRep from '../modules/Client/ClientRep';
import ClientDisability from '../modules/Client/ClientDisability';
import ClientAidEquip from '../modules/Client/ClientAidEquip';
import ClientDailyLiving from '../modules/Client/ClientDailyLiving';
import ClientHealth from '../modules/Client/ClientHealth';
import ClientBehaviuor from '../modules/Client/ClientBehaviuor';

import ClientRoute from '../modules/Client';

export default [

    // {
    //     path: 'main',
    //     component: ClientRoute
    //  },

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
    {
        path: 'client-rep',
        component: ClientRep
    },
    {
        path: 'client-disability',
        component: ClientDisability
    },
    {
        path: 'client-aid-equip',
        component: ClientAidEquip
    },
    {
        path: 'client-daily-living',
        component: ClientDailyLiving
    },
    {
        path: 'client-health',
        component: ClientHealth
    },
    {
        path: 'client-behaviuor',
        component: ClientBehaviuor
    },
    {
        path: 'client-message',
        component: ClientMessage
    },
    {
        path: 'client-view_ticket',
        component: ClientViewTicket
    },
    {
        path: 'client-raise_ticket',
        component: ClientRaiseTicket
    },
    {
        path: 'client-knowledge_base',
        component: ClientKnowledgeBase
    },

    {
        path: 'client-schedule',
        component: ClientSchedule
    },

]