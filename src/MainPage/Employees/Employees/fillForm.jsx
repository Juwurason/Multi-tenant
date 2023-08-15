
import React, { Component, useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import Swal from 'sweetalert2';
import useHttp from '../../../hooks/useHttp';
import Offcanvas from '../../../Entryfile/offcanvance';
import Editor from '../../../modules/Staff/StaffNewReport/editor';
import { fetchUser } from '../../../store/slices/UserSlice';
import { useDispatch, useSelector } from 'react-redux';

const FillForm = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const { uid, } = useParams();
    const [formDetails, setFormDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [report, setReport] = useState("");
    const [reportName, setReportName] = useState("");
    const navigate = useHistory();
    const privateHttp = useHttp();

    const id = JSON.parse(localStorage.getItem('user'));
    const dispatch = useDispatch();

    // Fetch user data and update the state
    useEffect(() => {
        dispatch(fetchUser(id.companyId));
    }, [dispatch]);

    // Access the entire state
    const users = useSelector((state) => state.user.data);

    const FetchData = async () => {
        setLoading(true);

        try {
            const { data } = await privateHttp.get(`/Templates/template_details/${uid}`, { cacheTimeout: 300000 });
            setReportName(data.templateName);
            setFormDetails(data)
            setReport(data.content)

        } catch (error) {
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
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



    const [staffId, setStaffId] = useState(0);
    // console.log(staffId);
    const SendReport = async (e) => {
        e.preventDefault()
        setLoading1(true)

        const info = {
            templateId: formDetails.templateId,
            templateName: formDetails.templateName,
            content: formDetails.content,
            companyId: user.companyId
        }


        try { 
            const { data } = await privateHttp.post(`/Templates/fiil_user_form?id=${staffId}&userId=${user.userId}`,
                info);
            console.log(data);
            // if (data.status === "Success") {
            //     Swal.fire(
            //         '',
            //         `${data.message}`,
            //         'success'
            //     )
            //     setLoading1(false)
            //     // navigate.push(`/app/reports/attendance-reports`)
            // }
            setLoading1(false)
        } catch (error) {
            console.log(error);
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
                    <title>Fill Form</title>
                    <meta name="description" content="Fill Form" />
                </Helmet>
                {/* Page Content */}
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <h3 className="page-title">Fill Form</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                    {/* <li className="breadcrumb-item"><Link to="/app/reports/attendance-reports">Attendance</Link></li> */}
                                    <li className="breadcrumb-item active">Fill Form</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form >
                                        <div className='col-md-4'>

                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="">Template Name</label>
                                                    <input
                                                        type="text"
                                                        name="startKm" value={reportName
                                                        }
                                                        className="form-control"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor=""> User</label>
                                                    <div className='form-control d-flex justify-content-center align-items-center'>
                                                        <select className="form-select py-2 border-0 bg-transparent" onChange={e => setStaffId(e.target.value)}>
                                                
                                                            <option defaultValue hidden>
                                                                --Select a User--
                                                            </option>
                                                            {
                                                                users.map((user, index) =>
                                                                    <option value={user.id} key={index}>
                                                                        {user.fullName}
                                                                    </option>
                                                                )
                                                            }
                                                        </select>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>


                                        <div className="form-group">
                                            {/* <DefaultEditor value={html} onChange={onChange} /> */}
                                            <label htmlFor="">Content </label>
                                            {/* <textarea
                                                rows={3}
                                                className="form-control summernote"
                                                name="report" value={attendance.report || ''} onChange={handleInputChange}
                                            /> */}
                                            <Editor
                                                placeholder="Write something..."
                                                // onChange={handleReportChange}
                                                value={report}
                                            ></Editor>
                                            <br />
                                            <br />
                                            <br />
                                        </div>


                                        <div className="form-group text-center mb-0">
                                            <div className="text-center d-flex gap-2">
                                                <button className="btn btn-info add-btn text-white rounded-2 m-r-5"
                                                    disabled={loading1 ? true : false}
                                                    onClick={SendReport}
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


export default FillForm;
