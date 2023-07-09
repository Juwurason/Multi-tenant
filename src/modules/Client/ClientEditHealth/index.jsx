/**
 * Form Elemets
 */
 import React, { useEffect, useState } from 'react';
 import { Helmet } from "react-helmet";
 import { Link, useParams } from 'react-router-dom';
 import useHttp from '../../../hooks/useHttp';
 import { toast } from 'react-toastify';
 import { useCompanyContext } from '../../../context';
 
 
 const ClientEditHealth = () => {
     useEffect(() => {
         if ($('.select').length > 0) {
             $('.select').select2({
                 minimumResultsForSearch: -1,
                 width: '100%'
             });
         }
     });

     const { uid } = useParams()
     const [loading1, setLoading1] = useState(false);
     const { get, post } = useHttp();
     const id = JSON.parse(localStorage.getItem('user'))
     const [editpro, setEditPro] = useState({})
     const clientProfile = JSON.parse(localStorage.getItem('clientProfile'))

     const FetchSchedule = async () => {
        // setLoading(true)
        try {
          const {data} = await get(`/HealthSupports/edit/${uid}`, { cacheTimeout: 300000 });
          setEditPro(data)
          console.log(data);
          
        //   setLoading(false);
        } catch (error) {
          toast.error(error.response.data.message)
          toast.error(error.response.data.title)
        }
        finally {
        //   setLoading(false)
        }
    }

    useEffect(() => {
        FetchSchedule()
      }, []);
     
 
     const PostAvail = async (e) => {
        
         e.preventDefault()
         setLoading1(true)
         const info = {
             healthSupportId: uid,
             profileId: clientProfile.profileId,
             healthIssues: editpro.healthIssues,
             supportDetails: editpro.supportDetails,
             requireMedication: editpro.requireMedication,
             support: editpro.support,
             healthPlan: editpro.healthPlan,
             //  documentation: "",
             //  documentationFile: "",
             //  companyID: id.companyId
         }
         try {
 
             const { data } = await post(`/HealthSupports/edit/${id.userId}`, info);
             //  console.log(data)
             if (data.status === 'Success') {
                 toast.success(data.message)
                 // navigate.push(`/staff/staff/edit-health/${data.progressNote.progressNoteId}`)
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
                                             <select className='form-select' name="requireMedication" value={editpro.requireMedication || ''} onChange={handleInputChange} >
                                                 <option defaultValue hidden>Select...</option>
                                                 <option value={"true"}>Yes</option>
                                                 <option value={"false"}>No</option>
                                             </select>
                                         </div>
                                     </div>
 
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>How Often do you require medication?</label>
                                             <select className='form-select' name="support" value={editpro.support || ''} onChange={handleInputChange} >
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
                                             <textarea className="form-control" rows="2" cols="20" name="healthPlan" value={editpro.healthPlan || ''} onChange={handleInputChange} />
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
 export default ClientEditHealth;