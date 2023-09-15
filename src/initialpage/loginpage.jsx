
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory } from 'react-router-dom';
import './login.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import usePublicHttp from '../hooks/usePublicHttp';
import CryptoJS from 'crypto-js';
import loggo from '../assets/img/promaxcare_logo_white.png'


const Loginpage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pwdVisible, setPwdVisible] = useState(false);
  let errorsObj = { email: '', password: '' };
  const [errorss, setErrorss] = useState(errorsObj);
  const [loading, setLoading] = useState(false);
  const navigate = useHistory();
  const publicHttp = usePublicHttp();



  const handleLogin = async (e) => {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    if (email.trim() === '') {
      errorObj.email = 'Email cannot be empty';
      error = true;
    }
    if (password.trim() === '') {
      errorObj.password = 'Password cannot be empty';
      error = true;
    }

    setErrorss(errorObj);
    if (error) return;

    const info = {
      email,
      password,
      rememberMe: true
    }




    try {
      setLoading(true)

      const { data } = await publicHttp.post('/Account/auth_login', info)

      if (data.response.status === "Success") {
        toast.success(data.response.message)
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data.data), 'promax-001#').toString();
        localStorage.setItem('userEnc', encryptedData);
        localStorage.setItem("user", JSON.stringify(data.userProfile));
        { data.userProfile?.role === "Administrator" ? localStorage.setItem("adminAttendance", JSON.stringify(data.adminAttendance)) : "" }
      }
      if (data.userProfile?.role === "CompanyAdmin" || data.userProfile?.role === "Administrator") {
        navigate.push('/app/main/dashboard')

      }

      if (data.claims) {
        const filteredClaims = data.claims.filter(claim => {
          return claim.properties;
        });
        localStorage.setItem("claims", JSON.stringify(filteredClaims))
      }

      if (data.userProfile?.role === "Staff") {
        navigate.push('/staff/staff/dashboard')
        localStorage.setItem("staffProfile", JSON.stringify(data.staffProfile))

      }
      if (data.userProfile?.role === "Client") {
        navigate.push('/client/app/dashboard')
        localStorage.setItem("clientProfile", JSON.stringify(data.clientProfile))

      }
      else {
        navigate.push('/app/main/user-dashboard')
        // localStorage.setItem("adminProfile", JSON.stringify(data.adminProfile))

      }


    } catch (error) {
      // console.log(error);
      toast.error("Login Failed");
      if (error.response?.data?.message === 'User Not Found') {
        toast.error('User not found')
      }
      else if (error.response?.data?.message === 'Email Not Confirmed') {
        toast.error(error.response?.data?.message)
        localStorage.setItem('email', email);
        navigate.push('/otp')
      }
      else if (error.response.data.message === "Email Not Confirmed. An OTP has been sent to your mail to confirm your email") {
        toast.error(error.response?.data?.message)
        localStorage.setItem('email', email);
        navigate.push('/otp')
      }
      else if (error.response?.data?.message === 'Invalid Login Attempt') {
        toast.error("Incorrect Password")
      }
    }
    finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token && user.role === "CompanyAdmin" || user && user.token && user.role === "Administrator") {
      navigate.push('/app/main/dashboard');
    }
    if (user && user.token && user.role === "Staff") {
      navigate.push('/staff/main/dashboard');
    }
    if (user && user.token && user.role === "Client") {
      navigate.push('/client/client');
    }
    // if (user && user.token && user.role === "Admin") {
    //   navigate.push('/administrator/administrator');
    // }
  }, []);
  return (


    <>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Login page" />
      </Helmet>


      <div className='cover-bg px-2'>
        <div className="header-left p-4">
          <span className="logo p-4">
            <img src={loggo} width={180} height={180} alt="" />
          </span>
        </div>
        <div className="login-form px-1 shadow bg-white rounded" >
          <form onSubmit={handleLogin}>
            <h3 className="text-center text-primary fw-bold">Sign in to your account</h3>
            <div className="form-group mt-4">
              <input type="email" className="form-control" placeholder="Email"
                onChange={e => setEmail(e.target.value)}
                value={email}
                required />
            </div>
            <div className="form-group d-flex justify-content-between border mt-4">
              <input
                autoComplete="current-password"
                onChange={e => setPassword(e.target.value)}
                value={password}
                type={pwdVisible ? "text" : "password"}
                name="password"
                // minLength="6"
                // maxLength="15"
                required
                className="form-control border-0" placeholder="Password" />
              <button onClick={() => setPwdVisible(!pwdVisible)} type='button' className="btn">
                {pwdVisible ? <FaEye /> : <FaEyeSlash />}


              </button>
              {/* <input type="password" className="form-control" placeholder="Password" required="required" /> */}
            </div>


            <div className="form-group mt-4">
              <button type="submit" className="btn btn-info  text-white btn-lg w-100"
                disabled={loading ? true : false}
              >{loading ? <div className="spinner-grow text-light" role="status">
                <span className="sr-only">Loading...</span>
              </div> : "Log in"}

              </button>
            </div>
            <div className="clearfix mt-4">
              <label className="pull-left checkbox-inline"><input type="checkbox" defaultChecked /> Remember me</label>
              <Link to={'/forgotpassword'} className="pull-right text-info">Forgot Password?</Link>
            </div>
            {/* <div className="form-group mt-4">

              <p><span>Don't have an account?  </span> &nbsp; <Link to={'/register'} className="text-info"> Create an Account</Link></p>

            </div> */}
            <br />
            <br />

          </form>
        </div>
      </div>

    </>
  );
}


export default Loginpage;
