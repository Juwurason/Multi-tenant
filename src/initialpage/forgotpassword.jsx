
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
import loggo from '../assets/img/promaxcare_logo_white.png';


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
        navigate.replace(`/resetpassword`);
        setLoading(false)

      } else {
        toast.error(data.message)

        setLoading(false)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      toast.error(error.response.data.title);
      setLoading(false);
    }
  }



  return (

    <>
      <Helmet>
        <title>Forget Password -</title>
        <meta name="description" content="Password" />
      </Helmet>

      <div className="cover-bg px-2">
        <div className="header-left p-4">
          <span className="logo p-4">
            <img src={loggo} width={180} height={180} alt="" />
          </span>
        </div>
        <div className="login-form px-1 shadow bg-white rounded" >
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
