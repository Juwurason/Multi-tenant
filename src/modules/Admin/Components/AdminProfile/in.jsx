/**
 * TermsCondition Page
 */
 import React, { useEffect, useState } from 'react';
 import { Helmet } from "react-helmet";
 import { Link } from 'react-router-dom';
import useHttp from '../../../../hooks/useHttp';
 // import http from '../../../api/http';
//  import { Avatar_02, Avatar_05, Avatar_09, Avatar_10, Avatar_16 } from '../../../Entryfile/imagepath'
import { Avatar_02 } from "../../../../Entryfile/imagepath"
import Offcanvas from '../../../../Entryfile/offcanvance';

 
 const AdminProfile = () => {
 
   const [profile, setProfile] = useState([])
   const [userId, setUserId] = useState([""])
   const privateHttp = useHttp()
   const getStaffProfile = JSON.parse(localStorage.getItem('adminProfile'))
 
   useEffect(() => {
     if ($('.select').length > 0) {
       $('.select').select2({
         minimumResultsForSearch: -1,
         width: '100%'
       });
     }
   });
 
   useEffect(()=>{
     const fetchProfile = async () => {
       try {
           const {data} = await privateHttp.get(`/Administrators/${getStaffProfile.administratorId}`, { cacheTimeout: 300000 })
           setProfile(data)
          //  console.log(data);
       } catch (error) {
           console.log(error);
       }
   }
   fetchProfile()
   },[])
 
   
  
   
   return (
     <>
       <div className="page-wrapper">
         <Helmet>
           <title>Profile</title>
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
                         <a href="#"><img alt="" src={Avatar_02} /></a>
                       </div>
                     </div>
                     <div className="profile-basic">
                       <div className="row">
                         <div className="col-md-5">
                           <div className="profile-info-left">
                             <h3 className="user-name m-t-0 mb-0">{profile.fullName}</h3>
                             {/* <h6 className="text-muted">MCP202224</h6> */}
                             {/* <small className="text-muted">{profile.email}</small> */}
                             {/* <div className="staff-id"> {profile.maxStaffId}</div> */}
                             {/* <div className="small doj text-muted">{profile.address}</div> */}
                             <div className="staff-msg"><Link className="btn btn-primary" to="/administrator/profile">Edit Profile</Link></div>
                           </div>
                         </div>
                         <div className="col-md-7">
                           <ul className="personal-info">
                             <li>
                               <div className="title">Phone:</div>
                               <div className="text"><a href="">{profile.phoneNumber}</a></div>
                             </li>
                             <li>
                               <div className="title">Email:</div>
                               <div className="text"><a href="">{profile.email}</a></div>
                             </li>
                             <li>
                               <div className="title">Birthday:</div>
                               <div className="text">{profile.dateOfBirth}</div>
                             </li>
                             <li>
                               <div className="title">Address:</div>
                               <div className="text">{profile.address}</div>
                             </li>
                             <li>
                               <div className="title">Gender:</div>
                               <div className="text">{profile.gender}</div>
                             </li>
                             {/* <li>
                               <div className="title">Reports to:</div>
                               <div className="text">
                                 <div className="avatar-box">
                                   <div className="avatar avatar-xs">
                                     <img src={Avatar_16} alt="" />
                                   </div>
                                 </div>
                                 <Link to="/staff/Staffprofile">
                                   Jeffery Lalor
                                 </Link>
                               </div>
                             </li> */}
                           </ul>
                         </div>
                       </div>
                     </div>
                     <div className="pro-edit"><Link to="/administrator/profile" className="edit-icon"><i className="fa fa-pencil" /></Link></div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
           <div className="card tab-box">
             <div className="row user-tabs">
               <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                 <ul className="nav nav-tabs nav-tabs-bottom">
                   <li className="nav-item"><a href="#emp_profile" data-bs-toggle="tab" className="nav-link active">Profile</a></li>
                   {/* <li className="nav-item"><a href="#emp_projects" data-bs-toggle="tab" className="nav-link">Projects</a></li> */}
                   {/* <li className="nav-item"><a href="#bank_statutory" data-bs-toggle="tab" className="nav-link">Bank &amp; Statutory <small className="text-danger">(Admin Only)</small></a></li> */}
                 </ul>
               </div>
             </div>
           </div>
           <div className="tab-content">
             {/* Profile Info Tab */}
             <div id="emp_profile" className="pro-overview tab-pane fade show active">
               <div className="row">
                 <div className="col-md-6 d-flex">
                   <div className="card profile-box flex-fill">
                     <div className="card-body">
                       <h3 className="card-title">Personal Informations </h3>
                       <ul className="personal-info">
                         <li>
                           <div className="title">Passport No.</div>
                           <div className="text"></div>
                         </li>
                         <li>
                           <div className="title">Passport Exp Date.</div>
                           <div className="text"></div>
                         </li>
                         <li>
                           <div className="title">Tel</div>
                           <div className="text"><a href=""></a></div>
                         </li>
                         <li>
                           <div className="title">Nationality</div>
                           <div className="text"></div>
                         </li>
                         <li>
                           <div className="title">Religion</div>
                           <div className="text"></div>
                         </li>
                         <li>
                           <div className="title">Marital status</div>
                           <div className="text"></div>
                         </li>
                         <li>
                           <div className="title">Employment of spouse</div>
                           <div className="text"></div>
                         </li>
                         <li>
                           <div className="title">No. of children</div>
                           <div className="text"></div>
                         </li>
                       </ul>
                     </div>
                   </div>
                 </div>
                 <div className="col-md-6 d-flex">
                   <div className="card profile-box flex-fill">
                     <div className="card-body">
                       <h3 className="card-title">Emergency Contact </h3>
                       <h5 className="section-title">Primary</h5>
                       <ul className="personal-info">
                         <li>
                           <div className="title">Name</div>
                           <div className="text"></div>
                         </li>
                         <li>
                           <div className="title">Relationship</div>
                           <div className="text"></div>
                         </li>
                         <li>
                           <div className="title">Phone </div>
                           <div className="text"></div>
                         </li>
                       </ul>
                       <hr />
                       <h5 className="section-title">Secondary</h5>
                       <ul className="personal-info">
                         <li>
                           <div className="title">Name</div>
                           <div className="text"></div>
                         </li>
                         <li>
                           <div className="title">Relationship</div>
                           <div className="text"></div>
                         </li>
                         <li>
                           <div className="title">Phone </div>
                           <div className="text"></div>
                         </li>
                       </ul>
                     </div>
                   </div>
                 </div>
               </div>
               <div className="row">
                 <div className="col-md-6 d-flex">
                   <div className="card profile-box flex-fill">
                     <div className="card-body">
                       <h3 className="card-title">Bank information</h3>
                       <ul className="personal-info">
                         <li>
                           <div className="title">Bank name</div>
                           <div className="text"></div>
                         </li>
                         <li>
                           <div className="title">Bank account No.</div>
                           <div className="text"></div>
                         </li>
                         <li>
                           <div className="title">IFSC Code</div>
                           <div className="text"></div>
                         </li>
                         <li>
                           <div className="title">PAN No</div>
                           <div className="text"></div>
                         </li>
                       </ul>
                     </div>
                   </div>
                 </div>
 
                 <div className="col-md-6 d-flex">
                   <div className="card profile-box flex-fill">
                     <div className="card-body">
                       <h3 className="card-title">Family Informations</h3>
                       <ul className="personal-info">
                         <li>
                           <div className="title">Name</div>
                           <div className="text"></div>
                         </li>
                         <li>
                           <div className="title">Relationship</div>
                           <div className="text"></div>
                         </li>
                         <li>
                           <div className="title">Date of Birth</div>
                           <div className="text"></div>
                         </li>
                         <li>
                           <div className="title">Phone</div>
                           <div className="text"></div>
                         </li>
                       </ul>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
         
           </div>
         </div>
 
         <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
           <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
             <div className="modal-content">
               <div className="modal-header text-center">
                 <h5 className="modal-title" id="staticBackdropLabel">Profile Information</h5>
                 <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
               </div>
               <div className="modal-body overflow-scroll">
                 <form>
                   <div className="row ">
                     <div className="col-md-12">
                       <div className="profile-img-wrap edit-img">
                         <img className="inline-block" src={Avatar_02} alt="user" />
                         <div className="fileupload btn">
                           <span className="btn-text">edit</span>
                           <input className="upload" type="file" />
                         </div>
                       </div>
                       <div className="row">
                         <div className="col-md-6">
                           <div className="form-group">
                             <label>First Name</label>
                             <input type="text" className="form-control" defaultValue="John" />
                           </div>
                         </div>
                         <div className="col-md-6">
                           <div className="form-group">
                             <label>Last Name</label>
                             <input type="text" className="form-control" defaultValue="Doe" />
                           </div>
                         </div>
                         <div className="col-md-6">
                           <div className="form-group">
                             <label>Birth Date</label>
                             <div>
                               <input className="form-control datetimepicker" type="date" defaultValue="05/06/1985" />
                             </div>
                           </div>
                         </div>
                         <div className="col-md-6">
                           <div className="form-group">
                             <label>Gender</label>
                             <select className="select form-control">
                               <option value="male selected">Male</option>
                               <option value="female">Female</option>
                             </select>
                           </div>
                         </div>
                       </div>
                     </div>
                     <div className="col-md-12">
                       <div className="form-group">
                         <label>Address</label>
                         <input type="text" className="form-control" defaultValue="4487 Snowbird Lane" />
                       </div>
                     </div>
                     <div className="col-md-6">
                       <div className="form-group">
                         <label>State</label>
                         <input type="text" className="form-control" defaultValue="New York" />
                       </div>
                     </div>
                     <div className="col-md-6">
                       <div className="form-group">
                         <label>Country</label>
                         <input type="text" className="form-control" defaultValue="United States" />
                       </div>
                     </div>
                     <div className="col-md-6">
                       <div className="form-group">
                         <label>Pin Code</label>
                         <input type="text" className="form-control" defaultValue={10523} />
                       </div>
                     </div>
                     <div className="col-md-6">
                       <div className="form-group">
                         <label>Phone Number</label>
                         <input type="text" className="form-control" defaultValue="631-889-3206" />
                       </div>
                     </div>
                     <div className="col-md-6">
                       <div className="form-group">
                         <label>Department <span className="text-danger">*</span></label>
                         <select className="select">
                           <option>Select Department</option>
                           <option>Web Development</option>
                           <option>IT Management</option>
                           <option>Marketing</option>
                         </select>
                       </div>
                     </div>
                     <div className="col-md-6">
                       <div className="form-group">
                         <label>Designation <span className="text-danger">*</span></label>
                         <select className="select">
                           <option>Select Designation</option>
                           <option>Web Designer</option>
                           <option>Web Developer</option>
                           <option>Android Developer</option>
                         </select>
                       </div>
                     </div>
                     <div className="col-md-6">
                       <div className="form-group">
                         <label>Reports To <span className="text-danger">*</span></label>
                         <select className="select">
                           <option>-</option>
                           <option>Wilmer Deluna</option>
                           <option>Lesley Grauer</option>
                           <option>Jeffery Lalor</option>
                         </select>
                       </div>
                     </div>
                     <div className="submit-section">
                       <button className="btn btn-primary submit-btn">Submit</button>
                     </div>
                   </div>
                   <div className="row">
                   </div>
 
                 </form>
               </div>
 
             </div>
           </div>
         </div>
 
 
       </div>
       <Offcanvas />
     </>
 
 
   );
 }
 export default AdminProfile;
 