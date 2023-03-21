/**
 * Signin Firebase
 */

import React, { Component, useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Applogo } from '../Entryfile/imagepath.jsx'
import { Link, NavLink, useHistory } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BsArrowCounterclockwise } from 'react-icons/bs';
// import { useCompanyContext } from "../../context";

const OTPscreen = () => {
  // const { email, companyId } = useCompanyContext();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false)
  const navigate = useHistory()

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index) ? element.value : d)])

    //focus on next element
    if (element.nextSibling) {
      element.nextSibling.focus()
    }

    element.addEventListener('keydown', function (event) {
      if (event.key === 'Backspace' || event.keyCode === 8) {

        // if (element.previousSibling) {
        //     element.previousSibling.focus();
        // }
      }
    });

  };
  // useEffect(() => {
  //   const storedAdminEmail = localStorage.getItem('email');
  //   if (email === "" || companyId === "") {
  //     navigate("/register")
  //   }

  // })


  const handleSubmit = async (event) => {

    const postData = {
      email: email,
      otp: otp.join(''),
      companyId: companyId
    }
    if (postData.otp < 5 || postData.email === '' || postData.companyId === null) {
      return
    } else {

      try {
        setLoading(true)
        const res = await axios.post(' http://profitmax-001-site8.ctempurl.com/api/Account/post_otp', postData)
        console.log(res.data);
        toast.success(res.data.message)
        setLoading(false)

      } catch (error) {
        console.log(error.response.data);
        toast.error(error.response.data.message)
        setLoading(false)
      }

    }

  }
  return (
    <>
      <Helmet>
        <title>OTP - Promax Multitenant APP</title>
        <meta name="description" content="Login page" />
      </Helmet>
      <div className='authincation h-100 p-meddle'>
        <div className='container h-100  mt-5'>
          <div className='row justify-content-center h-100 align-items-center'>
            <div className='col-md-7   py-5'>
              <div className='text-center w-100 d-flex flex-column gap-4'>
                <h2 className='text-center font-weight-bold mb-2 fs-1'>Check your email for a code</h2>
                <h4>
                  <i className='fa fa-lock text-primary mb-2' />  We've sent a 6-digit code to <span className="text-primary">tmail@mail.com </span>
                  The code expires shortly.
                </h4>

                <div className="d-flex justify-content-center flex-column align-items-center">
                  <div className="d-flex gap-2">
                    {
                      otp.map((value, i) =>

                        <input
                          type="text"
                          maxLength={1}
                          className="form-control fs-3 mb-2 rounded-sm border border-2 bg-none "
                          style={{ width: '3.2rem', height: "3.2rem", textAlign: "center" }}
                          key={i}
                          value={value}
                          onChange={(e) => handleChange(e.target, i)}
                          onFocus={e => e.target.select()}
                        />
                      )
                    }
                  </div>
                  <button className="btn"
                    onClick={e => setOtp([...otp.map(v => "")])}
                  ><BsArrowCounterclockwise /></button>


                </div>

                <div>
                  <button className='btn btn-primary btn-lg rounded-sm w-50' to='/dashboard'
                    onClick={handleSubmit}>
                    {/* <span className="spinner-border spinner-border-sm"></span> */}

                    Verify OTP
                  </button>
                </div>
                <div>
                  <span> Can't find your code? Check your spam folder. or </span>
                  <a className="text-primary"
                    onClick={e => setOtp([...otp.map(v => "")])}
                  >Resend OTP</a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  );
}


export default OTPscreen;
