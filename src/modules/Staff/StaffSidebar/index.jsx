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
                    <div id="sidebar-menu" className="sidebar-menu" style={{backgroundColor: "#1C75B9", height:'100vh'}}>
                        
                        <ul className="sidebar-vertical" id='veritical-sidebar'>
                            <li className="menu-title">
                                <span>Main</span>
                            </li>
                            <li className="submenu">
                                <a href="/staff/staff/staffDashboard" className={isSideMenu == "dashboard" ? "subdrop" : ""} onClick={() => toggleSidebar(isSideMenu == "dashboard" ? "" : "dashboard")}><i className="la la-dashboard" /> <span> Dashboard</span> </a>
                            </li>
                          
                            <li className="menu-title">
                                <span>Account Management</span>
                            </li>
                           
                            <li className={pathname.includes('clients') ? "active" : ""}>
                                <Link to="/staff/staffprofile"><i className="la la-user" /> <span>Profile</span></Link>
                            </li>
                           
                            <li className={pathname.includes('leads') ? "active" : ""}>
                                <Link to="/staff/staffchangepassword"><i className="la la-lock" /> <span>Change Password</span></Link>
                                {/* <li><Link to="/forgotpassword"> Forgot Password </Link></li> */}
                            </li>
                            <li className={pathname.includes('tickets') ? "active" : pathname.includes('ticket-view') ? "active" : ""}>
                                <Link to="/staff/staff-form"><i className="la la-book" /> <span>My Availabilities</span></Link>
                            </li>
                            <li className={pathname.includes('tickets') ? "active" : pathname.includes('ticket-view') ? "active" : ""}>
                                <Link to="/staff/staff-attendance"><i className="la la-columns" /> <span>Attendances</span></Link>
                            </li>
                            <li className="menu-title">
                                <span>Staff-Client Management</span>
                            </li>
                          
                            <li className={pathname.includes('policies') ? "active" : ""}>
                                <Link to="/staff/staff-roster"><i className="la la-file-pdf-o" /> <span>My Shift Roster</span></Link>
                            </li>
                            <li className={pathname.includes('policies') ? "active" : ""}>
                                <Link to="/staff/staff-document"><i className="la la-file-pdf-o" /> <span>Documents</span></Link>
                            </li>
                        </ul>
                    </div>
                </div>


            </Scrollbars>
            
        </div>


    );

}



export default withRouter(StaffSidebar);

