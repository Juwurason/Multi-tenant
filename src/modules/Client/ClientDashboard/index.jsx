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
import useHttp from '../../../hooks/useHttp.jsx';
import { MdHourglassTop, MdHourglassBottom, MdPersonOutline } from 'react-icons/md';
import { BsClockHistory } from 'react-icons/bs';
import { RxPencil2 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import { FaRegEdit } from 'react-icons/fa';
import { MdLibraryAdd } from 'react-icons/md';
import { ImCancelCircle } from 'react-icons/im';
import { MultiSelect } from 'react-multi-select-component';
dayjs.extend(isBetween);

const options = [
  { label: "Medication Supervision", value: "Medication Supervision" },
  { label: "Medication administering", value: "Medication administering" },
  { label: "Personal Support", value: "Personal Support" },
  { label: "Domestic Cleaning", value: "Domestic Cleaning" },
  { label: "Transport", value: "Transport" },
  { label: "Dog training", value: "Dog training" },
  { label: "Install phone", value: "Install phone" },
  { label: "Welfare check", value: "Welfare check" },
  { label: "Support Groceries shopping", value: "Support Groceries shopping" },
  { label: "Pick up", value: "Pick up" },
  { label: "Baby sitting", value: "Baby sitting" },
  { label: "Taking to solicitors appointment", value: "Taking to solicitors appointment" },
  { label: "Meal Preparation", value: "Meal Preparation" },
  { label: "Shopping", value: "Shopping" },
  { label: "Groceries Transport", value: "Groceries Transport" },
  { label: "Domestics Social Support", value: "Domestics Social Support" },

];

const ClientDashboard = () => {
  const navigate = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || !user.token) {
      localStorage.clear();
      navigate.push('/')
    }
  }, [localStorage.getItem('user')]);
  dayjs.extend(utc);
  dayjs.extend(timezone);

  // Set the default timezone to Australia/Sydney
  dayjs.tz.setDefault('Australia/Sydney');
  const [roster, setRoster] = useState([]);
  const { loading, setLoading } = useCompanyContext();
  const { get, post } = useHttp();

  let isMounted = true;



  useEffect(() => {
    if (isMounted) {
      FetchStaff();
    }

    return () => {
      isMounted = false;
    };
  }, []);


  const clientProfile = JSON.parse(localStorage.getItem('clientProfile'));
  async function FetchStaff() {
    setLoading(true)
    try {
      const { data } = await get(`/ShiftRosters/get_shifts_by_user?client=${clientProfile.profileId}&staff=`, { cacheTimeout: 300000 });
      const activities = data.shiftRoster;
      setRoster(activities);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }

    finally {
      setLoading(false)
    }
  }

  const [currentDate, setCurrentDate] = useState(dayjs().tz());
  const [editedProfile, setEditedProfile] = useState({});

  const addAppoint = async (e) => {
    setAppointModal(true)
    setCli(e)
    try {
      const { data } = await get(`/ShiftRosters/${e}`, { cacheTimeout: 300000 });
      // console.log(data);
      setEditedProfile(data);
      setLoading(false)
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
      setLoading(false)
    }
  }

  const cancelShift = async (e) => {
    setReasonModal(true)
    setCli(e)
    try {
      const { data } = await get(`/ShiftRosters/${e}`, { cacheTimeout: 300000 });
      // console.log(data);
      setEditedProfile(data);
      setLoading(false)
      FetchSchedule()
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
      setLoading(false)
    }
  }

  const rejectShift = async () => {

    if (editedProfile === "") {
      return toast.error("Input Fields cannot be empty")
    }
    try {
      setLoading(true)
      const response = await get(`/ShiftRosters/client_shift_cancellation?userId=${id.userId}&reasons=${editedProfile.reason}&shiftid=${cli}`);
      // console.log(data);
      // toast.success(data.message);
      setLoading(false);
      setReasonModal(false)
      // setLgShow(false)

    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.message);
      toast.error(error.response.data.title);
    }
    finally {
      setLoading(false);
    }
  }

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
  const daysOfWeek = [
    currentDate.subtract(1, 'day'),
    currentDate,
    currentDate.add(1, 'day'),
    currentDate.add(2, 'day')
  ];

  const activitiesByDay = daysOfWeek.map((day) =>
    roster.filter((activity) =>
      dayjs(activity.dateFrom).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
    )

  );

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


  // const [appoint, setAppoint] = useState("");
  const id = JSON.parse(localStorage.getItem('user'));
  const [showModal, setShowModal] = useState(false);
  const [appointModal, setAppointModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [cli, setCli] = useState("");


  const handleActivityClick = (activitiesByDay) => {
    setSelectedActivity(activitiesByDay);
    setShowModal(true);
  };

  const addAppointment = async () => {
    if (editedProfile === "") {
      return toast.error("Input Fields cannot be empty")
    }
    try {
      setLoading(true)
      const { data } = await post(`ShiftRosters/add_appointment?userId=${id.userId}&shiftId=${cli}&appointment=${editedProfile.appointment}`);
      // console.log(data);
      if (data.status === "Success") {
        toast.success(data.message);
        FetchStaff()
        setLoading(false);
        setAppointModal(false);
      }

    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  };
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [lgShow, setLgShow] = useState(false);
  const [reasonModal, setReasonModal] = useState(false)
  const handleActivityChange = (selected) => {
    setSelectedActivities(selected);
  };
  const selectedValues = selectedActivities.map(option => option.label).join(', ');

  const editActivity = async (e) => {
    setLgShow(true)
    setCli(e)
    try {
      const { data } = await get(`ShiftRosters/${e}`, { cacheTimeout: 300000 });
      const { activities } = data;
      setActivities(activities.split(',').map((activity) => ({ label: activity, value: activity })));
      setSelectedActivities(data.activities.split(',').map((activity) => ({ label: activity, value: activity })));

      setLoading(false)
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
    }
  }

  const submitActivity = async () => {

    try {
      setLoading(true)
      const { data } = await post(`ShiftRosters/edit_activities?userId=${id.userId}&shiftId=${cli}&activities=${selectedValues}`);
      // console.log(data);
      if (data.status === "Success") {
        toast.success(data.message);
        FetchStaff()
        setLoading(false);
        setLgShow(false)
      }


    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>

        {/* <StaffHeader />
         <StaffSidebar /> */}
        <div className="page-wrapper">
          <Helmet>
            <title>Dashboard - Promax Client Dashboard</title>
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
                          <span style={{ fontSize: '12px' }}>{`${dayjs(daysOfWeek[0]).format('dddd, MMMM D, YYYY')}`}</span>
                          <span style={{ fontSize: '12px' }} className='text-white bg-dark rounded px-2'>{activitiesByDay[0][0]?.status === "string" ? "Active" : activitiesByDay[0][0]?.status}</span>
                        </div>
                      </div>
                      <div className="card-body  d-flex flex-column gap-1 justify-content-start align-items-start">

                        <span className=' d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdPersonOutline /> Staff: </span><span className='text-truncate'>{activitiesByDay[0][0]?.staff?.firstName}</span></span>
                        <span className='d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdHourglassTop className='text-success' /> Start Time: </span><span className='text-truncate'>{activitiesByDay[0].length > 0 ? dayjs(activitiesByDay[0][0]?.dateFrom).format('hh:mm A') : '--'}</span></span>
                        <span className='d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdHourglassBottom className='text-danger' /> End Time: </span><span className='text-truncate'>{activitiesByDay[0].length > 0 ? dayjs(activitiesByDay[0][0]?.dateTo).format('hh:mm A') : '--'}</span></span>
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
                          <span style={{ fontSize: '12px' }}> {`${dayjs(daysOfWeek[1]).format('dddd, MMMM D, YYYY')}`}</span>
                          <span style={{ fontSize: '12px' }} className='text-white bg-warning rounded px-2'>{activitiesByDay[1][0]?.status}</span>
                        </div>
                      </div>

                      <div className="card-body d-flex flex-column gap-1 justify-content-start align-items-start">

                        <span className=' d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdPersonOutline /> Staff: </span><span className='text-truncate'>{activitiesByDay[1][0]?.staff?.fullName}</span></span>
                        <span className='d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdHourglassTop className='text-success' /> Start Time: </span><span className='text-truncate'>  {activitiesByDay[1].length > 0 ? dayjs(activitiesByDay[1][0]?.dateFrom).format('hh:mm A') : '--'}</span></span>
                        <span className='d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdHourglassBottom className='text-danger' /> End Time: </span><span className='text-truncate'>  {activitiesByDay[1].length > 0 ? dayjs(activitiesByDay[1][0]?.dateTo).format('hh:mm A') : '--'}</span></span>
                      </div>
                      <div className="card-footer text-body-secondary bg-light text-dark">
                        <RxPencil2 /> &nbsp; Appointment
                      </div>
                      <div className='px-5 py-4'>
                        <span>{activitiesByDay[1][0]?.appointment ? activitiesByDay[1][0]?.appointment : <span className='text-muted'>No Appointment</span>}</span>
                      </div>
                      <div className="card-footer text-body-secondary bg-secondary text-white">
                        <BsClockHistory /> &nbsp; Activities
                      </div>

                      {/* <div className='px-5 py-4'>
                        <span>{activitiesByDay[1][0]?.activities}</span> <br /> <br />
                        {activitiesByDay[1].length > 0 ? (
                          
                          <div>
                            <button
                            className='btn btn-primary'
                            onClick={() => addAppoint(activitiesByDay[1][0]?.shiftRosterId)}
                            disabled={
                              (dayjs(activitiesByDay[1][0]?.dateTo)).format('YYYY-MM-DD HH:mm:ss')
                              <
                              dayjs().tz().format('YYYY-MM-DD HH:mm:ss')}
                          >
                            Add Appointment
                          </button>

                          </div>
                        ) : (
                          <span>No Shift Today</span>
                        )}
                      </div> */}
                      <div className='px-5 py-4'>
                        <span>{activitiesByDay[1][0]?.activities}</span>
                        <br /><br />
                        {activitiesByDay[1].length > 0 ? (
                          dayjs(activitiesByDay[1][0].dateTo).format('YYYY-MM-DD HH:mm:ss') >
                            dayjs().tz().format('YYYY-MM-DD HH:mm:ss') ? (
                            <div className='d-flex gap-2 justify-content-center'>

                              <button

                                //   className={`text-truncate d-flex align-items-center 
                                // justify-content-center px-2 py-1 rounded border-0 bg-light pointer`}
                                className='btn btn-light'
                                onClick={() => editActivity(activitiesByDay[1][0]?.shiftRosterId)}
                                title="Edit activities"
                              >
                                <FaRegEdit className='fs-6 text-dark' />

                              </button>

                              <button
                                className='btn btn-primary'
                                onClick={() => addAppoint(activitiesByDay[1][0]?.shiftRosterId)}
                                title="Add Appointment"
                              >
                                <MdLibraryAdd className='fs-6 text-white' />
                              </button>

                              <button
                                className='btn btn-danger'
                                onClick={() => cancelShift(activitiesByDay[1][0]?.shiftRosterId)}
                                title="Cancel shift"
                              >
                                <ImCancelCircle className='fs-6 text-white' />
                              </button>


                            </div>
                          ) : null
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
                          <span style={{ fontSize: '12px' }}>{dayjs(daysOfWeek[2]).format('dddd, MMMM D, YYYY')}</span>
                          <span style={{ fontSize: '12px' }} className='text-white bg-primary rounded px-2'>{activitiesByDay[2][0]?.status}</span>
                        </div>
                      </div>
                      <div className="card-body  d-flex flex-column gap-1 justify-content-start align-items-start">

                        <span className=' d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdPersonOutline /> Staff: </span><span className='text-truncate'>{activitiesByDay[2][0]?.staff?.firstName}</span></span>
                        <span className='d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdHourglassTop className='text-success' /> Start Time: </span><span className='text-truncate'>{activitiesByDay[2].length > 0 ? dayjs(activitiesByDay[2][0]?.dateFrom).format('hh:mm A') : '--'}</span></span>
                        <span className='d-flex justify-content-between w-100'><span className='fw-bold text-truncate'><MdHourglassBottom className='text-danger' /> End Time: </span><span className='text-truncate'>{activitiesByDay[2].length > 0 ? dayjs(activitiesByDay[2][0]?.dateTo).format('hh:mm A') : '--'}</span></span>
                      </div>
                      <div style={{ backgroundColor: "#5374A5" }} className="card-footer text-white pointer" onClick={() => handleActivityClick(activitiesByDay[2])}>
                        View Details

                      </div>
                    </div>
                  </div>

                </div>

              </div>



            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Activity Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedActivity && (
                  <>
                    <p><b>Date:</b> {dayjs(daysOfWeek[2]).format('dddd, MMMM D, YYYY')}</p>
                    <p><b>Time:</b> {activitiesByDay[2]?.length > 0 ? dayjs(activitiesByDay[2][0]?.dateFrom).format('hh:mm A') : '--'} - {activitiesByDay[2].length > 0 ? dayjs(activitiesByDay[2][0]?.dateTo).format('hh:mm A') : '--'}</p>
                    <p><b>Staff:</b> {activitiesByDay[2][0]?.staff?.fullName}</p>
                    <p><b>Status:</b> {activitiesByDay[2][0]?.status}</p>
                    <p><b>Description:</b> {activitiesByDay[2][0]?.activities}</p>
                  </>
                )}
              </Modal.Body>
              <Modal.Footer>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </Modal.Footer>
            </Modal>

            <Modal show={appointModal} onHide={() => setAppointModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Add Appointment</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <label htmlFor="">Please Provide Appointment Details</label>
                  <textarea rows={3} className="form-control summernote" placeholder="" defaultValue={""}
                    name='appointment' value={editedProfile.appointment || ""} onChange={handleInputChange}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button className="btn btn-primary" onClick={addAppointment}>{loading ? <div className="spinner-grow text-light" role="status">
                  <span className="sr-only">Loading...</span>
                </div> : "Submit"}</button>
              </Modal.Footer>
            </Modal>

            <Modal
              size="lg"
              show={lgShow}
              onHide={() => setLgShow(false)}
              backdrop="static"
              keyboard={false}
              aria-labelledby="example-modal-sizes-title-lg"
              centered>
              <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                  Edit Activities
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <label className="col-form-label fw-bold text-danger">Add or Remove From Activities</label>
                <div className="form-group">
                  <label className="col-form-label fw-bold">Activities</label>

                  <MultiSelect
                    options={options.concat(activities)}
                    value={selectedActivities}
                    onChange={handleActivityChange}
                    labelledBy={'Select Activities'}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button className="btn btn-info add-btn text-white rounded" onClick={submitActivity}>
                  {loading ? <div className="spinner-grow text-light" role="status">
                    <span className="sr-only">Loading...</span>
                  </div> : "Submit"}
                </button>
              </Modal.Footer>
            </Modal>

            <Modal show={reasonModal} onHide={() => setReasonModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Request to Cancel Shift</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <label htmlFor="">Please provide reasons for cancelling shift</label>
                  <textarea rows={3} className="form-control summernote" placeholder="Add Reason for Cancel Shift..."
                    name='reason' value={editedProfile.reason || ""} onChange={handleInputChange} />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button className="btn btn-primary" onClick={rejectShift}>{loading ? <div className="spinner-grow text-light" role="status">
                  <span className="sr-only">Loading...</span>
                </div> : "Submit"}</button>
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

export default withRouter(ClientDashboard);
