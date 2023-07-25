
import React, { Component, useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Offcanvas from '../../Entryfile/offcanvance';
import moment from 'moment';
import Swal from 'sweetalert2';
import Editor from '../../modules/Admin/Message/editor';
import useHttp from '../../hooks/useHttp';
import axiosInstance from '../../store/axiosInstance';

const AdminClockOutReport = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const adminAttendance = JSON.parse(localStorage.getItem('adminAttendance'));
    const [loading1, setLoading1] = useState(false);
    // const navigate = useHistory();
    const privateHttp = useHttp();
    const { uid } = useParams()


    const [startKm, setStartKm] = useState(0);
    const [endKm, setEndKm] = useState(0);
    const [clockIn, setClockIn] = useState("");
    const [clockOut, setClockOut] = useState("");
    const [report, setReport] = useState("");
    const [url, setUrl] = useState(null)

    const handleReportChange = (value) => {
        setReport(value); // Update the state when the editor content changes
      };
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

        if (allowedExtensions.exec(selectedFile.name)) {
            setUrl(selectedFile);
        } else {
            alert('Please upload an image');
        }
    };

    const SendReport = async (e) => {
        e.preventDefault();
        setLoading1(true);
      
        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
      
              // Create the formData and append the values
              const formData = new FormData();
              formData.append("AdminAttendanceId", uid);
              formData.append("Report", report);
              formData.append("ClockIn", adminAttendance.clockIn);
              formData.append("clockInCheck", adminAttendance.clockInCheck);
              formData.append("InLongitude", longitude);
              formData.append("InLatitude", latitude);
              formData.append("StartKm", startKm);
              formData.append("EndKm", endKm);
              formData.append("AdministratorId", adminAttendance.administrator.administratorId);
              formData.append("CompanyID", user.companyId);
              formData.append("ImageFIle", url);
              
      
              
              // Make the post request
              privateHttp.post(`/AdminAttendances/clock_out/${uid}&userId=${user.userId}`, formData)
                .then((response) => {
                    console.log(response);
                  if (response.data.status === "Success") {
                    toast.success(response.data.message)
                    setLoading1(false);
                    // navigate.push(`/staff/staff/daily-report`)
                  }
                })
                .catch((error) => {
                  // Handle error
                  console.log(error);
                  setLoading1(false);
                  toast.error(error.response.data.message)
                  toast.error(error.response.data.title)
                });
            },
            (error) => {
              // Handle location error
              setLoading1(false);
              toast.error(error.response.data.message)
              toast.error(error.response.data.title)
            }
          );
        } else {
          // Geolocation is not supported by the browser
          setLoading1(false);
          console.log("Geolocation is not supported");
        }
      };
      



    return (
        <>
            <div className="page-wrapper">
                <Helmet>
                    <title>Daily Report</title>
                    <meta name="description" content="Daily Report" />
                </Helmet>
                {/* Page Content */}
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <h3 className="page-title">Admin Report & Clock Out</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item active">Daily Report</li>
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
                                                    <label htmlFor="">Starting Kilometre (km)</label>
                                                    <input type="text" className="form-control" onChange={e => setStartKm(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="">Ending Kilometre (km)</label>
                                                    <input type="text" className="form-control" onChange={e => setEndKm(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>


                                        <div className="form-group">
                                            <label>Report</label>
                                            <Editor
                                                placeholder="Write something..."
                                            onChange={handleReportChange}
                                            value={report}
                                            ></Editor>
                                            <br />
                                            <br />
                                            <br />
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


export default AdminClockOutReport;
