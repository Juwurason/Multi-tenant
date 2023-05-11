/**
 * Signin Firebase
 */

 import React, { Component, useState, useEffect } from 'react';
 import { Helmet } from "react-helmet";
 import { Link, useParams, useHistory } from 'react-router-dom';
 import { toast } from 'react-toastify';
 import "../../index.css";
import Offcanvas from '../../../Entryfile/offcanvance';
import { useCompanyContext } from '../../../context';
import useHttp from '../../../hooks/useHttp';
import { async } from '@babel/runtime/helpers/regeneratorRuntime';
 
 const ProgressNote = () => {
  const lat = JSON.parse(localStorage.getItem('latit'))
  const log = JSON.parse(localStorage.getItem('log'))
  const user = JSON.parse(localStorage.getItem('user'));
 const navigate = useHistory()
   // const id = "my-unique-id";
   const {uid, name} = useParams()
  //  console.log(uid, name);
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
   const [report, setReport] = useState('')
   const [progress, setProgress] = useState('')
   const [follow, setFollow] = useState('')
   const [kilometer, setKilometer] = useState(0)
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
      const staffLocation = await get(`/Attendances/clock_in?userId=${user.userId}&shiftId=${uid}&lat=${lat}&lng=${log}`, { cacheTimeout: 300000 });
      const staffLocate = staffLocation;
      console.log(staffLocate);
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

  const SaveProgress = async(e) => {
    e.preventDefault()
    setLoading(true)
    const info = {
      report: report,
      progress: progress,
      position: "",
      followUp: follow,
      staff: staff,
      startKm: kilometer,
      profileId: details.profileId,
      companyID: companyId
    }
    try {
      const {data} = await privateHttp.post(`/ProgressNotes/save_progressnote/${''}?userId=${user.userId}`, info);
      console.log(data);
      if (data.status === 'Success') {
        navigate.push(`/staff/staff-edit-progress/${uid}/${data.progressNote.progressNoteId}`)
      }
      toast.success(data.message)
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
      report: report,
      progress: progress,
      position: "",
      followUp: follow,
      staff: staff,
      startKm: kilometer,
      profileId: details.profileId,
      companyID: companyId
    }

    try {
      const CreateProgress = await privateHttp.post(`/ProgressNotes/create_progressnote?userId=${user.userId}`, info);
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
           <title>Progress Note</title>
           <meta name="description" content="Progress Note" />
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
                   <li className="breadcrumb-item active">Progress Note</li>
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
                     <div className="form-group">
                      <label htmlFor="">Input Your Starting Kilometer</label>
                       <input type="text" placeholder="0" className="form-control" onChange={e => setKilometer(e.target.value)} />
                     </div>
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
                       <textarea rows={3} className="form-control summernote" placeholder="" onChange={e => setReport(e.target.value)} />
                     </div>
                     <div className="form-group">
                     <label htmlFor="">Progress towards goals</label>
                       <textarea rows={3} className="form-control summernote" placeholder="" onChange={e => setProgress(e.target.value)} />
                     </div>
                     <div className="form-group">
                        <label htmlFor="">Follow up <span className='text-success' style={{fontSize:'10px'}}>Note: If restrictive practices were used or a serious included occurred, It must be reported immediately to the Position Title </span></label>
                       <textarea rows={3} className="form-control summernote" placeholder="" onChange={e => setFollow(e.target.value)} />
                     </div>
                     <div className="form-group text-center mb-0">
                       <div className="text-center d-flex gap-2">
                         <button className="btn btn-primary" onClick={SaveProgress}>{loading ? <div className="spinner-grow text-light" role="status">
                      <span className="sr-only">Loading...</span>
                    </div> : "Save"}</button>
                         <button className="btn btn-primary ml-4" onClick={CreateProgress}>Submit</button>
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
 

export default ProgressNote;
