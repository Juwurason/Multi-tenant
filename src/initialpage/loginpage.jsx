
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory } from 'react-router-dom';
import './login.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import http from '../api/http.jsx';
import { toast } from 'react-toastify';
import { useCompanyContext } from '../context';


const Loginpage = () => {
  const [email, setEmail] = useState('teecreations8@gmail.com');
  const [password, setPassword] = useState('1234567');
  const [pwdVisible, setPwdVisible] = useState(false)
  let errorsObj = { email: '', password: '' };
  const [errorss, setErrorss] = useState(errorsObj);
  const [loading, setLoading] = useState(false)
  const navigate = useHistory()

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
      const { data } = await http.post('/Account/auth_login', info)
      console.log(data);
      if (data.response.status === "Success") {
        toast.success(data.response.message)
        localStorage.setItem("user", JSON.stringify(data.userProfile))
        navigate.push('/app/main/dashboard')
      } else {

      }


    } catch (error) {

      console.log(error.response.data);
      if (error.response?.data?.message === 'User Not Found') {
        toast.error('User not found')
      }
      else if (error.response?.data?.message === 'Email Not Confirmed') {
        toast.error(error.response?.data?.message)
      }

    }
    finally {
      setLoading(false)
    }
  }

  const { userProfile } = useCompanyContext();
  console.log(userProfile);

  return (


    <>
      <Helmet>
        <title>Login - Promax Multitenant App</title>
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
            <label className="pull-left checkbox-inline"><input type="checkbox" /> Remember me</label>
            <Link to={'/forgotpassword'} className="pull-right">Forgot Password?</Link>
          </div>
          <div className="form-group mt-4">

            <p className="text-center"><span>Don't have an account?    </span> &nbsp; <Link to={'/register'}> Create an Account</Link></p>

          </div>
        </form>
      </div>

    </>
  );
}


export default Loginpage;
