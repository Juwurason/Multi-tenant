/**
 * Signin Firebase
 */

 import React, { Component, useState, useEffect } from 'react';
 import { Helmet } from "react-helmet";
 import { Link, useParams } from 'react-router-dom';
 import { toast } from 'react-toastify';
 import "../../index.css";
import Offcanvas from '../../../Entryfile/offcanvance';
import { useCompanyContext } from '../../../context';
import useHttp from '../../../hooks/useHttp';
 
 const EditProgressNote = () => {
  const user = JSON.parse(localStorage.getItem('user'));
   // const id = "my-unique-id";
   const {uid, pro} = useParams()
  //  console.log(pro);
   const [html, setHtml] = React.useState('my <b>HTML</b>');
   
   function onChange(e) {
     setHtml(e.target.value);
   }
   const onImageUpload = (fileList) => {
 
     const reader = new FileReader();
     reader.onloadend = () => {
       ReactSummernote.insertImage(reader.result);
     }
     reader.readAsDataURL(fileList[0]);
 
   }
   const [details, setDetails] = useState('')
   const [staff, setStaff] = useState('')
   const [kilometer, setKilometer] = useState('')
   const [editpro, setEditPro] = useState({})
   const [companyId, setCompanyId] = useState('')
   const { get } = useHttp();
  const { loading, setLoading } = useCompanyContext();
  const privateHttp = useHttp()


   const FetchSchedule = async () => {
    setLoading(true)
    try {
      const staffResponse = await get(`/ShiftRosters/${uid}`, { cacheTimeout: 300000 });
      const staff = staffResponse.data;
      // console.log(staff);
      setCompanyId(staff.companyID)
      setStaff(staff.staff.fullName);
      setDetails(staff.profile);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }

    try {
      const editProgress = await get(`/ProgressNotes/${pro}`, { cacheTimeout: 300000 });
      const editpro = editProgress;
      // console.log(editpro.data);
      setEditPro(editpro.data);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
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
  const SaveProgress = async(e) => {
    e.preventDefault()
    setLoading(true)
    const info = {
      report: editpro.report,
      progress: editpro.progress,
      position: 0,
      followUp: editpro.followUp,
      staff: staff,
      startKm: editpro.startKm,
      profileId: details.profileId,
      companyID: companyId,
      date: "2023-05-11"
    }
    try {
      const saveProgress = await privateHttp.post(`/ProgressNotes/save_progressnote/${pro}?userId=${user.userId}`, info);
      const savePro = saveProgress.data;
      // console.log(savePro);
      toast.success(savePro)
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  }

  const CreateProgress = async(e) => {
    e.preventDefault()
    setLoading(true)
    const info = {
      progressNoteId: Number(pro),
      report: editpro.report,
      progress: editpro.progress,
      position: "",
      followUp: editpro.follow,
      staff: staff,
      startKm: editpro.startKm,
      profileId: details.profileId,
      companyID: companyId,
      date: "2023-05-11"
    }

    try {
      const CreateProgress = await privateHttp.post(`/ProgressNotes/edit/${pro}?userId=${user.userId}`, info);
      const createPro = CreateProgress.data;
      console.log(createPro);
      setLoading(false)
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    finally {
      setLoading(false)
    }
  }

   return (
     <>
       <div className="page-wrapper">
         <Helmet>
           <title>Edit Progress Note</title>
           <meta name="description" content="Edit Progress Note" />
         </Helmet>
         {/* Page Content */}
         <div className="content container-fluid">
           {/* Page Header */}
           <div className="page-header">
             <div className="row">
               <div className="col-sm-12">
                 <h3 className="page-title">Progress Note</h3>
                 <ul className="breadcrumb">
                   <li className="breadcrumb-item"><Link to="/staff/staff/staffDashboard">Dashboard</Link></li>
                   <li className="breadcrumb-item active">Edit Progress Note</li>
                 </ul>
               </div>
             </div>
           </div>
           {/* /Page Header */}
           <div className="row">
             <div className="col-sm-12">
               <div className="card">
                 <div className="card-body">
                   <form>
                     <div className='col-md-4'>
                     {/* <div className="form-group">
                      <label htmlFor="">Input Your Starting Kilometer</label>
                       <input type="text" placeholder="0" className="form-control" onChange={e => setKilometer(e.target.value)} />
                     </div> */}
                     </div>
                     <div className="row">
                       <div className="col-md-4">
                         <div className="form-group">
                          <label htmlFor="">Client</label>
                           <input type="text" placeholder="Client" className="form-control" value={details.fullName} readOnly/>
                         </div>
                       </div>
                       <div className="col-md-4">
                         <div className="form-group">
                          <label htmlFor="">Staff</label>
                           <input type="text" placeholder="Staff" className="form-control" value={staff} readOnly/>
                         </div>
                       </div>
                       <div className="col-md-4">
                         <div className="form-group">
                          <label htmlFor="">Position</label>
                           <input type="text" placeholder="Position" className="form-control" readOnly/>
                         </div>
                       </div>
                     </div>
                     {/* <div className="form-group">
                       <input type="text" placeholder="Subject" className="form-control" />
                     </div> */}
 
                     <div className="form-group">
                      {/* <DefaultEditor value={html} onChange={onChange} /> */}
                      <label htmlFor="">Report <span className='text-success' style={{fontSize:'10px'}}>Only Include factual informations observations</span></label>
                       <textarea rows={3} className="form-control summernote" placeholder="" name="report" value={editpro.report || ''} onChange={handleInputChange} />
                     </div>
                     <div className="form-group">
                     <label htmlFor="">Progress towards goals</label>
                       <textarea rows={3} className="form-control summernote" placeholder="" name="progress" value={editpro.progress || ''} onChange={handleInputChange} />
                     </div>
                     <div className="form-group">
                        <label htmlFor="">Follow up <span className='text-success' style={{fontSize:'10px'}}>Note: If restrictive practices were used or a serious included occurred, It must be reported immediately to the Position Title </span></label>
                       <textarea rows={3} className="form-control summernote" placeholder="" name="followUp" value={editpro.followUp || ''} onChange={handleInputChange} />
                     </div>
                     <div className="form-group text-center mb-0">
                       <div className="text-center d-flex gap-2">
                         <button className="btn btn-primary" onClick={SaveProgress}>{loading ? <div className="spinner-grow text-light" role="status">
                      <span className="sr-only">Loading...</span>
                    </div> : "Save"}</button>

                         <div>
                         <button className="btn btn-success ml-4" onClick={CreateProgress}>{loading ? <div className="spinner-grow text-light" role="status">
                      <span className="sr-only">Loading...</span>
                    </div> : "Submit"}</button>
                         </div>
                       </div>
                     </div>
                   </form>
                 </div>
               </div>
             </div>
           </div>
         </div>
         {/* /Page Content */}
       </div>
       <Offcanvas />
     </>
 
   );
 
 }
 

export default EditProgressNote;
