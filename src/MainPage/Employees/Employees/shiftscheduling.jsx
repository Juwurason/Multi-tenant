
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
import { MdDoneOutline, MdOutlineEditCalendar } from 'react-icons/md';
import moment from 'moment';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { set } from 'react-hook-form';



const ShiftScheduling = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  // Set the default timezone to Australia/Sydney
  dayjs.tz.setDefault('Australia/Sydney');
  //Declaring Variables
  const id = JSON.parse(localStorage.getItem('user'));
  const { get, post } = useHttp();
  const { loading, setLoading } = useCompanyContext();
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false)
  const [staff, setStaff] = useState([]);
  const [clients, setClients] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [displaySchedule, setDisplaySchedule] = useState(schedule);
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


  //Fetching From the endpoints
  const FetchSchedule = async () => {
    setLoading(true)
    //All shift Roasters
    try {
      const scheduleResponse = await get(`/ShiftRosters/get_all_shift_rosters?companyId=${id.companyId}`, { cacheTimeout: 300000 });
      const schedule = scheduleResponse.data;
      setSchedule(schedule);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
    // All staff
    try {
      const staffResponse = await get(`/Staffs?companyId=${id.companyId}`, { cacheTimeout: 300000 });
      const staff = staffResponse.data;
      setStaff(staff);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
    //All Client
    try {
      const clientResponse = await get(`/Profiles?companyId=${id.companyId}`, { cacheTimeout: 300000 });
      const client = clientResponse.data;
      setClients(client);
      setLoading(false)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    FetchSchedule()
  }, []);

  // Filtering Schedule either by user or Client
  const FilterSchedule = async () => {

    if (sta === '' && cli === '') {
      return Swal.fire(
        "Select either a staff or client",
        "",
        "error"
      )

    } else {
      setLoading1(true)

      try {
        const shiftResponse = await get(`/ShiftRosters/get_shifts_by_user?client=${cli}&staff=${sta}`, { cacheTimeout: 300000 });
        const shift = shiftResponse.data?.shiftRoster;
        setSchedule(shift);
        setLoading1(false)
      } catch (error) {
        console.log(error);
        setLoading1(false)
      }
    }

  }

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
  const [draggedTask, setDraggedTask] = useState(null);
  const [targetDate, setTargetDate] = useState('');

  const handleDragStart = (initial) => {
    const { source } = initial;
    const draggedTask = schedule[source.index];
    // Store the dragged task temporarily in state
    setDraggedTask(draggedTask);
  };

  const handleDragEnd = (result) => {
    // Reset the temporary task stored in state
    // setDraggedTask(null);

    const { source, destination } = result;
    setTargetDate(destination.droppableId)
    console.log(targetDate);
    // Check if the item was dropped outside a valid droppable area
    if (!destination) {
      return;
    }
    const draggedTask = schedule[source.index];
    // Store the dragged task temporarily in state
    setSchedule(draggedTask);

    // Call the update endpoint to update the actual data
    // You can use the updatedItems data to send the necessary updates to the server
    console.log(draggedTask);

  };




  const activitiesByDay = daysOfWeek.map((day) =>
    schedule.filter((activity) =>
      dayjs(activity.dateFrom).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
    )
  );

  function getActivityStatus(activity) {
    const nowInAustraliaTime = dayjs().tz().format('YYYY-MM-DD HH:mm:ss');
    const activityDateFrom = dayjs(activity.dateFrom).format('YYYY-MM-DD HH:mm:ss');
    const activityDateTo = dayjs(activity.dateTo).format('YYYY-MM-DD HH:mm:ss');

    //   if (activityDateFrom.isAfter(nowInAustraliaTime, 'hour')) {
    //     return 'Upcoming';
    //   } else if (activityDateTo.isBefore(nowInAustraliaTime)) {
    //     return activity.attendance === true ? 'Present' : 'Absent';
    //   } else {
    //     return 'Active';
    //   }
    // }

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
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#00AEEF',
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
            FetchSchedule()
          } else {
            toast.error(data.message);
          }


        } catch (error) {
          console.log(error);
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
    if (report === "" || endKm === 0) {
      return toast.error("EndKm and Report cannot be empty")
    }
    const info = {

      report: report,
      startKm,
      endKm,
      staffId: e.staff.staffId,
      companyID: id.companyId
    }
    setLoading2(true)

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
    if (sta === '' && cli === '' || dateFrom.current.value === "" || dateTo.current.value === "") {
      return Swal.fire(
        "Select either a staff or client and time range",
        "",
        "error"
      )

    } else {
      setLoading3(true)

      try {
        const { data } = await get(`/ShiftRosters/get_periodic_shift_rosters?fromDate=${dateFrom.current.value}&toDate=${dateTo.current.value}&staffId=${sta}&clientId=${cli}&companyId=${id.companyId}`, { cacheTimeout: 300000 });
        setSchedule(data);
        setLoading3(false);
        setPeriodicModal(false);
      } catch (error) {
        console.log(error);
        setLoading3(false)
      }
    }
  }



  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title>Shift Roaster</title>
          <meta name="description" content="Shift Roaster" />
        </Helmet>

        {/* Page Content */}
        <div className="content container-fluid">
          <div className="page-header">

            <div className="row">
              <div className="col">
                <h3 className="page-title">Shift Roaster</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link to="/app/employee/allemployees">Employees</Link></li>
                  <li className="breadcrumb-item active">Shift Roaster</li>
                </ul>
              </div>
              <div className="col-auto float-end ml-auto p-4">
                <Link to="/app/employee/add-shift" className="btn btn-info add-btn text-white m-r-5 rounded-2">Add New Roaster</Link>
              </div>
            </div>
          </div>

          <div className="row align-items-center py-2">
            {/* <span className='fw-bold' draggable>Filter Shift Roaster By User</span>
            <br />
            <br /> */}
            <div className="col-md-4">
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
            <div className="col-md-4">
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
                <button onClick={FilterSchedule} className="btn btn-info add-btn text-white rounded-2 m-r-5"
                  disabled={loading1 ? true : false}
                >


                  {loading1 ? <div className="spinner-grow text-light" role="status">
                    <span className="sr-only">Loading...</span>
                  </div> : "Load"}
                </button>

              </div>
            </div>
            {/* <div className="col-auto mt-3">
              <div className="form-group">
                <button onClick={FetchSchedule} className="btn btn-secondary add-btn rounded-2 m-r-5">All Shifts</button>

              </div>
            </div> */}
            <div className="col-auto mt-3">
              <div className="form-group">
                <button className="btn btn-primary add-btn rounded-2 m-r-5">Send Roaster Notification</button>

              </div>
            </div>
            <div className="col-auto mt-3">
              <div className="form-group">
                <button className="btn btn-warning text-white add-btn rounded-2 m-r-5"
                  onClick={() => GetPeriodic()}

                >Get Periodic Shift Roaster</button>

              </div>
            </div>


          </div>


          <div className='row  shadow-sm'>

            <div className="col-md-6 col-lg-12 ">
              <div className=' py-3 d-flex justify-content-between align-items-center'>
                <span className='shadow-sm p-3' style={{ backgroundColor: '#F4F4F4' }} >
                  <FaAngleLeft className='pointer fs-4 text-primary' onClick={handlePrevClick} />
                  <span className='fw-bold text-muted' style={{ fontSize: '12px' }}> {startDate.format('MMMM D')} - {endDate.format('MMMM D')}</span>
                  <FaAngleRight className='pointer fs-4 text-primary' onClick={handleNextClick} />
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
              <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>


                <div className='row g-0'>
                  {daysOfWeek.map((day, index) => (



                    <Droppable droppableId={day.format('YYYY-MM-DD')}
                    >
                      {(provided) => (
                        <div className="col-md-6 col-lg-2 py-2" key={day.format('YYYY-MM-DD')}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          index={index}

                        >
                          <div className='border  d-flex justify-content-center py-2'>
                            <div className={`d-flex flex-column align-items-center gap-0  ${currentDate.format('YYYY-MM-DD HH:mm:ss') === day.format('YYYY-MM-DD HH:mm:ss') ? 'rounded bg-primary px-3 text-white ' : ''}`}>
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
                            className="col-sm-12 text-center border p-2"
                            style={{ height: "65vh", overflow: "auto", overflowX: "hidden" }}

                          >

                            {loading && (
                              <div className="spinner-grow text-secondary" role="status">
                                <span className="sr-only">Loading...</span>
                              </div>
                            )}


                            {activitiesByDay[index].map((activity, activityIndex) => (
                              <Draggable key={activityIndex} draggableId={activity.shiftRosterId.toString()} index={activityIndex}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >


                                    {/* Render the temporary task if it matches the current draggable item */}

                                    <div key={activityIndex}
                                      className='text-white gap-1 pointer rounded-2 d-flex flex-column align-items-start p-2 mt-2'
                                      style={{
                                        fontSize: '10px',
                                        overflow: 'hidden',
                                        backgroundColor:
                                          dayjs(activity.dateFrom).format('HH:mm') <= '20:00'
                                            ? '#1C75BC'
                                            : '#5fa8e8',
                                      }}
                                    >
                                      <div
                                        onClick={() => handleActivityClick(activity)}
                                        className='d-flex flex-column align-items-start' style={{ fontSize: '10px' }}>
                                        <span className='fw-bold' >
                                          {dayjs(activity.dateFrom).format('hh:mm A')} - {dayjs(activity.dateTo).format('hh:mm A')}
                                        </span>
                                        <span><span className='fw-bold text-truncate'>Staff: </span><span className='text-truncate'>{activity.staff.fullName}</span></span>
                                        <span><span className='fw-bold text-truncate'>Client: </span><span className='text-truncate'>{activity.profile.fullName}</span></span>
                                        <span className='text-truncate'><span className='fw-bold'>Task: </span><span className='text-truncate'>{activity.activities}</span></span>
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
                                                to={`/app/employee/edit-shift/${activity?.shiftRosterId}`}
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
                                                    to={`/app/employee/edit-shift/${activity?.shiftRosterId}`}
                                                    className={`text-truncate d-flex 
                              align-items-center
                              justify-content-center px-2 py-1 rounded bg-light pointer`}
                                                    title="Edit"

                                                  >
                                                    <MdOutlineEditCalendar className='fs-6 text-dark' />
                                                  </Link>

                                                )
                                              }
                                            </div>

                                          )
                                      }


                                    </div>

                                  </div>
                                )}


                              </Draggable>
                            ))}
                            {!loading && activitiesByDay[index].length <= 0 && (
                              <div>
                                <span>No Activity</span>
                              </div>
                            )}
                            {provided.placeholder} {/* Include the placeholder element */}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>

              </DragDropContext>

            </div>
          </div>









          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Shift Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedActivity && (
                <>
                  <p><b>Date:</b> {moment(selectedActivity.dateFrom).format('LLL')} - {moment(selectedActivity.dateTo).format('LLL')}</p>
                  <p><b>Time:</b> {dayjs(selectedActivity.dateFrom).format('hh:mm A')} - {dayjs(selectedActivity.dateTo).format('hh:mm A')}</p>
                  <p><b>Staff:</b> {selectedActivity.staff.fullName}</p>
                  <p><b>Client:</b> {selectedActivity.profile.fullName}</p>
                  <p><b>Activities:</b> {selectedActivity.activities}</p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Link to={`/app/employee/edit-shift/${selectedActivity?.shiftRosterId}`} className="btn btn-primary" >Edit Shift</Link>

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
                      Mark Attendance for {selectedActivity.staff.fullName}

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
                        <input className="form-check-input" type="checkbox" defaultValue id="flexCheckChecked" defaultChecked />
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
                    onClick={() => handleConfirmation(selectedActivity)}
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
              <Modal.Title>Add New Shift Roaster</Modal.Title>
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

export default ShiftScheduling;
