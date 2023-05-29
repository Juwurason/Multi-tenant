
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory } from 'react-router-dom';
import './login.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import usePublicHttp from '../hooks/usePublicHttp';
import {
  headerlogo,
} from '../Entryfile/imagepath'


const Loginpage = () => {
  const [email, setEmail] = useState('teecreations8@gmail.com');
  const [password, setPassword] = useState('1234567');
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
        localStorage.setItem("user", JSON.stringify(data.userProfile))
      }
      if (data.userProfile?.role === "CompanyAdmin") {
        navigate.push('/app/main/dashboard')

      }

      if (data.userProfile?.role === "Staff") {
        navigate.push('/staff/staff')
        localStorage.setItem("staffProfile", JSON.stringify(data.staffProfile))

      }
      if (data.userProfile?.role === "Client") {
        navigate.push('/client/client')
        localStorage.setItem("clientProfile", JSON.stringify(data.clientProfile))

      }
      if (data.userProfile?.role === "Admin") {
        navigate.push('/administrator/administrator')
        localStorage.setItem("adminProfile", JSON.stringify(data.adminProfile))

      }


    } catch (error) {

      toast.error(error.message);
      if (error.response?.data?.message === 'User Not Found') {
        toast.error('User not found')
      }
      else if (error.response?.data?.message === 'Email Not Confirmed') {
        toast.error(error.response?.data?.message)
        localStorage.setItem('email', email)
        navigate.push('/otp')
      }
      else if (error.response?.data?.message === "Email Not Confirmed. An OTP has been sent to your mail to confirm your email") {
        toast.error(error.response?.data?.message)
        localStorage.setItem('email', email)
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
    if (user && user.token && user.role === "CompanyAdmin") {
      navigate.push('/app/main/dashboard');
    }
    if (user && user.token && user.role === "Staff") {
      navigate.push('/staff/staff');
    }
    if (user && user.token && user.role === "Client") {
      navigate.push('/client/client');
    }
    if (user && user.token && user.role === "Admin") {
      navigate.push('/administrator/administrator');
    }
  }, []);
  return (


    <>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Login page" />
      </Helmet>


      <div className='cover-bg'>
        <div className="header-left p-4">
          <span className="logo p-4">
            <img src={headerlogo} width={40} height={40} alt="" /> &nbsp; Promax Care
          </span>
        </div>
        <div className="login-form px-3 shadow bg-white rounded" >
          <form onSubmit={handleLogin}>
            <h3 className="text-center text-primary">Sign in to your account</h3>
            <div className="form-group mt-4">
              <input type="email" className="form-control" placeholder="Email"
                onChange={e => setEmail(e.target.value)}
                value={email}
                required />
            </div>
            <div className="form-group d-flex justify-content-between border mt-4">
              <input

                onChange={e => setPassword(e.target.value)}
                value={password}
                type={pwdVisible ? "text" : "password"}
                name="password"
                minLength="4"
                maxLength="15"
                required
                className="form-control border-0" placeholder="password" />
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
