
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory } from 'react-router-dom';
import './login.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import http from '../api/http.jsx';
import { toast } from 'react-toastify';
import { useCompanyContext } from '../context';
import usePublicHttp from '../hooks/usePublicHttp';


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
      console.log(data);
      if (data.response.status === "Success") {
        toast.success(data.response.message)
        localStorage.setItem("user", JSON.stringify(data.userProfile))
      }
      if (data.userProfile?.role === "CompanyAdmin") {
        navigate.push('/app/main/dashboard')

      }

      if (data.userProfile?.role === "Staff") {
        navigate.push('/staff/staff/staffDashboard')
        localStorage.setItem("staffProfile", JSON.stringify(data.staffProfile))

      }
      if (data.userProfile?.role === "Client") {
        navigate.push('/client/client/Dashboard')
        localStorage.setItem("clientProfile", JSON.stringify(data.clientProfile))

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
      navigate.push('/staff/staff/staffDashboard');
    }
    if (user && user.token && user.role === "Client") {
      navigate.push('/client/client/Dashboard');
    }
  }, []);
  return (


    <>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Login page" />
      </Helmet>


      <div className="login-form px-2" >
        <form onSubmit={handleLogin}>
          <h4 className="text-center">Login to your account</h4>
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
              minLength="6"
              maxLength="15"
              required
              className="form-control border-0" placeholder="password" />
            <button onClick={() => setPwdVisible(!pwdVisible)} type='button' className="btn">
              {pwdVisible ? <FaEye /> : <FaEyeSlash />}


            </button>
            {/* <input type="password" className="form-control" placeholder="Password" required="required" /> */}
          </div>


          <div className="form-group mt-4">
            <button type="submit" className="btn btn-primary btn-lg w-100"
              disabled={loading ? true : false}
            >{loading ? <div className="spinner-grow text-light" role="status">
              <span className="sr-only">Loading...</span>
            </div> : "Log in"}

            </button>
          </div>
          <div className="clearfix mt-4">
            <label className="pull-left checkbox-inline"><input type="checkbox" defaultChecked /> Remember me</label>
            <Link to={'/forgotpassword'} className="pull-right">Forgot Password?</Link>
          </div>
          <div className="form-group mt-4">

            <p className="text-center"><span>Don't have an account?  </span> &nbsp; <Link to={'/register'}> Create an Account</Link></p>

          </div>
        </form>
      </div>

    </>
  );
}


export default Loginpage;
