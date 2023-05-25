/**
 * App Header
 */
 import React, { useState, useEffect } from 'react'
 import { FaAngleDown } from 'react-icons/fa';
 import { useHistory, withRouter } from 'react-router-dom';
 import { Link } from 'react-router-dom';
 import {
     headerlogo, lnEnglish, lnFrench, lnSpanish, lnGerman, Avatar_02, Avatar_03, Avatar_05,
     Avatar_06, Avatar_08, Avatar_09, Avatar_13, Avatar_17, Avatar_21
 } from '../../../Entryfile/imagepath'
 import man from "../../../assets/img/user.jpg"
 import { MdOutlineLockPerson, MdOutlineLogout, MdOutlineSettings } from 'react-icons/md';
 import { BiUserCircle, BiMessageDetail } from 'react-icons/bi';
 import { IoMdHelpCircleOutline } from 'react-icons/io';
 
 const AdminHeader = (props) => {
     const navigate = useHistory()
     const handlesidebar = () => {
         document.body.classList.toggle('mini-sidebar');
     }
     const onMenuClik = () => {
         props.onMenuClick()
     }
     const [isDropdownOpen, setDropdownOpen] = useState(false);
 
 
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
 
     const handleLogout = () => {
         localStorage.removeItem('user')
         localStorage.removeItem('adminProfile')
         navigate.push("/login")
     }
 
     return (
         <div className="header" style={{ right: "0px" }}>
             {/* Logo */}
             <div className="header-left">
                 <Link to="/administrator/administrator/adminDashboard" className="logo">
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
                     <a href="#"  data-bs-toggle="dropdown">
                         <i className="fa fa-bell-o" />
                         {/* <span className="badge badge-pill">3</span> */}
                     </a>
                 </li>
                 {/* /Notifications */}
                 {/* Message Notifications */}
                 <li className="nav-item dropdown">
                     <Link to={"/administrator/messageInbox"}>
                         <i className="fa fa-comment-o" />
                     </Link>
                 </li>
 
                 {/* /Message Notifications */}
                 <li className="nav-item dropdown has-arrow main-drop">
                     <a href="javascript:void(0)" className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
                         <span className="user-img me-1">
 
                             <img src={man} alt="" width={50} height={50} className='rounded-circle' />
 
                             <span className="status online" /></span>
                         <span><FaAngleDown /></span>
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
                         <Link className="dropdown-item" to={"/administrator/profile"}><BiUserCircle /> &nbsp; Profile</Link>
                         <Link className="dropdown-item" to={"/administrator/messageInbox"}><BiMessageDetail /> &nbsp; Message</Link>
                         <Link className="dropdown-item" to={"/administrator/raiseTicket"}><IoMdHelpCircleOutline /> &nbsp; Help</Link>
                         <Link className="dropdown-item" to={"/administrator/changePassword"}><MdOutlineSettings /> &nbsp; Setting</Link>
                         <button className="dropdown-item" onClick={handleLogout}><MdOutlineLogout /> &nbsp; Logout</button>
 
                     </div>
                 </li>
             </ul>
             {/* /Header Menu */}
             {/* Mobile Menu */}
             <div className="dropdown mobile-user-menu">
                 <a
                     className="nav-link dropdown-toggle"
                     href="/"
                     onClick={(e) => {
                         e.preventDefault();
                         setDropdownOpen(!isDropdownOpen);
                     }}
                     data-bs-toggle="dropdown"
                 >
                     <i className="fa fa-ellipsis-v" /></a>
                 <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
 
                     <Link className="dropdown-item" to={"/administrator/profile"}><BiUserCircle /> &nbsp; Profile</Link>
                     <Link className="dropdown-item" to={"/administrator/messageInbox"}><BiMessageDetail /> &nbsp; Message</Link>
                     <Link className="dropdown-item" to={""}><IoMdHelpCircleOutline /> &nbsp; Help</Link>
                     <Link className="dropdown-item" to={"/administrator/changePassword"}><MdOutlineSettings /> &nbsp; Setting</Link>
                     <button className="dropdown-item" onClick={handleLogout}><MdOutlineLogout /> &nbsp; Logout</button>
 
                 </div>
             </div>
             {/* /Mobile Menu */}
         </div>
 
     );
 }
 
 
 export default withRouter(AdminHeader);