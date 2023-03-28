
import React, { Component, useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Applogo } from '../Entryfile/imagepath.jsx'
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { FaRegTrashAlt } from 'react-icons/fa';
import { useCompanyContext } from '../context/index.jsx';
import http from '../api/http.jsx';
import usePublicHttp from '../hooks/usePublicHttp.jsx';

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
  const publicHttp = usePublicHttp()

  useEffect(() => {
    // const checkID = localStorage.getItem("companyId")
    const checkEmail = localStorage.getItem("email")

    if (checkEmail === "") {
      navigate.push("/register")
    }

  })

  const dmail = localStorage.getItem('email')
  const handleSubmit = async () => {

    const postData = {
      email: dmail,
      otp: otp.join(''),
    }
    if (postData.otp < 5 || postData.email === '') {
      return
    } else {

      try {
        setLoading(true)
        const res = await publicHttp.post('/Account/post_otp', postData)
        toast.success(res.data.message)
        navigate.push('/login')
        localStorage.removeItem("email")
        setLoading(false)

      } catch (error) {
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
                <h1 className='text-center fw-2 mb-2 fs-1'>Check your email for a code</h1>
                <h4>
                  We've sent a 6-digit code to <span className="text-primary"> {dmail} </span>
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
                  ><FaRegTrashAlt /></button>


                </div>

                <div>
                  <button className='btn btn-primary btn-lg rounded-sm w-50' to='/dashboard'
                    onClick={handleSubmit}
                    disabled={loading ? true : false}
                  >{loading ? <div className="spinner-grow text-light" role="status">
                    <span className="sr-only">Loading...</span>
                  </div> : "Verify"}
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
