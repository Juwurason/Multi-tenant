import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import logo from '../../../assets/img/logo.png'
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import useHttp from "../../../hooks/useHttp";
import dayjs from "dayjs";
import moment from "moment";
import DataTable from "react-data-table-component";

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

const TimesheetForAll = () => {
    const id = JSON.parse(localStorage.getItem('user'));
    const { dateFrom, dateTo } = useParams();
    const { post, get } = useHttp();
    const [timesheet, setTimesheet] = useState([]);
    const [total, setTotal] = useState({});
    const columns = [
        {
            name: 'Staff Name',
            selector: row => row.staffName

        },
        {
            name: 'Normal Shift Duration',
            selector: row => ""

        },
        {
            name: 'Evening Shift Duration',
            selector: row => ""

        },
        {
            name: 'Saturday Shift Duration',
            selector: row => ""

        },
        {
            name: 'Sunday Shift Duration',
            selector: row => ""

        },
        {
            name: 'Exceptional Shift Duration',
            selector: row => ""

        },
        {
            name: 'Public Holiday',
            selector: row => ""

        },
        {
            name: 'Night Shift',
            selector: row => ""

        },
        {
            name: 'Total Km',
            selector: row => ""

        },
        {
            name: 'Total Duration',
            selector: row => ""

        },

    ]
    const GetTimeshift = async (e) => {
        try {
            const { data } = await get(`/Attendances/generate_all_staff_timesheet?userId=${id.userId}&fromDate=${dateFrom}&toDate=${dateTo}`, { cacheTimeout: 300000 });
            setTimesheet(data?.timesheet?.staffTimeSheet);
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
                <title>{`Staff Attendance Sheet from ${moment(total.fromDate).format('LLL')} to ${moment(total.toDate).format('LLL')}`}</title>
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
                    <h5 className="text-center mt-2">Staff Attendance Sheet from {moment(total.fromDate).format('LLL')} to {moment(total.toDate).format('LLL')}</h5>
                </div>


                <DataTable data={timesheet} columns={columns}

                    responsive



                />

                {/* <div className="pt-3 table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Staff Name</th>
                                <th>Normal Shift Duration</th>
                                <th>Evening Shift Duration</th>
                                <th>Saturday Shift Duration</th>
                                <th>Sunday Shift Duration</th>
                                <th>Exceptional Shift Duration</th>
                                <th>Public Holiday</th>
                                <th>Night Shift</th>
                                <th>Total Km</th>
                                <th>Total Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                timesheet.map((data, index) =>
                                    <tr key={index}>
                                        <th scope="row">{data.staffName}</th>

                                    </tr>

                                )
                            }


                        </tbody>
                    </table>

                </div> */}




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

export default TimesheetForAll;