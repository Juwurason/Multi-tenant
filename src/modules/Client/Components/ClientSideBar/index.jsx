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
                    <div id="sidebar-menu" className="sidebar-menu" style={{ backgroundColor: "#1C75B9", height: '100vh' }}>

                        <ul className="sidebar-vertical" id='veritical-sidebar'>
                            <li className="menu-title">
                                <span>Main</span>
                            </li>
                            <li className="submenu">
                                <a href="/client/client" className={isSideMenu == "dashboard" ? "subdrop" : ""} onClick={() => toggleSidebar(isSideMenu == "dashboard" ? "" : "dashboard")}>
                                    <i className="la la-dashboard" />
                                    <span> Dashboard</span> </a>

                            </li>

                            <li className="menu-title">
                                <span>Profile Management</span>
                            </li>

                            <li className={pathname.includes('clients') ? "active" : ""}>
                                <Link to="/client/client-profile"><i className="la la-user" /> <span>My Profile</span></Link>
                            </li>

                            <li className={pathname.includes('leads') ? "active" : ""}>
                                <Link to="/client/change-password"><i className="la la-lock" /> <span>Change Password</span></Link>
                                {/* <li><Link to="/forgotpassword"> Forgot Password </Link></li> */}
                            </li>

                            <li className="menu-title">
                                <span>Client Management</span>
                            </li>

                            <li className={pathname.includes('policies') ? "active" : ""}>
                                <Link to="/client/client-roster"><i className="la la-calendar" /> <span>Shift Roster</span></Link>
                            </li>
                            <li className={pathname.includes('policies') ? "active" : ""}>
                                <Link to="/client/client-document"><i className="la la-book" /> <span>Documents</span></Link>
                            </li>
                            {/* <li className={pathname.includes('policies') ? "active" : ""}>
                                <Link to=""><i className="la la-file-pdf-o" /> <span>Representative</span></Link>
                            </li> */}
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
                            <li className="menu-title">
                                <span>Communication</span>
                            </li>
                            <li className={pathname.includes('message') || pathname.includes('message') ? "active" : ""}>
                                <Link to="/client/client-message"><i className="la la-comment" /> <span>Messages</span></Link>
                            </li>
                            <li className="submenu">
                                <a href="javascript:void(0)" className={isSideMenu == "sales" ? "subdrop" : ""} onClick={() => toggleSidebar(isSideMenu == "sales" ? "" : "sales")}><i className="la la-headphones" /> <span>Support</span> <span className="menu-arrow" /></a>
                                {isSideMenu == "sales" ?
                                    <ul>
                                        <li><Link className={pathname.includes('t_dashboard') ? "active" : pathname.includes('projects-list') ?
                                            "active" : pathname.includes('cts-view') ? "active" : ""}
                                            to="/client/client-view_ticket">View Tickets</Link>
                                        </li>

                                        <li><Link className={pathname.includes('t_dashboard') ? "active" : pathname.includes('projects-list') ?
                                            "active" : pathname.includes('cts-view') ? "active" : ""}
                                            to="/client/client-raise_ticket">Raise a Ticket</Link>
                                        </li>

                                        <li><Link className={pathname.includes('t_dashboard') ? "active" : pathname.includes('projects-list') ?
                                            "active" : pathname.includes('cts-view') ? "active" : ""}
                                            to="/client/client-knowledge_base">Knowledge Base</Link>
                                        </li>

                                    </ul>
                                    : ""
                                }
                            </li>

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
