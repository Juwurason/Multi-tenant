/**
 * Signin Firebase
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, withRouter, useHistory } from 'react-router-dom';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Offcanvas from '../../../Entryfile/offcanvance/index.jsx';
import "../../index.css"
import { useCompanyContext } from '../../../context/index.jsx';
import DashboardCard from '../../../_components/cards/dashboardCard.jsx';
import useHttp from '../../../hooks/useHttp.jsx';
import { MdOutlineEventNote, MdOutlineFeed, MdOutlineFolderOpen, MdOutlineSummarize, MdOutlineQueryBuilder, MdOutlineSwitchAccount, MdHourglassTop, MdHourglassBottom, MdPerson, MdPersonOutline } from 'react-icons/md';
import man from "../../../assets/img/user.jpg"
import StaffHeader from '../Components/StaffHeader';
import StaffSidebar from '../Components/StaffSidebar';
import { BsClockHistory } from 'react-icons/bs';
import { BiStopwatch } from 'react-icons/bi';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';

dayjs.extend(isBetween);

const StaffDashboard = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  // Set the default timezone to Australia/Sydney
  dayjs.tz.setDefault('Australia/Sydney');
  const userObj = JSON.parse(localStorage.getItem('user'));
  const [roster, setRoster] = useState([]);
  const [activitiesYesterday, setActivitiesYesterday] = useState([]);
  const [activitiesToday, setActivitiesToday] = useState([]);
  const [activitiesTomorrow, setActivitiesTomorrow] = useState([]);
  const [upcomingActivities, setUpcomingActivities] = useState([]);
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
      const activities = data.shiftRoster;
      setRoster(activities);
      const now = dayjs().tz();
      const yesterday = now.subtract(1, 'day').startOf('day');
      const today = now.startOf('day');
      const tomorrow = now.add(1, 'day').startOf('day');

      const upcomingActivities = activities.filter(activity => dayjs(activity.dateFrom).tz().isAfter(now, 'hour'));
      const sortedUpcomingActivities = upcomingActivities.sort((a, b) => dayjs(a.dateFrom).tz().diff(dayjs(b.dateFrom).tz())).slice(0, 5);

      setActivitiesYesterday(activities.filter(activity => dayjs(activity.dateFrom).tz().isBetween(yesterday, today, null, '[)')));
      setActivitiesToday(activities.filter(activity => dayjs(activity.dateFrom).tz().isBetween(today, tomorrow, null, '[)')));
      setActivitiesTomorrow(activities.filter(activity => dayjs(activity.dateFrom).tz().isBetween(tomorrow, tomorrow.add(1, 'day'), null, '[)')));
      setUpcomingActivities(sortedUpcomingActivities);

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


  const [menu, setMenu] = useState(false);
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

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useHistory()

  const handleClockIn = () => {
    setIsLoading(true);
    // Simulating an asynchronous action, such as an API call
    setTimeout(() => {
      // Perform any necessary logic here before routing to the - page
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            localStorage.setItem("latit", latitude)
            localStorage.setItem("log", longitude)
            navigate.push(`/staff/staff-progress/${activitiesToday[0]?.shiftRosterId}`);
          },
          (error) => {
            toast.error('Error getting location:', error.message);
          }
        );
      } else {
        toast.error('Geolocation is not supported');
      }
      // Route to the - page
      // history.push('/-');
    }, 2000); // Set an appropriate delay to simulate the loading time

    // Optionally, you can clear the loading state after the specified time
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleActivityClick = (activitiesTomorrow) => {
    setSelectedActivity(activitiesTomorrow);
    setShowModal(true);
  };


  function getActivityStatus(activitiesToday) {
    if (!activitiesToday) {
      return 'No Shift Today';
    }



    const nowInAustraliaTime = dayjs().tz();
    const activityDateFrom = dayjs(activitiesToday.dateFrom).tz();
    const activityDateTo = dayjs(activitiesToday.dateTo).tz();

    if (activityDateFrom.isAfter(nowInAustraliaTime, 'hour')) {
      return 'Upcoming';
    } else if (activityDateTo.isBefore(nowInAustraliaTime)) {
      return activitiesToday.attendance === true ? 'Present' : 'Absent';
    } else {
      return 'Clock-In';
    }
  }

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

              <div className='col-sm-12'>

                <div className='row'>

                  <div className='col-sm-3'>
                    <div className='p-2'>
                      <label className='d-flex justify-content-center fw-bold text-muted'>Yesterday</label>
                    </div>
                    <div className="card text-center">
                      <div className="card-header bg-secondary text-white">
                        <div className='d-flex justify-content-between align-items-center'>
                          <span style={{ fontSize: '12px' }}>{`${dayjs(activitiesYesterday[0]?.dateFrom).tz().format('dddd, MMMM D, YYYY')}`}</span>
                          <span style={{ fontSize: '12px' }} className='text-white bg-dark rounded px-2'>{activitiesYesterday[0]?.status === "string" ? "Active" : activitiesYesterday[0]?.status}</span>
                        </div>
                      </div>
                      <div className="card-body  d-flex flex-column gap-1 justify-content-start align-items-start">

                        <span className=' d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdPersonOutline /> Client: </span><span className='text-truncate'>{activitiesYesterday[0]?.profile.firstName}</span></span>
                        <span className='d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdHourglassTop className='text-success' /> Start Time: </span><span className='text-truncate'>{activitiesYesterday.length > 0 ? dayjs(activitiesYesterday[0]?.dateFrom).format('hh:mm A') : '--'}</span></span>
                        <span className='d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdHourglassBottom className='text-danger' /> End Time: </span><span className='text-truncate'>{activitiesYesterday.length > 0 ? dayjs(activitiesYesterday[0]?.dateTo).format('hh:mm A') : '--'}</span></span>
                      </div>
                      <div className="card-footer text-body-light bg-light text-muted">
                        View Details

                      </div>
                    </div>
                  </div>

                  <div className='col-sm-6'>
                    <div className='p-2'>
                      <label className='d-flex justify-content-center fw-bold text-primary'>Today</label>
                    </div>
                    <div className="card text-center">
                      <div className="card-header bg-primary text-white">
                        <div className='d-flex justify-content-between align-items-center'>
                          <span style={{ fontSize: '12px' }}> {`${dayjs(activitiesToday[0]?.dateFrom).tz().format('dddd, MMMM D, YYYY')}`}</span>
                          <span style={{ fontSize: '12px' }} className='text-white bg-warning rounded px-2'>{activitiesToday[0]?.status}</span>
                        </div>
                      </div>

                      <div className="card-body  d-flex flex-column gap-1 justify-content-start align-items-start">

                        <span className=' d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdPersonOutline /> Client: </span><span className='text-truncate'>{activitiesToday[0]?.profile.fullName}</span></span>
                        <span className='d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdHourglassTop className='text-success' /> Start Time: </span><span className='text-truncate'>  {activitiesToday.length > 0 ? dayjs(activitiesToday[0]?.dateFrom).format('hh:mm A') : '--'}</span></span>
                        <span className='d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdHourglassBottom className='text-danger' /> End Time: </span><span className='text-truncate'>  {activitiesToday.length > 0 ? dayjs(activitiesToday[0]?.dateTo).format('hh:mm A') : '--'}</span></span>
                      </div>
                      <div className="card-footer text-body-secondary bg-secondary text-white">
                        <BsClockHistory /> &nbsp; Activities
                      </div>

                      <div className='px-5 py-4'>
                        {activitiesToday[0] ? (
                          <>
                            <span>{activitiesToday[0]?.activities}</span>
                            <br />
                            <br />

                            {getActivityStatus(activitiesToday[0]) === 'Upcoming' ? (
                              <span className='fw-bold text-warning pointer'>Request Cancellation</span>
                            ) : getActivityStatus(activitiesToday[0]) === 'Clock-In' ? (
                              <span className={`pointer btn text-white rounded ${isLoading ? "btn-warning" : "btn-success"}`} onClick={handleClockIn}>
                                <BiStopwatch /> Clock In
                              </span>
                            ) : (
                              <small
                                className={`p-1 rounded ${getActivityStatus(activitiesToday[0]) === 'Upcoming' ? 'bg-warning' :
                                  getActivityStatus(activitiesToday[0]) === 'Absent' ? 'bg-danger text-white' :
                                    getActivityStatus(activitiesToday[0]) === 'Present' ? 'bg-success text-white' : ''
                                  }`}
                              >
                                {getActivityStatus(activitiesToday[0])}
                              </small>
                            )}
                          </>
                        ) : (
                          <span>No Shift Today</span>
                        )}
                      </div>







                    </div>



                  </div>



                  <div className='col-sm-3'>
                    <div className='p-2'>
                      <label className='d-flex justify-content-center fw-bold text-muted'>Tomorrow</label>
                    </div>

                    <div className="card text-center">
                      <div className="card-header bg-info text-white">
                        <div className='d-flex justify-content-between align-items-center'>
                          <span style={{ fontSize: '12px' }}>{activitiesTomorrow.length > 0 ? dayjs(activitiesTomorrow[0]?.dateFrom).tz().format('dddd, MMMM D, YYYY') : "No shift yet"}</span>
                          <span style={{ fontSize: '12px' }} className='text-white bg-primary rounded px-2'>{activitiesTomorrow[0]?.status}</span>
                        </div>
                      </div>
                      <div className="card-body  d-flex flex-column gap-1 justify-content-start align-items-start">

                        <span className=' d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdPersonOutline /> Client: </span><span className='text-truncate'>{activitiesTomorrow[0]?.profile.firstName}</span></span>
                        <span className='d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdHourglassTop className='text-success' /> Start Time: </span><span className='text-truncate'>{activitiesTomorrow.length > 0 ? dayjs(activitiesTomorrow[0]?.dateFrom).format('hh:mm A') : '--'}</span></span>
                        <span className='d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdHourglassBottom className='text-danger' /> End Time: </span><span className='text-truncate'>{activitiesTomorrow.length > 0 ? dayjs(activitiesTomorrow[0]?.dateTo).format('hh:mm A') : '--'}</span></span>
                      </div>
                      <div className="card-footer text-body-danger bg-danger text-white pointer" onClick={() => handleActivityClick(activitiesTomorrow)}>
                        View Details

                      </div>
                    </div>
                  </div>

                </div>

              </div>

              <div className='col-md-4 p-2 d-flex flex-column gap-2 justify-content-start'>
                <div className='p-3 shadow-sm'>
                  <h3>Upcoming Shift</h3>
                  {upcomingActivities.length > 0 ? (
                    upcomingActivities.map(activity => (
                      <span className="mt-2" key={activity.id}>
                        <div className="d-flex justify-content-between text-dark">
                          <div className='d-flex flex-column justify-content-start'>
                            <span style={{ fontSize: "10px" }}>{dayjs(activity.dateFrom).tz().format('dddd MMMM D, YYYY')}</span>
                            <span className='text-dark fs-5 fw-bold'>{activity.staffName}</span>
                          </div>
                          <div>
                            <span className='bg-secondary px-2 py-1 text-white pointer rounded-2'>view</span>
                          </div>
                        </div>
                      </span>
                    ))
                  ) : (
                    <span>No upcoming shifts</span>
                  )}
                  <div className='d-flex justify-content-end mt-2'>
                    <Link to="/staff/staff-roster" className='text-dark pointer' style={{ fontSize: "12px" }}>
                      See all <FaLongArrowAltRight className='fs-3' />
                    </Link>
                  </div>
                </div>
              </div>

              {/* <div className='col-md-4 p-2 d-flex  flex-column gap-2 justify-content-start'>
                <div className='p-3 shadow-sm'>
                  <h3>Upcoming Shift</h3>

                  <span className="mt-2" >


                    <div className=" d-flex  justify-content-between text-dark">
                      <div className='d-flex flex-column justify-content-start'>
                        <span style={{ fontSize: "10px", }}>Monday May 23, 2023 </span>
                        <span className='text-dark fs-5 fw-bold'>Olakunle John</span>
                      </div>
                      <div>
                        <span className='bg-secondary px-2 py-1 text-white pointer rounded-2'>view</span>

                      </div>
                    </div>

                  </span>
                  <div className='d-flex justify-content-end mt-2'>
                    <span
                      className='text-dark pointer' style={{ fontSize: "12px", }}>
                      See all <FaLongArrowAltRight className='fs-3' />
                    </span>
                  </div>

                </div>

              </div> */}

            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Activity Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedActivity && (
                  <>
                    <p><b>Date:</b> {dayjs(selectedActivity.dateFrom).format('YYYY-MM-DD')}</p>
                    <p><b>Time:</b> {dayjs(selectedActivity.dateFrom).format('hh:mm A')} - {dayjs(selectedActivity.dateTo).format('hh:mm A')}</p>
                    <p><b>Description:</b> {selectedActivity.activities}</p>
                  </>
                )}
              </Modal.Body>
              <Modal.Footer>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </Modal.Footer>
            </Modal>


          </div>
        </div>
      </div>



      {/* /Page Content */}


      <Offcanvas />
    </>
  );
}

export default withRouter(StaffDashboard);
