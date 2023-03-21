import React from "react";
import { Helmet } from "react-helmet";
import { NavLink, useHistory } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// import { useCompanyContext } from "../../context";
import Phone from "../_components/Phone/Phone";

const AdminRegistration = () => {
    // const { companyId, storeAdminEmail } = useCompanyContext();
    const navigate = useHistory()
    const [pwdVisible, setPwdVisible] = useState(false)
    const firstName = useRef(null)
    const surName = useRef(null)
    const email = useRef(null)
    const address = useRef(null)
    const password = useRef(null)
    const confirmPassword = useRef(null)
    const [value, setValue] = useState("")
    const [loading, setLoading] = useState(false)
    let errorsObj = { firstName: '', surName: '', email: '', phone: '', address: '', password: '', confirmPassword: '' };
    const [errors, setErrors] = useState(errorsObj);
    // useEffect(() => {

    //     const storedCompanyId = localStorage.getItem('companyId');



    //     if (companyId === "") {
    //         navigate("/register")
    //     }


    // }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const details = {
            // companyId: companyId,
            firstName: firstName.current.value,
            surName: surName.current.value,
            email: email.current.value,
            phoneNumber: value,
            address: address.current.value,
            password: password.current.value,
            confirmPassword: confirmPassword.current.value
        }
        let error = false;
        const errorObj = { ...errorsObj };
        if (details.firstName === '') {
            errorObj.firstName = 'First Name cannot be empty';
            error = true;
        }
        if (details.surName === '') {
            errorObj.surName = 'Surname cannot be empty';
            error = true;
        }
        if (details.email === '') {
            errorObj.email = 'Email cannot be empty';
            error = true;
        }
        if (details.phoneNumber < 9) {
            errorObj.phone = 'Enter a valid Phone Number';
            error = true;
        }

        if (details.address === '') {
            errorObj.companyAddress = 'Address cannot be empty';
            error = true;
        }
        if (details.password === '') {
            errorObj.password = 'Password is Required';
            error = true;
        }
        if (details.confirmPassword !== details.password) {
            errorObj.confirmPassword = 'Password does not match';
            error = true;
        }
        setErrors(errorObj);
        if (error) return;
        setLoading(false)

        try {
            setLoading(true)
            const { data } = await axios.post(`http://profitmax-001-site8.ctempurl.com/api/CompanyAdmins/company_admin?id=${companyId}`, details)
            console.log(data);
            setLoading(false)

            if (data.status === "Success") {
                toast.success(data.message)
                storeAdminEmail(data.companyAdmin?.email)
                navigate('/email-confirmation')

            } else {
                toast.error(data.message)
                return
            }
            setLoading(false)
        } catch (error) {
            console.log(error.response.data.message);
            toast.error(error.response.data.message)
            setLoading(false);
        }
    }
    return (
        <>
            <Helmet>
                <title>Admin Setup - Promax Multitenant APP</title>
                <meta name="description" content="Admin Registration Page" />
            </Helmet>

            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card px-2">
                            <h4 className="card-header mx-auto fw-5">ADMIN REGISTRATION FORM</h4>
                            <div className="card-body">
                                <form className="form-horizontal" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name" className="cols-sm-2 control-label">First Name</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                                <input type="text"
                                                    ref={firstName}
                                                    placeholder="Enter Name"
                                                    className="form-control" name="name" />
                                            </div>
                                            {errors.firstName && (
                                                <span className="text-danger fs-6">{errors.firstName}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name" className="cols-sm-2 control-label">Surname</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                                <input type="text"
                                                    ref={surName}
                                                    placeholder="Enter Surname"
                                                    className="form-control" name="name" />
                                            </div>
                                            {errors.surName && (
                                                <span className="text-danger fs-6">{errors.surName}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="cols-sm-2 control-label">Email</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                                <input type="email"
                                                    ref={email}

                                                    className="form-control" name="email" id="email" placeholder="Enter Email" />
                                            </div>
                                            {errors.email && (
                                                <span className="text-danger fs-6">{errors.email}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="cols-sm-2 control-label">Phone Number</label>

                                        <Phone
                                            value={value}
                                            setValue={setValue}
                                        />
                                        {errors.phone && (
                                            <span className="text-danger fs-6">{errors.phone}</span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="cols-sm-2 control-label">Address</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                                <input type="email"
                                                    ref={address}
                                                    className="form-control" name="email" id="email" placeholder="Enter Address" />
                                            </div>
                                            {errors.address && (
                                                <span className="text-danger fs-6">{errors.address}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="cols-sm-2 control-label">Password</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group border">
                                                <input

                                                    ref={password}
                                                    type={pwdVisible ? "text" : "password"}
                                                    name="password"
                                                    minLength="6"
                                                    maxLength="15"
                                                    required



                                                    className="form-control border-0" placeholder="password" />
                                                <button onClick={() => setPwdVisible(!pwdVisible)} type='button' className="btn">
                                                    {pwdVisible ? <FaEye /> : <FaEyeSlash />}


                                                </button>
                                            </div>
                                            {errors.password && (
                                                <span className="text-danger fs-6">{errors.password}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="cols-sm-2 control-label">Confirm Password</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                                <input

                                                    ref={confirmPassword}
                                                    type={pwdVisible ? "text" : "password"}
                                                    name="password"
                                                    minLength="6"
                                                    maxLength="15"
                                                    required



                                                    className="form-control" placeholder="Confirm password" />
                                            </div>
                                            {errors.confirmPassword && (
                                                <span className="text-danger fs-6">{errors.confirmPassword}</span>
                                            )}
                                        </div>
                                    </div>





                                    <div className="form-group w-100 ">
                                        <button type="submit" className="btn w-100 btn-primary btn-lg btn-block login-button">Create Account</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default AdminRegistration;