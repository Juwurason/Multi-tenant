/**
 * App Header
 */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import "../../Staff/StaffSidebar/style.css"

const AdminSidebar = (props) => {
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
            >
                <div className="sidebar-inner slimscroll">
                    <div id="sidebar-menu" className="sidebar-menu" style={{ backgroundColor: "#1C75B9", height: '100vh', paddingRight: '10px' }}>

                        <ul className="sidebar-vertical" id='veritical-sidebar'>
                            <li className="menu-title">
                                <span>Main</span>
                            </li>
                            <li className="submenu">
                                <a href="/administrator/administrator/adminDashboard" className={isSideMenu == "dashboard" ? "subdrop" : ""} onClick={() => toggleSidebar(isSideMenu == "dashboard" ? "" : "dashboard")}><i className="la la-dashboard" /> <span> Dashboard</span> </a>
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



export default withRouter(AdminSidebar);

