
import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { FaArrowLeft, FaLongArrowAltLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
  headerlogo,
} from '../Entryfile/imagepath'
import './login.css'
import usePublicHttp from '../hooks/usePublicHttp';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';


const ForgotPassword = () => {
  const publicHttp = usePublicHttp();
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const navigate = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      toast.error("Enter your Email")
    }
    try {
      setLoading(true);
      const { data } = await publicHttp.get(`/Account/forgot_password?email=${email}`)
      if (data.status === "Success") {
        toast.success(data.message)
        navigate.replace(`/resetpassword`)
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
  }



  return (

    <>
      <Helmet>
        <title>Forget Password - Promax Multitenant App</title>
        <meta name="description" content="Password" />
      </Helmet>

      <div className="cover-bg">
        <div className="header-left p-4">
          <span className="logo p-4">
            <img src={headerlogo} width={40} height={40} alt="" /> &nbsp; <span className='fw-bold text-white'>Promax Care</span>
          </span>
        </div>
        <div className="login-form px-3 shadow bg-white rounded" >
          <form onSubmit={handleSubmit}>
            <h4 className="text-center text-primary fw-bold">Forgot Password</h4>
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

              <p className="text-center"><span>Back to login </span> &nbsp; <Link to={'/login'}> <FaLongArrowAltLeft className='text-primary fs-3' /></Link></p>

            </div>
          </form>
        </div>
      </div>
    </>
  );
}



export default ForgotPassword;
