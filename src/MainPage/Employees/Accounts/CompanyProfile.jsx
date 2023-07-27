
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from "react-helmet";
import Offcanvas from '../../../Entryfile/offcanvance';
import useHttp from '../../../hooks/useHttp';
import { FaCamera, FaRegEdit } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axiosInstance from '../../../store/axiosInstance';



const CompanyProfile = () => {
    const id = JSON.parse(localStorage.getItem('user'));
    const [companyOne, setCompanyOne] = useState({});
    const [editedCompany, setEditedCompany] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [image, setImage] = useState("");

    const privateHttp = useHttp();
    const FetchCompany = async () => {
        try {
            const { data } = await axiosInstance.get(`/Companies/get_company/${id.companyId}`, { cacheTimeout: 300000 })
            setCompanyOne(data.company)
            // console.log(data.company);
            setEditedCompany({ ...data.company })


        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        FetchCompany()
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedCompany((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handlechange = (e) => {
        setImage(e.target.files[0]);
    }
    

    const styles = {
        main: {
            backgroundColor: 'black',
            display: 'none',

        },
        label: {
            width: '250px',
            cursor: "pointer",
            display: "flex", justifyContent: "center", alignItems: "center", textAlign: 'center'
        }
    }
    const HandleSubmit = async (e) => {
        e.preventDefault();
        // toast("Not editable at the moment");
       
    const formData = new FormData()
    formData.append("CompanyId", id.companyId);
    formData.append("CompanyName", editedCompany.companyName);
    formData.append("CompanyEmail", editedCompany.companyEmail);
    formData.append("companyAddress", editedCompany.companyAddress);
    formData.append("companyPhone", editedCompany.companyPhone);
    formData.append("companyState", companyOne.companyState);
    formData.append("companyDetails", companyOne.companyDetails);
    formData.append("companyHead", editedCompany.companyHead);
    formData.append("PackagesId", companyOne.packagesId);
    formData.append("SubscribtionDate", companyOne.subscribtionDate);
    formData.append("ExpirationDate", companyOne.expirationDate);
    formData.append("IsApproved", companyOne.isApproved);
    formData.append("CompanyLogoFile", image);
        try {
            const { data } = await axiosInstance.post(`/Companies/edit/${id.companyId}`, formData)
            if (data.status === 'Success') {
                toast.success(data.message);
                 setShowModal(false);
                 FetchCompany()
              } else {
                toast.error(data.message);
              }
        

        } catch (error) {
            console.log(error);
        }
        finally {
            // setLoading(false)
          }
    }

    return (
        <>
            <div className="page-wrapper">
                <Helmet>
                    <title>Company Profile</title>
                    <meta name="description" content="Company Profile" />
                </Helmet>
                <div className="content container-fluid">
                    <div className="row">

                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h4 className="card-title mb-0 fw-bold">Company Profile</h4>
                                    <span className="card-title mb-0 text-info fs-3 pointer"
                                        onClick={() => setShowModal(true)}
                                    > <FaRegEdit /></span>
                                </div>

                                <div className="card-body">
                                    <form action="#">
                                        <div className="row">
                                            <div style={{ display: "flex", justifyContent: 'center' }}>
                                                <div className="form-group">
                                                    <label style={styles.label}>
                                                        <img className="" style={{ width: '100%', height: '100%' }}
                                                            src={companyOne.companyLogo || ""} alt="company logo" />
                                                    </label>

                                                </div>
                                            </div>



                                            <div className="form-group col-md-6">
                                                <label>Company Head</label>
                                                <input type="text" className="form-control"
                                                    value={companyOne.companyHead} readOnly
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>Company Name</label>
                                                <input type="text" className="form-control"
                                                    value={companyOne.companyName} readOnly
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>Company Email</label>
                                                <input type="text" className="form-control"
                                                    value={companyOne.companyEmail} readOnly
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>Company Address</label>
                                                <input type="text" className="form-control"
                                                    value={companyOne.companyAddress} readOnly
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>Company Phone</label>
                                                <input type="text" className="form-control"
                                                    value={companyOne.companyPhone} readOnly
                                                />
                                            </div>

                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={showModal} onHide={() => setShowModal(false)} size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title className='fw-bold'>Edit Company Profile </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form action="#" onSubmit={HandleSubmit}>
                            <div className="row">
                                <div style={{ display: "flex", justifyContent: 'center' }}>
                                    <div className="form-group">
                                        <label style={styles.label} className="border border-2 rounded-pill">
                                            <img className="rounded-pill" style={{ width: '100%', height: '100%' }}
                                                src={image === "" ? "" : URL.createObjectURL(image)} alt="Company Logo" />
                                        </label>

                                        <label style={{ display: 'flex', justifyContent: 'center' }}>
                                            <FaCamera />
                                            <input type="file" accept="image/jpeg, image/png" style={styles.main} onChange={handlechange} />
                                        </label>

                                    </div>
                                </div>
                                <div className="form-group col-md-12">
                                    <label>Company Head</label>
                                    <input type="text" className="form-control"
                                        value={editedCompany.companyHead || ""}
                                        name='companyHead'
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Company Name</label>
                                    <input type="text" className="form-control"
                                        value={editedCompany.companyName}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Company Email</label>
                                    <input type="text" className="form-control"
                                        value={editedCompany.companyEmail || ""}
                                        name='companyEmail'
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Company Address</label>
                                    <input type="text" className="form-control"
                                        value={editedCompany.companyAddress || ""}
                                        name='companyAddress'
                                        onChange={handleInputChange}

                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Company Phone</label>
                                    <input type="text" className="form-control"
                                        value={editedCompany.companyPhone || ""}
                                        name='companyPhone'
                                        onChange={handleInputChange}

                                    />
                                </div>
                                <div className="submit-section">
                                    <button className="btn btn-primary rounded submit-btn" type='submit'>

                                        Submit Changes
                                    </button>
                                </div>

                            </div>
                        </form>

                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>
            </div>
            <Offcanvas />
        </>

    );
}

export default CompanyProfile;
