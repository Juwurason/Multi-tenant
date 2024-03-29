
import React, { Component, useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Offcanvas from '../../Entryfile/offcanvance';
import moment from 'moment';
import Swal from 'sweetalert2';
import useHttp from '../../hooks/useHttp';
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";

const EditAttendance = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const { uid, } = useParams();
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const navigate = useHistory();
    const privateHttp = useHttp();

    const history = useHistory();
    const goBack = () => {
        history.goBack(); // Go back in history
    };

    const goForward = () => {
        history.goForward(); // Go forward in history
    };

    const FetchData = async () => {
        setLoading(true);

        try {
            const { data } = await privateHttp.get(`/Attendances/${uid}`, { cacheTimeout: 300000 });
            // console.log(data);
            setAttendance(data);
            // Process the attendance data here
            // setReport(data.report || "");
            // setStartKm(data.startKm || 0);
            // setEndKm(data.endKm || 0);

        } catch (attendanceError) {
            toast.error("Error Fetching Attendance")
            console.log(attendanceError);
        }
    };

    useEffect(() => {
        FetchData();
    }, []);



    const [imageFile, setImageFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

        if (allowedExtensions.exec(selectedFile.name)) {
            setImageFile(selectedFile);
        } else {
            alert('Please upload an image');
        }
    };


    function handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        const newValue = value === "" ? "" : value;
        setAttendance({
            ...attendance,
            [name]: newValue
        });
    }

    const SendReport = async (e) => {
        e.preventDefault()
        setLoading1(true)

        const info = {
            "attendanceId": attendance.attendanceId,
            "report": attendance.report,
            "clockIn": attendance.clockIn,
            // "clockInCheck": true,
            // "clockOutCheck": false,
            // "isSplitted": false,
            "clockOut": attendance.clockOut,
            "duration": attendance.duration,
            "inLongitude": attendance.inLongitude,
            "inLatitude": attendance.inLatitude,
            // "outLongitude": 0,
            // "outLatitude": 0,
            "startKm": attendance.startKm,
            "endKm": attendance.endKm,
            "staffId": attendance.staffId,
            "imageFile": imageFile,
            // "imageURL": attendance.imageURL,
            "companyID": user.companyId
        }


        try {
            const { data } = await privateHttp.post(`/Attendances/edit/${uid}?userId=${user.userId}`,
                info);
            // console.log(data);
            if (data.status === "Success") {
                Swal.fire(
                    '',
                    `${data.message}`,
                    'success'
                )
                setLoading1(false)
                navigate.push(`/app/reports/attendance-reports`)
            }
            setLoading1(false)
        } catch (error) {
            // console.log(error);
            // toast.error("Error Updating Attendance")
            toast.error(error.response?.data?.message)
            toast.error(error.response?.data?.title)

            setLoading1(false)

        }
        finally {
            setLoading1(false)
        }
    }



    return (
        <>
            <div className="page-wrapper">
                <Helmet>
                    <title>Edit Attendance</title>
                    <meta name="description" content="Edit Attendance" />
                </Helmet>
                {/* Page Content */}
                <div className="content container-fluid">
                    {/* Page Header */}
                    {/* <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <h3 className="page-title">Edit Attendance</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item"><Link to="/app/reports/attendance-reports">Attendance</Link></li>
                                    <li className="breadcrumb-item active">Edit Attendance</li>
                                </ul>
                                <div className="col-md-2 d-none d-md-block">
                                    <button className='btn' onClick={goBack}>
                                        <FaLongArrowAltLeft className='fs-3' />
                                    </button> &nbsp;  <button className='btn' onClick={goForward}>
                                        <FaLongArrowAltRight className='fs-3' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="page-header">
                        <div className="row align-items-center">
                            <div className="col">
                                <h3 className="page-title">Edit Attendance</h3>
                               <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item active">Edit Attendance</li>
                                </ul>
                            </div>
                            <div className="col-md-2 d-none d-md-block">
                                <button className='btn' onClick={goBack}>
                                    <FaLongArrowAltLeft className='fs-3' />
                                </button> &nbsp;  <button className='btn' onClick={goForward}>
                                    <FaLongArrowAltRight className='fs-3' />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form onSubmit={SendReport}>
                                        <div className='col-md-4'>

                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="">Clock In</label>
                                                    <input className="form-control datetimepicker" type="datetime-local"
                                                        name="clockIn" value={attendance.clockIn || ''} onChange={handleInputChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="">Clock Out</label>
                                                    <input className="form-control datetimepicker" type="datetime-local"
                                                        name="clockOut" value={attendance.clockOut || ''} onChange={handleInputChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="">Starting Kilometre (km)</label>
                                                    <input
                                                        type="number"
                                                        name="startKm" value={attendance.startKm || ''} onChange={handleInputChange}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="">Ending Kilometre (km)</label>
                                                    <input
                                                        type="number"
                                                        name="endKm" value={attendance.endKm || ''} onChange={handleInputChange}
                                                        className="form-control"
                                                    />

                                                </div>
                                            </div>
                                        </div>


                                        <div className="form-group">
                                            {/* <DefaultEditor value={html} onChange={onChange} /> */}
                                            <label htmlFor="">Additional Report <span className='text-success' style={{ fontSize: '10px' }}>This could be reasons why you were late or information you want your admin to be aware of</span></label>
                                            <textarea
                                                rows={3}
                                                className="form-control summernote"
                                                name="report" value={attendance.report || ''} onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="">Image URL </label>
                                            <input className="form-control" type="file"
                                                accept=".png,.jpg,.jpeg"
                                                maxsize={1024 * 1024 * 2}
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                        <div className="form-group text-center mb-0">
                                            <div className="text-center d-flex gap-2">
                                                <button className="btn btn-info add-btn text-white rounded-2 m-r-5"
                                                    disabled={loading1 ? true : false}
                                                    type='submit'
                                                >

                                                    {loading1 ? <div className="spinner-grow text-light" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div> : "Save"}</button>


                                            </div>
                                        </div>
                                    </form>
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


export default EditAttendance;
