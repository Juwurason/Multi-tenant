
import React, { Component, useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Offcanvas from '../../Entryfile/offcanvance';
import moment from 'moment';
import Swal from 'sweetalert2';
import useHttp from '../../hooks/useHttp';
import { MdCancel } from 'react-icons/md';
import Editor from '../../MainPage/HR/Message/editor';

const EditStaffAttendance = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const { uid, } = useParams();
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const navigate = useHistory();
    const privateHttp = useHttp();




    const FetchData = async () => {
        setLoading(true);

        try {
            const { data } = await privateHttp.get(`/StaffAttendances/get_attendance_record/${uid}`, { cacheTimeout: 300000 });
            setAttendance(data);
            // Process the attendance data here
            setEditorValue(data.report || "");
            setStartKm(data.startKm || 0);
            setEndKm(data.endKm || 0);
            setLongitude(data.InLongitude || 0);
            setLatitude(data.InLatitude || 0);

        } catch (attendanceError) {
            toast.error("Error Fetching Attendance")
            console.log(attendanceError);
        }
    };

    useEffect(() => {
        FetchData();
    }, []);


    const [startKm, setStartKm] = useState(0);
    const [endKm, setEndKm] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [url, setUrl] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

        if (allowedExtensions.exec(selectedFile.name)) {
            setUrl(selectedFile);
        } else {
            alert('Please upload an image');
        }
    };

    const formData = new FormData();
    formData.append("attendanceId", uid);
    formData.append("StartKm", startKm);
    formData.append("EndKm", endKm);
    formData.append("Report", editorValue);
    formData.append("ClockIn", attendance.clockIn);
    formData.append("ClockOut", attendance.clockOut);
    formData.append("InLongitude", longitude);
    formData.append("InLatitude", latitude);
    formData.append("ImageFile", url);
    formData.append("companyId", user.companyId);
    formData.append("staffId", attendance.staffId);



    const SendReport = async (e) => {
        e.preventDefault()
        setLoading1(true)

        try {
            const { data } = await privateHttp.post(`/StaffAttendances/edit/${uid}?userId=${user.userId}`,
                formData);
            if (data.status === "Success") {
                Swal.fire(
                    '',
                    `${data.message}`,
                    'success'
                )
                setLoading1(false)
                navigate.push(`/app/reports/staff-reports`)
            }
            setLoading1(false)
        } catch (error) {
            toast.error("Error Updating Attendance")

            console.log(error);
            setLoading1(false)

        }
        finally {
            setLoading1(false)
        }
    }

    const [editorValue, setEditorValue] = useState('');
    const handleEditorChange = (value) => {
        setEditorValue(value);
    };

    return (
        <>
            <div className="page-wrapper">
                <Helmet>
                    <title>Edit Staff Report</title>
                    <meta name="description" content="Edit Staff Report" />
                </Helmet>
                {/* Page Content */}
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item"><Link to="/app/reports/staff-reports">Reports</Link></li>
                                    <li className="breadcrumb-item active">Edit Staff Report</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h4 className="card-title mb-0">Edit Report</h4>
                                    <Link to="/app/reports/staff-reports" className="card-title mb-0 text-danger fs-3 "> <MdCancel /></Link>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={SendReport}>
                                        <div className='col-md-4'>

                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="">Clock In</label>
                                                    <input type="text" className="form-control"
                                                        value={moment(attendance.clockIn).format("LLL")} readOnly />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="">Clock Out</label>
                                                    <input type="text" className="form-control"
                                                        value={moment(attendance.clockOut).format("LLL")}
                                                        readOnly />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="">Starting Kilometre (km)</label>
                                                    <input
                                                        type="number"
                                                        value={startKm}
                                                        onChange={(e) => setStartKm(e.target.value)}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="">Ending Kilometre (km)</label>
                                                    <input
                                                        type="number"
                                                        value={endKm}
                                                        onChange={(e) => setEndKm(e.target.value)}
                                                        className="form-control"
                                                    />

                                                </div>
                                            </div>
                                        </div>


                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label htmlFor="">Additional Report <span className='text-success' style={{ fontSize: '10px' }}>This could be reasons why you were late or information you want your admin to be aware of</span></label>

                                                <Editor
                                                    placeholder="Write something..."
                                                    onChange={handleEditorChange}
                                                    value={editorValue}
                                                ></Editor>
                                                <br />
                                                <br />
                                            </div>
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


export default EditStaffAttendance;
