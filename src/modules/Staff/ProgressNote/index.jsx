/**
 * Signin Firebase
 */

 import React, { Component, useState, useEffect } from 'react';
 import { Helmet } from "react-helmet";
 import { Link, useParams } from 'react-router-dom';
 import { TextEditor } from "text-editor-react";
 
 // import ReactSummernote from 'react-summernote';
 import { DefaultEditor } from 'react-simple-wysiwyg';
 // import 'react-summernote/dist/react-summernote.css'; // import styles
 // import "../../../../../node_modules/react-summernote/dist/react-summernote.css";
 
 import "../../index.css";
import Offcanvas from '../../../Entryfile/offcanvance';
import { useCompanyContext } from '../../../context';
import useHttp from '../../../hooks/useHttp';
 
 const ProgressNote = () => {
  const getStaffProfile = JSON.parse(localStorage.getItem('staffProfile'))
  const lat = JSON.parse(localStorage.getItem('latit'))
  const log = JSON.parse(localStorage.getItem('log'))
  const user = JSON.parse(localStorage.getItem('user'));
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
   const { get } = useHttp();
  const { loading, setLoading } = useCompanyContext();
   const FetchSchedule = async () => {
    setLoading(true)
    try {
      const staffResponse = await get(`/ShiftRosters/${uid}`, { cacheTimeout: 300000 });
      const staff = staffResponse.data;
      // console.log(staff);
      setDetails(staff);
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
                   <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
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
                       <input type="text" placeholder="0" className="form-control" />
                     </div>
                     </div>
                     <div className="row">
                       <div className="col-md-4">
                         <div className="form-group">
                          <label htmlFor="">Client</label>
                           <input type="text" placeholder="Client" className="form-control" value={name} readOnly/>
                         </div>
                       </div>
                       <div className="col-md-4">
                         <div className="form-group">
                          <label htmlFor="">Staff</label>
                           <input type="text" placeholder="Staff" className="form-control" value={getStaffProfile.fullName} readOnly/>
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
                       <textarea rows={3} className="form-control summernote" placeholder="" defaultValue={""} />
                     </div>
                     <div className="form-group">
                     <label htmlFor="">Progress towards goals</label>
                       <textarea rows={3} className="form-control summernote" placeholder="" defaultValue={""} />
                     </div>
                     <div className="form-group">
                        <label htmlFor="">Follow up <span className='text-success' style={{fontSize:'10px'}}>Note: If restrictive practices were used or a serious included occurred, It must be reported immediately to the Position Title </span></label>
                       <textarea rows={3} className="form-control summernote" placeholder="" defaultValue={""} />
                     </div>
                     <div className="form-group text-center mb-0">
                       <div className="text-center d-flex gap-2">
                         <button className="btn btn-primary">Save</button>
                         <button className="btn btn-primary ml-4">Submit</button>
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
