/**
 * App Routes
 */
import React, { useEffect, useState } from 'react';
import { Link, Route, useHistory, withRouter } from 'react-router-dom';

// router service
import routerService from "../../staff_Routes";

import Header from './header.jsx';
import SidebarContent from './sidebar';
import StaffHeader from '../../modules/Staff/Components/StaffHeader';
import StaffSidebar from '../../modules/Staff/Components/StaffSidebar';

const StaffLayout = (props) => {
    const navigate = useHistory()
    const [menu, setMenu] = useState(false)

    const toggleMobileMenu = () => {
        setMenu(!menu)
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user || !user.token) {
            navigate.push('/')
        }
    }, [localStorage.getItem('user')]);

    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate.push('/')
    }

    const { match } = props;
    return (
        <>
            <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>

                <StaffHeader onMenuClick={(value) => toggleMobileMenu()} onLogout={() => handleLogout()} />
                <div>
                    {routerService && routerService.map((route, key) =>
                        <Route key={key} path={`${match.url}/${route.path}`} component={route.component} />
                    )}
                </div>
                <StaffSidebar />

            </div>
        </>
    );

}
export default withRouter(StaffLayout);