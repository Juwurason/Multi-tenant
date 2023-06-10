import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import logo from '../../../assets/img/logo.png'
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import useHttp from "../../../hooks/useHttp";
import dayjs from "dayjs";
import moment from "moment";

const formatDate = (dateString) => {
    const date = dayjs(dateString);

    // Format 1: Monday
    const formattedDay = date.format('dddd');
    // Format 1: 06/15/2023
    const formattedDate = date.format('MM/DD/YYYY');

    // Format 2: 08:40 PM
    const formattedTime = date.format('hh:mm A');

    return { formattedDay, formattedDate, formattedTime };
};


function formatDuration(duration) {
    if (duration) {
        const durationInMilliseconds = duration / 10000; // Convert ticks to milliseconds

        const durationInMinutes = Math.floor(durationInMilliseconds / (1000 * 60));
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;

        return `${hours} Hrs ${minutes} min`;
    }

    return "0 Hrs 0 min"; // Return an empty string if duration is not available
}
const todayDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const today = new Date();
const formattedTodayDate = todayDate(today);

const Timesheet = () => {
    const id = JSON.parse(localStorage.getItem('user'));
    const { sta, dateFrom, dateTo } = useParams();
    const { post, get } = useHttp();
    const [timesheet, setTimesheet] = useState([]);
    const [total, setTotal] = useState({});

    const GetTimeshift = async (e) => {
        try {
            const { data } = await get(`/Attendances/generate_staff_timesheet?userId=${id.userId}&staffid=${sta}&fromDate=${dateFrom}&toDate=${dateTo}`, { cacheTimeout: 300000 });
            setTimesheet(data?.timesheet?.attendanceSplits);
            setTotal(data?.timesheet)
            if (data.status === "Success") {
                toast.success(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        GetTimeshift();
    }, []);

    const handlePrint = () => {
        setTimeout(() => {
            window.print();

        }, 2000);
    };



    return (
        <div className="page-wrapper">
            <Helmet>
                <title>Time Sheet Page</title>
                <meta name="description" content="" />
            </Helmet>
            <div className="d-flex justify-content-end pt-3 px-4">
                <button
                    onClick={handlePrint}
                    className="btn btn-primary shadow add-btn rounded">Print Attendance</button>
            </div>
            <div className="content container-fluid" id="print-content">
                <div className="w-100">
                    <div className="mx-auto d-flex justify-content-center text-center">
                        <img src={logo} alt="" />

                    </div>
                    <h5 className="text-center mt-2">{total.staffName} Attendance Sheet from {moment(total.fromDate).format('LLL')} to {moment(total.toDate).format('LLL')}</h5>
                </div>
                <div className="pt-3 ">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Day</th>
                                <th scope="col">Clock In</th>
                                <th scope="col">Clock Out</th>
                                <th scope="col">Duration</th>
                                <th scope="col">Km</th>
                                <th scope="col">Client</th>
                                <th scope="col">Shift</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                timesheet.map((data, index) =>
                                    <tr key={index}>
                                        <th scope="row">{formatDate(data.clockIn).formattedDate}</th>
                                        <td>{formatDate(data.clockIn).formattedDay}</td>
                                        <td>{formatDate(data.clockIn).formattedTime}</td>
                                        <td>{formatDate(data.clockOut).formattedTime}</td>
                                        <td>{formatDuration(data.normalDuration)}</td>
                                        <td>{data.totalKm}</td>
                                        <td>{data.shiftRoster?.profile?.fullName}</td>
                                        <td>{data.shift}</td>
                                    </tr>
                                )
                            }
                            <tr>
                                <th ></th>
                                <td className="fw-bold">Total</td>
                                <td></td>
                                <td></td>
                                <td className="fw-bold"> {formatDuration(total.totalDuration)}</td>
                                <td className="fw-bold"> {total.totalKm}</td>
                                <td></td>
                                <td></td>
                            </tr>

                        </tbody>
                    </table>

                </div>
                <div className="d-flex flex-column gap-1 mb-4">
                    <span><span className="fw-bold">Total Duration for Normal Shift : </span>
                        <span> {formatDuration(total.normalDuration)}</span>
                    </span>
                    <span><span className="fw-bold">Total Duration for Evening Shift : </span>
                        <span> {formatDuration(total.eveningDuration)}</span>
                    </span>
                    <span><span className="fw-bold">Total Duration for Exceptional Shift :</span>
                        <span> {formatDuration(total.exceptionalDuration)}</span>
                    </span>
                    <span><span className="fw-bold">Total Duration for Saturday Shift :</span>
                        <span> {formatDuration(total.satDuration)}</span>
                    </span>
                    <span><span className="fw-bold">Total Duration for Sunday Shift :</span>
                        <span> {formatDuration(total.sunDuration)}</span>
                    </span>
                    <span><span className="fw-bold">Total Duration for Public Holidays Shift :</span>
                        <span> {formatDuration(total.phDuration)}</span>
                    </span>
                    <span><span className="fw-bold">Total Night Shift : </span>
                        <span> {total.nightShift}</span>
                    </span>
                </div>


                <div className="d-flex justify-content-evenly mt-5">
                    <div className="d-flex flex-column align-items-center gap-1">
                        <span className="fw-bold text-uppercase">{total.staffName}</span>
                        <small className="fw-bold">NAME OF STAFF</small>
                    </div>
                    <div className="d-flex flex-column align-items-center gap-1">
                        <span>{formattedTodayDate}</span>
                        <small className="fw-bold">Date</small>
                    </div>
                </div>
                <hr />
                <div className="d-flex justify-content-evenly mt-5">
                    <div className="d-flex flex-column align-items-center gap-1 signature-line">
                        <div className="border"></div>
                        <small className="fw-bold"> Approved By</small>
                    </div>
                    <div className="d-flex flex-column align-items-center gap-1 signature-line">
                        <small className="fw-bold">Payroll Officer and Date</small>
                    </div>
                </div>
                <hr />

            </div>
        </div>
    );
}

export default Timesheet;