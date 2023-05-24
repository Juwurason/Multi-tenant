/**
 * App Header
 */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import "../../Staff/Components/StaffSidebar/style.css"

const AdminSidebar = (props) => {
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
        <div id="sidebar" className="sidebar" style={{ backgroundColor: "#1C75B9"}}>
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
                    <div id="sidebar-menu" className="sidebar-menu" style={{ backgroundColor: "#1C75B9", height: '100vh', paddingRight: '10px' }}>

                        <ul className="sidebar-vertical" id='veritical-sidebar'>
                            <li className="menu-title">
                                <span>Main</span>
                            </li>
                            <li className="submenu">
                                <Link to="/administrator/administrator/adminDashboard" className={isSideMenu == "dashboard" ? "subdrop" : ""} onClick={() => toggleSidebar(isSideMenu == "dashboard" ? "" : "dashboard")}><i className="la la-dashboard" /> <span> Dashboard</span> </Link>
                            </li>

                            <li className="menu-title">
                                <span>User Management</span>
                            </li>

                            <li className={pathname.includes('allStaff') ? "active" : ""}>
                                <Link to="/administrator/allStaff"><i className="la la-user" /> <span>Staffs</span></Link>
                            </li>

                            <li className={pathname.includes('allClient') ? "active" : ""}>
                                <Link to="/administrator/allClient"><i className="la la-users" /> <span>Clients</span></Link>
                            </li>


                            <li className="submenu">
                                <a href="javascript:void(0)" className={isSideMenu == "sales" ? "subdrop" : ""} onClick={() => toggleSidebar(isSideMenu == "sales" ? "" : "sales")}><i className="la la-tools" /> <span>Account Management</span> <span className="menu-arrow" /></a>
                                {isSideMenu == "sales" ?
                                    <ul>
                                        <li><Link className={pathname.includes('t_dashboard') ? "active" : pathname.includes('sales-list') ?
                                            "active" : pathname.includes('cts-view') ? "active" : ""}
                                            to="/administrator/allUsers">Manage Users</Link>
                                        </li>

                                        <li><Link className={pathname.includes('t_dashboard') ? "active" : pathname.includes('sales-list') ?
                                            "active" : pathname.includes('cts-view') ? "active" : ""}
                                            to="/administrator/referrals">Referrals</Link>
                                        </li>

                                    </ul>
                                    : ""
                                }
                            </li>

                            <li className="menu-title">
                                <span>Staff-Client Management</span>
                            </li>

                            <li className="submenu">
                                <a href="javascript:void(0)" className={isSideMenu == "projects" ? "subdrop" : ""} onClick={() => toggleSidebar(isSideMenu == "projects" ? "" : "projects")}><i className="la la-map" /> <span>Set Up</span> <span className="menu-arrow" /></a>
                                {isSideMenu == "projects" ?
                                    <ul>
                                        <li><Link className={pathname.includes('t_dashboard') ? "active" : pathname.includes('projects-list') ?
                                            "active" : pathname.includes('cts-view') ? "active" : ""}
                                            to="/administrator/publicHoliday">Public Holidays</Link>
                                        </li>

                                        <li><Link className={pathname.includes('t_dashboard') ? "active" : pathname.includes('projects-list') ?
                                            "active" : pathname.includes('cts-view') ? "active" : ""}
                                            to="/administrator/scheduleSupport">Schedule Supports</Link>
                                        </li>

                                        <li><Link className={pathname.includes('t_dashboard') ? "active" : pathname.includes('projects-list') ?
                                            "active" : pathname.includes('cts-view') ? "active" : ""}
                                            to="/administrator/supportType">Support Type</Link>
                                        </li>

                                    </ul>
                                    : ""
                                }
                            </li>

                            <li className={pathname.includes('shiftRoster') ? "active" : ""}>
                                <Link to="/administrator/shiftRoster"><i className="la la-calendar" /> <span>Shift Roster</span></Link>
                            </li>

                            <li className="menu-title">
                                <span>Report Management</span>
                            </li>

                            <li className={pathname.includes('attendanceReport') || pathname.includes('attendanceReport') ? "active" : ""}>
                                <Link to="/administrator/attendanceReport"><i className="la la-calendar-check-o" /> <span>Attendance Report</span></Link>
                            </li>

                            <li className={pathname.includes('progressReport') || pathname.includes('progressReport') ? "active" : ""}>
                                <Link to="/administrator/progressReport"><i className="la la-file-o" /> <span>Progress Report</span></Link>
                            </li>

                            {/* <li className={pathname.includes('document') || pathname.includes('document') ? "active" : ""}>
                                <Link to="/app/employee/document"><i className="la la-book" /> <span>Documents</span></Link>
                            </li> */}

                            <li className="menu-title">
                                <span>Communication</span>
                            </li>

                            <li className={pathname.includes('messageInbox') || pathname.includes('messageInbox') ? "active" : ""}>
                                <Link to="/administrator/messageInbox"><i className="la la-comment" /> <span>Messages</span></Link>
                            </li>

                            <li className="submenu">
                                <a href="javascript:void(0)" className={isSideMenu == "ticket" ? "subdrop" : ""} onClick={() => toggleSidebar(isSideMenu == "ticket" ? "" : "ticket")}><i className="la la-headphones" /> <span>Support</span> <span className="menu-arrow" /></a>
                                {isSideMenu == "ticket" ?
                                    <ul>
                                        <li><Link className={pathname.includes('t_dashboard') ? "active" : pathname.includes('projects-list') ?
                                            "active" : pathname.includes('cts-view') ? "active" : ""}
                                            to="/administrator/viewTickets">View Tickets</Link>
                                        </li>

                                        <li><Link className={pathname.includes('t_dashboard') ? "active" : pathname.includes('projects-list') ?
                                            "active" : pathname.includes('cts-view') ? "active" : ""}
                                            to="/administrator/raiseTicket">Raise a Ticket</Link>
                                        </li>

                                        <li><Link className={pathname.includes('t_dashboard') ? "active" : pathname.includes('projects-list') ?
                                            "active" : pathname.includes('cts-view') ? "active" : ""}
                                            to="/administrator/knowledge">Knowledge Base</Link>
                                        </li>

                                    </ul>
                                    : ""
                                }
                            </li>

                            <br />

                        </ul>
                    </div>
                </div>


            </Scrollbars>

        </div>


    );

}



export default withRouter(AdminSidebar);

