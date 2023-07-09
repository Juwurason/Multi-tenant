/**
 * Form Elemets
 */
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import useHttp from '../../../hooks/useHttp';
import { useCompanyContext } from '../../../context';


const ClientHealth = () => {
    useEffect(() => {
        if ($('.select').length > 0) {
            $('.select').select2({
                minimumResultsForSearch: -1,
                width: '100%'
            });
        }
    });

    const navigate = useHistory()
    const [staffAva, setStaffAva] = useState("");
    const [loading1, setLoading1] = useState(false);
    const [selectedDay, setSelectedDay] = useState("");
    const { get, post } = useHttp();
    const [selectedTimeFrom, setSelectedTimeFrom] = useState("");
    const [selectedTimeTo, setSelectedTimeTo] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const id = JSON.parse(localStorage.getItem('user'))
    const clientProfile = JSON.parse(localStorage.getItem('clientProfile'))

    const PostAvail = async (e) => {
        if (selectedDay === "" || selectedTimeFrom === "" || selectedTimeTo === "") {
            return toast.error("Input Fields cannot be empty")
        }
        e.preventDefault()
        setLoading1(true)
       
        const info = {
            profileId: clientProfile.profileId,
            healthIssues: selectedDay,
            supportDetails: staffAva,
            requireMedication: selectedTimeFrom,
            support: selectedTime,
            healthPlan: selectedTimeTo,
            //  documentation: "",
            //  documentationFile: "",
      
        }
        try {

            const { data } = await post(`/HealthSupports/get_all?clientId=${id.userId}`, info);
             console.log(data)
            if (data.status === 'Success') {
                toast.success(data.message)
                navigate.push(`/client/app/client-edit-health/${data.healthSupportId}`)
            }
            setLoading1(false)
           
        } catch (error) {
            //  console.log(error);
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
                <title> Client Health Support Needs</title>
                <meta name="description" content="Client Health Support Needs" />
            </Helmet>
            <div className="content container-fluid">
                {/* Page Header */}
                <div className="page-header">
                    <div className="row">
                        <div className="col">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/client/app/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Health Support Needs</li>
                                <li className="breadcrumb-item active">Check if Yes and Uncheck if No</li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* /Page Header */}
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title mb-0">Health Support Needs</h4>
                            </div>
                            <div className="card-body">
                                <form className="row">
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Describe any ongoing health issues you have, including mental health issues.</label>
                                            <textarea className="form-control" onChange={(e) => setSelectedDay(e.target.value)} rows="2" cols="20" />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Is additional support  for these issues? If so, please provide detail</label>
                                            <textarea className="form-control" rows="2" cols="20" onChange={(e) => setStaffAva(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Medication Required?</label>
                                            <select className='form-select' onChange={(e) => setSelectedTimeFrom(e.target.value)}>
                                                <option defaultValue hidden>Select...</option>
                                                <option value={"true"}>Yes</option>
                                                <option value={"false"}>No</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>How Often do you require medication?</label>
                                            <select className='form-select' onChange={(e) => setSelectedTimeTo(e.target.value)}>
                                                <option defaultValue hidden>Please Select</option>
                                                <option value={"Prompt Required"}>Prompt Required</option>
                                                <option value={"Assitance Required"}>Assitance Required</option>
                                                <option value={"Administration Required"}>Administrati Required</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Provide details of your medication and treatment plan</label>
                                            <textarea className="form-control" rows="2" cols="20" onChange={(e) => setSelectedTime(e.target.value)} />
                                        </div>
                                    </div>


                                </form>
                                <div className="text-start">
                                    <button type="submit" className="btn btn-primary px-2" disabled={loading1 ? true : false}
                                     onClick={PostAvail}
                                    >
                                        {loading1 ? <div className="spinner-grow text-light" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div> : "Save"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

          

            </div>

        </div>
    );
}
export default ClientHealth;