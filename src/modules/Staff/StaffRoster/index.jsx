
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



const StaffRoster = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  // Set the default timezone to Australia/Sydney
  dayjs.tz.setDefault('Australia/Sydney');
  // const currentLate = dayjs().tz();
  // console.log(currentLate.format('YYYY-MM-DD HH:mm:ss'));


  const staffProfile = JSON.parse(localStorage.getItem('staffProfile'));
  const { get } = useHttp();
  const { loading, setLoading } = useCompanyContext();
  const [staff, setStaff] = useState([]);
  const [staffCancel, setStaffCancel] = useState('');
  const [reason, setReason] = useState('');


  const AustraliaTimezone = 'Australia/Sydney';
  const navigate = useHistory()

  const FetchSchedule = async () => {
    setLoading(true)
    try {
      const staffResponse = await get(`/ShiftRosters/get_shifts_by_user?client=&staff=${staffProfile.staffId}`, { cacheTimeout: 300000 });
      const staff = staffResponse.data;
      // console.log(staff.shiftRoster);
      setStaff(staff.shiftRoster);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }


  };
  useEffect(() => {
    FetchSchedule()
  }, []);

  const user = JSON.parse(localStorage.getItem('user'));
  const privateHttp = useHttp()
  const CancelShift = async () => {
    setLoading(true)
    if (reason === "") {
      return toast.error("Input Fields cannot be empty")
    }
    const info = {
      userId: user.userId,
      reason: reason
    }
    try {
      const cancelShif = await privateHttp.post(`/ShiftRosters/shift_cancellation/${staffCancel}?userId=${user.userId}&reason=${reason}`);
      const cancel = cancelShif.data;
      // console.log(cancel);
      setStaffCancel(cancel);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
      setReasonModal(false)
    }
  };






  // useEffect(() => {
  //   if ($('.select').length > 0) {
  //     $('.select').select2({
  //       minimumResultsForSearch: -1,
  //       width: '100%'
  //     });
  //   }
  // });

  // Get the current date
  const [currentDate, setCurrentDate] = useState(dayjs().tz());


  // const Move = () => {
  //   console.log(33);
  // navigate.push("/staff/staff-progress")
  // };
  const handleNextClick = () => {
    setCurrentDate(currentDate.add(6, 'day'));
  };

  const handlePrevClick = () => {
    setCurrentDate(currentDate.subtract(6, 'day'));
  };

  const HandleSubmit = (e) => {
    setReasonModal(true)
    setStaffCancel(e)
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


  function getActivityStatus(activity) {
    const nowInAustraliaTime = dayjs().tz().format('YYYY-MM-DD HH:mm:ss');
    const activityDateFrom = dayjs(activity.dateFrom).format('YYYY-MM-DD HH:mm:ss');
    const activityDateTo = dayjs(activity.dateTo).format('YYYY-MM-DD HH:mm:ss');

    if (activityDateFrom > nowInAustraliaTime) {
      return 'Upcoming';
    }
    else if (activityDateTo < nowInAustraliaTime) {
      return activity.attendance === true ? 'Present' : 'Absent';
    }
    else if (activityDateTo < nowInAustraliaTime || activity.attendance === true) {
      return 'Present'
    }
    else {
      return 'Clock-In';
    }
  }



  const [showModal, setShowModal] = useState(false);
  const [reasonModal, setReasonModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleActivityClick = (activity) => {
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
                  <li className="breadcrumb-item"><Link to="/staff/staff/staffDashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Shift Roaster</li>
                </ul>
              </div>

            </div>
          </div>


          <div className='row filter-row '>


            <div className="col-md-8 col-lg-12 ">
              <div className=' py-3 d-flex justify-content-between align-items-center'>
                <span className='shadow-sm p-3' style={{ backgroundColor: '#F4F4F4' }} >
                  <FaAngleLeft className='pointer' onClick={handlePrevClick} />
                  <span className='fw-bold text-primary'> {startDate.format('MMMM D')} - {endDate.format('MMMM D')}</span>
                  <FaAngleRight className='pointer' onClick={handleNextClick} />
                </span>
                <span>
                  <select className="form-select border-0 fw-bold" style={{ backgroundColor: '#F4F4F4' }}>
                    <option defaultValue hidden>Week</option>

                    <option value=''>Month</option>
                    <option value=''>Week</option>
                    <option value=''>Day</option>

                  </select>
                </span>
              </div>
              <div className='row g-0'>

                {daysOfWeek.map((day, index) => (
                  <div className="col-md-6 col-lg-2 py-2" key={day.format('YYYY-MM-DD')}>
                    <div className='border p-2'>
                      <span
                        className={`calendar-date text-muted text-truncate overflow-hidden ${day.isSame(currentDate, 'day') ? 'current-date' : ''}`}
                        style={{ fontSize: '12px' }}>
                        {day.format('dddd, MMMM D')}

                      </span>
                    </div>

                    <div className="col-sm-12 text-center border p-2" style={{ height: "50vh", overflow: "auto", overflowX: "hidden", cursor: 'pointer' }}>
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
                                className='text-white rounded-2 d-flex flex-column gap-1 align-items-start p-2 mt-2'
                                style={{ fontSize: '10px', backgroundColor: "#4256D0" }}
                              >
                                <div onClick={() => handleActivityClick(activity)}>
                                  <div className='d-flex flex-column gap-1 justify-content-start align-items-start'>
                                    <span className='fw-bold text-trucate'>
                                      {dayjs(activity.dateFrom).format('hh:mm A')} - {dayjs(activity.dateTo).format('hh:mm A')}
                                    </span>
                                    <span><span className='fw-bold text-truncate'>Client: </span><span className='text-truncate'>{activity.profile.fullName}</span></span>
                                    <span><span className='fw-bold text-truncate'>Status: </span><span className='text-truncate'>{activity.status}</span></span>
                                  </div>
                                </div>

                                {getActivityStatus(activity) === 'Clock-In' ? (
                                  <div className='d-flex gap-2'>
                                    <small onClick={() => {
                                      if (navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition(
                                          (position) => {
                                            const latitude = position.coords.latitude;
                                            const longitude = position.coords.longitude;
                                            localStorage.setItem("latit", latitude)
                                            localStorage.setItem("log", longitude)
                                            navigate.push(`/staff/staff-progress/${activity.shiftRosterId}`);
                                          },
                                          (error) => {
                                            toast.error('Error getting location:', error.message);
                                          }
                                        );
                                      } else {
                                        toast.error('Geolocation is not supported');
                                      }
                                    }}
                                      className="bg-info p-1 rounded"
                                    >
                                      Clock-In
                                    </small>
                                    <small
                                      className='bg-secondary p-1 rounded'
                                      onClick={() => HandleSubmit(activity.shiftRosterId)}
                                    >
                                      Cancel shift
                                    </small>
                                  </div>
                                ) : (
                                  <div className='d-flex gap-2'>
                                    <small
                                      className={`p-1 rounded ${getActivityStatus(activity) === 'Upcoming' ? 'bg-warning' :
                                        getActivityStatus(activity) === 'Absent' ? 'bg-danger' :
                                          getActivityStatus(activity) === 'Present' ? 'bg-success' : ''
                                        }`}
                                    >
                                      {getActivityStatus(activity)}
                                    </small>

                                    {getActivityStatus(activity) === 'Upcoming' && (
                                      <small
                                        className='bg-secondary p-1 rounded'
                                        onClick={() => HandleSubmit(activity.shiftRosterId)}
                                      >
                                        Cancel shift
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
                              <p><b>Description:</b> {selectedActivity.activities}</p>
                            </>
                          )}
                        </Modal.Body>
                        <Modal.Footer>
                          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                        </Modal.Footer>
                      </Modal>

                      <Modal show={reasonModal} onHide={() => setReasonModal(false)}>
                        <Modal.Header closeButton>
                          <Modal.Title>Request to Cancel Shift</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div>
                            <label htmlFor="">Please provide reasons for cancelling shift</label>
                            <textarea rows={3} className="form-control summernote" placeholder="" defaultValue={""} onChange={e => setReason(e.target.value)} />
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
