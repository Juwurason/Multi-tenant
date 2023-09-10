import React, { useEffect } from 'react';
import { Redirect, Route, Switch, useLocation, useHistory } from 'react-router-dom';
import LoginPage from './loginpage';
import ForgotPassword from './forgotpassword';
import DefaultLayout from './Sidebar/DefaultLayout';
import uicomponents from '../MainPage/UIinterface/components';
import CompanySetup from './CompanySetup';
import AdminRegistration from './AdminRegistration';
import StaffLayout from './Sidebar/StaffLayout';
import ClientLayout from './Sidebar/ClientLayout';
import AdminLayout from './Sidebar/AdminLayout';
import Timesheet from '../MainPage/HR/Reports/timesheet';
import TimesheetForAll from '../MainPage/HR/Reports/timesheetForAll';
import OTPscreen from './otp';
import StaffProgress from '../MainPage/HR/Reports/progressPrint';
import formTemplateDetails from '../MainPage/Employees/Setup/formTemplateDetails';
import ResetPassword from './resetPassword';
import RefferalDetails from '../MainPage/Employees/Employees/refferalDetails';
import GenerateShiftAttendance from '../MainPage/HR/Reports/generateShiftAttendanceReport';
import StaffAndClientAttendance from '../MainPage/HR/Reports/staffAndClientAttendance';

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
    if (location.pathname === '/') {
        history.push('/login')
    }

    // if (!user && location.pathname !== '/login') {
    //     return <Redirect to="/login" />;
    // }

    return (
        <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/forgotpassword" component={ForgotPassword} />
            <Route path="/resetpassword" component={ResetPassword} />
            <Route path="/register" component={CompanySetup} />
            <Route path="/admin/:companyId" component={AdminRegistration} />
            <Route path="/otp" component={OTPscreen} />
            <Route path="/app" component={DefaultLayout} />
            <Route path="/staff" component={StaffLayout} />
            <Route path="/administrator" component={AdminLayout} />
            <Route path="/client" component={ClientLayout} />

            <Route path="/ui-components" component={uicomponents} />
            <Route path={`/staff-timesheet/:sta/:dateFrom/:dateTo`} component={Timesheet} />
            <Route path={`/Allstaff-timesheet/:dateFrom/:dateTo`} component={TimesheetForAll} />
            <Route path={`/Alluser-shiftattendance/:dateFrom/:dateTo`} component={GenerateShiftAttendance} />
            <Route path={`/staff-client/:sta/:cli/:dateFrom/:dateTo`} component={StaffAndClientAttendance} />
            <Route path={`/staff-progress/:uid`} component={StaffProgress} />
            <Route path={`/form-details/:uid`} component={formTemplateDetails} />
            <Route path={`/refferal-details/:uid`} component={RefferalDetails} />

            <Route path="/logout" render={handleLogout} />
            {/* <Route component={Error404} /> Catch-all route */}
        </Switch>
    );
};

export default App;
