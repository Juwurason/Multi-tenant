
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import Offcanvas from '../../../Entryfile/offcanvance';
import useHttp from '../../../hooks/useHttp';
import { FaAngleLeft, FaAngleRight, FaRegEdit } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { useCompanyContext } from '../../../context';
import dayjs from 'dayjs';
import { Modal } from 'react-bootstrap';
import { GoTrashcan } from 'react-icons/go';
import { MdLibraryAdd } from 'react-icons/md';
import { MultiSelect } from 'react-multi-select-component';
import { toast } from 'react-toastify';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.locale('en-au');
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

const ClientRoster = () => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault('Australia/Sydney');

    const clientProfile = JSON.parse(localStorage.getItem('clientProfile'));
    const id = JSON.parse(localStorage.getItem('user'));
    const { get, post } = useHttp();
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [cli, setCli] = useState("");
    const [activities, setActivities] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [reasonModal, setReasonModal] = useState(false)
    const [appointModal, setAppointModal] = useState(false)

    const FetchSchedule = async () => {
        setLoading(true)


        try {
            const { data } = await get(`/ShiftRosters/get_shifts_by_user?client=${clientProfile.profileId}&staff=`, { cacheTimeout: 300000 });
            setClients(data.shiftRoster);
            setLoading(false);

        } catch (error) {
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
        finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        FetchSchedule()
    }, []);



    useEffect(() => {
        if ($('.select').length > 0) {
            $('.select').select2({
                minimumResultsForSearch: -1,
                width: '100%'
            });
        }
    });

    // Get the current date
    const [currentDate, setCurrentDate] = useState(dayjs().tz());

    const handleNextClick = () => {
        setCurrentDate(currentDate.add(6, 'day'));
    };

    const handlePrevClick = () => {
        setCurrentDate(currentDate.subtract(6, 'day'));
    };
    const handleActivityChange = (selected) => {
        setSelectedActivities(selected);
    };



    const selectedValues = selectedActivities.map(option => option.label).join(', ');

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
        clients.filter((activity) => dayjs(activity.dateFrom).format('YYYY-MM-DD') === day.format('YYYY-MM-DD'))
    );


    const [showModal, setShowModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [lgShow, setLgShow] = useState(false);

    const handleActivityClick = (activity) => {
        setSelectedActivity(activity);
        setShowModal(true);
    };

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
            toast.success(data.message);
            setLoading(false);
            setLgShow(false)

        } catch (error) {
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
        finally {
            setLoading(false);
        }
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

    const cancelShift = async (e) => {
        setReasonModal(true)
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

    const addAppointment = async () => {
        if (editedProfile === "") {
            return toast.error("Input Fields cannot be empty")
        }
        try {
            setLoading(true)
            const { data } = await post(`ShiftRosters/add_appointment?userId=${id.userId}&shiftId=${cli}&appointment=${editedProfile.appointment}`);
            // console.log(data);
            toast.success(data.message);
            setLoading(false);
            setAppointModal(false);

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
            {/* Page Wrapper */}
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
                                    <li className="breadcrumb-item"><Link to="/client/app/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item"><Link to="/client/app/dashboard">Client</Link></li>
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

                        <div className="col-md-8 col-lg-12">
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
                                                    className={`fw-bold fs-4`}
                                                >
                                                    {/* {day.format('dddd, MMMM D')} */}
                                                    {day.format('D')}

                                                </span>
                                                <span style={{ fontSize: '10px' }} className='mb-2'>
                                                    {day.locale('en').format('ddd')}
                                                </span>
                                            </div>
                                        </div>



                                        <div className="col-sm-12 text-center roster border p-2"
                                            style={{ height: "65vh", overflow: "auto", overflowX: "hidden" }}>

                                            {loading &&

                                                <div className="spinner-grow text-secondary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            }

                                            {activitiesByDay[index].map((activity, activityIndex) => (

                                                <div key={activityIndex}

                                                    className='text-white gap-1 pointer rounded-2 d-flex flex-column align-items-start p-2 mt-2'
                                                    // style={{ fontSize: '10px', backgroundColor: "#4256D0" }}
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
                                                        <span className='fw-bold' >
                                                            {dayjs(activity.dateFrom).format('hh:mm A')} - {dayjs(activity.dateTo).format('hh:mm A')}
                                                        </span>
                                                        <span><span className='fw-bold text-truncate'>Staff: </span><span className='text-truncate'>{activity.staff.fullName}</span></span>
                                                        <span><span className='fw-bold text-truncate'>Client: </span><span className='text-truncate'>{activity.profile.fullName}</span></span>
                                                        <span className='text-truncate'><span className='fw-bold'>Task: </span><span className='text-truncate'>{activity.activities}</span></span>
                                                    </div>
                                                    <div className='d-flex gap-2'>
                                                        <button

                                                            className={`text-truncate d-flex 
                                                            align-items-center
                                                            justify-content-center px-2 py-1 rounded border-0 bg-light pointer`}
                                                            disabled={
                                                                (dayjs(activity.dateTo)).format('YYYY-MM-DD HH:mm:ss')
                                                                <
                                                                dayjs().tz().format('YYYY-MM-DD HH:mm:ss')}
                                                            onClick={() => editActivity(activity.shiftRosterId)}
                                                            title="Edit"
                                                        >
                                                            <FaRegEdit className='fs-6 text-dark' />

                                                        </button>

                                                        <button
                                                            className={`text-truncate d-flex 
                                                            align-items-center
                                                            justify-content-center px-2 py-1 rounded border-0 bg-danger pointer`}
                                                            disabled={
                                                                (dayjs(activity.dateTo)).format('YYYY-MM-DD HH:mm:ss')
                                                                <
                                                                dayjs().tz().format('YYYY-MM-DD HH:mm:ss')}
                                                            title="Cancel"
                                                            onClick={() => cancelShift(activity.shiftRosterId)}

                                                        >
                                                            <ImCancelCircle className='fs-6 text-white' />
                                                        </button>

                                                        <button
                                                            className={`text-truncate d-flex 
                                                            align-items-center
                                                            justify-content-center px-2 py-1 rounded border-0 bg-success pointer`}
                                                            title="Add Appointment"
                                                            disabled={
                                                                (dayjs(activity.dateTo)).format('YYYY-MM-DD HH:mm:ss')
                                                                <
                                                                dayjs().tz().format('YYYY-MM-DD HH:mm:ss')}
                                                            onClick={() => addAppoint(activity.shiftRosterId)}

                                                        >
                                                            <MdLibraryAdd className='fs-6 text-white' />
                                                        </button>

                                                    </div>
                                                </div>
                                            ))}
                                            {!loading && activitiesByDay[index] <= 0 &&

                                                <div>
                                                    <span>No Activity</span>
                                                </div>
                                            }

                                            {/* Modal */}
                                            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Activity Details</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    {selectedActivity && (
                                                        <>
                                                            <p><b>Date:</b> {dayjs(selectedActivity.dateFrom).tz('Australia/Sydney').format('YYYY-MM-DD')}</p>
                                                            <p><b>Time:</b> {dayjs(selectedActivity.dateFrom).tz('Australia/Sydney').format('hh:mm A')} - {dayjs(selectedActivity.dateTo).tz('Australia/Sydney').format('hh:mm A')}</p>
                                                            <p><b>Status:</b> {selectedActivity.status}</p>
                                                            <p><b>Description:</b> {selectedActivity.activities}</p>
                                                        </>
                                                    )}
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
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

                                            <Modal show={appointModal} onHide={() => setAppointModal(false)} centered>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Add Appointment</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <div>
                                                        <label htmlFor="">Please Provide Appointment Details</label>
                                                        <textarea rows={3} className="form-control summernote" placeholder="Add Appointment..."
                                                            // onChange={e => setAppoint(e.target.value)}
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


export default ClientRoster;
