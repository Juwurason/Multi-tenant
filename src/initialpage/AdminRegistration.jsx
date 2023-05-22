import React from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Phone from "../_components/Phone/Phone";
import './login.css'
import { useParams } from "react-router-dom";
import { useCompanyContext } from "../context";
import usePublicHttp from "../hooks/usePublicHttp";
import {
    headerlogo,
} from '../Entryfile/imagepath';

const AdminRegistration = () => {
    const { storeAdminEmail } = useCompanyContext();
    const navigate = useHistory();
    const { companyId } = useParams();
    const [pwdVisible, setPwdVisible] = useState(false);
    const firstName = useRef(null);
    const surName = useRef(null);
    const email = useRef(null);
    const address = useRef(null);
    const password = useRef(null);
    const confirmPassword = useRef(null);
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const publicHttp = usePublicHttp();

    let errorsObj = { firstName: '', surName: '', email: '', phone: '', address: '', password: '', confirmPassword: '' };
    const [errors, setErrors] = useState(errorsObj);
    useEffect(() => {
        const checkID = localStorage.getItem("companyId")
        if (!checkID) {
            navigate.push("/register")
        }
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token && user.role === "CompanyAdmin") {
            navigate.push('/app/main/dashboard');
        }
        if (user && user.token && user.role === "Staff") {
            navigate.push('/staff/staff/staffDashboard');
        }

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const details = {
            companyId: companyId,
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
            const { data } = await publicHttp.post(`/CompanyAdmins/company_admin?id=${companyId}`, details)
            setLoading(false)

            if (data.status === "Success") {
                toast.success(data.message)
                storeAdminEmail(data.companyAdmin?.email)
                navigate.push('/otp')

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
            <div className="cover2-bg">
                <div className="header-left p-4">
                    <span className="logo p-4">
                        <img src={headerlogo} width={40} height={40} alt="" /> &nbsp; Promax Care
                    </span>
                </div>
                <div className="container pt-3">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="shadow bg-white p-2">
                                <div className="card-body bg-none">
                                    <form className="form-horizontal" onSubmit={handleSubmit}>
                                        <h4 className="mx-auto fw-bold text-center text-primary">ADMIN REGISTRATION FORM</h4>
                                        <div className="form-group mt-3">

                                            <label className="cols-sm-2 control-label text-muted">First Name</label>
                                            <div className="cols-sm-10">
                                                <div className="input-group">
                                                    <input type="text"
                                                        ref={firstName}
                                                        placeholder="Enter Name"
                                                        className="form-control" name="name" required />
                                                </div>
                                                {errors.firstName && (
                                                    <span className="text-danger fs-6">{errors.firstName}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="cols-sm-2 control-label text-muted">Surname</label>
                                            <div className="cols-sm-10">
                                                <div className="input-group">
                                                    <input type="text"
                                                        ref={surName}
                                                        placeholder="Enter Surname"
                                                        className="form-control" name="name" required />
                                                </div>
                                                {errors.surName && (
                                                    <span className="text-danger fs-6">{errors.surName}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="cols-sm-2 control-label text-muted">Email</label>
                                            <div className="cols-sm-10">
                                                <div className="input-group">
                                                    <input type="email"
                                                        ref={email}

                                                        className="form-control" placeholder="Enter Email" required />
                                                </div>
                                                {errors.email && (
                                                    <span className="text-danger fs-6">{errors.email}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="cols-sm-2 control-label text-muted">Phone Number</label>

                                            <Phone
                                                value={value}
                                                setValue={setValue}
                                            />
                                            {errors.phone && (
                                                <span className="text-danger fs-6">{errors.phone}</span>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label className="cols-sm-2 control-label text-muted">Address</label>
                                            <div className="cols-sm-10">
                                                <div className="input-group">
                                                    <input type="text"
                                                        ref={address}
                                                        className="form-control" placeholder="Enter Address" required />
                                                </div>
                                                {errors.address && (
                                                    <span className="text-danger fs-6">{errors.address}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="cols-sm-2 control-label text-muted">Password</label>
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
                                            <label className="cols-sm-2 control-label text-muted">Confirm Password</label>
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
                                        <div className="form-group">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" defaultValue id="flexCheckChecked" defaultChecked />
                                                <label className="form-check-label text-muted" htmlFor="flexCheckChecked">
                                                    I consent to the collection and processing of my personal data in line with data regulations as described in the privacy policy
                                                </label>
                                            </div>

                                        </div>




                                        <div className="form-group w-100 ">
                                            <button type="submit" className="btn w-100 btn-primary btn-lg btn-block login-button"

                                                disabled={loading ? true : false}
                                            >
                                                {loading ? <div className="spinner-grow text-light" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div> : "Create Account"}
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default AdminRegistration;