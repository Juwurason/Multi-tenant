
import React, { Component, useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../../index.css";
import Offcanvas from '../../../Entryfile/offcanvance';
import useHttp from '../../../hooks/useHttp';
import Swal from 'sweetalert2';
import moment from 'moment';
import { MdCancel } from 'react-icons/md';
import ReactHtmlParser from 'react-html-parser';


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

const AdminReportDetails = () => {
    const { uid, pro } = useParams()
    const [details, setDetails] = useState('')
    const { get, post } = useHttp();
    const [loading, setLoading] = useState(false);

    const FetchSchedule = async () => {
        setLoading(true)
        try {
            const { data } = await get(`/AdminAttendances/get_attendance/${uid}`, { cacheTimeout: 300000 });
            setDetails(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
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




    return (
        <>
            <div className="page-wrapper">
                <Helmet>
                    <title>Administrator Report Details</title>
                    <meta name="description" content="Attendance Details" />
                </Helmet>
                {/* Page Content */}
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item active"><Link to="/app/reports/administrator-reports">Reports</Link></li>
                                    <li className="breadcrumb-item active">Administrator Report Details</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <Link to="/app/reports/administrator-reports" className="card-title mb-0 text-danger fs-3 "> <MdCancel /></Link>
                                </div>
                                <div className="card-body">


                                    <ul className="personal-info">
                                        <li>
                                            <div className="title">ClockIn</div>
                                            <div className="text">{moment(details.clockIn).format('lll')}</div>
                                        </li>
                                        <li>
                                            <div className="title">ClockOut</div>
                                            <div className="text">{moment(details.clockOut).format('lll')}</div>
                                        </li>
                                        <li>
                                            <div className="title">Duration</div>
                                            <div className="text">{formatDuration(details.duration)}</div>
                                        </li>

                                        <li>
                                            <div className="title">Kilometre</div>
                                            <div className="text">{(details.endKm - details.startKm) || 0} Km</div>
                                        </li>
                                        <li>
                                            <div className="title">Report</div>
                                            <div className="text"> {ReactHtmlParser(details.report)}</div>
                                        </li>
                                        <li>
                                            <div className="title">ImageUrl</div>
                                            <div style={{ width: "300px", height: "200px" }} className="text border"><img src={details.imageFIle} alt="" width={"100%"} /></div>
                                        </li>
                                        <li>
                                            <div className="title">Date Created</div>
                                            <div className="text">{moment(details.dateCreated).format('lll')}</div>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Page Content */}
            </div>
            <Offcanvas />
        </>

    );

}


export default AdminReportDetails;
