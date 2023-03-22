
import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Applogo } from '../Entryfile/imagepath.jsx'
import './login.css'


const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  console.log(email);
  return (

    <>
      <Helmet>
        <title>Forget Password - Promax Multitenant App</title>
        <meta name="description" content="Password Reset" />
      </Helmet>


      <div className="login-form px-2" >
        <form>
          <h4 className="text-center">Reset Password</h4>
          <div className="form-group mt-4">
            <input type="email" className="form-control" placeholder="Email"
              onChange={e => setEmail(e.target.value)}

              required />
          </div>


          <div className="form-group mt-4">
            <button type="submit" className="btn btn-primary btn-lg w-100"
              disabled={loading ? true : false}
            >{loading ? <div className="spinner-grow text-light" role="status">
              <span className="sr-only">Loading...</span>
            </div> : "Proceed"}

            </button>
          </div>

          <div className="form-group mt-4">

            <p className="text-center"><span>Back to login </span> &nbsp; <Link to={'/login'}> <FaArrowLeft /></Link></p>

          </div>
        </form>
      </div>

    </>
  );
}



export default ForgotPassword;
