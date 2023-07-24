
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaBackspace } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCompanyContext } from '../../context';
import useHttp from '../../hooks/useHttp';
const EditAccount = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [userOne, setUserOne] = useState({});
    const [editedUser, setEditedUser] = useState({});
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const { get, post } = useHttp()
    const navigate = useHistory();
    const { uid } = useParams();

    function handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        const newValue = value === "" ? "" : value;
        setEditedUser({
            ...editedUser,
            [name]: newValue
        });
    }


    useEffect(() => {
        const FetchUser = async () => {
            try {
                const { data } = await get(`/Account/get_a_user?userId=${uid}`, { cacheTimeout: 300000 })
                setUserOne(data);
                setEditedUser(data);

            } catch (error) {
                console.log(error);
            }
        }
        FetchUser()
    }, [])

    const id = JSON.parse(localStorage.getItem('user'));
    const submitForm = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const { data } = await post(`/Account/user_edit/${uid}?userId=${id.userId}`,
                {
                    email: editedUser.email,
                    id: uid,
                    firstName: editedUser.firstName,
                    lastName: editedUser.lastName,
                    phoneNumber: editedUser.lastName,
                }
            )
            toast.success(data.message)

            navigate.push('/app/account/alluser')
            setLoading(false);


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
                                <Link to={'/app/account/alluser'} className="card-title mb-0 text-danger fs-3 "> <MdCancel /></Link>
                            </div>
                            <div className="card-body">
                                <form onSubmit={submitForm}>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">Email <span className="text-danger">*</span></label>
                                                <input className="form-control" name="email" value={editedUser.email || ''} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">First Name <span className="text-danger">*</span></label>
                                                <input className="form-control" type="text"
                                                    autoComplete='false'
                                                    name="firstName" value={editedUser.firstName || ''} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">Last Name <span className="text-danger">*</span></label>
                                                <input className="form-control" type="text" name="lastName" value={editedUser.lastName || ''} onChange={handleInputChange} />
                                            </div>
                                        </div>


                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">Phone Number <span className="text-danger">*</span></label>
                                                <input className="form-control" type="tel" name="phoneNumber" value={editedUser.phoneNumber || ''} onChange={handleInputChange} />
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

export default EditAccount;