
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import { Avatar_02, Avatar_05, Avatar_11, Avatar_12, Avatar_09, Avatar_10, Avatar_13 } from "../../../Entryfile/imagepath"
import Offcanvas from '../../../Entryfile/offcanvance';
import Addschedule from "../../../_components/modelbox/Addschedule"
import useHttp from '../../../hooks/useHttp';
import { FaAngleLeft, FaAngleRight, FaArrowCircleLeft, FaArrowCircleRight, FaArrowLeft, FaArrowRight, FaFilter, FaPlus, FaSearch, FaSlidersH } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward, IoMdArrowDropleft } from 'react-icons/io';
import { useCompanyContext } from '../../../context';
import dayjs from 'dayjs';
import { Modal } from 'react-bootstrap';
import { GoTrashcan } from 'react-icons/go';
import { MdOutlineEditCalendar, MdLibraryAdd } from 'react-icons/md';
import { MultiSelect } from 'react-multi-select-component';
import { toast } from 'react-toastify';


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
    const clientProfile = JSON.parse(localStorage.getItem('clientProfile'));
    const userProfile = JSON.parse(localStorage.getItem('user'));
    const { get, post } = useHttp();
    const { loading, setLoading } = useCompanyContext();
    const [clients, setClients] = useState([]);
    const [cli, setCli] = useState("");
    const [activities, setActivities] = useState([]);
    const [reason, setReason] = useState();
    const [appoint, setAppoint] = useState("");
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [reasonModal, setReasonModal] = useState(false)
    const [appointModal, setAppointModal] = useState(false)

    const FetchSchedule = async () => {
        setLoading(true)


        try {
            const clientResponse = await get(`/ShiftRosters/get_shifts_by_user?client=${clientProfile.profileId}&staff=`, { cacheTimeout: 300000 });
            const client = clientResponse.data;
            setClients(client.shiftRoster);
            setLoading(false);

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

    const handleNextClick = () => {
        setCurrentDate(currentDate.add(6, 'day'));
    };

    const handlePrevClick = () => {
        setCurrentDate(currentDate.subtract(6, 'day'));
    };
    const handleActivityChange = (selected) => {
        setSelectedActivities(selected);
    };
    const cancelShift = () => {
        setReasonModal(true)
    }

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
        clients.filter((activity) => dayjs(activity.dateFrom).isSame(day, 'day'))
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
            console.log(error);
        }
    }

    const submitActivity = async () => {

        try {
            setLoading(true)
            const { data } = await post(`ShiftRosters/edit_activities?userId=${userProfile.userId}&shiftId=${cli}&activities=${selectedValues}`);
            // console.log(data);
            toast.success(data.message);
            setLoading(false);
            setLgShow(false)

        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };

    const addAppoint = (e) => {
        setAppointModal(true)
        setCli(e)
    }
    const addAppointment = async () => {
        if (appoint === "") {
            return toast.error("Input Fields cannot be empty")
        }
        try {
            setLoading(true)
            const { data } = await post(`ShiftRosters/add_appointment?userId=${userProfile.userId}&shiftId=${cli}&appointment=${appoint}`);
            // console.log(data);
            toast.success(data.message);
            setLoading(false);
            setAppointModal(false)

        } catch (error) {
            console.log(error);
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
                    <meta name="description" content="Login page" />
                </Helmet>
                {/* Page Content */}
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="row">
                            <div className="col">
                                <h3 className="page-title">Shift Roster</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/client/client/Dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item"><Link to="/client/client/Dashboard">Client</Link></li>
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
                                                className={`calendar-date text-muted text-truncate overflow-hidden ${day.tz('Australia/Sydney').isSame(currentDate, 'day') ? 'current-date' : ''}`}
                                                style={{ fontSize: '12px' }}>
                                                {day.tz('Australia/Sydney').format('dddd, MMMM D')}

                                            </span>
                                        </div>



                                        <div className="col-sm-12 text-center border p-2" style={{ height: "50vh", overflow: "auto", overflowX: "hidden", cursor: 'pointer' }}>

                                            {loading &&

                                                <div className="spinner-grow text-secondary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            }

                                            {activitiesByDay[index].map((activity, activityIndex) => (

                                                <div key={activityIndex}

                                                    className='text-white gap-1 pointer rounded-2 d-flex flex-column align-items-start p-2 mt-2'
                                                    style={{ fontSize: '10px', backgroundColor: "#4256D0" }}
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
                                                        <small

                                                            className={`text-truncate d-flex 
                                                            align-items-center
                                                            justify-content-center px-2 py-1 rounded bg-light pointer`}
                                                            onClick={() => editActivity(activity.shiftRosterId)}
                                                            title="Edit"
                                                        >
                                                            <MdOutlineEditCalendar className='fs-6 text-dark' />

                                                        </small>

                                                        <small
                                                            className={`text-truncate d-flex 
                                                            align-items-center
                                                            justify-content-center px-2 py-1 rounded bg-danger pointer`}
                                                            title="Cancel"
                                                            onClick={() => cancelShift()}

                                                        >
                                                            <GoTrashcan className='fs-6' />
                                                        </small>

                                                        <small
                                                            className={`text-truncate d-flex 
                                                            align-items-center
                                                            justify-content-center px-2 py-1 rounded bg-success pointer`}
                                                            title="Add Appointment"
                                                            onClick={() => addAppoint(activity.shiftRosterId)}

                                                        >
                                                            <MdLibraryAdd className='fs-6' />
                                                        </small>

                                                    </div>
                                                </div>
                                            ))}
                                            {!loading && activitiesByDay[index] <= 0 &&

                                                <div>
                                                    <span>No Activity</span>
                                                </div>
                                            }

                                            {/* Modal */}
                                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Activity Details</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    {selectedActivity && (
                                                        <>
                                                            <p><b>Date:</b> {dayjs(selectedActivity.dateFrom).tz('Australia/Sydney').format('YYYY-MM-DD')}</p>
                                                            <p><b>Time:</b> {dayjs(selectedActivity.dateFrom).tz('Australia/Sydney').format('hh:mm A')} - {dayjs(selectedActivity.dateTo).tz('Australia/Sydney').format('hh:mm A')}</p>
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
                                            >
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
                                                    <button className="btn btn-primary">{loading ? <div className="spinner-grow text-light" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div> : "Submit"}</button>
                                                </Modal.Footer>
                                            </Modal>

                                            <Modal show={appointModal} onHide={() => setAppointModal(false)}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Add Appointment</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <div>
                                                        <label htmlFor="">Please Provide Appointment Details</label>
                                                        <textarea rows={3} className="form-control summernote" placeholder="" defaultValue={""} onChange={e => setAppoint(e.target.value)} />
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
