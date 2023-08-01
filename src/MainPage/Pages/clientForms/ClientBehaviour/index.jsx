/**
 * Form Elemets
 */
 import React, { useEffect, useState } from 'react';
 import { Helmet } from "react-helmet";
 import { Link, useHistory, useParams } from 'react-router-dom';
 import "jspdf-autotable";
 import { toast } from 'react-toastify';
import useHttp from '../../../../hooks/useHttp';
 
 
 const ClientBehaviuor = () => {
     useEffect(() => {
         if ($('.select').length > 0) {
             $('.select').select2({
                 minimumResultsForSearch: -1,
                 width: '100%'
             });
         }
     });
     
     const {uid} = useParams()
     const navigate = useHistory()
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
 
     const [idSave, setIdSave] = useState('')
     const [staffAvail, setStaffAvail] = useState([]);
     const [editpro, setEditPro] = useState({});
     const FetchSchedule = async () => {
         // setLoading2(true)
         try {
             const { data } = await get(`BehaviourSupports/get_all?clientId=${uid}`, { cacheTimeout: 300000 });
             // console.log(data);
              setStaffAvail(data)
              
              if (data && data.length > 0) {
                 const behaviourSupportId = data[0].behaviourSupportId;
                 setIdSave(behaviourSupportId)
                 const { data: secondData } = await get(`/BehaviourSupports/${behaviourSupportId}`, { cacheTimeout: 300000 });
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
            behaviourSupportId: idSave,
             profileId: uid,
             question1: editpro.question1,
             question2: editpro.question2,
             question3: editpro.question3,
             behaviourPlan: editpro.behaviourPlan,
             //  behaviourPlanFile: selectedPosition,
             riskAssessment: editpro.riskAssessment,
             //  riskAssessmentFile: ""
             //  companyID: id.companyId
         }
         try {
 
             const { data } = await post(`/BehaviourSupports/edit/${idSave}`, info);
             // console.log(data)
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
                                 <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                 <li className="breadcrumb-item active">Behaviour Support Needs</li>
                             </ul>
                         </div>
                     </div>
                 </div>
                 {/* /Page Header */}
                 {staffAvail.length === 0 && <div className="row">
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
                 </div>}
 
 
                 {staffAvail.length > 0 && <div className="row">
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
                                             <textarea className="form-control" rows="2" name="question1" value={editpro.question1 || ''} onChange={handleInputChange} cols="20" />
                                         </div>
                                     </div>
 
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Do you have any behaviours of concern that require specific support? If so, please provide detail</label>
                                             <textarea className="form-control" rows="2" name="question2" value={editpro.question2 || ''} onChange={handleInputChange} cols="20" />
                                         </div>
                                     </div>
 
                                     <div className="col-md-6">
                                         <div className="form-group">
                                             <label>Do you do anything that others might find disruptive?</label>
                                             <textarea className="form-control" rows="2" name="question3" value={editpro.question3 || ''} onChange={handleInputChange} cols="20" />
                                         </div>
                                     </div>
 
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Behaviour Plan</label>
                                             <textarea className="form-control" rows="2" name="behaviourPlan" value={editpro.behaviourPlan || ''} onChange={handleInputChange} cols="20" />
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
                                             <textarea className="form-control" name="riskAssessment" value={editpro.riskAssessment || ''} onChange={handleInputChange} rows="2" cols="20" />
                                         </div>
                                     </div>
 
                                     {/* <div className='col-md-6'>
                                          <div className="form-group">
                                              <label>Risk Assessment File</label>
                                              <textarea className="form-control"  rows="2" cols="20" />
                                          </div>
                                      </div> */}
 
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
 export default ClientBehaviuor;