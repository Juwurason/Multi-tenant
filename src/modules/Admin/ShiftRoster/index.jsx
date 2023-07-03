
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import Offcanvas from '../../../Entryfile/offcanvance';
import useHttp from '../../../hooks/useHttp';
import { FaAngleLeft, FaAngleRight, FaExclamationTriangle, FaPlus, } from 'react-icons/fa';
import { useCompanyContext } from '../../../context';
import dayjs from 'dayjs';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { GoTrashcan } from 'react-icons/go';
import { MdDoneOutline, MdOutlineEditCalendar, MdThumbUpOffAlt } from 'react-icons/md';
import moment from 'moment';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useHistory } from 'react-router-dom';
import { fetchRoaster, filterRoaster } from '../../../store/slices/shiftRoasterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff } from '../../../store/slices/StaffSlice';
import { fetchClient } from '../../../store/slices/ClientSlice';



const ShiftRoster = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  // Set the default timezone to Australia/Sydney
  dayjs.tz.setDefault('Australia/Sydney');
  //Declaring Variables
  const dispatch = useDispatch();
  const id = JSON.parse(localStorage.getItem('user'));

  // Fetch staff data and update the state
  useEffect(() => {
    dispatch(fetchRoaster(id.companyId));
    dispatch(fetchStaff(id.companyId));
    dispatch(fetchClient(id.companyId));
  }, [dispatch]);

  // Access the entire state
  const loading = useSelector((state) => state.roaster.isLoading);
  const schedule = useSelector((state) => state.roaster.data);
  const staff = useSelector((state) => state.staff.data);
  const clients = useSelector((state) => state.client.data);

  useEffect(() => {
    // Check if staff data already exists in the store
    if (!schedule.length) {
      // Fetch staff data only if it's not available in the store
      dispatch(fetchRoaster(id.companyId));
    }
  }, [dispatch, schedule]);



  const { get, post } = useHttp();
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const history = useHistory();
  const [cli, setCli] = useState('');
  const [sta, setSta] = useState('');
  const [lgShow, setLgShow] = useState(false);
  const [report, setReport] = useState("");
  const [startKm, setStartKm] = useState(0);
  const [endKm, setEndKm] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [periodicModal, setPeriodicModal] = useState(false);
  const dateFrom = useRef(null);
  const dateTo = useRef(null);





  //Calendar Logic Starts here
  // Get the current date
  const [currentDate, setCurrentDate] = useState(dayjs().tz());

  const handleNextClick = () => {
    setCurrentDate(currentDate.add(6, 'day'));
  };

  const handlePrevClick = () => {
    setCurrentDate(currentDate.subtract(6, 'day'));
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
  const [selectedShift, setSelectedShift] = useState(null);
  const [dropModal, setDropModal] = useState(false);





  const activitiesByDay = daysOfWeek.map((day) =>
    schedule.filter((activity) =>
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
    else if (activity.status === "Pending") {
      return 'Pending'
    }
    else {
      return 'Active';
    }
  }



  //To view details of a shift roaster
  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  // Delete a Shift Roaster
  const handleDelete = async (e) => {
    Swal.fire({
      html: `<h3>Are you sure? you want to delete this shift</h3>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#405189',
      cancelButtonColor: '#777',
      confirmButtonText: 'Confirm Delete',
      showLoaderOnConfirm: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await post(`/ShiftRosters/delete/${e}?userId=${id.userId}`,
          )
          if (data.status === 'Success') {
            toast.success(data.message);
            dispatch(fetchRoaster(id.companyId));
          } else {
            toast.error(data.message);
          }


        } catch (error) {
          toast.error("Error Deleting Shift");
          toast.error(error.response.data.message)
          toast.error(error.response.data.title)


        }


      }
    })


  }

  const handleCancelShift = async (e) => {
    Swal.fire({
      html: `<h3>Approving Shift Cancellation</h3>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#405189',
      cancelButtonColor: '#777',
      confirmButtonText: 'Proceed',
      showLoaderOnConfirm: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await get(`/ShiftRosters/cancel_shift/${e.shiftRosterId}?userId=${id.userId}`,
          )
          console.log(data);
          if (data.status === 'Success') {
            toast.success(data.message);
            dispatch(fetchRoaster(id.companyId));
          } else {
            toast.error(data.message);
          }


        } catch (error) {
          toast.error("Error Cancelling Shift");
          toast.error(error.response.data.message)
          toast.error(error.response.data.title)


        }


      }
    })


  }

  //Mark attendance on behalf of staff
  const markAttendance = (activity) => {
    setSelectedActivity(activity);
    setLgShow(true);
  }

  const handleConfirmation = async (e) => {
    if (endKm === 0) {
      return toast.error("EndKm and Cannot be 0")
    }

    const info = {
      clockIn: e.dateFrom,
      clockInCheck: true,
      clockOutCheck: true,
      clockOut: e.dateTo,
      report: report,
      startKm,
      endKm,
      staffId: e.staff.staffId,
      companyID: id.companyId
    }
    setLoading2(true);
    try {
      const { data } = await post(`/Attendances/mark_attendance?userId=${id.userId}&shiftId=${e.shiftRosterId}`,
        info);
      if (data.status === "Success") {
        Swal.fire(
          '',
          `${data.message}`,
          'success'
        )
        setLoading2(false)
        setLgShow(false);
      }
      setLoading2(false)
    } catch (error) {
      toast.error("Error Marking Attendance")
      toast.error(error.response?.data?.message);
      setLoading2(false)

    }
    finally {
      setLoading2(false)
      setLgShow(false);
    }

  }
  //Get periodic shift roaster

  const GetPeriodic = async () => {
    if (sta === '' && cli === '' && dateFrom.current.value === "" || dateTo.current.value === "") {
      return Swal.fire(
        "Select filter parameters",
        "",
        "error"
      )

    } else {

      dispatch(filterRoaster({ dateFrom: dateFrom.current.value, dateTo: dateTo.current.value, sta, cli, companyId: id.companyId }));
    }
  }

  // /api/ShiftRosters/reassign_staff?shiftId=&staffId=&userId=
  const SendRosterNotice = async () => {
    if (dateFrom.current.value === "" || dateTo.current.value === "") {
      return Swal.fire(
        "Select time range",
        "",
        "error"
      )

    } else {
      setLoading3(true)

      try {
        const { data } = await get(`/ShiftRosters/send_notification?userId=${id.userId}&staffId=${sta}&clientId=${cli}&fromDate=${dateFrom.current.value}&toDate=${dateTo.current.value}`, { cacheTimeout: 300000 });
        toast.success(data.message)
        setLoading3(false);
        setPeriodicModal(false);

      } catch (error) {
        toast.error("Ooops!😔 Error Occurred")
        console.log(error);
        setLoading3(false)
      }
    }
  }

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };


  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title>Shift Roster</title>
          <meta name="description" content="Shift Roster" />
        </Helmet>

        {/* Page Content */}
        <div className="content container-fluid">
          <div className="page-header">

            <div className="row">
              <div className="col">
                <h3 className="page-title">Shift Roster</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/administrator/administrator/adminDashboard">Dashboard</Link></li>
                  {/* <li className="breadcrumb-item"><Link to="/app/employee/allemployees">Employees</Link></li> */}
                  <li className="breadcrumb-item active">Shift Roster</li>
                </ul>
              </div>
              <div className="col-auto float-end ml-auto p-4">
                <Link to="/administrator/createShift" className="btn btn-info add-btn text-white m-r-5 rounded-2">Add New Roster</Link>
              </div>
            </div>
          </div>

          <div className="row align-items-center py-2 shadow-sm">
            {/* <span className='fw-bold' draggable>Filter Shift Roaster By User</span>
            <br />
            <br /> */}
            <div className="col-md-4">
              <div className="form-group">
                <label className="col-form-label">Staff Name</label>
                <div>
                  <select className="form-select" onChange={e => setSta(e.target.value)}>
                    <option defaultValue hidden>--Select a staff--</option>
                    <option value="">All Staff</option>
                    {
                      staff.map((data, index) =>
                        <option value={data.staffId} key={index}>{data.fullName}</option>)
                    }
                  </select></div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="col-form-label">Client Name</label>
                <div>
                  <select className="form-select" onChange={e => setCli(e.target.value)}>
                    <option defaultValue hidden>--Select a Client--</option>
                    <option value="">All Clients</option>
                    {
                      clients.map((data, index) =>
                        <option value={data.profileId} key={index}>{data.fullName}</option>)
                    }
                  </select></div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="col-form-label">Start Date</label>
                <div>
                  <input type="date" ref={dateFrom} className=' form-control' name="" id="" />
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label className="col-form-label">End Date</label>
                <div>
                  <input type="date" ref={dateTo} className=' form-control' name="" id="" />
                </div>
              </div>
            </div>

            <div className="col-auto mt-3">
              <div className="form-group">
                <button onClick={GetPeriodic} className="btn btn-info add-btn text-white rounded-2 m-r-5"
                  disabled={loading ? true : false}
                >


                  Load
                </button>

              </div>
            </div>

            <div className="col-auto mt-3">
              <div className="form-group">
                <button className="btn btn-primary add-btn rounded-2 m-r-5"
                  onClick={SendRosterNotice}
                >
                  {loading3 ? <div className="spinner-grow text-light" role="status">
                    <span className="sr-only">Loading...</span>
                  </div> : "Send Roster Notification"}
                </button>

              </div>
            </div>
            {/* <div className="col-auto mt-3">
              <div className="form-group">
                <button className="btn btn-warning text-white add-btn rounded-2 m-r-5"
                  onClick={() => GetPeriodic()}

                >Get Periodic Shift Roaster</button>

              </div>
            </div> */}


          </div>


          <div className='row'>

            <div className="col-md-6 col-lg-12 ">
              <div className='mt-4 p-3 d-flex justify-content-between flex-wrap align-items-center'>
                <span className='' >
                  <button onClick={handlePrevClick} className='btn btn-primary btn-sm shadow'>
                    <FaAngleLeft className='pointer fs-4 text-white' />

                  </button>
                  <span className='fw-bold px-2' style={{ fontSize: '15px' }}> {startDate.format('MMMM D')} - {endDate.format('MMMM D')}</span>
                  <button onClick={handleNextClick} className='btn btn-primary btn-sm shadow' >
                    <FaAngleRight className='pointer fs-4 text-white' />

                  </button>
                </span>

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


                  <div className="col-md-6 col-lg-2 py-2" key={day.format('YYYY-MM-DD')}


                  >
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
                      className="col-sm-12 text-center border p-2 roster"
                      style={{ height: "65vh", overflow: "auto", overflowX: "hidden" }}

                    >




                      {activitiesByDay[index].map((activity, index) => (


                        <div
                          className='text-white gap-1 pointer rounded-2 d-flex flex-column align-items-start p-2 mt-2'
                          key={index}
                          style={{
                            fontSize: '10px',
                            overflow: 'hidden',
                            backgroundColor:
                              activity.status === "Pending" ? "#ffbc34" : activity.status === "Cancelled" ? "#f62d51" : "#405189"
                          }}
                        >
                          <div
                            onClick={() => handleActivityClick(activity)}
                            className='d-flex flex-column align-items-start' style={{ fontSize: '10px' }}>
                            <div className='d-flex gap-5 align-items-center'>
                              <span className='fw-bold' >
                                {dayjs(activity.dateFrom).format('hh:mm A')} - {dayjs(activity.dateTo).format('hh:mm A')}
                              </span>



                              <span style={{ width: "10px", height: "10px" }} className={`${activity.attendance === true ? "bg-success" : "bg-danger"} rounded-circle`}></span>
                            </div>
                            <span><span className='fw-bold text-truncate'>Staff: </span><span className='text-truncate'>{activity.staff?.fullName}</span></span>
                            <span><span className='fw-bold text-truncate'>Client(s): </span><span className='text-truncate'>{activity.clients}</span></span>
                            <span className='text-truncate'><span className='fw-bold'>Task: </span><span className='text-truncate'>{activity?.activities}</span></span>
                          </div>

                          {
                            getActivityStatus(activity) === 'Active' ?
                              (
                                <div className='d-flex gap-2'>
                                  <small
                                    className={`text-truncate d-flex 
                             align-items-center
                             justify-content-center px-2 py-1 rounded bg-danger pointer`}

                                    onClick={() => handleDelete(activity?.shiftRosterId)}
                                    title="Delete"
                                  >
                                    <GoTrashcan className='fs-6' />
                                  </small>
                                  <Link
                                    to={`/administrator/editShiftRoster/${activity?.shiftRosterId}`}
                                    className={`text-truncate d-flex 
                              align-items-center
                              justify-content-center px-2 py-1 rounded bg-light pointer`}
                                    title="Edit"

                                  >
                                    <MdOutlineEditCalendar className='fs-6 text-dark' />
                                  </Link>
                                  <small
                                    className={`text-truncate d-flex 
                               align-items-center
                               justify-content-center px-2 py-1 rounded bg-warning pointer`}

                                    onClick={() => markAttendance(activity)}
                                    title="Mark attendance for staff"
                                  >
                                    <MdDoneOutline className='fs-6' />
                                  </small>
                                </div>
                              )
                              :
                              (
                                <div className='d-flex gap-2' >

                                  <small
                                    className={`text-truncate d-flex 
                             align-items-center
                             justify-content-center px-2 py-1 rounded bg-danger pointer`}

                                    onClick={() => handleDelete(activity?.shiftRosterId)}
                                    title="Delete"
                                  >
                                    <GoTrashcan className='fs-6' />
                                  </small>

                                  {
                                    getActivityStatus(activity) === 'Upcoming' && (
                                      <Link
                                        to={`/administrator/editShiftRoster/${activity?.shiftRosterId}`}
                                        className={`text-truncate d-flex 
                              align-items-center
                              justify-content-center px-2 py-1 rounded bg-light pointer`}
                                        title="Edit"

                                      >
                                        <MdOutlineEditCalendar className='fs-6 text-dark' />
                                      </Link>

                                    )
                                  }
                                  {
                                    getActivityStatus(activity) === 'Absent' && (
                                      <small
                                        className={`text-truncate d-flex 
                                 align-items-center
                                 justify-content-center px-2 py-1 rounded bg-warning pointer`}

                                        onClick={() => markAttendance(activity)}
                                        title="Mark attendance for staff"
                                      >
                                        <MdDoneOutline className='fs-6' />
                                      </small>

                                    )
                                  }
                                  {
                                    getActivityStatus(activity) === 'Pending' && "Absent" && (

                                      <small
                                        className={`text-truncate d-flex 
                                     align-items-center
                                     justify-content-center px-2 py-1 rounded bg-secondary pointer`}

                                        onClick={() => handleCancelShift(activity)}
                                        title="Approve Cancelling Shift"
                                      >
                                        <MdThumbUpOffAlt className='fs-6' />
                                      </small>

                                    )


                                  }
                                </div>

                              )
                          }


                        </div>





                      ))}
                      {!loading && activitiesByDay[index].length <= 0 && (
                        <div>
                          <span>No Activity</span>
                        </div>
                      )}

                    </div>
                  </div>





                ))}
              </div>


            </div>
          </div>









          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Shift Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedActivity && (
                <>
                  <p><b>Date:</b> {moment(selectedActivity.dateFrom).format('LLL')} - {moment(selectedActivity.dateTo).format('LLL')}</p>
                  <p><b>Time:</b> {dayjs(selectedActivity.dateFrom).format('hh:mm A')} - {dayjs(selectedActivity.dateTo).format('hh:mm A')}</p>
                  <p><b>Staff:</b> {selectedActivity.staff?.fullName}</p>
                  <p><b>Client(s):</b> {selectedActivity.clients}</p>
                  <p><b>Activities:</b> {selectedActivity?.activities}</p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Link to={`/administrator/editShiftRoster/${selectedActivity?.shiftRosterId}`} className="btn btn-primary" >Edit Shift</Link>

            </Modal.Footer>
          </Modal>
          <Modal
            size="lg"
            show={lgShow}
            onHide={() => setLgShow(false)}
            backdrop="static"
            keyboard={false}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg text-start">
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedActivity && (
                <>
                  <div>
                    <span className='fw-bold fs-5'>
                      Mark Attendance for {selectedActivity.staff?.fullName}

                    </span>
                  </div>
                  <br />
                  <div className="form-group">

                    <div className="alert alert-danger d-flex align-items-start gap-2" role="alert">
                      <FaExclamationTriangle className='text-danger fs-1' />
                      <div>
                        <span className='fw-bold'> Note:</span> This action should only be taken as a last resort if all effort from the staff to
                        clock in on the mobile fails and you have notified technical support.
                        If so click the check box below to proceed.
                      </div>
                    </div>
                    <div className='d-flex flex-column gap-1'>
                      <span>

                        Attendance for this shift will be marked in respect to the shift start time and end time.
                      </span>
                      <span><span className='fw-bold'>Clock In Time: </span><span>{moment(selectedActivity.dateFrom).format('LLL')} </span></span>
                      <span><span className='fw-bold'>Clock Out Time: </span><span>{moment(selectedActivity.dateTo).format('LLL')} </span></span>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="form-group">
                          <input className="form-control" type="text"
                            value={startKm}
                            placeholder='Start Km' onChange={(e) => setStartKm(e.target.value)} />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <input className="form-control" type="text" placeholder='End Km'
                            value={endKm}
                            onChange={(e) => setEndKm(e.target.value)} />
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="form-group">
                          <textarea name="" id="" cols="30" rows="3" className='form-control' placeholder='Report'
                            value={report}
                            onChange={(e) => setReport(e.target.value)}
                          ></textarea>
                        </div>

                      </div>
                    </div>

                    <div className="form-group">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="flexCheckChecked"
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor="flexCheckChecked">
                          I have done due verification that staff has tried on
                          the mobile and it fails and issue have been reported to technical support...
                        </label>
                      </div>

                    </div>


                  </div>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <div className='d-flex justify-content-end'>
                <div className='d-flex gap-2'>
                  <button className="btn add-btn rounded-2 btn-secondary"
                    disabled={isChecked ? false : true}
                    onClick={() => handleConfirmation(selectedActivity)}
                    style={{ cursor: isChecked ? 'pointer' : 'not-allowed' }}
                    title={isChecked ? "Proceed" : "Confirm verification by checking the checkbox"}
                  >
                    {loading2 ? <div className="spinner-grow text-light" role="status">
                      <span className="sr-only">Loading...</span>
                    </div> : "Yes"}
                  </button>
                  <button className="btn add-btn rounded-2 btn-danger" onClick={() => setLgShow(false)}>
                    No
                  </button>
                </div>
              </div>
            </Modal.Footer>
          </Modal>

          <Modal show={periodicModal}
            size="lg"
            onHide={() => setPeriodicModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Shift Roster</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="col-form-label">Staff Name</label>
                    <div>
                      <select className="form-select" onChange={e => setSta(e.target.value)}>
                        <option defaultValue hidden>--Select a staff--</option>
                        {
                          staff.map((data, index) =>
                            <option value={data.staffId} key={index}>{data.fullName}</option>)
                        }
                      </select></div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="col-form-label">Client Name</label>
                    <div>
                      <select className="form-select" onChange={e => setCli(e.target.value)}>
                        <option defaultValue hidden>--Select a Client--</option>
                        {
                          clients.map((data, index) =>
                            <option value={data.profileId} key={index}>{data.fullName}</option>)
                        }
                      </select></div>
                  </div>
                </div>

              </div>
            </Modal.Body>
            <Modal.Footer>
              {/* <button className="ml-4 text-white add-btn rounded btn btn-info"
                onClick={GetPeriodic}
              >
                {loading3 ? <div className="spinner-grow text-light" role="status">
                  <span className="sr-only">Loading...</span>
                </div> : "Load"}
              </button> */}
            </Modal.Footer>
          </Modal>


        </div>

      </div>

      <Offcanvas />
    </>
  );

}

export default ShiftRoster;
