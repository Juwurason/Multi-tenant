/**
 * App Routes
 */
import React, { useEffect, useState } from 'react';
import { Link, Route, useHistory, withRouter } from 'react-router-dom';

// router service
import routerService from "../../router_service";
import ClientHeader from '../../modules/Client/Components/ClientHeader';
import Sidebar from './sidebar';


const ClientLayout = (props) => {
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


    const { match } = props;
    return (
        <>
            <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>

                <ClientHeader onMenuClick={(value) => toggleMobileMenu()} />
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
export default withRouter(ClientLayout);