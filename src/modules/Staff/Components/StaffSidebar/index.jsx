/**
 * App Header
 */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import "./style.css"

const StaffSidebar = (props) => {
    const MenuMore = () => {
        document.getElementById("more-menu-hidden").classList.toggle("hidden");
    }

    const [isSideMenu, setSideMenu] = useState("");
    const [isSideMenunew, setSideMenuNew] = useState("dashboard")
    const [level2Menu, setLevel2Menu] = useState("")
    const [level3Menu, setLevel3Menu] = useState("")


    const toggleSidebar = (value) => {
        // console.log(value);
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
            >
                <div className="sidebar-inner slimscroll">
                    <div id="sidebar-menu" className="sidebar-menu" style={{ backgroundColor: "#1C75B9", height: '100vh' }}>

                        <ul className="sidebar-vertical" id='veritical-sidebar'>
                            <li className="menu-title">
                                <span>Main</span>
                            </li>
                            <li className="submenu">
                                <Link to="/staff/staff" className={isSideMenu == "dashboard" ? "subdrop" : ""} onClick={() => toggleSidebar(isSideMenu == "dashboard" ? "" : "dashboard")}><i className="la la-dashboard" /> <span> Dashboard</span> </Link>
                            </li>

                            <li className="menu-title">
                                <span>Account Management</span>
                            </li>

                            <li className={pathname.includes('staffprofile') ? "active" : ""}>
                                <Link to="/staff/staffprofile"><i className="la la-user" /> <span>Profile</span></Link>
                            </li>

                            <li className={pathname.includes('staffchangepassword') ? "active" : ""}>
                                <Link to="/staff/staffchangepassword"><i className="la la-lock" /> <span>Change Password</span></Link>
                                {/* <li><Link to="/forgotpassword"> Forgot Password </Link></li> */}
                            </li>
                            <li className={pathname.includes('staff-form') ? "active" : pathname.includes('ticket-view') ? "active" : ""}>
                                <Link to="/staff/staff-form"><i className="la la-book" /> <span>My Availabilities</span></Link>
                            </li>
                            <li className={pathname.includes('staff-attendance') ? "active" : pathname.includes('ticket-view') ? "active" : ""}>
                                <Link to="/staff/staff-attendance"><i className="la la-columns" /> <span>My Attendances</span></Link>
                            </li>
                            <li className={pathname.includes('staff-progressNote') ? "active" : pathname.includes('ticket-view') ? "active" : ""}>
                                <Link to="/staff/staff-progressNote"><i className="la la-clipboard" /> <span>My Progress Note</span></Link>
                            </li>
                            <li className="menu-title">
                                <span>Staff-Client Management</span>
                            </li>

                            <li className={pathname.includes('staff-roster') ? "active" : ""}>
                                <Link to="/staff/staff-roster"><i className="la la-calendar" /> <span>My Shift Roster</span></Link>
                            </li>
                            <li className={pathname.includes('staff-document') ? "active" : ""}>
                                <Link to="/staff/staff-document"><i className="la la-book" /> <span>Documents</span></Link>
                            </li>

                            <li className="menu-title">
                                <span>Communication</span>
                            </li>
                            
                            <li className="submenu">
                                <a href="javascript:void(0)" className={isSideMenu == "ticket" ? "subdrop" : ""} onClick={() => toggleSidebar(isSideMenu == "ticket" ? "" : "ticket")}><i className="la la-headphones" /> <span>Support</span> <span className="menu-arrow" /></a>
                                {isSideMenu == "ticket" ?
                                    <ul>
                                        <li><Link className={pathname.includes('t_dashboard') ? "active" : pathname.includes('projects-list') ?
                                            "active" : pathname.includes('cts-view') ? "active" : ""}
                                            to="/staff/view-ticket">View Tickets</Link>
                                        </li>

                                        <li><Link className={pathname.includes('t_dashboard') ? "active" : pathname.includes('projects-list') ?
                                            "active" : pathname.includes('cts-view') ? "active" : ""}
                                            to="/staff/raise-ticket">Raise a Ticket</Link>
                                        </li>

                                        <li><Link className={pathname.includes('t_dashboard') ? "active" : pathname.includes('projects-list') ?
                                            "active" : pathname.includes('cts-view') ? "active" : ""}
                                            to="/staff/knowledge">Knowledge Base</Link>
                                        </li>

                                    </ul>
                                    : ""
                                }
                            </li>

                        </ul>
                    </div>
                </div>


            </Scrollbars>

        </div>


    );

}



export default withRouter(StaffSidebar);

