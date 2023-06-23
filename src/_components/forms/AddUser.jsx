import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from "react-helmet";
import { FaBackspace } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCompanyContext } from '../../context';
import useHttp from '../../hooks/useHttp';
const AddUser = () => {
    const id = JSON.parse(localStorage.getItem('user'));
    const [loading, setLoading] = useState(false)
    const firstName = useRef(null);
    const lastName = useRef(null);
    const email = useRef(null);
    const phoneNumber = useRef(null);
    const password = useRef(null);
    const confirmPassword = useRef(null);
    const role = useRef(null);
    const privateHttp = useHttp();
    const navigate = useHistory()



    const submitForm = async (e) => {
        e.preventDefault()
        if (firstName.trim() === "" || surName.trim() === "" || phoneNumber.trim() === "" ||
            email.trim() === ""
        ) {
            return toast.error("Marked Fields must be filled")
        }


        const info = {
            "firstName": firstName.current.value,
            "lastName": lastName.current.value,
            "phoneNumber": phoneNumber.current.value,
            "email": email.current.value,
            "password": password.current.value,
            "confirmPassword": confirmPassword.current.value,
            "role": role.current.value
        }


        try {
            setLoading(true)
            const { data } = await privateHttp.post(`/Account/add_user/Account/add_user`,
                info
            )
            toast.success(data.message)
            navigate.push('/app/account/alluser')
            setLoading(false)

        } catch (error) {
            toast.error("Error creating user")

            setLoading(false)

        } finally {
            setLoading(false)
        }

    }
    return (
        <div className="page-wrapper">
            <Helmet>
                <title>Add User</title>
                <meta name="description" content="" />
            </Helmet>
            <div className="content container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title mb-0">Add New User</h4>
                                <Link to={'/app/employee/allstaff'} className="card-title mb-0 text-danger fs-3 "> <MdCancel /></Link>
                            </div>

                            <div className="card-body">
                                <form onSubmit={submitForm}>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">First Name <span className="text-danger">*</span></label>
                                                <input className="form-control" required type="text" ref={firstName} onChange={e => setFirstName(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">Last Name <span className="text-danger">*</span></label>
                                                <input className="form-control" required type="text" ref={lastName} />
                                            </div>
                                        </div>

                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">Email <span className="text-danger">*</span></label>
                                                <input className="form-control" required type="email" ref={email} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">Phone Number <span className="text-danger">*</span></label>
                                                <input className="form-control" required type="tel" ref={phoneNumber} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">Password <span className="text-danger">*</span></label>
                                                <input className="form-control" required type="password" ref={password} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">Confirm Password <span className="text-danger">*</span></label>
                                                <input className="form-control" required type="password" ref={confirmPassword} />
                                            </div>
                                        </div>

                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">Role <span className="text-danger">*</span></label>
                                                <div>
                                                    <select className="form-select" ref={role}>
                                                        <option defaultValue hidden value="">--Select a role--</option>
                                                        <option value=""></option>
                                                    </select></div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="submit-section">
                                        <button className="btn btn-primary rounded submit-btn" type='submit'>

                                            {loading ? <div className="spinner-grow text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div> : "Submit"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddUser;