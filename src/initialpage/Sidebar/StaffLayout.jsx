/**
 * App Routes
 */
import React, { useEffect, useState } from 'react';
import { Link, Route, useHistory, withRouter } from 'react-router-dom';

// router service
import routerService from "../../router_service";

import StaffHeader from '../../modules/Staff/Components/StaffHeader';
import Sidebar from './sidebar';

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
    }, [navigate]);



    const { match } = props;
    return (
        <>
            <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>

                <StaffHeader onMenuClick={(value) => toggleMobileMenu()} />
                <div>
                    {routerService && routerService.map((route, key) =>
                        <Route key={key} path={`${match.url}/${route.path}`} component={route.component} />
                    )}
                </div>
                <Sidebar onMenuClick={(value) => toggleMobileMenu()} />

            </div>
        </>
    );

}
export default withRouter(StaffLayout);