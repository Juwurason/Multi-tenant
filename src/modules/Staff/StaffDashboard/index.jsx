/**
 * Signin Firebase
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, withRouter } from 'react-router-dom';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';

import Header from '../../../initialpage/Sidebar/header'
import Sidebar from '../../../initialpage/Sidebar/sidebar';
import Offcanvas from '../../../Entryfile/offcanvance/index.jsx';
import "../../index.css"
import { useCompanyContext } from '../../../context/index.jsx';
import DashboardCard from '../../../_components/cards/dashboardCard.jsx';
import useHttp from '../../../hooks/useHttp.jsx';
import { MdOutlineEventNote, MdOutlineFeed, MdOutlineFolderOpen, MdOutlineSummarize, MdOutlineQueryBuilder, MdOutlineSwitchAccount } from 'react-icons/md';
import man from "../../../assets/img/user.jpg"
import StaffHeader from '../StaffHeader';
import StaffSidebar from '../StaffSidebar';

dayjs.extend(isBetween);

const StaffDashboard = () => {
  const userObj = JSON.parse(localStorage.getItem('user'));
  const [roster, setRoster] = useState([]);
  const [activitiesYesterday, setActivitiesYesterday] = useState([]);
  const [activitiesToday, setActivitiesToday] = useState([]);
  const [activitiesTomorrow, setActivitiesTomorrow] = useState([]);
  const [clients, setClients] = useState([]);
  const { loading, setLoading } = useCompanyContext();
  const [document, setDocument] = useState([]);
  const { get } = useHttp();

  let isMounted = true;



  useEffect(() => {
    if (isMounted) {
      FetchStaff();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const staffProfile = JSON.parse(localStorage.getItem('staffProfile'));

  async function FetchStaff() {
    setLoading(true)
    try {
      const { data } = await get(`/ShiftRosters/get_shifts_by_user?client=&staff=${staffProfile.staffId}`, { cacheTimeout: 300000 });
      const activities = data.shiftRoster
      setRoster(activities)
      // console.log(data.shiftRoster);
      const now = dayjs(); // Get the current date and time
      const yesterday = now.subtract(1, 'day').startOf('day'); // Get the start of yesterday
      const today = now.startOf('day'); // Get the start of today
      const tomorrow = now.add(1, 'day').startOf('day'); // Get the start of tomorrow

      const activitiesYesterday = activities.filter(activity => dayjs(activity.dateFrom).isBetween(yesterday, today, null, '[)'));
      setActivitiesToday(activities.filter(activity => dayjs(activity.dateFrom).isBetween(today, tomorrow, null, '[)')))
      const activitiesTomorrow = activities.filter(activity => dayjs(activity.dateFrom).isBetween(tomorrow, tomorrow.add(1, 'day'), null, '[)'));

      // console.log('Activities Yesterday:', activitiesYesterday);
      // console.log('Activities Today:', activitiesToday);
      // console.log('Activities Tomorrow:', activitiesTomorrow);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await get(`Documents/get_all_documents?companyId=${userObj.companyId}`, { cacheTimeout: 300000 });
      setDocument(data)
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    finally {
      setLoading(false)
    }
  }

  console.log(activitiesToday);

  const [menu, setMenu] = useState(false);
  // const { staff, clients, FetchStaff, document } = useCompanyContext()
  const toggleMobileMenu = () => {
    setMenu(!menu)
  };

  useEffect(() => {
    FetchStaff()
  }, []);

  useEffect(() => {
    let firstload = localStorage.getItem("firstload")
    if (firstload === "false") {
      setTimeout(function () {
        window.location.reload(1)
        localStorage.removeItem("firstload")
      }, 1000)
    }
  });



  return (
    <>
      <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>

        <StaffHeader />
        <StaffSidebar />
        <div className="page-wrapper">
          <Helmet>
            <title>Dashboard - Promax Staff Dashboard</title>
            <meta name="description" content="Dashboard" />
          </Helmet>
          {/* Page Content */}
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  {/* <h3 className="page-title">Welcome {userObj.firstName}</h3> */}
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item active">Dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className='row g-5'>

              <div className='col-sm-12 border'>

                <div className='row'>

                  <div className='col-sm-3'>

                    <div className="card text-center">
                      <div className="card-header">
                        Featured
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        <a href="#" className="btn btn-primary">Go somewhere</a>
                      </div>
                      <div className="card-footer text-body-secondary">
                        2 days ago

                      </div>
                    </div>
                  </div>

                  <div className='col-sm-6'>
                    <label className='d-flex justify-content-center fw-bold text-primary'>Today</label>
                    
                    {activitiesToday.map(activity => (
                      <div className="card text-center" key={activity.id}>
                        <div className="card-header bg-primary text-white d-flex justify-content-between">
                        {`${dayjs(activity.dateFrom).format('dddd, MMMM D, YYYY')}`}
     
                          <small className='bg-warning text-white rounded p-1' style={{fontSize:'10px'}}>{activity.status}</small>
                        </div>
              
                        <div className="card-body">
                        <span className='d-flex justify-content-between'><span>Client </span><span>{activity.profile.fullName}</span></span>
                          
                        </div>
                        <div className="card-footer text-body-secondary">
                          {dayjs(activity.dateFrom).format('MMMM D, YYYY')}
                        </div>
                      </div>
                    ))}
                  </div>



                  <div className='col-sm-3'>

                    <div className="card text-center">
                      <div className="card-header">
                        Featured
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        <a href="#" className="btn btn-primary">Go somewhere</a>
                      </div>
                      <div className="card-footer text-body-secondary">
                        2 days ago

                      </div>
                    </div>
                  </div>

                </div>

              </div>

              <div className='col-sm-6 border px-2'>
                <div className="card text-center">
                  <div className="card-header">
                    Featured
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">Special title treatment</h5>
                    <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    <a href="#" className="btn btn-primary">Go somewhere</a>
                  </div>
                  <div className="card-footer text-body-secondary">
                    2 days ago

                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>



      {/* /Page Content */}


      <Offcanvas />
    </>
  );
}

export default withRouter(StaffDashboard);
