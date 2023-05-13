import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCompanyContext } from "../../context";
import useHttp from "../../hooks/useHttp";
import { Link } from 'react-router-dom';
import { MdCancel } from "react-icons/md";
const ProgressReportDetails = () => {


    const { loading, setLoading } = useCompanyContext();
    const { uid } = useParams()
    const [details, setDetails] = useState({});


    const { get } = useHttp()
    const FetchProgress = async () => {
        setLoading(true)
        try {
            const { data } = await get(`/ProgressNotes/${uid}`, { cacheTimeout: 300000 })
            console.log(data);
            setDetails(data)

        } catch (error) {
            console.log(error);
        }

        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        FetchProgress()
    }, [])




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
                                    <h4 className="card-title mb-0">Progess Note Details</h4>
                                    <Link to={`/app/reports/progress-reports`} className="card-title mb-0 text-danger fs-3 "> <MdCancel /></Link>
                                </div>
                                <div className="card-body">
                                    <form

                                    >
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label className="col-form-label">Report</label>
                                                    <textarea name="" className="form-control" id="" cols="10" rows="4"

                                                        value={details.report}
                                                        readOnly
                                                    />


                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label className="col-form-label">Progress</label>
                                                    <textarea name="" className="form-control" id="" cols="10" rows="4"
                                                        value={details.progress}
                                                        readOnly
                                                    />


                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label className="col-form-label">Follow Up</label>
                                                    <textarea name="" className="form-control" id="" cols="10" rows="4"
                                                        value={details.followUp}
                                                        readOnly
                                                    />


                                                </div>
                                            </div>






                                        </div>


                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>



                </div>
            </div>
        </>
    );
}

export default ProgressReportDetails;