/**
 * Form Elemets
 */
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useHttp from '../../../../hooks/useHttp';
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';



const ClientComunitySupport = () => {
    useEffect(() => {
        if ($('.select').length > 0) {
            $('.select').select2({
                minimumResultsForSearch: -1,
                width: '100%'
            });
        }
    });

    const { uid } = useParams()
    const [staffAvail, setStaffAvail] = useState([]);
    const [loading1, setLoading1] = useState(false);
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedPosition, setSelectedPosition] = useState("");
    const [selectedPhone, setSelectedPhone] = useState("");
    const { get, post } = useHttp();
    const [selectedTimeFrom, setSelectedTimeFrom] = useState("");
    const [selectedTimeTo, setSelectedTimeTo] = useState("");


    const PostAvail = async (e) => {
        e.preventDefault()
        if (selectedDay === "" || selectedTimeFrom === "" || selectedPhone === "") {
            return toast.error("Input Fields cannot be empty")
        }

        setLoading1(true)

        const info = {
            profileId: uid,
            communityAssistance: selectedDay,
            transportType: selectedTimeFrom,
            transportAssistance: selectedTimeTo,
            activitiesParticipation: selectedPhone,
            activitiesAssistance: selectedPosition,
        }
        try {

            const { data } = await post(`/CommunitySupports`, info);
            console.log(data)
            if (data.status === 'Success') {
                toast.success(data.message)
            }
            setLoading1(false)
            FetchSchedule()
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
        finally {
            setLoading1(false)
        }
    }


    const [editpro, setEditPro] = useState({});
    const [idSave, setIdSave] = useState('')
    const FetchSchedule = async () => {
        // setLoading2(true)
        try {
            const { data } = await get(`/CommunitySupports/get_all?clientId=${uid}`, { cacheTimeout: 300000 });
            // console.log(data);
            setStaffAvail(data)

            if (data && data.length > 0) {
                const communitySupportId = data[0].communitySupportId;
                setIdSave(communitySupportId);
                const { data: secondData } = await get(`/BehaviourSupports/${communitySupportId}`, { cacheTimeout: 300000 });
                // console.log(secondData);
                setEditPro(secondData);
                // Do something with the second data (e.g., setEditPro(secondData))
            }
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }


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


    const EditAvail = async (e) => {

        e.preventDefault()
        setLoading1(true)

        const info = {
            communitySupportId: idSave,
            profileId: uid,
            communityAssistance: editpro.communityAssistance,
            transportType: editpro.transportType,
            transportAssistance: editpro.transportAssistance,
            activitiesParticipation: editpro.activitiesParticipation,
            activitiesAssistance: editpro.activitiesAssistance,
        }
        try {

            const { data } = await post(`/CommunitySupports/edit/${idSave}`, info);
            //  console.log(data);
            if (data.status === 'Success') {
                toast.success(data.message)
            }
            setLoading1(false)
            FetchSchedule()
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
        finally {
            setLoading1(false)
        }
    }

    const history = useHistory();

    const goBack = () => {
        history.goBack(); // Go back in history
    };

    const goForward = () => {
        history.goForward(); // Go forward in history
    };

    return (
        <div className="page-wrapper">
            <Helmet>
                <title> Community Support Needs</title>
                <meta name="description" content="Community Support Needs" />
            </Helmet>
            <div className="content container-fluid">
                {/* Page Header */}
                <div className="page-header">
                    <div className="row">
                        <div className="col-md-10">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Community Support Needs</li>
                            </ul>
                        </div>
                        <div className="col-md-2 d-none d-md-block">
                            <button className='btn' onClick={goBack}>
                                <FaLongArrowAltLeft className='fs-3' />
                            </button> &nbsp;  <button className='btn' onClick={goForward}>
                                <FaLongArrowAltRight className='fs-3' />
                            </button>
                        </div>
                    </div>
                </div>
                {/* /Page Header */}
                {staffAvail.length === 0 && <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 style={{ fontSize: "15px" }} className="card-title mb-0">Community Support Needs</h4>
                            </div>
                            <div className="card-body">
                                <form className="row">
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Do you need assistance getting around the community? If so, please provide detail</label>
                                            <textarea className="form-control" rows="2" onChange={(e) => setSelectedDay(e.target.value)} cols="20" />
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Do you need assistance to use transport? If so, please provide detail.</label>
                                            <textarea className="form-control" rows="2" onChange={(e) => setSelectedTimeFrom(e.target.value)} cols="20" />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>What type of transport do you mainly use?</label>
                                            <textarea className="form-control" rows="2" onChange={(e) => setSelectedTimeTo(e.target.value)} cols="20" />
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Do you participate in any activities (such as employment, training or community activities)? If yes, please provide detail.</label>
                                            <textarea className="form-control" rows="2" onChange={(e) => setSelectedPhone(e.target.value)} cols="20" />
                                        </div>
                                    </div>



                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Do you need assistance to access these activities? If yes, please provide detail.</label>
                                            <textarea className="form-control" onChange={(e) => setSelectedPosition(e.target.value)} rows="2" cols="20" />
                                        </div>
                                    </div>



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
                </div>}


                {staffAvail.length > 0 && <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 style={{ fontSize: "15px" }} className="card-title mb-0">Community Support Needs</h4>
                            </div>
                            <div className="card-body">
                                <form className="row">
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Do you need assistance getting around the community? If so, please provide detail</label>
                                            <textarea className="form-control" rows="2" name="communityAssistance" value={editpro.communityAssistance || ''} onChange={handleInputChange} cols="20" />
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Do you need assistance to use transport? If so, please provide detail.</label>
                                            <textarea className="form-control" rows="2" name="transportType" value={editpro.transportType || ''} onChange={handleInputChange} cols="20" />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>What type of transport do you mainly use?</label>
                                            <textarea className="form-control" rows="2" name="transportAssistance" value={editpro.transportAssistance || ''} onChange={handleInputChange} cols="20" />
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Do you participate in any activities (such as employment, training or community activities)? If yes, please provide detail.</label>
                                            <textarea className="form-control" rows="2" name="activitiesParticipation" value={editpro.activitiesParticipation || ''} onChange={handleInputChange} cols="20" />
                                        </div>
                                    </div>



                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Do you need assistance to access these activities? If yes, please provide detail.</label>
                                            <textarea className="form-control" name="activitiesAssistance" value={editpro.activitiesAssistance || ''} onChange={handleInputChange} rows="2" cols="20" />
                                        </div>
                                    </div>



                                    <div className="text-start">
                                        <button type="submit" className="btn btn-primary px-2" disabled={loading1 ? true : false} onClick={EditAvail}>
                                            {loading1 ? <div className="spinner-grow text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div> : "Submit"}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>}



            </div>

        </div>
    );
}
export default ClientComunitySupport;