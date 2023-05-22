/**
 * App Header
 */
import React, { useEffect, useState } from 'react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useHistory, withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
    headerlogo, lnEnglish, lnFrench, lnSpanish, lnGerman, Avatar_02, Avatar_03, Avatar_05,
    Avatar_06, Avatar_08, Avatar_09, Avatar_13, Avatar_17, Avatar_21
} from '../../../../Entryfile/imagepath'
import man from "../../../../assets/img/user.jpg"
import { MdOutlineLockPerson, MdOutlineLogout, MdOutlineVerifiedUser, MdPersonOutline } from 'react-icons/md';


const ClientHeader = (props) => {
    const navigate = useHistory()
    const handlesidebar = () => {
        document.body.classList.toggle('mini-sidebar');
    }
    const onMenuClik = () => {
        props.onMenuClick()
    }
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('clientProfile')
        navigate.push("/login")
    }

    let pathname = location.pathname

    const [currentTime, setCurrentTime] = useState(new Date());
    const userObj = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const options = { timeZone: 'Australia/Sydney' };
    const timeString = currentTime.toLocaleTimeString('en-AU', options);

    return (
        <div className="header" style={{ right: "0px" }}>
            {/* Logo */}
            <div className="header-left">
                <Link to="/" className="logo">
                    <img src={headerlogo} width={40} height={40} alt="" />
                </Link>
            </div>
            {/* /Logo */}
            <a id="toggle_btn" href="#" style={{ display: pathname.includes('tasks') ? "none" : pathname.includes('compose') ? "none" : "" }} onClick={handlesidebar}>
                <span className="bar-icon"><span />
                    <span />
                    <span />
                </span>
            </a>
            {/* Header Title */}
            <div className="page-title-box">
                <h3>Promax Care</h3>
            </div>
            {/* /Header Title */}
            <a id="mobile_btn" className="mobile_btn" href="#" onClick={() => onMenuClik()}><i className="fa fa-bars" /></a>
            {/* Header Menu */}
            <ul className="nav user-menu">
                {/* Search */}
                <li className="nav-item">
                    <div className="top-nav-search">
                        <a href="" className="responsive-search">
                            <i className="fa fa-search" />
                        </a>
                        <form>
                            <input className="form-control" type="text" placeholder="Search here" style={{ backgroundColor: "white" }} />
                            <button className="btn" type="submit"><i className="fa fa-search" /></button>
                        </form>
                    </div>
                </li>
                {/* /Search */}
                {/* Flag */}
                <li className="nav-item dropdown has-arrow flag-nav">
                    <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="javascript:void(0)" role="button">
                        <span className='fw-bold'>
                            {timeString}

                        </span>
                    </a>

                </li>
                {/* /Flag */}
                {/* Notifications */}
                <li className="nav-item dropdown">
                    <a href="#" className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
                        <i className="fa fa-bell-o" /> <span className="badge badge-pill">3</span>
                    </a>
                    <div className="dropdown-menu notifications">
                        <div className="topnav-dropdown-header">
                            <span className="notification-title">Notifications</span>
                            <a href="" className="clear-noti"> Clear All </a>
                        </div>
                        <div className="noti-content">
                            <ul className="notification-list">
                                <li className="notification-message">
                                    <Link onClick={() => localStorage.setItem("minheight", "true")} to="">
                                        <div className="media">
                                            <span className="avatar">
                                                <img alt="" src={Avatar_02} />
                                            </span>
                                            <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">John Doe</span> added new task <span className="noti-title">Patient appointment booking</span></p>
                                                <p className="noti-time"><span className="notification-time">4 mins ago</span></p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="notification-message">
                                    <Link onClick={() => localStorage.setItem("minheight", "true")} to="/">
                                        <div className="media">
                                            <span className="avatar">
                                                <img alt="" src={Avatar_03} />
                                            </span>
                                            <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">Tarah Shropshire</span> changed the task name <span className="noti-title">Appointment booking with payment gateway</span></p>
                                                <p className="noti-time"><span className="notification-time">6 mins ago</span></p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="notification-message">
                                    <Link onClick={() => localStorage.setItem("minheight", "true")} to="/">
                                        <div className="media">
                                            <span className="avatar">
                                                <img alt="" src={Avatar_06} />
                                            </span>
                                            <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">Misty Tison</span> added <span className="noti-title">Domenic Houston</span> and <span className="noti-title">Claire Mapes</span> to project <span className="noti-title">Doctor available module</span></p>
                                                <p className="noti-time"><span className="notification-time">8 mins ago</span></p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="notification-message">
                                    <Link onClick={() => localStorage.setItem("minheight", "true")} to="/">
                                        <div className="media">
                                            <span className="avatar">
                                                <img alt="" src={Avatar_17} />
                                            </span>
                                            <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">Rolland Webber</span> completed task <span className="noti-title">Patient and Doctor video conferencing</span></p>
                                                <p className="noti-time"><span className="notification-time">12 mins ago</span></p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="notification-message">
                                    <Link onClick={() => localStorage.setItem("minheight", "true")} to="/">
                                        <div className="media">
                                            <span className="avatar">
                                                <img alt="" src={Avatar_13} />
                                            </span>
                                            <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">Bernardo Galaviz</span> added new task <span className="noti-title">Private chat module</span></p>
                                                <p className="noti-time"><span className="notification-time">2 days ago</span></p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="topnav-dropdown-footer">
                            <Link onClick={() => localStorage.setItem("minheight", "true")} to="/">View all Notifications</Link>
                        </div>
                    </div>
                </li>
                {/* /Notifications */}
                {/* Message Notifications */}
                <li className="nav-item dropdown">
                    <a href="#" className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
                        <i className="fa fa-comment-o" /> <span className="badge badge-pill">8</span>
                    </a>
                    <div className="dropdown-menu notifications">
                        <div className="topnav-dropdown-header">
                            <span className="notification-title">Messages</span>
                            <a href="" className="clear-noti"> Clear All </a>
                        </div>
                        <div className="noti-content">
                            <ul className="notification-list">
                                <li className="notification-message">
                                    <Link onClick={() => localStorage.setItem("minheight", "true")} to="/conversation/chat">
                                        <div className="list-item">
                                            <div className="list-left">
                                                <span className="avatar">
                                                    <img alt="" src={Avatar_09} />
                                                </span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author">Richard Miles </span>
                                                <span className="message-time">12:28 AM</span>
                                                <div className="clearfix" />
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="notification-message">
                                    <Link onClick={() => localStorage.setItem("minheight", "true")} to="/conversation/chat">
                                        <div className="list-item">
                                            <div className="list-left">
                                                <span className="avatar">
                                                    <img alt="" src={Avatar_02} />
                                                </span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author">John Doe</span>
                                                <span className="message-time">6 Mar</span>
                                                <div className="clearfix" />
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="notification-message">
                                    <Link onClick={() => localStorage.setItem("minheight", "true")} to="/conversation/chat">
                                        <div className="list-item">
                                            <div className="list-left">
                                                <span className="avatar">
                                                    <img alt="" src={Avatar_03} />
                                                </span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author"> Tarah Shropshire </span>
                                                <span className="message-time">5 Mar</span>
                                                <div className="clearfix" />
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="notification-message">
                                    <Link onClick={() => localStorage.setItem("minheight", "true")} to="/conversation/chat">
                                        <div className="list-item">
                                            <div className="list-left">
                                                <span className="avatar">
                                                    <img alt="" src={Avatar_05} />
                                                </span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author">Mike Litorus</span>
                                                <span className="message-time">3 Mar</span>
                                                <div className="clearfix" />
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="notification-message">
                                    <Link onClick={() => localStorage.setItem("minheight", "true")} to="/conversation/chat">
                                        <div className="list-item">
                                            <div className="list-left">
                                                <span className="avatar">
                                                    <img alt="" src={Avatar_08} />
                                                </span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author"> Catherine Manseau </span>
                                                <span className="message-time">27 Feb</span>
                                                <div className="clearfix" />
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur adipiscing</span>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="topnav-dropdown-footer">
                            <Link onClick={() => localStorage.setItem("minheight", "true")} to="/conversation/chat">View all Messages</Link>
                        </div>
                    </div>
                </li>
                {/* /Message Notifications */}

                <li className={`nav-item dropdown has-arrow main-drop ${isDropdownOpen ? 'show' : ''}`}>
                    <a
                        className="nav-link dropdown-toggle"
                        href="javascript:void(0)"
                        onClick={(e) => {
                            e.preventDefault();
                            setDropdownOpen(!isDropdownOpen);
                        }}
                        data-bs-toggle="dropdown"
                    >
                        <span className="user-img me-1">

                            <img src={man} alt="" width={50} height={50} className='rounded-circle' />

                            <span className="status online" /></span>
                        <span>
                            {
                                isDropdownOpen ?
                                    <FaAngleUp />

                                    :
                                    <FaAngleDown />

                            }
                        </span>

                    </a>
                    <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                        <div className='bg-primary p-2'>
                            <div className="row mt-2">
                                <div className="col-2">
                                    <div className='rounded-circle bg-secondary' style={{ width: "35px", height: "35px" }}>
                                        <img src={man} alt="" width={50} height={50} className='rounded-circle' />

                                    </div>
                                </div>
                                &nbsp;
                                &nbsp;

                                <div className="col-8 d-flex flex-column justify-content-start text-white">
                                    <span className='fw-bold'>{userObj.fullName}</span>
                                    <span style={{ fontSize: "7px", }}>{userObj.email}</span>
                                </div>

                            </div>
                        </div>
                        <Link className="dropdown-item" to={"/client/clientchange-password"}><MdOutlineLockPerson /> &nbsp; Change Password</Link>
                        <Link className="dropdown-item" to={"/client/client-profile"}><MdPersonOutline /> &nbsp; Profile</Link>
                        <button className="dropdown-item" onClick={handleLogout}><MdOutlineLogout /> &nbsp; Logout</button>

                    </div>
                </li>


            </ul>
            {/* /Header Menu */}
            {/* Mobile Menu */}
            <div className="dropdown mobile-user-menu">
                <a
                    className="nav-link dropdown-toggle"
                    href="javascript:void(0)"
                    onClick={(e) => {
                        e.preventDefault();
                        setDropdownOpen(!isDropdownOpen);
                    }}
                    data-bs-toggle="dropdown"
                >
                    <i className="fa fa-ellipsis-v" /></a>
                <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>

                    <Link className="dropdown-item" to={"/client/client-profile"}><MdOutlineLockPerson /> &nbsp; Change Password</Link>
                    <Link className="dropdown-item" to={"/client/change-password"}><MdPersonOutline /> &nbsp; Profile</Link>
                    <button className="dropdown-item" onClick={handleLogout}><MdOutlineLogout /> &nbsp; Logout</button>

                </div>
            </div>

            {/* /Mobile Menu */}
        </div>

    );
}


export default withRouter(ClientHeader);