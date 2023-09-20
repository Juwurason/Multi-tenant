
import React, { Component, useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../../index.css";
import Offcanvas from '../../../Entryfile/offcanvance';
import { useCompanyContext } from '../../../context';
import moment from 'moment';
import useHttp from '../../../hooks/useHttp';
import Swal from 'sweetalert2';

const AddReport = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const { uid, } = useParams();
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(false);
    const [editpro, setEditPro] = useState({});
    const [loading1, setLoading1] = useState(false);
    const navigate = useHistory();
    const privateHttp = useHttp();



    const FetchData = async () => {
        setLoading(true);
        try {
            const { data } = await privateHttp.get(`/ShiftRosters/${uid}`, { cacheTimeout: 300000 });
            const attendId = data.attendId;

            try {
                const {data}= await privateHttp.get(`/Attendances/${attendId}`, { cacheTimeout: 300000 });
                // console.log(data);
                setAttendance(data);
                setEditPro(data)
                // Process the attendance data here
            } catch (error) {
                toast.error(error.response.data.message)
             toast.error(error.response.data.title)
            }

        } catch (error) {
            toast.error(error.response.data.message)
             toast.error(error.response.data.title)
             setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        FetchData();
    }, []);


    const [startKm, setStartKm] = useState(0);
    const [endKm, setEndKm] = useState(0);
    const [report, setReport] = useState("");
    const [url, setUrl] = useState(null)

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

        if (allowedExtensions.exec(selectedFile.name)) {
            setUrl(selectedFile);
        } else {
            alert('Please upload an image');
        }
    };

    function handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        const newValue = value === "" ? "" : value;
        setEditPro({
          ...editpro,
          [name]: newValue
        });
      }

    const formData = new FormData();
    formData.append("StartKm", editpro.startKm);
    formData.append("EndKm", editpro.endKm);
    formData.append("Report", report);
    formData.append("ImageFile", url);

    const SendReport = async (e) => {
        e.preventDefault()
        setLoading1(true)

        try {
            const { data } = await privateHttp.post(`/Attendances/add_report/${uid}?userId=${user.userId}&attendanceId=${attendance.attendanceId}`,
                formData);
            if (data.status === "Success") {
                Swal.fire(
                    '',
                    `${data.message}`,
                    'success'
                )
                setLoading1(false)
                navigate.push(`/staff/staff/attendance`)
            }
            setLoading1(false)
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message)
             toast.error(error.response.data.title)
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
                    <title>Add A Report</title>
                    <meta name="description" content="Add A Report" />
                </Helmet>
                {/* Page Content */}
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <h3 className="page-title">Add A Report</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/staff/staff/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item active">Add A Report</li>
                                </ul>
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
                                                    <input type="text"
                                                        name="startKm" value={editpro.startKm || ''} onChange={handleInputChange}
                                                        className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="">Ending Kilometre (km)</label>
                                                    <input type="text"
                                                        name="endKm" value={editpro.endKm || ''} onChange={handleInputChange}
                                                        className="form-control" />
                                                </div>
                                            </div>
                                        </div>


                                        <div className="form-group">
                                            {/* <DefaultEditor value={html} onChange={onChange} /> */}
                                            <label htmlFor="">Additional Report <span className='text-success' style={{ fontSize: '10px' }}>This could be reasons why you were late or information you want your admin to be aware of</span></label>
                                            <textarea rows={3} className="form-control summernote"
                                                name="report" value={report} onChange={e => setReport(e.target.value)} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor=""> Upload an Image related to your shift</label>
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


export default AddReport;
