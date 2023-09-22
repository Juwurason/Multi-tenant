/**
 * App Header
 */
import React, { useState, useEffect } from 'react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useHistory, withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import man from "../../../../assets/img/user.jpg"
import { MdOutlineLockPerson, MdOutlineSettings, MdOutlineLogout, MdOutlineLockReset } from "react-icons/md"
import loggo from '../../../../assets/img/promaxcare_logo_icon.png';
import axiosInstance from '../../../../store/axiosInstance';
import { emptyCache } from '../../../../hooks/cacheUtils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInbox } from '../../../../store/slices/MessageInboxSlice';

const StaffHeader = (props) => {
    const navigate = useHistory()
    const handlesidebar = () => {
        document.body.classList.toggle('mini-sidebar');
    }
    const onMenuClik = () => {
        props.onMenuClick()
    }

    let pathname = location.pathname

    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const userObj = JSON.parse(localStorage.getItem('user'));
    const [isDropdownOpen, setDropdownOpen] = useState(false);


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
        localStorage.removeItem('staffProfile')
        localStorage.removeItem('log')
        localStorage.removeItem('latit')
        navigate.push("/")
    }

    const [companyOne, setCompanyOne] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));

    const FetchCompany = async () => {

        setLoading(true)
        try {
            const { data } = await axiosInstance.get(`/Companies/get_company/${user.companyId}`, { cacheTimeout: 300000 })
            // console.log(data);
            setCompanyOne(data.company)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchInbox(user.userId));
        FetchCompany()
    }, []);
    const inbox = useSelector((state) => state.inbox.data);

    const filteredInbox = inbox.filter((item) => item.status === false);

    return (
        <div className="header" style={{ right: "0px" }}>
            {/* Logo */}
            <div className="header-left">
        <a href='/staff/staff/dashboard' className="logo mt-1">
          {/* <img src={
            loading ? <p>
              please waiting...
            </p>
              :
              companyOne.companyLogo ? companyOne.companyLogo : loggo} width={60} height={60} alt="" /> */}
          {loading ? ( // If loading is true, display the loading message
            <div className="spinner-grow" role="status">
              <span className="sr-only text-warning">Loading...</span>
            </div>
          ) : (
            // If loading is false, display the image
            <img
              src={companyOne.companyLogo ? companyOne.companyLogo : loggo}
              width={60}
              height={60}
              alt=""
            />
          )}
        </a>
      </div>
            {/* /Logo */}
            <a id="toggle_btn" href="#" style={{ display: pathname.includes('tasks') ? "none" : pathname.includes('compose') ? "none" : "" }} onClick={handlesidebar}>
                <span className="bar-icon">
                    <span />
                    <span />
                    <span />
                </span>
            </a>
            {/* Header Title */}
            <div className="page-title-box">
                <h3>{companyOne.companyName ? companyOne.companyName : "Promax Care"}</h3>
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
                {/* Search */}

                <li className="nav-item dropdown has-arrow flag-nav">
                    <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button">
                        <span className='fw-bold' style={{ fontSize: "16px" }}>
                            {timeString}

                        </span>
                    </a>

                </li>

                {/* /Search */}
                {/* Flag */}
                <li className="nav-item">
                    <div className="top-nav-search">
                        <a href="" className="responsive-search">
                            <i className="fa fa-search" />
                        </a>
                        <form>
                            {/* <input className="form-control" type="text" placeholder="Search here" style={{ backgroundColor: "white" }} /> */}
                            {/* <button className="btn" type="submit"><i className="fa fa-search" /></button> */}
                        </form>
                    </div>
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
                    <Link to={'/staff/staff/messageInbox'} >
                        <i className="fa fa-comment-o" />
                        {/* <span className="badge badge-pill">8</span> */}
                        {
                            filteredInbox.length <= 0 ? "" :
                                <span className="badge badge-pill bg-danger">{filteredInbox.length}</span>
                        }
                    </Link>

                </li>

                {/* /Message Notifications */}
                <li className="nav-item dropdown has-arrow main-drop">
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
                                    <span className='fw-bold'>{userObj.fullName}</span>
                                    <span style={{ fontSize: "7px", }}>{userObj.email}</span>
                                </div>

                            </div>
                        </div>
                        <Link className="dropdown-item" to={"/staff/staff/changepassword"}><MdOutlineLockPerson /> &nbsp; Change Password</Link>
                        <Link className="dropdown-item" to={"/staff/staff/profile"}><MdOutlineSettings /> &nbsp; Settings</Link>
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
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        setDropdownOpen(!isDropdownOpen);
                    }}
                    data-bs-toggle="dropdown"
                >
                    <i className="fa fa-ellipsis-v" /></a>
                <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>

                    <Link className="dropdown-item" to={"/staff/staff/changepassword"}><MdOutlineLockPerson /> &nbsp; Change Password</Link>
                    <Link className="dropdown-item" to={"/staff/staff/profile"}><MdOutlineSettings /> &nbsp; Settings</Link>
                    <button className="dropdown-item" onClick={() => emptyCache()}><MdOutlineLockReset /> &nbsp; Update App Version</button>

                    <button className="dropdown-item" onClick={handleLogout}><MdOutlineLogout /> &nbsp; Logout</button>

                </div>
            </div>
            {/* /Mobile Menu */}


        </div>

    );
}


export default withRouter(StaffHeader);