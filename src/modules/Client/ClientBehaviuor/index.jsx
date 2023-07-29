/**
 * Form Elemets
 */
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory } from 'react-router-dom';
import useHttp from '../../../hooks/useHttp';
import { useCompanyContext } from '../../../context';
import "jspdf-autotable";
import { toast } from 'react-toastify';


const ClientBehaviuor = () => {
    useEffect(() => {
        if ($('.select').length > 0) {
            $('.select').select2({
                minimumResultsForSearch: -1,
                width: '100%'
            });
        }
    });

    const navigate = useHistory()
    const [loading1, setLoading1] = useState(false);
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedPosition, setSelectedPosition] = useState("");
    const [selectedPhone, setSelectedPhone] = useState("");
    const { get, post } = useHttp();
    const [selectedTimeFrom, setSelectedTimeFrom] = useState("");
    const [selectedTimeTo, setSelectedTimeTo] = useState("");
    const clientProfile = JSON.parse(localStorage.getItem('clientProfile'))
    


    const PostAvail = async (e) => {
        e.preventDefault()
        if (selectedDay === "" || selectedTimeFrom === "" || selectedPhone === "") {
            return toast.error("Input Fields cannot be empty")
        }
       
        setLoading1(true)

        const info = {
            profileId: clientProfile.profileId,
            question1: selectedDay,
            question2: selectedTimeFrom,
            question3: selectedTimeTo,
            behaviourPlan: selectedPhone,
            //  behaviourPlanFile: selectedPosition,
            riskAssessment: selectedPosition,
            //  riskAssessmentFile: ""
            //  companyID: id.companyId
        }
        try {

            const { data } = await post(`/BehaviourSupports`, info);
            console.log(data)
            if (data.status === 'Success') {
                toast.success(data.message)
                // navigate.push(`/client/app/client-behaviuor-edit/${data.behaviourSupportId}`)
            }
            setLoading1(false)
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
        finally {
            setLoading1(false)
        }
    }



    
    return (
        <div className="page-wrapper">
            <Helmet>
                <title> Behaviour Support Needs</title>
                <meta name="description" content="Behaviour Support Needs" />
            </Helmet>
            <div className="content container-fluid">
                {/* Page Header */}
                <div className="page-header">
                    <div className="row">
                        <div className="col">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/client/app/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Behaviour Support Needs</li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* /Page Header */}
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 style={{ fontSize: "15px" }} className="card-title mb-0">Behaviour Support Needs</h4>
                            </div>
                            <div className="card-body">
                                <form className="row">
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Describe how you would react if someone you lived with did something you found disruptive or upsetting?</label>
                                            <textarea className="form-control" rows="2" onChange={(e) => setSelectedDay(e.target.value)} cols="20" />
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Do you have any behaviours of concern that require specific support? If so, please provide detail</label>
                                            <textarea className="form-control" rows="2" onChange={(e) => setSelectedTimeFrom(e.target.value)} cols="20" />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Do you do anything that others might find disruptive?</label>
                                            <textarea className="form-control" rows="2" onChange={(e) => setSelectedTimeTo(e.target.value)} cols="20" />
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Behaviour Plan</label>
                                            <textarea className="form-control" rows="2" onChange={(e) => setSelectedPhone(e.target.value)} cols="20" />
                                        </div>
                                    </div>

                                    {/* <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Behaviour Plan File</label>
                                             <textarea className="form-control" onChange={(e) => setSelectedPosition(e.target.value)} rows="2" cols="20" />
                                         </div>
                                     </div> */}

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Risk Assessment</label>
                                            <textarea className="form-control" onChange={(e) => setSelectedPosition(e.target.value)} rows="2" cols="20" />
                                        </div>
                                    </div>

                                    {/* <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Risk Assessment File</label>
                                             <textarea className="form-control"  rows="2" cols="20" />
                                         </div>
                                     </div> */}

                                    <div className="text-start">
                                        <button type="submit" className="btn btn-primary px-2" disabled={loading1 ? true : false} onClick={PostAvail}>
                                            {loading1 ? <div className="spinner-grow text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div> : "Submit"}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                
            


            </div>

        </div>
    );
}
export default ClientBehaviuor;