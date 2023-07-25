
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, Redirect } from 'react-router-dom';
import Offcanvas from '../../../Entryfile/offcanvance';
import useHttp from '../../../hooks/useHttp';
import { FaAngleLeft, FaAngleRight, FaPlus } from 'react-icons/fa';
import { useCompanyContext } from '../../../context';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Modal } from 'react-bootstrap';
import { useHistory } from "react-router-dom"
import { toast } from 'react-toastify';
import { BiStopwatch } from 'react-icons/bi';
// import axiosInstance from '../../../store/axiosInstance';


const StaffRoster = ({ staff, loading, FetchData }) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault('Australia/Sydney');
  const [staffCancel, setStaffCancel] = useState('');

  // const [loading, setLoading] = useState(false);


  const AustraliaTimezone = 'Australia/Sydney';
  const navigate = useHistory()


  const user = JSON.parse(localStorage.getItem('user'));
  const privateHttp = useHttp()



  const [currentDate, setCurrentDate] = useState(dayjs().tz());

  const handleNextClick = () => {
    setCurrentDate(currentDate.add(6, 'day'));
  };

  const handlePrevClick = () => {
    setCurrentDate(currentDate.subtract(6, 'day'));
  };

  const [editedProfile, setEditedProfile] = useState({});

  function handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    const newValue = value === "" ? "" : value;
    setEditedProfile({
      ...editedProfile,
      [name]: newValue
    });
  }

  const HandleSubmit = async (e) => {
    setReasonModal(true)
    setStaffCancel(e)
    try {
      const { data } = await privateHttp.get(`/ShiftRosters/${e}`, { cacheTimeout: 300000 });
      // console.log(data);
      setEditedProfile(data);
      // setLoading(false)
    } catch (error) {
      toast.error(error.response.data.message);
      toast.error(error.response.data.title);
      // setLoading(false)
    }
  };

  const CancelShift = async () => {
    // setLoading(true)
    if (editedProfile.reason === "" || editedProfile.reason === null) {
      return toast.error("Input Fields cannot be empty")
    }
    try {
      const response = await privateHttp.get(`/ShiftRosters/shift_cancellation?userId=${user.userId}&reason=${editedProfile.reason}&shiftid=${staffCancel}`)
      FetchData()

    // Use the converted JSON data in your component
    // console.log(json);
      // setStaffCancel(cancel);
      // setLoading(false);
      setReasonModal(false)
    } catch (error) {
      FetchData()
      // console.log(error);
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
    }
    finally {
      // setLoading(false)
      setReasonModal(false)
    }
  };

  const daysOfWeek = [
    currentDate.subtract(3, 'day'),
    currentDate.subtract(2, 'day'),
    currentDate.subtract(1, 'day'),
    currentDate,
    currentDate.add(1, 'day'),
    currentDate.add(2, 'day'),
  ];
  const startDate = currentDate.subtract(3, 'day');
  const endDate = currentDate.add(2, 'day');

  const activitiesByDay = daysOfWeek.map((day) =>
    staff.filter((activity) =>
      dayjs(activity.dateFrom).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
    )
  );
  // console.log(staff)
  function getActivityStatus(activity) {
    const nowInAustraliaTime = dayjs().tz().format('YYYY-MM-DD HH:mm:ss');
    const activityDateFrom = dayjs(activity.dateFrom).format('YYYY-MM-DD HH:mm:ss');
    const activityDateTo = dayjs(activity.dateTo).format('YYYY-MM-DD HH:mm:ss');

    if (activityDateFrom > nowInAustraliaTime) {
      return 'Upcoming';
    }
    else if (activity.status === "Cancelled" ) {
      return 'Cancelled'
    }
    else if (activityDateTo < nowInAustraliaTime) {
      return activity.attendance === true ? 'Present' : 'Absent';
    }
    else if (activityDateTo < nowInAustraliaTime || activity.attendance === true && activity.isEnded === false) {
      return 'You are already Clocked in'
    }
    else if (activityDateTo < nowInAustraliaTime || activity.attendance === true && activity.isEnded === true) {
      return 'Present'
    }
    else {
      // console.log();
      return 'Clock-In';
    }
  }


  const rosterId = JSON.parse(localStorage.getItem('rosterId'))
  const progressNoteId = JSON.parse(localStorage.getItem('progressNoteId'))
  const HandleFill = () => {
    navigate.push(`/staff/staff/edit-progress/${rosterId}/${progressNoteId}`);
  }
  const [showModal, setShowModal] = useState(false);
  const [reasonModal, setReasonModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleActivityClick = (activity) => {
    // console.log(activity);
    setSelectedActivity(activity);
    setShowModal(true);
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <Helmet>
          <title>Shift Roster</title>
          <meta name="description" content="Staff Shift Roaster" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Shift Roaster</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/staff/staff/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Shift Roaster</li>
                </ul>
              </div>

            </div>
          </div>

          <div className='row'>


            <div className="col-md-6 col-lg-12 ">
              <div className='mt-4 p-3 d-flex justify-content-between flex-wrap align-items-center'>
                <span className=''>
                  <button onClick={handlePrevClick} className='btn btn-primary btn-sm shadow'>
                    <FaAngleLeft className='pointer fs-4 text-white' />
                  </button>
                  <span className='fw-bold px-2' style={{ fontSize: '15px' }}> {startDate.format('MMMM D')} - {endDate.format('MMMM D')}</span>
                  <button onClick={handleNextClick} className='btn btn-primary btn-sm shadow'>
                    <FaAngleRight className='pointer fs-4 text-white' />
                  </button>

                </span>

                <span>
                  {
                    loading ?
                      <div className="text-center d-flex align-items-center gap-2 ">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span>Please Wait</span>
                      </div>

                      :
                      <span>
                        <h1 className='text-muted fw-bold'>
                          {startDate.format('YYYY')}
                        </h1>
                      </span>
                  }
                </span>

                <span>
                  <select className="form-select border-0 fw-bold" style={{ backgroundColor: '#F4F4F4' }}>
                    <option defaultValue hidden>Week</option>

                    {/* <option value=''>Month</option> */}
                    <option value=''>Week</option>
                    {/* <option value=''>Day</option> */}

                  </select>
                </span>
              </div>

              <div className='row g-0'>

                {daysOfWeek.map((day, index) => (
                  <div className="col-md-6 col-lg-2 py-2" key={day.format('YYYY-MM-DD')}>
                    <div className='border  d-flex justify-content-center py-2 bg-light'>
                      <div className={`d-flex flex-column align-items-center gap-0  ${currentDate.format('YYYY-MM-DD HH:mm:ss') === day.format('YYYY-MM-DD HH:mm:ss') ? 'rounded-3 bg-primary px-3 text-white ' : ''}`}>
                        <span
                          className={`fw-bold fs-4`

                          }
                        >
                          {day.format('D')}
                        </span>

                        <span style={{ fontSize: '10px' }} className='mb-2'>
                          {day.locale('en').format('ddd')}
                        </span>
                      </div>
                    </div>

                    <div
                      className="col-sm-12 text-center border roster p-2"
                      style={{ height: "65vh", overflow: "auto", overflowX: "hidden" }}
                    >
                      {loading &&

                        <div className="spinner-grow text-secondary" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      }
                      {loading ? (
                        <div> </div>
                      ) : (
                        staff.length <= 0 ? (
                          <div>
                            <h5>No Activities</h5>
                          </div>
                        ) : (
                          activitiesByDay[index].length > 0 ? (
                            activitiesByDay[index].map((activity, activityIndex) => (
                              <div key={activityIndex}
                                className='text-white gap-1 pointer rounded-2 d-flex flex-column align-items-start p-2 mt-2'
                                style={{
                                  fontSize: '10px',
                                  overflow: 'hidden',
                                  backgroundColor:
                                    activity.status === "Pending" ? "#ffbc34" : activity.status === "Cancelled" ? "#f62d51" : "#405189"
                                }}
                              >
                                <div onClick={() => handleActivityClick(activity)}>
                                  <div className='d-flex flex-column gap-1 justify-content-start align-items-start'>
                                    <span className='fw-bold text-trucate'>
                                      {dayjs(activity.dateFrom).format('hh:mm A')} - {dayjs(activity.dateTo).format('hh:mm A')}
                                    </span>
                                    <span><span className='fw-bold text-truncate'>Client: </span><span className='text-truncate'>{activity.clients}</span></span>
                                    <span><span className='fw-bold text-truncate'>Status: </span><span className='text-truncate'>{activity.status}</span></span>
                                  </div>
                                </div>

                                {activity.status !== "Cancelled" && getActivityStatus(activity) === 'Clock-In' ? (
                                  <div className='d-flex gap-2'>
                                    <small onClick={() => {
                                      if (navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition(
                                          (position) => {
                                            const latitude = position.coords.latitude;
                                            const longitude = position.coords.longitude;
                                            localStorage.setItem("latit", latitude)
                                            localStorage.setItem("log", longitude)
                                            navigate.push(`/staff/staff/progress/${activity.shiftRosterId}`);
                                          },
                                          (error) => {
                                            toast.error('Error getting location:', error.message);
                                          }
                                        );
                                      } else {
                                        toast.error('Geolocation is not supported');
                                      }
                                    }}
                                      className="bg-success p-1 rounded"
                                    >
                                      <BiStopwatch /> Clock-In
                                    </small>
                                    {/* <small
                                      className='bg-secondary p-1 rounded'
                                      onClick={() => HandleSubmit(activity.shiftRosterId)}
                                    >
                                      Cancel shift
                                    </small> */}
                                  </div>
                                ) : (
                                  <div className='d-flex gap-2 flex-wrap'>
                                    <small
                                      className={`p-1 rounded text-truncate ${getActivityStatus(activity) === 'Upcoming' ? 'bg-warning' :
                                        getActivityStatus(activity) === 'Absent' ? 'bg-danger' :
                                        getActivityStatus(activity) === 'Cancelled' ? 'bg-secondary' :
                                          getActivityStatus(activity) === 'You are already Clocked in' ? 'bg-primary' :
                                            getActivityStatus(activity) === 'Present' ? 'bg-success' : ''
                                        }`}
                                    >
                                      {getActivityStatus(activity)}
                                    </small>
                                    {
                                      activity.status === "Cancelled" ? (
                                        <small className='bg-secondary p-1 rounded'>
                                          Shift Cancelled
                                        </small>
                                      ) : null
                                    }

                                    {activity.status !== "Cancelled" && getActivityStatus(activity) === 'Upcoming' && (
                                      <small
                                        className='bg-secondary p-1 rounded'
                                        onClick={() => HandleSubmit(activity.shiftRosterId)}
                                      >
                                        Cancel shift
                                      </small>
                                    )}

                                    


                                    {getActivityStatus(activity) === 'You are already Clocked in' && (
                                      <small
                                        className='bg-secondary p-1 rounded'
                                        onClick={HandleFill}
                                      >
                                        Fill Progress Note
                                      </small>
                                    )}
                                  </div>
                                )}


                              </div>
                            ))
                          ) : (
                            <div>
                              <h5>No Activities</h5>
                            </div>
                          )
                        )
                      )}




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
                              <p><b>Client:</b> {selectedActivity.clients}</p>
                              <p><b>Status:</b> {selectedActivity.status}</p>
                              <p><b>Description:</b> {selectedActivity.activities}</p>
                            </>
                          )}
                        </Modal.Body>
                        <Modal.Footer>
                          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                        </Modal.Footer>
                      </Modal>

                      <Modal show={reasonModal} onHide={() => setReasonModal(false)} centered>
                        <Modal.Header closeButton>
                          <Modal.Title>Request to Cancel Shift</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div>
                            <label htmlFor="">Please provide reasons for cancelling shift</label>
                            <textarea rows={3} className="form-control summernote" placeholder="" name='reason' value={editedProfile.reason || ""} onChange={handleInputChange} />
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <button onClick={CancelShift} className="btn btn-success">Submit</button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                ))}

              </div>

            </div>
          </div>
        </div>

      </div>






      <Offcanvas />
    </>
  );

}

export default StaffRoster;
