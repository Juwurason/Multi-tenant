/**
 * TermsCondition Page
 */
 import React, { Component, useEffect, useState } from 'react';
 import { Helmet } from "react-helmet";
 import { Link, useParams } from 'react-router-dom';
 import { Avatar_01, Avatar_02, Avatar_05, Avatar_09, Avatar_10, Avatar_11, Avatar_12, Avatar_13, Avatar_16, Avatar_19 } from '../../../Entryfile/imagepath'
 import Offcanvas from '../../../Entryfile/offcanvance';
 import moment from 'moment';
import useHttp from '../../../hooks/useHttp';
 
 const ClientsProfile = () => {
   const { uid } = useParams()
   const [clientOne, setClientOne] = useState({});
 
   const { get } = useHttp()
   useEffect(() => {
     const FetchClient = async () => {
       try {
         const { data } = await get(`/Profiles/${uid}`, { cacheTimeout: 300000 })
         setClientOne(data)
 
 
       } catch (error) {
         console.log(error);
       }
     }
     FetchClient()
   }, [])
 
   return (
     <>
       <div className="page-wrapper">
         <Helmet>
           <title>Client Profile</title>
           <meta name="description" content="Reactify Blank Page" />
         </Helmet>
         {/* Page Content */}
         <div className="content container-fluid">
           {/* Page Header */}
           <div className="page-header">
             <div className="row">
               <div className="col-sm-12">
                 <h3 className="page-title">Profile</h3>
                 <ul className="breadcrumb">
                   <li className="breadcrumb-item"><Link to="/administrator/administrator/adminDashboard">Dashboard</Link></li>
                   <li className="breadcrumb-item"><Link to="/administrator/allClient">Client</Link></li>
                   <li className="breadcrumb-item active">Profile</li>
                 </ul>
               </div>
             </div>
           </div>
           {/* /Page Header */}
           <div className="card mb-0">
             <div className="card-body">
               <div className="row">
                 <div className="col-md-12">
                   <div className="profile-view">
                     <div className="profile-img-wrap">
                       <div className="profile-img">
                         <a href="">
                           <img src={Avatar_19} alt="" />
                         </a>
                       </div>
                     </div>
                     <div className="profile-basic">
                       <div className="row">
                         <div className="col-md-5">
                           <div className="profile-info-left">
                             <h3 className="user-name m-t-0">{clientOne.fullName}</h3>
                             {/* <h5 className="company-role m-t-0 mb-0">Barry Cuda</h5> */}
                             <small className="text-muted">{clientOne.email}</small>
                             {/* <div className="staff-id">Employee ID : CLT-0001</div> */}
                             <div className="staff-msg d-flex gap-2">
                               <Link to={`/administrator/editClientPro/${clientOne.profileId}`} className="btn btn-primary">Edit Profile</Link>
                               <Link to={`/administrator/clientDocum/${clientOne.profileId}`} className="btn btn-danger">Client's Doc</Link>
                             </div>
                           </div>
                         </div>
                         <div className="col-md-7">
                           <ul className="personal-info">
                             <li>
                               <span className="title">Phone:</span>
                               <span className="text"><a href={`tel:${clientOne.phoneNumber}`}>{clientOne.phoneNumber}</a></span>
                             </li>
                             <li>
                               <span className="title">Email:</span>
                               <span className="text"><a href={`mailto:${clientOne.email}`}>{clientOne.email}</a></span>
                             </li>
                             <li>
                               <span className="title">Birthday:</span>
                               <span className="text">{!clientOne.dateOfBirth ? "Not Updated" : moment(clientOne.dateOfBirth).format('ll')}</span>
                             </li>
                             <li>
                               <span className="title">Address:</span>
                               <span className="text">{clientOne.address}</span>
                             </li>
                             <li>
                               <span className="title">Gender:</span>
                               <span className="text">{clientOne.gender}</span>
                             </li>
                           </ul>
                         </div>
                       </div>
                     </div>
                   </div>
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
 export default ClientsProfile;
 