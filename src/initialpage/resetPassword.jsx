
import React, { useRef, useState } from 'react';
import { Helmet } from "react-helmet";
import { FaArrowLeft, FaLongArrowAltLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './login.css'
import usePublicHttp from '../hooks/usePublicHttp';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import loggo from '../assets/img/promaxcare_logo_white.png';


const ResetPassword = () => {
    const publicHttp = usePublicHttp();
    const [loading, setLoading] = useState(false)
    const email = useRef(null);
    const otp = useRef(null);
    const password = useRef(null);
    const confirmPassword = useRef(null);
    const navigate = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            setLoading(true);
            const { data } = await publicHttp.post(`/Account/reset_password`,
                {
                    password: password.current.value,
                    confirmPassword: confirmPassword.current.value,
                    email: email.current.value,
                    otp: otp.current.value
                }
            )
            if (data.status === "Success") {
                toast.success(data.message)
                navigate.replace(`/login`)
            } else {
                toast.error(data.message)
                setLoading(false)
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
            setLoading(false);
        }
    }



    return (

        <>
            <Helmet>
                <title>Reset Password - Promax Multitenant App</title>
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
                        <h4 className="text-center text-primary fw-bold">Create New Password</h4>
                        <div className="form-group mt-3">
                            <label className="cols-sm-2 control-label text-muted">OTP (Check your Email For a 6-digit Code)</label>
                            <input type="OTP" className="form-control" placeholder="Enter OTP"
                                ref={otp}

                                required />
                        </div>
                        <div className="form-group">
                            <input type="email" className="form-control" placeholder="Enter Email"
                                ref={email}

                                required />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Enter New password"
                                ref={password}

                                required />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Confirm New password"
                                ref={confirmPassword}

                                required />
                        </div>


                        <div className="form-group mt-4">
                            <button type="submit" className="btn btn-primary btn-lg w-100"
                                disabled={loading ? true : false}
                            >{loading ? <div className="spinner-grow text-light" role="status">
                                <span className="sr-only">Loading...</span>
                            </div> : "Submit"}

                            </button>
                        </div>

                        <div className="form-group mt-4">

                            <p className="text-center"><Link to={'/login'}> <FaLongArrowAltLeft className='text-primary fs-3' /></Link></p>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}



export default ResetPassword;
