import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { MdCancel } from 'react-icons/md';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import useHttp from '../../hooks/useHttp';
import { FaBackspace, FaCaretRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplate } from '../../store/slices/FormTemplateSlice';
const AddStaff = () => {
    const id = JSON.parse(localStorage.getItem('user'));
    const [loading, setLoading] = useState(false)
    const [firstName, setFirstName] = useState('');
    const [surName, setSurName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [offerLetter, setOfferLetter] = useState(null);
    const privateHttp = useHttp();
    const navigate = useHistory()
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchTemplate(id.companyId));
    }, [dispatch]);

    const loading1 = useSelector((state) => state.template.isLoading);
    const template = useSelector((state) => state.template.data);
    const filteredTemplates = template.filter((template) => template.templateType === "Non-Editable");
    // console.log(filteredTemplates);
    const submitForm = async (e) => {
        e.preventDefault()
        if (firstName.trim() === "" || surName.trim() === "" || phoneNumber.trim() === "" ||
            email.trim() === ""
        ) {
            return toast.error("Marked Fields must be filled");
        }


        const formData = new FormData()
        // Add input field values to formData
        formData.append("CompanyId", id.companyId);
        formData.append("FirstName", firstName);
        formData.append("SurName", surName);
        formData.append("MiddleName", middleName);
        formData.append("Address", address);
        formData.append("Email", email);
        formData.append("PhoneNumber", phoneNumber);
        formData.append("OfferLetter", offerLetter);


        try {
            setLoading(true)
            const { data } = await privateHttp.post(`/Staffs/add_staff?userId=${id.userId}`,
                formData
            )
            toast.success(data.message)
            navigate.push('/app/employee/allstaff')
            setLoading(false)

        } catch (error) {
            toast.error("Error Creating Staff")
            toast.error(error.response?.data?.message)
            setLoading(false)

        } finally {
            setLoading(false)
        }

    }
    return (
        <div className="page-wrapper">
            <Helmet>
                <title>Add Staff</title>
                <meta name="description" content="" />
            </Helmet>
            <div className="content container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title mb-0">Add New Staff</h4>
                                <Link to={'/app/employee/allstaff'} className="card-title mb-0 text-danger fs-3 "> <MdCancel /></Link>
                            </div>

                            <div className="card-body">
                                <form onSubmit={submitForm}>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">First Name <span className="text-danger">*</span></label>
                                                <input className="form-control" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
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
                                                <label className="col-form-label">Middle Name </label>
                                                <input className="form-control" type="text" value={middleName} onChange={e => setMiddleName(e.target.value)} />
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
                                                <label className="col-form-label">Address </label>
                                                <input className="form-control" type="text" value={address} onChange={e => setAddress(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label className="col-form-label"> Upload Offer Letter <span className="text-danger">*</span></label>
                                                <div><input className="form-control" type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    maxsize={1024 * 1024 * 2}
                                                    onChange={e => setOfferLetter(e.target.files[0])} /></div>

                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label className="col-form-label">List of Documents to be sent as an attachment to staffs invite mail <span className="text-danger">*</span></label>

                                                <div className='d-flex gap-2 flex-column'>
                                                    {loading1 ? (
                                                        <>
                                                            <span className="spinner-border text-white spinner-border-sm me-2" aria-hidden="true" />
                                                            Please wait...
                                                        </>
                                                    ) : (
                                                        <>
                                                            {filteredTemplates.length > 0 ? (
                                                                filteredTemplates.map((data, index) => (
                                                                    <div key={index}>
                                                                        <span className='fw-bold'>
                                                                            <FaCaretRight />
                                                                            <span className='fw-bold'>{data.templateName}</span>
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            ) : null}
                                                          
                                                        </>
                                                    )}
                                                </div>

                                                <div>
                                                <Link to="/app/setup/create-template" className="btn btn-info rounded-2 text-white">
                                                   Click Me
                                                </Link>
                                             </div>


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

export default AddStaff;