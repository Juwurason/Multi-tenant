import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaBackspace } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCompanyContext } from '../../../context';
import useHttp from '../../../hooks/useHttp';
const EditUsers = () => {
    const { loading, setLoading } = useCompanyContext();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [userOne, setUserOne] = useState({});
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const { get, post } = useHttp()
    const navigate = useHistory();
    const { uid } = useParams();

    useEffect(() => {
        const FetchUser = async () => {
            try {
                const { data } = await get(`/Account/get_all_users/${uid}`, { cacheTimeout: 300000 })
                console.log(data);
                setUserOne(data)


            } catch (error) {
                console.log(error);
            }
        }
        FetchUser()
    }, [])

    const submitForm = async (e) => {
        e.preventDefault()
        if (firstName.trim() === "" || lastName.trim() === "" || phoneNumber.trim() === "" ||
            email.trim() === "" || password === ""
        ) {
            return toast.error("All Fields must be filled")
        }

        const id = JSON.parse(localStorage.getItem('user'));



        try {
            setLoading(true)
            const { data } = await post(`/Account/user_edit/{id}?userId=${id.userId}`,
                {
                    email,
                    id: uid,
                    firstName,
                    lastName,
                    phoneNumber
                }
            )
            toast.success(data.message)

            navigate.push('/administrator/allUsers')
            setLoading(false);
            setSurName('');
            setFirstName('');
            setEmail('');
            setAddress('');
            setPassword('');
            setConfirmPassword('');
            setPhoneNumber('');

        } catch (error) {
            toast.error(error.response?.data?.message)

            setLoading(false)

        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="page-wrapper">
            <Helmet>
                <title>Edit User - Promax</title>
                <meta name="description" content="" />
            </Helmet>
            <div className="content container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">

                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title mb-0">Edit User</h4>
                                <Link to={'/administrator/allUsers'} className="card-title mb-0 text-danger fs-3 "> <MdCancel /></Link>
                            </div>
                            <div className="card-body">
                                <form onSubmit={submitForm}>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">Email <span className="text-danger">*</span></label>
                                                <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">First Name <span className="text-danger">*</span></label>
                                                <input className="form-control" type="text"
                                                    autoComplete='false'
                                                    value={firstName} onChange={e => setFirstName(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">Last Name <span className="text-danger">*</span></label>
                                                <input className="form-control" type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
                                            </div>
                                        </div>


                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">Phone Number <span className="text-danger">*</span></label>
                                                <input className="form-control" type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                                            </div>
                                        </div>

                                    </div>

                                    <div className="submit-section">
                                        <button className="btn btn-primary submit-btn" type='submit'>

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

export default EditUsers;