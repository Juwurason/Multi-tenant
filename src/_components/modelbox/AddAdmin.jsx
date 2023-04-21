import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import useHttp from '../../hooks/useHttp';

const AddAdmin = () => {
    const [loading, setLoading] = useState(false)
    const [firstName, setFirstName] = useState('');
    const [surName, setSurName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const privateHttp = useHttp();
    const navigate = useHistory();


    const submitForm = async (e) => {
        e.preventDefault()
        if (firstName.trim() === "" || surName.trim() === "" || address.trim() === "" ||
            email.trim() === "" || password === ""
        ) {
            return toast.error("All Fields must be filled")
        }
        if (password !== confirmPassword
        ) {
            return toast.error("Password not Match")
        }
        const id = JSON.parse(localStorage.getItem('user'));



        try {
            setLoading(true)
            const { data } = await privateHttp.post(`/CompanyAdmins/company_admin?id=${id.companyId}`,
                {
                    companyId: id.companyId,
                    firstName,
                    surName,
                    email,
                    phoneNumber,
                    address,
                    password,
                    confirmPassword
                }
            )
            toast.success(data.message)

            // navigate.push('/app/main/dashboard')
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
        <>
            {/* Add Employee Modal */}
            <div id="add_admin" className="modal custom-modal fade" role="dialog">
                <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                    <div className="modal-content overflow-auto">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Administrators</h5>
                            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={submitForm}>
                                <div className="row">
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
                                            <input className="form-control" type="text" value={surName} onChange={e => setSurName(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="col-form-label">Email <span className="text-danger">*</span></label>
                                            <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="col-form-label">Phone Number <span className="text-danger">*</span></label>
                                            <input className="form-control" type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="col-form-label">Address <span className="text-danger">*</span></label>
                                            <input className="form-control" type="text" value={address} onChange={e => setAddress(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="col-form-label">Password <span className="text-danger">*</span></label>
                                            <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="col-form-label">Confirm Password <span className="text-danger">*</span></label>
                                            <input className="form-control" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
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
            {/* /Add Employee Modal */}
        </>
    )
}

export default AddAdmin