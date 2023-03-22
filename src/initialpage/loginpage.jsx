/**
 * Signin Firebase
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import { Applogo } from '../Entryfile/imagepath.jsx'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { alphaNumericPattern, emailrgx } from '../constant'
import './login.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const schema = yup
  .object({

    email: yup
      .string()
      .matches(emailrgx, 'Email is required')
      .required('Email is required')
      .trim(),
    password: yup.string().min(6)
      .max(6).required('Password is required')
      .trim(),
  })

const Loginpage = (props) => {
  const [pwdVisible, setPwdVisible] = useState(false)

  const [eye, seteye] = useState(true);
  const [emailerror, setEmailError] = useState("");
  const [nameerror, setNameError] = useState("");
  const [passworderror, setPasswordError] = useState("");
  const [formgroup, setFormGroup] = useState("");
  const [inputValues, setInputValues] = useState({
    email: "admin@dreamguys.co.in",
    password: "123456",
  });

  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data) => {
    console.log("data", data)

    if (data.password != "123456") {
      setError('password', {
        message: 'password is mismatch',
      })
    } else {
      clearErrors('password')
      props.history.push('/app/main/dashboard')

    }
  }

  const onEyeClick = () => {
    seteye(!eye)
  }
  return (


    <>
      <Helmet>
        <title>Login - Promax Multitenant App</title>
        <meta name="description" content="Login page" />
      </Helmet>


      <div className="login-form px-2">
        <form>
          <h4 className="text-center">Login to your account</h4>
          <div className="form-group mt-4">
            <input type="text" className="form-control" placeholder="Username" required="required" />
          </div>
          <div className="form-group d-flex justify-content-between border mt-4">
            <input


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
            <button type="submit" className="btn btn-primary w-100">Log in</button>
          </div>
          <div className="clearfix mt-4">
            <label className="pull-left checkbox-inline"><input type="checkbox" /> Remember me</label>
            <a href="#" className="pull-right">Forgot Password?</a>
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
