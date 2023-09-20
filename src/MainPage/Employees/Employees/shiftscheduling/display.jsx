import dayjs from "dayjs";
import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { GoTrashcan } from "react-icons/go";
import { MdDoneOutline, MdOutlineCancel, MdOutlineEditCalendar, MdOutlineRefresh, MdThumbUpOffAlt } from "react-icons/md";
import { Link } from "react-router-dom";

const Display = ({ handlePrevClick, handleNextClick, startDate, endDate, daysOfWeek, currentDate,
    activitiesByDay, handleActivityClick, getActivityStatus, user, markAttendance, hasRequiredClaims, handleDelete,
    reAssign, handleCancelShift, cancelClientShift, loading
}) => {
    return (

        <div className='row'>

            <div className="col-md-6  col-lg-12 col-xl-12">
                <div className='mt-4 p-3 d-flex justify-content-between flex-wrap align-items-center'>
                    <span className='' >
                        <button onClick={() => handlePrevClick(startDate, endDate)} className='btn btn-primary btn-sm shadow'>
                            <FaAngleLeft className='pointer fs-4 text-white' />

                        </button>
                        <span className='fw-bold px-2' style={{ fontSize: '15px' }}> {startDate.format('MMM D')} - {endDate.format('MMM D')}</span>
                        <button onClick={() => handleNextClick(startDate, endDate)} className='btn btn-primary btn-sm shadow' >
                            <FaAngleRight className='pointer fs-4 text-white' />

                        </button>
                    </span>

                    {
                        loading ?
                            <div className="text-center d-flex flex-column align-items-center gap-2 ">
                                <div className="spinner-border text-info" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <span>Loading Activities</span>
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


                        <div className="col-md-6 col-lg-2 col-xl-2 py-2" key={day.format('YYYY-MM-DD')}


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



                                                <span style={{ width: "10px", height: "10px" }}
                                                    title={activity.attendance === true ? "Attended Shift" : "Unattended Shift"}
                                                    className={`${activity.attendance === true ? "bg-success" : activity.attendance === false ? "bg-danger" :
                                                        activity.status === "Pending" ? "" : activity.status === "Cancelled" ? "" : "bg-danger"
                                                        } rounded-circle`}></span>
                                            </div>
                                            <span><span className='fw-bold text-truncate'>Staff: </span><span className='text-truncate'>{activity.staff?.fullName}</span></span>
                                            <span><span className='fw-bold text-truncate'>Client(s): </span><span className='text-truncate'>{activity.clients}</span></span>
                                            <span className='text-truncate'><span className='fw-bold'>Task: </span><span className='text-truncate'>{activity?.activities}</span></span>
                                        </div>

                                        {
                                            getActivityStatus(activity) === 'Active' ?
                                                (
                                                    <div className='d-flex gap-2'>


                                                        {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Edit Shift Roster") ? <Link
                                                            to={`/app/employee/edit-shift/${activity?.shiftRosterId}`}
                                                            className={`text-truncate d-flex 
              align-items-center
              justify-content-center px-2 py-1 rounded bg-light pointer`}
                                                            title="Edit"

                                                        >
                                                            <MdOutlineEditCalendar className='fs-6 text-dark' />
                                                        </Link> : ""}
                                                        {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Mark Attendances") ? <small
                                                            className={`text-truncate d-flex 
               align-items-center
               justify-content-center px-2 py-1 rounded bg-warning pointer`}

                                                            onClick={() => markAttendance(activity)}
                                                            title="Mark attendance for staff"
                                                        >
                                                            <MdDoneOutline className='fs-6' />
                                                        </small> : ""}
                                                    </div>
                                                )
                                                :
                                                (

                                                    <div className='d-flex gap-2' >


                                                        {
                                                            getActivityStatus(activity) === 'Upcoming' && activity.status !== 'Pending' && activity.status !== 'Cancelled' && (
                                                                (user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Edit Shift Roster")) && (
                                                                    <div className='d-flex gap-2'>

                                                                        {(user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Delete Shift Roster")) && (

                                                                            <small
                                                                                className={`text-truncate d-flex 
align-items-center
justify-content-center px-2 py-1 rounded bg-danger pointer`}

                                                                                onClick={() => handleDelete(activity?.shiftRosterId)}
                                                                                title="Delete"
                                                                            >
                                                                                <GoTrashcan className='fs-6' />
                                                                            </small>



                                                                        )}

                                                                        <Link
                                                                            to={`/app/employee/edit-shift/${activity?.shiftRosterId}`}
                                                                            className={`text-truncate d-flex 
                                                                        align-items-center
                                                                        justify-content-center px-2 py-1 rounded bg-light pointer`}
                                                                            title="Edit"

                                                                        >
                                                                            <MdOutlineEditCalendar className='fs-6 text-dark' />
                                                                        </Link>
                                                                    </div>
                                                                )

                                                            )
                                                        }


                                                        {
                                                            getActivityStatus(activity) === 'Absent' && activity.status !== 'Pending' && (
                                                                (user.role === 'CompanyAdmin' || user.role === "Administrator" || hasRequiredClaims('Mark Attendances')) && (
                                                                    <small
                                                                        className={`text-truncate d-flex align-items-center justify-content-center px-2 py-1 rounded bg-warning pointer`}
                                                                        onClick={() => markAttendance(activity)}
                                                                        title="Mark attendance for staff"
                                                                    >
                                                                        <MdDoneOutline className="fs-6" />
                                                                    </small>
                                                                )
                                                            )
                                                        }




                                                        {
                                                            getActivityStatus(activity) === 'Upcoming' && activity.status === 'Pending' &&

                                                            (<small
                                                                className={`text-truncate d-flex 
                     align-items-center
                     justify-content-center px-2 py-1 rounded bg-secondary pointer`}

                                                                onClick={() => handleCancelShift(activity)}
                                                                title="Approve Request"
                                                            >
                                                                <MdThumbUpOffAlt className='fs-6' />
                                                            </small>
                                                            )



                                                        }
                                                        {
                                                            getActivityStatus(activity) === 'Absent' && activity.status === 'Pending' &&

                                                            (<small
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
                                                        {
                                                            getActivityStatus(activity) === 'Present' && activity.status === 'Pending' &&

                                                            (<small
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
                                                        {
                                                            getActivityStatus(activity) === 'Absent' && activity.status === 'Cancelled' &&

                                                            (<small
                                                                className={`text-truncate d-flex 
                     align-items-center
                     justify-content-center px-2 py-1 rounded bg-primary pointer`}

                                                                onClick={() => reAssign(activity)}
                                                                title="Re-assign Shift"
                                                            >
                                                                <MdOutlineRefresh className='fs-6' />
                                                            </small>
                                                            )



                                                        }
                                                        {
                                                            getActivityStatus(activity) === 'Present' && activity.status === 'Cancelled' &&

                                                            (<small
                                                                className={`text-truncate d-flex 
                     align-items-center
                     justify-content-center px-2 py-1 rounded bg-primary pointer`}

                                                                onClick={() => reAssign(activity)}
                                                                title="Re-assign Shift"
                                                            >
                                                                <MdOutlineRefresh className='fs-6' />
                                                            </small>
                                                            )



                                                        }
                                                        {
                                                            getActivityStatus(activity) === 'Upcoming' && activity.status === 'Cancelled' &&


                                                            (<small
                                                                className={`text-truncate d-flex 
                     align-items-center
                     justify-content-center px-2 py-1 rounded bg-primary pointer`}

                                                                onClick={() => reAssign(activity)}
                                                                title="Re-assign Shift"
                                                            >
                                                                <MdOutlineRefresh className='fs-6' />
                                                            </small>
                                                            )



                                                        }
                                                        {
                                                            getActivityStatus(activity) === 'Upcoming' &&


                                                            (<small
                                                                className={`text-truncate d-flex 
           align-items-center
           justify-content-center px-2 py-1 rounded bg-white pointer`}

                                                                onClick={() => cancelClientShift(activity)}
                                                                title="Cancel Client Shift"
                                                            >
                                                                <MdOutlineCancel className='fs-6 text-danger' />
                                                            </small>
                                                            )



                                                        }
                                                        {
                                                            getActivityStatus(activity) === 'Absent' &&


                                                            (<small
                                                                className={`text-truncate d-flex 
           align-items-center
           justify-content-center px-2 py-1 rounded bg-white pointer`}

                                                                onClick={() => cancelClientShift(activity)}
                                                                title="Cancel Client Shift"
                                                            >
                                                                <MdOutlineCancel className='fs-6 text-danger' />
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
    );
}

export default Display;