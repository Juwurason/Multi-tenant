/**
 * App Header
 */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';

const ClientSidebar = (props) => {
    const MenuMore = () => {
        document.getElementById("more-menu-hidden").classList.toggle("hidden");
    }

    const [isSideMenu, setSideMenu] = useState("");
    const [isSideMenunew, setSideMenuNew] = useState("dashboard")
    const [level2Menu, setLevel2Menu] = useState("")
    const [level3Menu, setLevel3Menu] = useState("")


    const toggleSidebar = (value) => {
        console.log(value);
        setSideMenu(value);
        setSideMenuNew(value);

    }

    const toggleLvelTwo = (value) => {
        setLevel2Menu(value)
    }
    const toggleLevelThree = (value) => {
        setLevel3Menu(value)
    }




    let pathname = props.location.pathname
    return (
        <div id="sidebar" className="sidebar" >
            <Scrollbars
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={200}
                autoHeight
                autoHeightMin={0}
                autoHeightMax="95vh"
                thumbMinSize={30}
                universal={false}
                hideTracksWhenNotNeeded={true}
            // horizontal="false"

            >
                <div className="sidebar-inner slimscroll">
                    <div id="sidebar-menu" className="sidebar-menu" style={{ backgroundColor: "#18225C", height: '100vh' }}>

                        <ul className="sidebar-vertical" id='veritical-sidebar'>
                            <li className="menu-title">
                                <span>Main</span>
                            </li>
                            <li className="submenu">
                                <a href="/client/client/Dashboard" className={isSideMenu == "dashboard" ? "subdrop" : ""} onClick={() => toggleSidebar(isSideMenu == "dashboard" ? "" : "dashboard")}><i className="la la-dashboard" /> <span> Dashboard</span> </a>

                            </li>

                            <li className="menu-title">
                                <span>Account Management</span>
                            </li>

                            <li className={pathname.includes('clients') ? "active" : ""}>
                                <Link to="/client/client-profile"><i className="la la-user" /> <span>My Profile</span></Link>
                            </li>

                            <li className={pathname.includes('leads') ? "active" : ""}>
                                <Link to="/client/change-password"><i className="la la-lock" /> <span>Change Password</span></Link>
                                {/* <li><Link to="/forgotpassword"> Forgot Password </Link></li> */}
                            </li>

                            <li className="menu-title">
                                <span>Staff-Client Management</span>
                            </li>

                            <li className={pathname.includes('policies') ? "active" : ""}>
                                <Link to=""><i className="la la-file-pdf-o" /> <span>Shift Roster</span></Link>
                            </li>
                            <li className={pathname.includes('policies') ? "active" : ""}>
                                <Link to="/client/client-document"><i className="la la-file-pdf-o" /> <span>Documents</span></Link>
                            </li>
                            <li className={pathname.includes('policies') ? "active" : ""}>
                                <Link to=""><i className="la la-file-pdf-o" /> <span>Representative</span></Link>
                            </li>
                            {/* <li className={pathname.includes('policies') ? "active" : ""}>
                                <Link to=""><i className="la la-file-pdf-o" /> <span>Disability Support Needs</span></Link>
                            </li>
                            <li className={pathname.includes('policies') ? "active" : ""}>
                                <Link to=""><i className="la la-file-pdf-o" /> <span>Aids & Equipments</span></Link>
                            </li>
                            <li className={pathname.includes('policies') ? "active" : ""}>
                                <Link to=""><i className="la la-file-pdf-o" /> <span>Day Living & Night Support</span></Link>
                            </li>
                            <li className={pathname.includes('policies') ? "active" : ""}>
                                <Link to=""><i className="la la-file-pdf-o" /> <span>Health Support Needs</span></Link>
                            </li>
                            <li className={pathname.includes('policies') ? "active" : ""}>
                                <Link to=""><i className="la la-file-pdf-o" /> <span>Behaviour Support Needs</span></Link>
                            </li>
                            <li className={pathname.includes('policies') ? "active" : ""}>
                                <Link to=""><i className="la la-file-pdf-o" /> <span>Community Support Needs</span></Link>
                            </li>
                            <li className={pathname.includes('policies') ? "active" : ""}>
                                <Link to=""><i className="la la-file-pdf-o" /> <span>Privacy Statement</span></Link>
                            </li> */}
                            {/* <li className={pathname.includes('policies') ? "active" : ""}>
                                <Link to="/staff/staff-table"><i className="la la-file-pdf-o" /> <span>Tab</span></Link>
                            </li> */}

                        </ul>
                    </div>
                </div>


            </Scrollbars>
            <div className="two-col-bar" id="two-col-bar">
                {/* <di */}
            </div>
        </div>


    );

}

export default withRouter(ClientSidebar);
