import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { MdDashboard } from 'react-icons/md';

const ClientSidebar = (props) => {
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

                                <Link to="/client/client"  >
                                    <i className="la la-dashboard" />
                                    <span> Dashboard</span></Link>

                            </li>

                            <li className="menu-title">
                                <span>Account Management</span>
                            </li>
                            <li className={pathname.includes('client-profile') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/client/client-profile"><i className="la la-user" /> <span>Profile</span></Link>
                            </li>

                            <li className={pathname.includes('change-password') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/client/change-password"><i className="la la-lock" /> <span>Change Password</span></Link>
                            </li>
        
                             <li className="menu-title">
                                 <span>Client Management</span>
                             </li>
                   
                            <li className={pathname.includes('client-roster') || pathname.includes('client-roster') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/client/client-roster"><i className="la la-calendar" /> <span>Shift Roster</span></Link>
                            </li>

                            <li className={pathname.includes('client-rep') || pathname.includes('client-rep') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/client/client-rep"><i className="la la-rub" /> <span>Representatives</span></Link>
                            </li>

                            <li className={pathname.includes('client-disability') || pathname.includes('client-disability') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/client/client-disability"><i className="la la-wheelchair" /> <span>Disability Support Needs</span></Link>
                            </li>

                            <li className={pathname.includes('client-aid-equip') || pathname.includes('client-aid-equip') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/client/client-aid-equip"><i className="la la-eraser" /> <span>Aids & Equipments</span></Link>
                            </li>

                            <li className={pathname.includes('client-daily-living') || pathname.includes('client-daily-living') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/client/client-daily-living"><i className="la la-sun-o" /> <span>Daily Living & Night Support</span></Link>
                            </li>

                            <li className={pathname.includes('client-health') || pathname.includes('client-health') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/client/client-health"><i className="la la-yelp" /> <span>Health Support Needs</span></Link>
                            </li>

                            <li className={pathname.includes('client-behaviuor') || pathname.includes('client-behaviuor') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/client/client-behaviuor"><i className="la la-bell-o" /> <span>Behaviour Support Needs</span></Link>
                            </li>

                            <li className={pathname.includes('client-document') || pathname.includes('client-document') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/client/client-document"><i className="la la-book" /> <span>Documents</span></Link>
                            </li>

                            <li className="menu-title">
                                <span>Communication</span>
                            </li>

                            <li className={pathname.includes('client-message') || pathname.includes('client-message') ? "active" : ""} onClick={() => onMenuClik()}>
                                <Link to="/client/client-message"><i className="la la-comment" /> <span>Messages</span></Link>
                            </li>
                       
                            <li className="submenu">
                                <a href="#" className={isSideMenu == "support" ? "subdrop" : ""}  onClick={(e) => {
                                    e.preventDefault()
                                    toggleSidebar(isSideMenu == "support" ? "" : "support")
                                }}><i className="la la-headphones" /> <span>Support</span> <span className="menu-arrow" /></a>
                                {isSideMenu == "support" ?
                                    <ul>
                                        <li><Link onClick={() => onMenuClik()} className={pathname.includes('client-view_ticket') ? "active" : pathname.includes('client-view_ticket') ?
                                            "active" : pathname.includes('client-view_ticket') ? "active" : ""}
                                            to="/client/client-view_ticket">View Tickets</Link>
                                        </li>

                                        <li><Link onClick={() => onMenuClik()} className={pathname.includes('client-raise_ticket') ? "active" : pathname.includes('client-raise_ticket') ?
                                            "active" : pathname.includes('client-raise_ticket') ? "active" : ""}
                                            to="/client/client-raise_ticket">Raise a Ticket</Link>
                                        </li>

                                        <li><Link onClick={() => onMenuClik()} className={pathname.includes('client-knowledge_base') ? "active" : pathname.includes('client-knowledge_base') ?
                                            "active" : pathname.includes('client-knowledge_base') ? "active" : ""}
                                            to="/client/client-knowledge_base">Knowledge Base</Link>
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

export default withRouter(ClientSidebar);
