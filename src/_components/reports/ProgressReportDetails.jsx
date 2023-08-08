import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCompanyContext } from "../../context";
import useHttp from "../../hooks/useHttp";
import { Link } from 'react-router-dom';
import { MdCancel } from "react-icons/md";
import './report.css';

const ProgressReportDetails = () => {
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const { uid } = useParams();
    const [details, setDetails] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedDetails, setEditedDetails] = useState({});
    const id = JSON.parse(localStorage.getItem('user'));
    const claims = JSON.parse(localStorage.getItem('claims'));
  const hasRequiredClaims = (claimType) => {
    return claims.some(claim => claim.value === claimType);
  };

    const { get, post } = useHttp();

    const fetchProgress = async () => {
        setLoading(true);
        try {
            const { data } = await get(`/ProgressNotes/${uid}`, { cacheTimeout: 300000 });
            // console.log(data);
            setDetails(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgress();
    }, []);

    const handlePrint = () => {
        setLoading2(true);
        setTimeout(() => {
            const url = `/staff-progress/${uid}`;
            window.open(url, '_blank');
            setLoading2(false);
        }, 2000);
    };

    const toggleEditing = () => {
        setIsEditing(prevEditing => !prevEditing);
    };

    const handleEdit = () => {
        setEditedDetails(details);
        toggleEditing();
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const today = new Date();
    const formattedDate = formatDate(today);

     const navigate = useHistory();
    const handleSave = async () => {
        const info = {
    
            progressNoteId: uid,
            report: editedDetails.report,
            progress: editedDetails.progress,
            position: editedDetails.position,
            followUp: editedDetails.followUp,
            staff: editedDetails.staff,
            staffId: editedDetails.staffId,
            date: formattedDate,
            startKm: editedDetails.startKm,
            endKm: editedDetails.endKm,
            profileId: editedDetails.profile.profileId,
            companyID: editedDetails.companyID,
            IsCompleted: editedDetails.isCompleted
          }
      
        try {
            setLoading1(true)
            const {data} = await post(`/ProgressNotes/edit/${uid}?userId=${id.userId}`, info);
            if (data.status === "Success") {
                toast.success(data.message)
                setLoading1(false);
                navigate.push(`/app/reports/progress-reports`)
            }

            // toast.success(savePro.message)
            setLoading1(false)
            toggleEditing();

        } catch (error) {
            console.log(error);
            // toast.error("Error Updating Progress Note")
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
            toggleEditing();

        }
        finally {
            setLoading1(false)
            toggleEditing();

        }
    };


    return (
        <>
            <div className="page-wrapper">
                <Helmet>
                    <title>Progress Notes Details</title>
                    <meta name="description" content="" />
                </Helmet>
                <div className="content container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h4 className="card-title mb-0">
                                        {
                                            isEditing ? `Editing Progress Note by ${details.staff}` : `Progress Note Details by ${details.staff}`
                                        }

                                    </h4>
                                    <Link to={`/app/reports/progress-reports`} className="card-title mb-0 text-danger fs-3 ">
                                        <MdCancel />
                                    </Link>
                                </div>
                                <div className="card-body">
                                    <form id="print-content">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label className="col-form-label">Report</label>
                                                    {isEditing ? (
                                                        <textarea
                                                            cols="10" rows="5"
                                                            className="form-control"
                                                            value={editedDetails.report || ""}
                                                            onChange={e =>
                                                                setEditedDetails({ ...editedDetails, report: e.target.value })
                                                            }
                                                        />
                                                    ) : (
                                                        <textarea
                                                            cols="10" rows="5"
                                                            className="form-control"
                                                            value={details.report}
                                                            readOnly
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label className="col-form-label">Progress</label>
                                                    {isEditing ? (
                                                        <textarea
                                                            cols="10" rows="5"
                                                            className="form-control"
                                                            value={editedDetails.progress || ""}
                                                            onChange={e =>
                                                                setEditedDetails({ ...editedDetails, progress: e.target.value })
                                                            }
                                                        />
                                                    ) : (
                                                        <textarea
                                                            cols="10" rows="5"
                                                            className="form-control"
                                                            value={details.progress}
                                                            readOnly
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label className="col-form-label">Follow Up</label>
                                                    {isEditing ? (
                                                        <textarea
                                                            cols="10" rows="5"
                                                            className="form-control"
                                                            value={editedDetails.followUp || ""}
                                                            onChange={e =>
                                                                setEditedDetails({ ...editedDetails, followUp: e.target.value })
                                                            }
                                                        />
                                                    ) : (
                                                        <textarea
                                                            cols="10" rows="5"
                                                            className="form-control"
                                                            value={details.followUp}
                                                            readOnly
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="d-flex gap-1 justify-content-end">
                                        {isEditing ? (
                                            <button className="add-btn btn btn-primary rounded-2 text-white" onClick={handleSave}>
                                                {
                                                    loading1 ? <div className="spinner-grow text-white" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div> :
                                                        "Save"
                                                }
                                            </button>
                                        ) : (
                                            <>
                                                {id.role === "CompanyAdmin" || hasRequiredClaims("Edit Progress Report") ? <button className="add-btn btn btn-secondary rounded-2 text-white" onClick={handleEdit}>
                                                    Edit
                                                </button> : "" }



                                                {id.role === "CompanyAdmin" || hasRequiredClaims("Print Progress Report") ?<button
                                                    type='button'
                                                    onClick={handlePrint}
                                                    className="btn btn-primary add-btn text-white rounded-2 m-r-5"
                                                    disabled={loading2 ? true : false}
                                                >
                                                    {loading2 ? (
                                                        <>
                                                            <span className="spinner-border text-white spinner-border-sm me-2" role="status" aria-hidden="true" />
                                                            Please wait...
                                                        </>
                                                    ) : (
                                                        "Print"
                                                    )}


                                                </button>: "" }


                                            </>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProgressReportDetails;
