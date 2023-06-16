import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { MdDashboard } from 'react-icons/md';

const StaffSidebar = (props) => {
    const MenuMore = () => {
        document.getElementById("more-menu-hidden").classList.toggle("hidden");
    }

    const onMenuClik = () => {
        props.onMenuClick()
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
        <div id="sidebar" className="sidebar" style={{ backgroundColor: "#1C75B9" }}>
            <Scrollbars
                autoHide
                // autoHideTimeout={1000}
                // autoHideDuration={200}
                autoHeight
                autoHeightMin={0}
                autoHeightMax="95vh"
                thumbMinSize={30}
                universal={false}
                hideTracksWhenNotNeeded={true}


            >
                <div className="sidebar-inner slimscroll">
                    <div id="sidebar-menu" className="sidebar-menu" style={{ backgroundColor: "#1C75B9", height: '100vh' }}>


                        { /*Vertical Sidebar starts here*/}
                        <ul className="sidebar-vertical" id='veritical-sidebar'>
                            <li className="menu-title">
                                <span>Main</span>
                            </li>
                            <li className={pathname.includes('dashboard') ? "active" : ""} onClick={() => onMenuClik()}>

                                <Link to="/staff/main/dashboard"  >
                                    <i className="la la-dashboard" />
                                    <span> Dashboard</span></Link>

                            </li>

                            <li className="menu-title">
                                <span>Account Management</span>
                            </li>
                            <li className={pathname.includes('profile') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/staff/main/profile"><i className="la la-user" /> <span>Profile</span></Link>
                            </li>

                            <li className={pathname.includes('changepassword') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/staff/main/changepassword"><i className="la la-lock" /> <span>Change Password</span></Link>
                            </li>
                            <li className={pathname.includes('form') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/staff/main/form"><i className="la la-book" /> <span>My Availabilities</span></Link>
                            </li>

                            <li className={pathname.includes('attendance') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/staff/main/attendance"><i className="la la-calendar-check-o" /> <span>My Attendances</span></Link>
                            </li>

                            <li className={pathname.includes('progressNote') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/staff/main/progressNote"><i className="la la-folder-open" /> <span>My Progress Note</span></Link>
                            </li>
                        
                            <li className="menu-title">
                                <span>Staff-Client Management</span>
                            </li>
                   
                            <li className={pathname.includes('roster') || pathname.includes('roster') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/staff/main/roster"><i className="la la-calendar" /> <span>My Shift Roster</span></Link>
                            </li>

                            <li className={pathname.includes('document') || pathname.includes('document') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/staff/main/document"><i className="la la-book" /> <span>Documents</span></Link>
                            </li>

                            <li className={pathname.includes('daily-report') || pathname.includes('daily-report') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/staff/main/daily-report"><i className="la la-newspaper-o" /> <span>Staff Daily Report</span></Link>
                            </li>

                            <li className="menu-title">
                                <span>Communication</span>
                            </li>

                            <li className={pathname.includes('messageInbox') || pathname.includes('messageInbox') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/staff/main/messageInbox"><i className="la la-comment" /> <span>Messages</span></Link>
                            </li>
                       
                            <li className="submenu">
                                <a href="#" className={isSideMenu == "support" ? "subdrop" : ""}  onClick={(e) => {
                                    e.preventDefault()
                                    toggleSidebar(isSideMenu == "support" ? "" : "support")
                                }}><i className="la la-headphones" /> <span>Support</span> <span className="menu-arrow" /></a>
                                {isSideMenu == "support" ?
                                    <ul>
                                        <li><Link onClick={() => onMenuClik()} className={pathname.includes('view-ticket') ? "active" : pathname.includes('view-ticket') ?
                                            "active" : pathname.includes('view-ticket') ? "active" : ""}
                                            to="/staff/main/view-ticket">View Tickets</Link>
                                        </li>

                                        <li><Link onClick={() => onMenuClik()} className={pathname.includes('raise-ticket') ? "active" : pathname.includes('raise-ticket') ?
                                            "active" : pathname.includes('raise-ticket') ? "active" : ""}
                                            to="/staff/main/raise-ticket">Raise a Ticket</Link>
                                        </li>

                                        <li><Link onClick={() => onMenuClik()} className={pathname.includes('knowledge') ? "active" : pathname.includes('knowledge') ?
                                            "active" : pathname.includes('knowledge') ? "active" : ""}
                                            to="/staff/main/knowledge">Knowledge Base</Link>
                                        </li>

                                    </ul>
                                    : ""
                                }
                            </li>

                            <br />
                            <br />
                        </ul>
                    </div>
                </div>


            </Scrollbars>


        </div>

    );

}

export default withRouter(StaffSidebar);
