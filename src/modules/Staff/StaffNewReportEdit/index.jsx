
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
import Editor from './editor';

const StaffNewReportEdit = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const staffProfile = JSON.parse(localStorage.getItem('staffProfile'));
    const [loading1, setLoading1] = useState(false);
    const navigate = useHistory();
    const privateHttp = useHttp();


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
              formData.append("Report", report);
              formData.append("ClockIn", clockIn);
              formData.append("ClockOut", clockOut);
              formData.append("InLongitude", longitude);
              formData.append("InLatitude", latitude);
              formData.append("StartKm", startKm);
              formData.append("EndKm", endKm);
              formData.append("StaffId", staffProfile.staffId);
              formData.append("ImageFIle", url);
              formData.append("CompanyId", user.companyId);
      
              // Make the post request
               privateHttp.post(`/StaffAttendances/add_report?userId=${user.userId}`, formData)
                .then((response) => {
                    // console.log(response.data);
                  if (response.data.status === "Success") {
                    Swal.fire("", response.data.message, "success");
                    setLoading1(false);
                    navigate.push(`/staff/staff/daily-report`)
                  }
                })
                .catch((error) => {
                  // Handle error
                  setLoading1(false);
                  console.log(error);
                });
            },
            (error) => {
              // Handle location error
              setLoading1(false);
              console.log(error);
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
                    <title>Edit Report</title>
                    <meta name="description" content="Edit Report" />
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
                                    <li className="breadcrumb-item active">Edit Report</li>
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
                                                    <input className="form-control datetimepicker" onChange={e => setClockIn(e.target.value)} type="datetime-local"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="">Clock Out</label>
                                                    <input className="form-control datetimepicker" onChange={e => setClockOut(e.target.value)} type="datetime-local"
                                                    />
                                                </div>
                                            </div>
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
                                            <label>Day Report</label>
                                            <Editor
                                                placeholder="Write something..."
                                            onChange={handleReportChange}
                                            value={report}
                                            ></Editor>
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


export default StaffNewReportEdit;
