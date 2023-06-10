import React, { useEffect } from 'react';
import { Redirect, Route, Switch, useLocation, useHistory } from 'react-router-dom';
import LoginPage from './loginpage';
import ForgotPassword from './forgotpassword';
import OTP from './otp';
import DefaultLayout from './Sidebar/DefaultLayout';
import Tasklayout from './Sidebar/tasklayout';
import chatlayout from './Sidebar/chatlayout';
import uicomponents from '../MainPage/UIinterface/components';
import Error404 from '../MainPage/Pages/ErrorPage/error404';
import Error500 from '../MainPage/Pages/ErrorPage/error500';
import CompanySetup from './CompanySetup';
import AdminRegistration from './AdminRegistration';
import StaffLayout from './Sidebar/StaffLayout';
import ClientLayout from './Sidebar/ClientLayout';
import AdminLayout from './Sidebar/AdminLayout';

const App = () => {
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        if (
            location.pathname.includes('login') ||
            location.pathname.includes('register') ||
            location.pathname.includes('forgotpassword') ||
            location.pathname.includes('otp') ||
            location.pathname.includes('lockscreen')
        ) {
            // $('body').addClass('account-page');
        } else if (
            location.pathname.includes('error-404') ||
            location.pathname.includes('error-500')
        ) {
            // $('body').addClass('error-page');
        }
    }, [location.pathname]);

    const user = localStorage.getItem('user');

    const handleLogout = () => {
        // Clear user data from local storage
        localStorage.removeItem('user');
        // Redirect to the previous location
        history.goBack();
    };

    if (!user && location.pathname !== '/login') {
        return <Redirect to="/login" />;
    }

    return (
        <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/forgotpassword" component={ForgotPassword} />
            <Route path="/register" component={CompanySetup} />
            <Route path="/admin/:companyId" component={AdminRegistration} />
            <Route path="/otp" component={OTP} />
            <Route path="/app" component={DefaultLayout} />
            <Route path="/staff" component={StaffLayout} />
            <Route path="/administrator" component={AdminLayout} />
            <Route path="/client" component={ClientLayout} />
            <Route path="/tasks" component={Tasklayout} />
            <Route path="/conversation" component={chatlayout} />
            <Route path="/ui-components" component={uicomponents} />
            <Route path="/error-500" component={Error500} />
            <Route path="/logout" render={handleLogout} />
            <Route component={Error404} /> {/* Catch-all route */}
        </Switch>
    );
};

export default App;
