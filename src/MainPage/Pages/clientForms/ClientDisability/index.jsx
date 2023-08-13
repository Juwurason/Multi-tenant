/**
 * Form Elemets
 */
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useParams } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from 'react-toastify';
import { GoSearch, GoTrashcan } from 'react-icons/go';
import dayjs from 'dayjs';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';
import { async } from '@babel/runtime/helpers/regeneratorRuntime';
import { MultiSelect } from 'react-multi-select-component';
import useHttp from '../../../../hooks/useHttp';
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
const options = [
    { label: "Need Mobility Assistance?", value: "Need Mobility Assistance?" },
    { label: "Mobility Independency", value: "Mobility Independency" },

];
const optionsOther = [
    { label: "Need Communication Assistance?", value: "Need Communication Assistance?" },

];


const ClientDisability = () => {
    useEffect(() => {
        if ($('.select').length > 0) {
            $('.select').select2({
                minimumResultsForSearch: -1,
                width: '100%'
            });
        }
    });

    const [selected, setSelected] = useState([]);
    const [staffAvail, setStaffAvail] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [selectedDay, setSelectedDay] = useState("");
    const { get, post } = useHttp();
    const [selectedTimeFrom, setSelectedTimeFrom] = useState("");
    const [selectedTimeTo, setSelectedTimeTo] = useState("");
    const id = JSON.parse(localStorage.getItem('user'))
    const [showModal, setShowModal] = useState(false);
    const { uid } = useParams()

    const selectedValues = selected.map(option => option.label).join(', ');


    const PostAvail = async (e) => {
        if (selectedDay === "" || selectedTimeFrom === "" || selectedTimeTo === "" || selectedValues === "") {
            return toast.error("Input Fields cannot be empty")
        }
        e.preventDefault()
        setLoading1(true)
        const info = {
            profileId: uid,
            mobilityAssistance: true,
            mobilityIndependent: true,
            mobilityDescription: "string",
            hearingIssues: "string",
            hearingDescription: "string",
            visionIssues: "string",
            visionDescription: "string",
            memoryIssues: "string",
            memoryDescription: "string",
            communicationAssistance: true,
            communicationMeans: "string",
            communicationAttachment: "string",
            communicationDescription: "string",
            communicationAttachmentFile: "string"
        }
        try {

            const { data } = await post(`/Disabilities`, info);
            console.log(data)
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


    const FetchSchedule = async () => {
        // setLoading2(true)
        try {
            const { data } = await get(`ClientSchedules/get_client_schedule?clientId=${uid}`, { cacheTimeout: 300000 });
            // console.log(data);
            //  setStaffAvail(data)
            // setLoading2(false);
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
        // finally {
        //   setLoading2(false)
        // }


    };
    useEffect(() => {
        FetchSchedule()
    }, []);


    const [selectedActivities, setSelectedActivities] = useState([]);
    const selectedValue = selectedActivities.map(option => option.label).join(', ');


    const handleActivityChange = (selected) => {
        setSelectedActivities(selected);
    };

    const EditAvail = async (e) => {

        e.preventDefault()
        setLoading2(true)
        const info = {
            clientScheduleId: idSave,
            profileId: uid,
            days: editAvail.days,
            fromTimeOfDay: editAvail.fromTimeOfDay,
            toTimeOfDay: editAvail.toTimeOfDay,
            activities: selectedValue,
            companyID: id.companyId
        }
        try {

            const { data } = await post(`/ClientSchedules/edit/${idSave}?userId=${id.userId}`, info);
            // console.log(data);
            if (data.status === 'Success') {
                toast.success(data.message)
            }
            setLoading2(false)
            setShowModal(false)
            FetchSchedule()
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
        finally {
            setLoading2(false)
        }
    }


    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = staffAvail.filter((item) =>
        item.days.toLowerCase().includes(searchText.toLowerCase())
    );



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
                <title> Disability Support Needs</title>
                <meta name="description" content="Disability Support Needs" />
            </Helmet>
            <div className="content container-fluid">
                {/* Page Header */}
                <div className="page-header">
                    <div className="row">
                        <div className="col-md-10">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Disability Support Needs</li>
                                <li className="breadcrumb-item active">Check if Yes and Uncheck if No</li>
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
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title mb-0">Mobility Related Issues</h4>
                            </div>
                            <div className="card-body">
                                <form className="">
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Need Mobility Assistance?</label>
                                            <MultiSelect
                                                options={options}
                                                value={selectedActivities}
                                                onChange={handleActivityChange}
                                                labelledBy={'Select Issues'}
                                            />
                                        </div>
                                    </div>


                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Mobility Description</label>
                                            <textarea className="form-control" rows="2" cols="10" />
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title mb-0">Hearing Related Issues</h4>
                            </div>
                            <div className="card-body">
                                <form className="">
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Hearing Issues</label>
                                            <select className='form-select' onChange={(e) => setSelectedDay(e.target.value)} required>
                                                <option defaultValue hidden >Select Issues</option>
                                                <option value={"No Issues"}>No Issues</option>
                                                <option value={"Some Issues"}>Some Issues</option>
                                                <option value={"Hearing Impaired"}>Hearing Impaired</option>

                                            </select>
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Hearing Description</label>
                                            <textarea className="form-control" rows="2" cols="10" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title mb-0">Vision Related Issues</h4>
                            </div>
                            <div className="card-body">
                                <form className="">
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Vision Related Issues</label>
                                            <select className='form-select' onChange={(e) => setSelectedDay(e.target.value)} required>
                                                <option defaultValue hidden >Select Issues</option>
                                                <option value={"No Issues"}>No Issues</option>
                                                <option value={"Some Issues"}>Some Issues</option>
                                                <option value={"Hearing Impaired"}>Hearing Impaired</option>

                                            </select>
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Vision Description</label>
                                            <textarea className="form-control" rows="2" cols="10" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title mb-0">Memory Related Issues</h4>
                            </div>
                            <div className="card-body">
                                <form className="">
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Memory Related Issues</label>
                                            <select className='form-select' onChange={(e) => setSelectedDay(e.target.value)} required>
                                                <option defaultValue hidden >Select Issues</option>
                                                <option value={"No Issues"}>No Issues</option>
                                                <option value={"Some Issues"}>Some Issues</option>
                                                <option value={"Hearing Impaired"}>Hearing Impaired</option>

                                            </select>
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Memory Description</label>
                                            <textarea className="form-control" rows="2" cols="10" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title mb-0">Communication Related Issues</h4>
                            </div>
                            <div className="card-body">
                                <form className="">
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Need Communication Assistance?</label>
                                            <MultiSelect
                                                options={optionsOther}
                                                value={selectedActivities}
                                                onChange={handleActivityChange}
                                                labelledBy={'Select Issues'}
                                            />
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Communication Preferences</label>
                                            <select className='form-select' onChange={(e) => setSelectedDay(e.target.value)} required>
                                                <option defaultValue hidden >Select Preferences</option>
                                                <option value={"Verbally"}>Verbally</option>
                                                <option value={"Ausian"}>Ausian</option>
                                                <option value={"Makaton"}>Makaton</option>
                                                <option value={"Combination of Ausian / Makaton"}>Combination of Ausian / Makaton</option>
                                                <option value={"Non-verbal / vocalize"}>Non-verbal / vocalize</option>
                                                <option value={"Point / Gesture"}>Point / Gesture</option>
                                                <option value={"IPad"}>IPad</option>
                                                <option value={"PECS"}>PECS</option>
                                                <option value={"Other"}>Other</option>

                                            </select>
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Communication Description</label>
                                            <textarea className="form-control" rows="2" cols="10" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="text-start">
                            <button type="submit" className="btn btn-primary px-2" disabled={loading1 ? true : false} >
                                {loading1 ? <div className="spinner-grow text-light" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : "Submit"}</button>
                        </div>
                    </div>
                </div>





            </div>

        </div>
    );
}
export default ClientDisability;