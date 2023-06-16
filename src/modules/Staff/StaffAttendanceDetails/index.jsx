
import React, { Component, useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../../index.css";
import Offcanvas from '../../../Entryfile/offcanvance';
import { useCompanyContext } from '../../../context';
import useHttp from '../../../hooks/useHttp';
import Swal from 'sweetalert2';

const AttendanceDetails = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const { uid, pro } = useParams()

    const [details, setDetails] = useState('')
    const [staff, setStaff] = useState('')
    const [kilometer, setKilometer] = useState('')
    const [editpro, setEditPro] = useState({})
    const [companyId, setCompanyId] = useState('')
    const { get, post } = useHttp();
    const { loading, setLoading } = useCompanyContext();
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const navigate = useHistory()


    const FetchSchedule = async () => {
        setLoading(true)
        try {
            const { data } = await get(`/Attendances/edit/${uid}`, { cacheTimeout: 300000 });
            console.log(data);
            setCompanyId(staff.companyID)
            setStaff(staff.staff.fullName);
            setDetails(staff.profile);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false)
        }

        // try {
        //   const editProgress = await get(`/ProgressNotes/${pro}`, { cacheTimeout: 300000 });
        //   const editpro = editProgress;
        //   setEditPro(editpro.data);
        //   setLoading(false)
        // } catch (error) {
        //   console.log(error);
        // }
        // finally {
        //   setLoading(false)
        // }

    };
    useEffect(() => {
        FetchSchedule()
    }, []);

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
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const today = new Date();
    const formattedDate = formatDate(today);


    // Pass `formattedDate` to your endpoint or perform any other actions here

    //   const SaveProgress = async (e) => {
    //     e.preventDefault()
    //     setLoading1(true)
    //     const info = {
    //       progressNoteId: pro,
    //       report: editpro.report,
    //       progress: editpro.progress,
    //       position: "0",
    //       followUp: editpro.followUp,
    //       date: formattedDate,
    //       staff: staff,
    //       startKm: editpro.startKm,
    //       profileId: details.profileId,
    //       companyID: companyId,
    //     }
    //     try {
    //       const saveProgress = await post(`/ProgressNotes/save_progressnote/?userId=${user.userId}&noteid=${pro}`, info);
    //       const savePro = saveProgress.data;
    //       toast.success(savePro.message)
    //       setLoading1(false)
    //     } catch (error) {
    //       console.log(error);
    //     }
    //     finally {
    //       setLoading1(false)
    //     }
    //   }



    //   const CreateProgress = async (e) => {
    //     e.preventDefault()
    //     const info = {
    //       progressNoteId: Number(pro),
    //       report: editpro.report,
    //       progress: editpro.progress,
    //       position: "",
    //       followUp: editpro.followUp,
    //       staff: staff,
    //       startKm: editpro.startKm,
    //       profileId: details.profileId,
    //       companyID: companyId,
    //       date: ""
    //     }
    //     Swal.fire({
    //       html: `<h3>Submitting your progress note will automatically clock you out</h3> <br/> 
    //       <h5>Do you wish to proceed ?<h5/>
    //       `,
    //       icon: 'warning',
    //       showCancelButton: true,
    //       confirmButtonColor: '#1C75BC',
    //       cancelButtonColor: '#777',
    //       confirmButtonText: 'Proceed',
    //       showLoaderOnConfirm: true,
    //     }).then(async (result) => {

    //       if (result.isConfirmed) {
    //         setLoading2(false)
    //         try {
    //           const { data } = await post(`/ProgressNotes/edit/${pro}?userId=${user.userId}`, info);
    //           if (data.status === "Success") {
    //             Swal.fire(
    //               '',
    //               `${data.message}`,
    //               'success'
    //             )
    //             setLoading2(false)
    //             navigate.push(`/staff/staff-report/${uid}`)
    //           }
    //         } catch (error) {
    //           console.log(error);
    //           toast.error(error.response.data.message);
    //           setLoading2(false)
    //         }
    //         finally {
    //           setLoading2(false)
    //         }


    //       }
    //     })


    //   }

    return (
        <>
            <div className="page-wrapper">
                <Helmet>
                    <title>Attendance Details</title>
                    <meta name="description" content="Attendance Details" />
                </Helmet>
                {/* Page Content */}
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <h3 className="page-title">Attendance Details</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/staff/main/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item active"><Link to="/staff/main/attendance">Attendance</Link></li>
                                    <li className="breadcrumb-item active">Attendance Details</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="border-bottom">
                                        <Link to="/staff/main/attendance" className="edit-icon bg-danger text-white" >
                                            <i className="la la-times-circle" />
                                        </Link>
                                        <h3>Attendance Details</h3>
                                    </div> <br />

                                    <ul className="personal-info">
                                        <li>
                                            <div className="title">ClockIn</div>
                                            <div className="text"></div>
                                        </li>
                                        <li>
                                            <div className="title">ClockOut</div>
                                            <div className="text"></div>
                                        </li>
                                        <li>
                                            <div className="title">Duration</div>
                                            <div className="text"></div>
                                        </li>
                                        <li>
                                            <div className="title">Staff</div>
                                            <div className="text"></div>
                                        </li>
                                        <li>
                                            <div className="title">Kilometre</div>
                                            <div className="text"></div>
                                        </li>
                                        <li>
                                            <div className="title">Report</div>
                                            <div className="text"><a className='text-primary' href={`tel:$ber}`}></a></div>
                                        </li>
                                        <li>
                                            <div className="title">ImageUrl</div>
                                            <div className="text"></div>
                                        </li>
                                        <li>
                                            <div className="title">Date Created</div>
                                            <div className="text"></div>
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


export default AttendanceDetails;
