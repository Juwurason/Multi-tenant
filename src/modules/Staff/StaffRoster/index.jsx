
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

dayjs.extend(utc);
dayjs.extend(timezone);

const StaffRoster = () => {
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
      console.log(cancel);
      // setStaffCancel(cancel);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
      setReasonModal(false)
    }
  };






  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%'
      });
    }
  });

  // Get the current date
  const [currentDate, setCurrentDate] = useState(dayjs());

  const Move = () => {
    console.log(33);
    // navigate.push("/staff/staff-progress")
  };
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
    staff.filter((activity) => dayjs(activity.dateFrom).isSame(day, 'day'))
  );

  function getActivityStatus(activity) {
    const nowInAustraliaTime = dayjs()
    const activityDateFrom = dayjs(activity.dateFrom)
    const activityDateTo = dayjs(activity.dateTo)

    if (activityDateFrom.isAfter(nowInAustraliaTime, 'hour')) {
      return 'Upcoming';
    } else if (activityDateTo.isBefore(nowInAustraliaTime)) {
      return activity.isClockedIn ? 'Present' : 'Absent';
    } else {
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
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Shift Roster</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/staff/staff/staffDashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link to="/staff/staff/staffDashboard">Staff</Link></li>
                  <li className="breadcrumb-item active">Shift Roster</li>
                </ul>
              </div>
              <div className="col-auto float-end ml-auto">
                {/* <Link to="/app/employee/add-shift" className="btn add-btn m-r-5">Add New Roaster</Link> */}
                {/* <a href="#" className="btn add-btn m-r-5" data-bs-toggle="modal" data-bs-target="#add_schedule"> Assign Shifts</a> */}
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Content Starts */}
          {/* Search Filter */}

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
                                className='bg-primary text-white rounded-2 d-flex flex-column align-items-start p-2 mt-2'
                                style={{ fontSize: '10px' }}
                              >
                                <div onClick={() => handleActivityClick(activity)}>
                                  <div className='d-flex flex-column gap-1 justify-content-start align-items-start'>
                                    <span className='fw-bold'>
                                      {dayjs(activity.dateFrom).format('hh:mm A')} - {dayjs(activity.dateTo).format('hh:mm A')}
                                    </span>
                                  </div>
                                  <span><span className='fw-bold'>Client :</span> {activity.profile.firstName} {activity.profile.surName}</span>
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
                                            console.error('Error getting location:', error.message);
                                          }
                                        );
                                      } else {
                                        console.error('Geolocation is not supported');
                                      }
                                    }}
                                      className="bg-success p-1 rounded"
                                    >Clock-In</small>
                                    <small className='bg-secondary p-1 rounded'
                                      onClick={() => HandleSubmit(activity.shiftRosterId)}
                                    >
                                      Cancel shift
                                    </small>
                                  </div>
                                ) : (
                                  <small
                                    className={`text-truncate p-1 rounded ${getActivityStatus(activity) === 'Upcoming' ? 'bg-warning' :
                                      getActivityStatus(activity) === 'Absent' ? 'bg-danger' :
                                        getActivityStatus(activity) === 'Present' ? 'bg-primary' : ''
                                      }`}
                                    style={{ cursor: getActivityStatus(activity) === 'Clock-In' ? 'pointer' : 'default' }}
                                    onClick={() => {
                                      if (getActivityStatus(activity) === 'Clock-In') {
                                        if (navigator.geolocation) {
                                          navigator.geolocation.getCurrentPosition(
                                            (position) => {
                                              const latitude = position.coords.latitude;
                                              const longitude = position.coords.longitude;
                                              navigate.push(`/staff/staff-progress/${activity.shiftRosterId}/${activity.profile.firstName} ${activity.profile.surName}?lat=${latitude}&lng=${longitude}`);
                                            },
                                            (error) => {
                                              console.error('Error getting location:', error.message);
                                            }
                                          );
                                        } else {
                                          console.error('Geolocation is not supported');
                                        }
                                      }
                                    }}
                                  >
                                    {getActivityStatus(activity)}
                                  </small>
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
                      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
          {/* /Content End */}
        </div>
        {/* /Page Content */}

      </div>
      {/* /Page Wrapper */}
      {/* Add Schedule Modal */}
      {/* /Add Schedule Modal */}
      {/* Edit Schedule Modal */}






      {/* /Edit Schedule Modal */}
      <Offcanvas />
    </>
  );

}

export default StaffRoster;
