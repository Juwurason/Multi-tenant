
 import React,{useEffect, useRef, useState} from 'react';
 import { Helmet } from "react-helmet";
import { useHistory } from 'react-router-dom';
 import Offcanvas from '../../../Entryfile/offcanvance';
import usePublicHttp from '../../../hooks/usePublicHttp';
import { toast } from "react-toastify";
 
 
 const ClientChangePassword = () => {
    const mail = JSON.parse(localStorage.getItem('user'))
    const navigate = useHistory()
//   const [password, setPassword] = useState()
const [loading, setLoading] = useState(false)
  const email = useRef(null);
  const oldPassword = useRef(null)
  const password = useRef(null)
  const confirmPassword = useRef(null)
    const publicHttp = usePublicHttp()
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (email === "" ||  oldPassword === "" || password === "" || confirmPassword === "")
     {
      return toast.error("Input Fields cannot be empty")
    }
    const info = {
        email: email.current.value,
        oldPassword: oldPassword.current.value,
        password: password.current.value,
        confirmPassword: confirmPassword.current.value,
    }
    try {
        setLoading(true)
        const { data } = await publicHttp.post("/Account/change_password", info)
        console.log(data);
        if (data.status === "Success") {
            toast.success(data.message)
            navigate.push("/client/client/Dashboard")
        } else {
            toast.error(data.message)
            return
        }
        setLoading(false)
    } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
        setLoading(false);
    }
    finally{
        setLoading(false)
    }
}
   
 
       return ( 
        <>
        <div className="page-wrapper">
       <Helmet>
           <title>Change Password - HRMS Admin Template</title>
           <meta name="description" content="Login page"/>					
       </Helmet>
       <div className="content container-fluid">
         <div className="row">
           <div className="col-md-6 offset-md-3">
             {/* Page Header */}
             <div className="page-header">
               <div className="row">
                 <div className="col-sm-12">
                   <h3 className="page-title">Change Password</h3>
                 </div>
               </div>
             </div>
             {/* /Page Header */}
             <form onSubmit={handleSubmit}>
               <div className="form-group">
                 <label>Email</label>
                 <input type="email" ref={email} value={mail.email} readOnly className="form-control" />
               </div>
               <div className="form-group">
                 <label>Old password</label>
                 <input type="text" ref={oldPassword}  className="form-control" />
               </div>
               <div className="form-group">
                 <label>New password</label>
                 <input type="text" ref={password}  className="form-control" />
               </div>
               <div className="form-group">
                 <label>Confirm password</label>
                 <input type="text" ref={confirmPassword}  className="form-control" />
               </div>
               <div className="submit-section">
                 <button className="btn btn-primary submit-btn" disabled={loading ? true : false}>
                 {loading ? <div className="spinner-grow text-light" role="status">
                 <span className="sr-only">Loading...</span>
             </div> : "Update Password"}</button>
               </div>
             </form>
           </div>
         </div>
       </div>
    
     </div>
     <Offcanvas/>
        </>
       
       );
   }
 
 export default ClientChangePassword;
 