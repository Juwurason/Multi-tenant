/**
 * Form Elemets
 */
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useParams } from 'react-router-dom';
import "jspdf-autotable";
import { toast } from 'react-toastify';
import { MultiSelect } from 'react-multi-select-component';
import useHttp from '../../../../hooks/useHttp';
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';
import { useRef } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
const options = [
    { label: "Need Mobility Assistance?", value: "Need Mobility Assistance?" },
    { label: "Mobility Independency", value: "Mobility Independency" }

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

        const [disabled, setDisabled] = useState([])
       const [editDisabled, setEditDisabled] = useState({
        mobilityAssistance: ['Need Mobility Assistance'] // Initial value should be an array to hold selected values
      });

      function handleInputChan(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        const newValue = value === "" ? "" : value;
        setEditDisabled({
          ...editDisabled,
          [name]: newValue
        });
      }
      const { uid } = useParams()
      const { get, post } = useHttp();
      const [loading1, setLoading1] = useState(false);
      const [idSave, setIdSave] = useState("");

    const FetchDisable = async () => {
        // setLoading2(true)
        try {
            const { data } = await get(`/Disabilities/get_all?clientId=${uid}`, { cacheTimeout: 300000 });
            // console.log(data);
           setDisabled(data)
             
             if (data && data.length > 0) {
                const disabilityId = data[1].disabilityId;
                setIdSave(disabilityId)
                const { data: secondData } = await get(`/Disabilities/${disabilityId}`, { cacheTimeout: 300000 });
                console.log(secondData);
                setEditDisabled(secondData);

                const options = [
                    {
                        label: 'Need Mobility Assistance?',
                        value: 'Need Mobility Assistance?',
                        selected: secondData.mobilityAssistance // Set to true or false
                    },
                    {
                        label: 'Mobility Independency',
                        value: 'Mobility Independency',
                        selected: secondData.mobilityIndependency // Set to true or false
                    }
                ];
                setEditDisabled({
                    mobilityAssistance: options.filter(option => option.selected),
                    mobilityIndependency: options.filter(option => option.selected) // Assuming data contains mobilityAssistance array
                  });

              }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
       
        
    };
    useEffect(() => {
        FetchDisable()
    }, []);

    const [selectedActivities, setSelectedActivities] = useState([]);
    const [selectedActiviti, setSelectedActiviti] = useState([]);


    const handleActivityChange = (selected) => {
        setSelectedActivities(selected);
    };

    const handleActivityChan = (selected) => {
        setSelectedActiviti(selected);
    };

    const mobile = useRef(null)
    const vision = useRef(null)
    const visionDescription = useRef(null);
    const memoryIssues = useRef(null)
    const memoryDescription = useRef(null)
    const communicationMeans = useRef(null)
    const hearingIssues = useRef(null)
    const hearingDescription = useRef(null)
    const communicationDescription = useRef(null)

    const PostAvail = async (e) => {
        e.preventDefault()
        // if (selectedDay === "" || selectedTimeFrom === "" || selectedTimeTo === "" ) {
        //     return toast.error("Input Fields cannot be empty")
        // }
        const selectedValue = selectedActivities.map(option => option.label);
        const optionsOther = selectedActiviti.map(option => option.label);
        setLoading1(true)
        const info = {
            profileId: uid,
            mobilityAssistance: selectedValue.includes("Need Mobility Assistance?"),
            mobilityIndependent: selectedValue.includes("Mobility Independency"),
            mobilityDescription: mobile.current.value,
            hearingIssues: hearingIssues.current.value,
            hearingDescription: hearingDescription.current.value,
            visionIssues: vision.current.value,
            visionDescription: visionDescription.current.value,
            memoryIssues: memoryIssues.current.value,
            memoryDescription: memoryDescription.current.value,
            communicationAssistance: optionsOther.includes("Need Communication Assistance?"),
            communicationMeans: communicationMeans.current.value,
            // communicationAttachment: communicationAttachment.current.value,
            communicationDescription: communicationDescription.current.value,
            // communicationAttachmentFile: "string"
        }
        try {

            const { data } = await post(`/Disabilities`, {
                ...info,
                mobilityAssistance: info.mobilityAssistance,
                mobilityIndependent: info.mobilityIndependent,
                communicationAssistance: info.communicationAssistance,
            });
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
                {disabled.length === 0 && <div>
                    
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
                                            <textarea className="form-control" rows="2" cols="10" ref={mobile} />
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
                                            <select className='form-select' ref={hearingIssues} required>
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
                                            <textarea className="form-control" rows="2" cols="10" ref={hearingDescription} />
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
                                            <select className='form-select' ref={vision} required>
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
                                            <textarea className="form-control" rows="2" cols="10" ref={visionDescription} />
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
                                            
                                            <select className='form-select' ref={memoryIssues} required>
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
                                            <textarea className="form-control" rows="2" cols="10" ref={memoryDescription} />
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
                                                value={selectedActiviti}
                                                onChange={handleActivityChan}
                                                labelledBy={'Select Issues'}
                                            />
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Communication Preferences</label>
                                            <select className='form-select' ref={communicationMeans} required>
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
                                            <textarea className="form-control" rows="2" cols="10" ref={communicationDescription} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="text-start">
                            <button type="submit" className="btn btn-primary px-2" disabled={loading1 ? true : false} onClick={PostAvail} >
                                {loading1 ? <div className="spinner-grow text-light" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : "Submit"}</button>
                        </div>
                    </div>
                </div>
                </div>}


                {disabled.length > 0 && <div>
                    
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
                                                // value={selectedActivities}
                                                name="mobilityAssistance" value={editDisabled.mobilityAssistance || ''} onChange={handleInputChan}
                                                // onChange={handleActivityChange}
                                                labelledBy={'Select Issues'}
                                            />
                                        </div>
                                    </div>


                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Mobility Description</label>
                                            <textarea className="form-control" rows="2" cols="10" ref={mobile} />
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
                                            <select className='form-select' ref={hearingIssues} required>
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
                                            <textarea className="form-control" rows="2" cols="10" ref={hearingDescription} />
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
                                            <select className='form-select' ref={vision} required>
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
                                            <textarea className="form-control" rows="2" cols="10" ref={visionDescription} />
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
                                            
                                            <select className='form-select' ref={memoryIssues} required>
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
                                            <textarea className="form-control" rows="2" cols="10" ref={memoryDescription} />
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
                                                value={selectedActiviti}
                                                onChange={handleActivityChan}
                                                labelledBy={'Select Issues'}
                                            />
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Communication Preferences</label>
                                            <select className='form-select' ref={communicationMeans} required>
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
                                            <textarea className="form-control" rows="2" cols="10" ref={communicationDescription} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="text-start">
                            <button type="submit" className="btn btn-primary px-2" disabled={loading1 ? true : false}
                            //  onClick={EditAvail} 
                             >
                                {loading1 ? <div className="spinner-grow text-light" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : "Submit"}</button>
                        </div>
                    </div>
                </div>
                </div>}





            </div>

        </div>
    );
}
export default ClientDisability;