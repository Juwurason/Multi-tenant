
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import Offcanvas from '../../../../Entryfile/offcanvance';
import useHttp from '../../../../hooks/useHttp';
import { FaAngleLeft, FaAngleRight, FaExclamationTriangle, FaPlus, } from 'react-icons/fa';
import dayjs from 'dayjs';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { GoTrashcan } from 'react-icons/go';
import { MdDoneOutline, MdOutlineCancel, MdOutlineEditCalendar, MdOutlineRefresh, MdThumbUpOffAlt } from 'react-icons/md';
import moment from 'moment';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useHistory } from 'react-router-dom';
import { fetchRoaster, filterRoaster } from '../../../../store/slices/shiftRoasterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff } from '../../../../store/slices/StaffSlice';
import { fetchClient } from '../../../../store/slices/ClientSlice';
import axiosInstance from '../../../../store/axiosInstance';
import Display from './display';
import Form from './form';



const ShiftScheduling = () => {
    dayjs.extend(utc);
    dayjs.extend(timezone);

    // Set the default timezone to Australia/Sydney
    dayjs.tz.setDefault('Australia/Sydney');
    //Declaring Variables
    const dispatch = useDispatch();
    const id = JSON.parse(localStorage.getItem('user'));
    const user = JSON.parse(localStorage.getItem('user'));
    const claims = JSON.parse(localStorage.getItem('claims'));
    const hasRequiredClaims = (claimType) => {
        return claims.some(claim => claim.value === claimType);
    };

    // Fetch staff data and update the state
    useEffect(() => {
        dispatch(fetchRoaster(id.companyId));
        dispatch(fetchStaff(id.companyId));
        dispatch(fetchClient(id.companyId));
    }, [dispatch, id.companyId]);

    // Access the entire state
    const loading = useSelector((state) => state.roaster.isLoading);
    const schedule = useSelector((state) => state.roaster.data);
    const staff = useSelector((state) => state.staff.data);
    const clients = useSelector((state) => state.client.data);


    // useEffect(() => {
    //   const now = new Date(); // Current date and time
    //   const options = { timeZone: 'Australia/Sydney' };

    //   // Format the current date and time in the 'Australia/Sydney' timezone
    //   const nowInAustraliaTime = now.toLocaleString('en-US', options);
    //   console.log(nowInAustraliaTime);
    // }, [])

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
    const [reasonModal, setReasonModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [periodicModal, setPeriodicModal] = useState(false);
    const dateFrom = useRef(null);
    const dateTo = useRef(null);

    const [reason, setReason] = useState("");





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
        else if (activityDateTo < nowInAustraliaTime || activity.attendance === false) {
            return 'Absent'
        }
        else if (activity.status === "Pending") {
            return 'Pending'
        }
        else {
            return 'Active';
        }
    }
    // function getActivityStatus(activity) {
    //   const now = new Date(); // Current date and time
    //   const options = { timeZone: 'Australia/Sydney' };

    //   // Format the current date and time in the 'Australia/Sydney' timezone
    //   const nowInAustraliaTime = now.toLocaleString('en-US', options);

    //   if (new Date(activity.dateFrom) > nowInAustraliaTime) {
    //     return 'Upcoming';
    //   } else if (new Date(activity.dateTo) < nowInAustraliaTime || activity.attendance === true) {
    //     return 'Present';
    //   } else if (new Date(activity.dateTo) < nowInAustraliaTime || activity.attendance === false) {
    //     return 'Absent';
    //   } else if (activity.status === 'Pending') {
    //     return 'Pending';
    //   } else {
    //     return 'Active';
    //   }
    // }


    //To view details of a shift roaster
    const handleActivityClick = (activity) => {
        // console.log(activity);
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
                    const data = await get(`/ShiftRosters/cancel_shift?userId=${id.userId}&shiftId=${e.shiftRosterId}`,
                    )
                    dispatch(fetchRoaster(id.companyId));
                    // if (data.status === 'Success') {
                    //   toast.success(data.message);
                    // } else {
                    //   toast.error(data.message);
                    // }


                } catch (error) {
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
    const reAssign = (activity) => {
        setSelectedActivity(activity);
        setPeriodicModal(true);
    }
    const cancelClientShift = (activity) => {
        setSelectedActivity(activity);
        setReasonModal(true);
    }


    const handleConfirmation = async (e) => {


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
                dispatch(fetchRoaster(id.companyId));
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

    const handleReassign = async (e) => {

        setLoading3(true);
        try {
            const { data } = await get(`/ShiftRosters/reassign_staff?shiftId=${e}&staffId=${sta}&userId=${id.userId}`)
            dispatch(fetchRoaster(id.companyId));
            if (data.status === "Success") {
                Swal.fire(
                    '',
                    `${data.message}`,
                    'success'
                )
                setLoading3(false)
                setPeriodicModal(false);
            }
            setLoading3(false)
        } catch (error) {
            toast.error(error.response?.data?.message);
            setLoading3(false)

        }
        finally {
            setLoading3(false)
            setPeriodicModal(false);
        }

    }

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const cancelShift = async (e) => {
        // setLoading(true)
        if (reason.trim() === "") {
            return toast.error("Please Provide A Reason")
        }
        try {

            const { data } = await axiosInstance.get(`/ShiftRosters/cancel_client_shift?shiftId=${e}&userId=${id.userId}&cancellationdate=${reason}`)
            if (data.status === "Success") {
                toast.success(data.message)
                setReason("");
                setReasonModal(false)
                dispatch(fetchRoaster(id.companyId));
            }

        } catch (error) {
            setReasonModal(false)

            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
        finally {
            // setLoading(false)
            setReasonModal(false)
        }
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
                                {id.role === "CompanyAdmin" ? <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="">Dashboard</Link></li>
                                    <li className="breadcrumb-item"><Link to="">Employees</Link></li>
                                    <li className="breadcrumb-item active">Shift Roster</li>
                                </ul> : ""}
                            </div>
                            {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Add Shift Roster") ? <div className="col-auto float-end ml-auto p-4">
                                <Link to="/app/employee/add-shift" className="btn btn-info add-btn text-white m-r-5 rounded-2">Add New Roster</Link>
                            </div> : ""}
                        </div>
                    </div>
                    <Form
                        setCli={setCli} setSta={setSta} staff={staff} clients={clients} dateFrom={dateFrom}
                        dateTo={dateTo} GetPeriodic={GetPeriodic} loading={loading} SendRosterNotice={SendRosterNotice} loading3={loading3} />


                    <Display
                        handlePrevClick={handlePrevClick} handleNextClick={handleNextClick} startDate={startDate} endDate={endDate} daysOfWeek={daysOfWeek} currentDate={currentDate}
                        activitiesByDay={activitiesByDay} handleActivityClick={handleActivityClick} getActivityStatus={getActivityStatus} user={user} markAttendance={markAttendance} hasRequiredClaims={hasRequiredClaims}
                        handleDelete={handleDelete} reAssign={reAssign} handleCancelShift={handleCancelShift} cancelClientShift={cancelClientShift} loading={loading}
                    />

                    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Shift Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedActivity && (
                                <>
                                    <p><b>Status:</b> <span style={{ fontSize: "10px" }} className={`px-3 py-1 rounded fw-bold text-white ${selectedActivity.status === "Pending" ? "bg-warning" : selectedActivity.status === "Cancelled" ? "bg-danger" : "bg-primary"}`}>{selectedActivity.status}</span></p>
                                    <p><b>Date:</b> {moment(selectedActivity.dateFrom).format('LLL')} - {moment(selectedActivity.dateTo).format('LLL')}</p>
                                    <p><b>Time:</b> {dayjs(selectedActivity.dateFrom).format('hh:mm A')} - {dayjs(selectedActivity.dateTo).format('hh:mm A')}</p>
                                    <p><b>Staff:</b> {selectedActivity.staff?.fullName}</p>
                                    <p><b>Client(s):</b> {selectedActivity.clients}</p>
                                    <p><b>Activities:</b> {selectedActivity?.activities}</p>
                                </>
                            )}
                        </Modal.Body>

                        {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Edit Shift Roster") ? <Modal.Footer>
                            <Link to={`/app/employee/edit-shift/${selectedActivity?.shiftRosterId}`} className="btn btn-primary" >Edit Shift</Link>

                        </Modal.Footer> : ""}
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
                                                    <label className="col-form-label">Start Km</label>

                                                    <input className="form-control" type="text"
                                                        value={startKm}
                                                        placeholder='Start Km' onChange={(e) => setStartKm(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label className="col-form-label">End Km</label>

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

                        onHide={() => setPeriodicModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Re-Assign New Staff</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedActivity && <div className="row">
                                <div className="col-md-12">
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

                            </div>}
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="ml-4 text-white add-btn rounded btn btn-info"
                                onClick={() => handleReassign(selectedActivity.shiftRosterId)}
                            >
                                {loading3 ? <div className="spinner-grow text-light" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : "Submit"}
                            </button>
                        </Modal.Footer>
                    </Modal>

                    {/* Cancel Client Shift Modal Here */}

                    <Modal show={reasonModal} onHide={() => setReasonModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Cancel Client Shift</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedActivity && <div className="form-group">
                                <label className="col-form-label">Select Date</label>

                                <input className="form-control" type="date"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)} />
                            </div>}
                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                onClick={() => cancelShift(selectedActivity.shiftRosterId)}
                                className="btn btn-primary add-btn rounded">Submit</button>
                        </Modal.Footer>
                    </Modal>


                </div>

            </div>

            <Offcanvas />
        </>
    );

}

export default ShiftScheduling;
