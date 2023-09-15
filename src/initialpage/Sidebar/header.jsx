import React, { useEffect, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useHistory, withRouter, Link } from 'react-router-dom';
import { MdOutlineLockPerson, MdOutlineLockReset, MdOutlineLogout, MdOutlineSettings } from 'react-icons/md';
import man from "../../assets/img/user.jpg";
import loggo from '../../assets/img/promaxcare_logo_icon.png';
import axiosInstance from '../../store/axiosInstance';
import { emptyCache } from '../../hooks/cacheUtils';
const Header = (props) => {
  const navigate = useHistory();
  const handlesidebar = () => {
    document.body.classList.toggle('mini-sidebar');
  };

  const onMenuClik = () => {
    props.onMenuClick();
  };

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [companyOne, setCompanyOne] = useState({});
  const pathname = location.pathname;
  const user = JSON.parse(localStorage.getItem('user'));

  const FetchCompany = async () => {
    try {
      const { data } = await axiosInstance.get(`/Companies/get_company/${user.companyId}`, { cacheTimeout: 300000 })
      // console.log(data.company);
      setCompanyOne(data.company)
      // console.log(data.company);
      // setEditedCompany({ ...data.company })


    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    FetchCompany()
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.clear();
    navigate.push('/');
  };

  // Assuming companyOne.dateCreated is a valid date string (e.g., "2023-09-15")
const companyOneDate = new Date(companyOne.expirationDate);

// Get the current date in Australia (assuming Australian Eastern Standard Time)
const australiaTimeZoneOffset = 10; // UTC+10 for Australian Eastern Standard Time
const currentDateInAustralia = new Date();
currentDateInAustralia.setHours(currentDateInAustralia.getHours() + australiaTimeZoneOffset);

// Calculate the difference in days
const timeDifference = currentDateInAustralia - companyOneDate;
const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days

// Define your rendering logic
let displayText;
if (daysDifference <= 0) {
  // Free trial not expired yet
  displayText = `Free trial: ${Math.abs(daysDifference)} days left`;
} else {
  // Free trial has expired
  displayText = 'Free trial: Expired';
}
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
        <Link to="/app/main/dashboard" className="logo">
          <img src={companyOne.companyLogo ? companyOne.companyLogo : loggo} width={60} height={60} alt="" />
        </Link>
      </div>
      {/* /Logo */}
      <button id="toggle_btn"
        className='btn'
        style={{ display: pathname.includes('tasks') ? "none" : pathname.includes('compose') ? "none" : "" }} onClick={handlesidebar}>
        <span className="bar-icon btn"><span />
          <span />
          <span />
        </span>
      </button>
      {/* Header Title */}
      <div className="page-title-box">
        <h3> {companyOne.companyName ? companyOne.companyName : "Promax Care"}</h3>
      </div>
      {/* /Header Title */}
      <a id="mobile_btn" className="mobile_btn" href="#"
        onClick={(e) => {
          e.preventDefault();
          onMenuClik();
        }}
      >
        <i className="fa fa-bars" /></a>
      {/* Header Menu */}
      <ul className="nav user-menu">

      {user.role === "CompanyAdmin" ? <li className="nav-item dropdown has-arrow flag-nav">
      <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button">
        <span className='fw-bold'>
          {displayText}
        </span>
      </a>
    </li>:""}
        {/* Search */}
        <li className="nav-item">
          <div className="top-nav-search">
            <a href="#" className="responsive-search">
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
          <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button">
            <span className='fw-bold'>
              {timeString}
            </span>
          </a>

        </li>
        {/* /Flag */}
        {/* Notifications */}
        <li className="nav-item dropdown">
          <a href="#" className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
            <i className="fa fa-bell-o" />
            {/* <span className="badge badge-pill">3</span> */}
          </a>
        </li>
        {/* /Notifications */}
        {/* Message Notifications */}
        <li className="nav-item dropdown">
          <Link to={'/app/message/inbox'} >
            <i className="fa fa-comment-o" />
            {/* <span className="badge badge-pill">8</span> */}
          </Link>
        </li>
        {/* /Message Notifications */}
        <li className={`nav-item dropdown has-arrow main-drop ${isDropdownOpen ? 'show' : ''}`}>
          <a
            className="nav-link dropdown-toggle"
            href="#"
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
                  <span className='fw-bold'>{userObj?.fullName}</span>
                  <span style={{ fontSize: "7px", }}>{userObj?.email}</span>
                </div>
              </div>
            </div>
            <Link className="dropdown-item" to={"/app/account/change-password"}><MdOutlineLockPerson /> &nbsp; Change Password</Link>
            {user.role === "CompanyAdmin" ? <Link className="dropdown-item" to={"/app/account/company-profile"}><MdOutlineSettings /> &nbsp; Company Profile</Link> : ""}
            <button className="dropdown-item" onClick={() => emptyCache()}><MdOutlineLockReset /> &nbsp; Update App Version</button>

            <button className="dropdown-item" onClick={handleLogout}><MdOutlineLogout /> &nbsp; Logout</button>
          </div>
        </li>
      </ul>
      {/* /Header Menu */}
      {/* Mobile Menu */}
      <div className="dropdown mobile-user-menu">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setDropdownOpen(!isDropdownOpen);
          }}
          data-bs-toggle="dropdown"
        >
          <i className="fa fa-ellipsis-v" />
        </a>
        <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
          <Link className="dropdown-item" to={"/app/account/change-password"}><MdOutlineLockPerson /> &nbsp; Change Password</Link>
          <Link className="dropdown-item" to={"/app/account/company-profile"}><MdOutlineSettings /> &nbsp; Company Profile</Link>
          <button className="dropdown-item" onClick={() => emptyCache()}><MdOutlineLockReset /> &nbsp; Update App Version</button>
          <button className="dropdown-item" onClick={handleLogout}><MdOutlineLogout /> &nbsp; Logout</button>
        </div>
      </div>
      {/* /Mobile Menu */}
    </div>
  );
};

export default withRouter(Header);
