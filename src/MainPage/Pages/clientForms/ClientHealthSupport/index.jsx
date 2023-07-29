/**
 * Form Elemets
 */
 import React, { useEffect, useState } from 'react';
 import { Helmet } from "react-helmet";
 import { Link, useParams } from 'react-router-dom';
 import "jspdf-autotable";
 import { toast } from 'react-toastify';
import useHttp from '../../../../hooks/useHttp';
 
 
 
 const ClientHealth = () => {
     useEffect(() => {
         if ($('.select').length > 0) {
             $('.select').select2({
                 minimumResultsForSearch: -1,
                 width: '100%'
             });
         }
     });
 
     const [staffAvail, setStaffAvail] = useState([]);
     const [staffAva, setStaffAva] = useState("");
     
     const [loading1, setLoading1] = useState(false);
     const [loading2, setLoading2] = useState(false);
     const [selectedDay, setSelectedDay] = useState("");
     const { get, post } = useHttp();
     const [selectedTimeFrom, setSelectedTimeFrom] = useState("");
     const [selectedTimeTo, setSelectedTimeTo] = useState("");
     const [selectedTime, setSelectedTime] = useState("");
     const id = JSON.parse(localStorage.getItem('user'));
     const {uid} = useParams()
 
 
     const PostAvail = async (e) => {
         if (selectedDay === "" || selectedTimeFrom === "" || selectedTimeTo === "") {
             return toast.error("Input Fields cannot be empty")
         }
         e.preventDefault()
         setLoading1(true)
         const info = {
             profileId: uid,
             healthIssues: selectedDay,
             supportDetails: staffAva,
             requireMedication: selectedTimeFrom,
             support: selectedTime,
             healthPlan: selectedTimeTo,
            
         }
         try {
 
             const { data } = await post(`/HealthSupports/get_all?clientId=${id.userId}`, info);
             //  console.log(data)
             if (data.status === 'Success') {
                 toast.success(data.message)
             }
             setLoading1(false)
             FetchSchedule()
         } catch (error) {
             //  console.log(error);
             toast.error(error.response.data.message)
             toast.error(error.response.data.title)
         }
         finally {
             setLoading1(false)
         }
     }
 
     const [idSave, setIdSave] = useState('')
     const FetchSchedule = async () => {
         // setLoading2(true)
         try {
             const { data } = await get(`HealthSupports/get_all?clientId=${uid}`, { cacheTimeout: 300000 });
             // console.log(data);
              setStaffAvail(data)
              
              if (data && data.length > 0) {
                 const healthSupportId = data[0].healthSupportId;
                 setIdSave(healthSupportId)
                 const { data: secondData } = await get(`/HealthSupports/${healthSupportId}`, { cacheTimeout: 300000 });
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
 
     const [editpro, setEditPro] = useState({})
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
         setLoading2(true)
         const info = {
             healthSupportId: idSave,
             profileId: uid,
             healthIssues: editpro.healthIssues,
             supportDetails: editpro.supportDetails,
             requireMedication: editpro.requireMedication == "true" ? true : false,
             support: editpro.support,
             healthPlan: editpro.healthPlan
         }
         try {
 
             const { data } = await post(`/HealthSupports/edit/${idSave}`, info);
             // console.log(data);
             if (data.status === 'Success') {
                 toast.success(data.message)
             }
             setLoading2(false)
             // setShowModal(false)
             FetchSchedule()
         } catch (error) {
             console.log(error);
             toast.error(error.response.data.message)
             toast.error(error.response.data.title)
         }
         finally {
             setLoading2(false)
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
                                 <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                 <li className="breadcrumb-item active">Health Support Needs</li>
                             </ul>
                         </div>
                     </div>
                 </div>
                 {/* /Page Header */}
                 {staffAvail.length < 0 && <div className="row">
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
                                                 <option value={"Assistance Required"}>Assistance Required</option>
                                                 <option value={"Administration Required"}>Administration Required</option>
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
                 </div>}
 
                 {staffAvail.length > 0 && <div className="row">
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
                                             <textarea className="form-control" name="healthIssues" value={editpro.healthIssues || ''} onChange={handleInputChange} rows="2" cols="20" />
                                         </div>
                                     </div>
 
                                     <div className="col-md-6">
                                         <div className="form-group">
                                             <label>Is additional support  for these issues? If so, please provide detail</label>
                                             <textarea className="form-control" rows="2" cols="20" name="supportDetails" value={editpro.supportDetails || ''} onChange={handleInputChange} />
                                         </div>
                                     </div>
 
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Medication Required?</label>
                                             <select className='form-select' name="requireMedication" value={editpro.requireMedication || ''} onChange={handleInputChange}>
                                                 <option defaultValue hidden>Select...</option>
                                                 <option value={"true"}>Yes</option>
                                                 <option value={"false"}>No</option>
                                             </select>
                                         </div>
                                     </div>
 
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>How Often do you require medication?</label>
                                             <select className='form-select' name="support" value={editpro.support || ''} onChange={handleInputChange}>
                                                 <option defaultValue hidden>Please Select</option>
                                                 <option value={"Prompt Required"}>Prompt Required</option>
                                                 <option value={"Assistance Required"}>Assistance Required</option>
                                                 <option value={"Administration Required"}>Administration Required</option>
                                             </select>
                                         </div>
                                     </div>
 
                                     <div className="col-md-6">
                                         <div className="form-group">
                                             <label>Provide details of your medication and treatment plan</label>
                                             <textarea className="form-control" rows="2" cols="20" name="healthPlan" value={editpro.healthPlan || ''} onChange={handleInputChange} />
                                         </div>
                                     </div>
 
 
                                 </form>
                                 <div className="text-start">
                                     <button type="submit" className="btn btn-primary px-2" disabled={loading2 ? true : false}
                                      onClick={EditAvail}
                                     >
                                         {loading2 ? <div className="spinner-grow text-light" role="status">
                                             <span className="sr-only">Loading...</span>
                                         </div> : "Save"}</button>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>}
 
                 
                 
 
 
             </div>
 
         </div>
     );
 }
 export default ClientHealth;