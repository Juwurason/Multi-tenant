
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Helmet } from "react-helmet";
import { FaCamera, FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link, useHistory, useParams } from 'react-router-dom';
import Offcanvas from '../../../Entryfile/offcanvance';
import useHttp from '../../../hooks/useHttp'
import man from '../../../assets/img/man.png'
import { toast } from 'react-toastify';

const StaffProfile = ({ staffOne, FetchData, editedProfile, setEditedProfile }) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [informModal, setInformModal] = useState(false);
  const [stateModal, setStateModal] = useState(false);
  const [kinModal, setKinModal] = useState(false);
  const [bankModal, setBankModal] = useState(false);
  const [employmentModal, setEmploymentModal] = useState(false);
  const [socialModal, setSocialModal] = useState(false);

  const getStaffProfile = JSON.parse(localStorage.getItem('staffProfile'))
  const privateHttp = useHttp()


  const styles = {
    main: {
      backgroundColor: 'black',
      display: 'none',

    },
    label: {
      width: '130px',
      height: '130px',
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex", justifyContent: "center", alignItems: "center", textAlign: 'center'
    }
  }



  const handleModal0 = () => {
    setInformModal(true)

  }
  const handleModal1 = () => {
    setStateModal(true)

  }
  const handleModal2 = () => {
    setKinModal(true)
  }
  const handleModal3 = () => {
    setBankModal(true)
  }
  const handleModal4 = () => {
    setEmploymentModal(true);
  }
  const handleModal5 = () => {
    setSocialModal(true);
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handlechange = (e) => {
    setImage(e.target.files[0]);
  }

  const id = JSON.parse(localStorage.getItem('user'))

  const handleSave = async (e) => {
    e.preventDefault()
    const formData = new FormData();

    for (const key in editedProfile) {
      const value = editedProfile[key];
      if (value === null) {
        formData.append(key, ''); // Pass empty string if value is null
      } else {
        formData.append(key, value);
      }
    }

    try {
      setLoading(true)
      const { data } = await privateHttp.post(`/Staffs/edit/${getStaffProfile.staffId}?userId=${id.userId}`,
        formData
      )

      if (data.status === 'Success') {
        toast.success(data.message);
        setInformModal(false);
        setStateModal(false);
        setKinModal(false);
        setBankModal(false);
        setEmploymentModal(false);
        setSocialModal(false);
        FetchData();
      } else {
        toast.error(data.message);
      }

      setLoading(false)

    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
      setLoading(false);

    }
    finally {
      setLoading(false)
    }
  }


  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title>Staff Profile </title>
          <meta name="description" content="Staff Profile" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Profile</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/staff/staff/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link to="/staff/staff/dashboard">Staff</Link></li>
                  <li className="breadcrumb-item active">Profile</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="card mb-0">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="profile-view">
                    <div className="profile-img-wrap">
                      <div className="profile-img border rounded rounded-circle">
                        <a className='text-primary' href="#">
                          <img alt="" src={staffOne.imageUrl || man} width={"100%"} className='rounded-circle' />
                        </a>
                      </div>
                    </div>
                    <div className="profile-basic">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="profile-info-left d-flex flex-column">
                            <h3 className="user-name m-t-0 mb-0">{staffOne.fullName}</h3>
                            <div className="staff-id">Staff ID : {staffOne.maxStaffId === "null" ? "" : staffOne.maxStaffId}</div>
                            <div className="small">About Me : {staffOne.aboutMe === "null" ? "" : staffOne.aboutMe}</div>
                            <div className="staff-msg d-flex gap-2">
                              {/* <Link to={`/app/profile/edit-profile/${staffOne.staffId}`} className="btn btn-primary" >Edit Profile</Link> */}
                              <Link style={{ backgroundColor: "#405189" }} to={`/staff/staff/document`} className="py-1 px-2 rounded text-white">My Document</Link>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-7">
                          <ul className="personal-info">
                            <li>
                              <div className="title">Phone:</div>
                              <div className="text"><a className='text-primary' href={`tel:${staffOne.phoneNumber}`}>{staffOne.phoneNumber}</a></div>
                            </li>
                            <li>
                              <div className="title">Email:</div>
                              <div className="text"><a className='text-primary' href={`mailto:${staffOne.email}`}>{staffOne.email}</a></div>
                            </li>
                            <li>
                              <div className="title">Birthday:</div>
                              <div className="text">{moment(staffOne.dateOfBirth).format('ll')}</div>
                            </li>
                            <li>
                              <div className="title">Address:</div>
                              <div className="text">{staffOne.address}</div>
                            </li>
                            <li>
                              <div className="title">Gender:</div>
                              <div className="text">{staffOne.gender || "None"}</div>
                            </li>

                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="pro-edit">
                      <a className="edit-icon bg-info text-white" onClick={() => handleModal0(staffOne.staffId)}>
                        <i className="fa fa-pencil" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <Modal
            show={informModal}
            onHide={() => setInformModal(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"

          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: "10px" }}>
                Update profile for {editedProfile.firstName} {editedProfile.lastName}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div style={{ display: "flex", justifyContent: 'center' }}>
                  <div className="form-group">
                    <label style={styles.label} className="border border-2 rounded-circle">
                      <img className="rounded-circle" style={{ width: '100%', height: '100%' }}
                        src={image === "" ? man : URL.createObjectURL(image)} alt="profile image" />
                    </label>

                    <label style={{ display: 'flex', justifyContent: 'center' }}>
                      <FaCamera />
                      <input type="file" accept="image/jpeg, image/png" required style={styles.main} onChange={handlechange} />
                    </label>

                  </div>
                </div> 
                <div className="form-group col-md-4">
                  <label>SurName</label>
                  <input type="text" className="form-control" value={editedProfile.surName} onChange={handleInputChange} readOnly />
                </div>
                <div className="form-group col-md-4">
                  <label>First Name</label>
                  <input type="text" className="form-control" value={editedProfile.firstName} readOnly />
                </div>
                <div className="form-group col-md-4">
                  <label>Last Name</label>
                  <input type="text" className="form-control" name="middleName" value={editedProfile.middleName || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group col-md-4">
                  <label>Phone Number</label>
                  <input type="number" className="form-control" value={editedProfile.phoneNumber} readOnly />
                </div>
                <div className="form-group col-md-4">
                  <label>Date Of Birth</label>
                  <input type="date" name='dateOfBirth' className="form-control" value={editedProfile.dateOfBirth || ''} onChange={handleInputChange} />
                </div>

                <div className="form-group col-md-4">
                  <label>Email</label>
                  <input type="text" className="form-control" value={editedProfile.email} readOnly />
                </div>
                <div className="form-group col-md-4">
                  <label>Gender:</label>
                  <select className="form-control" name="gender" value={editedProfile.gender || ''} onChange={handleInputChange}>
                    <option defaultValue hidden>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>

                </div>
                <div className="form-group col-md-8">
                  <label>Address</label>
                  <input type="text" className="form-control" name='address' value={editedProfile.address || ''} onChange={handleInputChange} />
                </div>


                <div className="form-group col-md-12">
                  <label>About Me</label><br />
                  <textarea className='form-control' name="aboutMe" id="" style={{ width: "100%", height: "auto" }} value={editedProfile.aboutMe || ''} onChange={handleInputChange}></textarea>
                </div>


              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn add-btn rounded btn-outline-danger"
                onClick={() => setInformModal(false)}
              >
                Close
              </button>
              <button
                className="ml-2 btn add-btn rounded text-white btn-info"
                onClick={handleSave}
              >
                {loading ? <div className="spinner-grow text-light" role="status">
                  <span className="sr-only">Loading...</span>
                </div> : "Send"}
              </button>
            </Modal.Footer>

          </Modal>





          <div className="card tab-box">
            <div className="row user-tabs">
              <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                <ul className="nav nav-tabs nav-tabs-bottom">
                  <li className="nav-item"><a href="#emp_profile" data-bs-toggle="tab" className="nav-link active text-primary">Profile</a></li>
                  {/* <li className="nav-item"><a  href="#emp_projects" data-bs-toggle="tab" className="nav-link">Projects</a></li> */}
                </ul>
              </div>
            </div>
          </div>
          <div className="tab-content">
            {/* Profile Info Tab */}
            <div id="emp_profile" className="pro-overview tab-pane fade show active">

              <div className="row">
                <div className="col-md-6 d-flex">
                  <div className="card profile-box flex-fill">
                    <div className="card-body">
                      <div className="pro-edit">
                        <a className="edit-icon bg-info text-white" onClick={() => handleModal1(staffOne.staffId)}>
                          <i className="fa fa-pencil" />
                        </a>
                        <Modal
                          show={stateModal}
                          onHide={() => setStateModal(false)}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"

                        >
                          <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: "10px" }}>
                              Update profile for {editedProfile.firstName} {editedProfile.lastName}
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="row">






                              <div className="form-group col-md-6">
                                <label>State</label>
                                <input type="text" className="form-control" name='state' value={editedProfile.state || ''} onChange={handleInputChange} />
                              </div>


                              <div className="form-group col-md-6">
                                <label>City</label>
                                <input type="text" className="form-control" name='city' value={editedProfile.city || ''} onChange={handleInputChange} />
                              </div>
                              <div className="form-group col-md-6">
                                <label>Country</label>
                                <input type="text" className="form-control" name='country' value={editedProfile.country || ''} onChange={handleInputChange} />
                              </div>
                              <div className="form-group col-md-6">
                                <label>Post Code</label>
                                <input type="text" className="form-control" name='postcode' value={editedProfile.postcode || ''} onChange={handleInputChange} />
                              </div>


                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <button
                              className="btn add-btn rounded btn-outline-danger"
                              onClick={() => setStateModal(false)}
                            >
                              Close
                            </button>
                            <button
                              className="ml-2 btn add-btn rounded text-white btn-info"
                              onClick={handleSave}
                            >
                              {loading ? <div className="spinner-grow text-light" role="status">
                                <span className="sr-only">Loading...</span>
                              </div> : "Send"}
                            </button>
                          </Modal.Footer>

                        </Modal>

                      </div>
                      <h3 className="card-title">Personal Informations</h3>
                      <ul className="personal-info">
                        <li>
                          <div className="title">Nationality</div>
                          <div className="text">{staffOne.country}</div>
                        </li>
                        <li>
                          <div className="title">State</div>
                          <div className="text">{staffOne.state}</div>
                        </li>
                        <li>
                          <div className="title">Post Code</div>
                          <div className="text">{staffOne.postcode}</div>
                        </li>

                        <li>
                          <div className="title">Tel</div>
                          <div className="text"><a className='text-primary' href={`tel:${staffOne.phoneNumber}`}>{staffOne.phoneNumber}</a></div>
                        </li>

                        {/* <li>
                          <div className="title">Marital status</div>
                          <div className="text"></div>
                        </li> */}

                      </ul>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Info */}
                <div className="col-md-6 d-flex">
                  <div className="card profile-box flex-fill">
                    <div className="card-body">
                      <div className="pro-edit">
                        <a className="edit-icon bg-info text-white" onClick={() => handleModal2(staffOne.staffId)}>
                          <i className="fa fa-pencil" />
                        </a>
                        <Modal
                          show={kinModal}
                          onHide={() => setKinModal(false)}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"

                        >
                          <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: "10px" }}>
                              Emergency Contact Information
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="row">
                              <div className="form-group col-md-4">
                                <label>Emergency Contact FullName</label>
                                <input type="text" className="form-control" name='nextOfKin' value={editedProfile.nextOfKin || ''} onChange={handleInputChange} />
                              </div>

                              <div className="form-group col-md-4">
                                <label>Relationship</label>
                                <input type="text" className="form-control" name='relationship' value={editedProfile.relationship || ''} onChange={handleInputChange} />
                              </div>
                              <div className="form-group col-md-4">
                                <label>State</label>
                                <input type="text" className="form-control" name='kinState' value={editedProfile.kinState || ''} onChange={handleInputChange} />
                              </div>
                              <div className="form-group col-md-4">
                                <label>Email</label>
                                <input type="email" className="form-control" name='kinEmail' value={editedProfile.kinEmail || ''} onChange={handleInputChange} />
                              </div>
                              <div className="form-group col-md-4">
                                <label>Post Code</label>
                                <input type="email" className="form-control" name='kinPostCode' value={editedProfile.kinPostCode || ''} onChange={handleInputChange} />
                              </div>
                              <div className="form-group col-md-4">
                                <label>Address</label>
                                <input type="text" className="form-control" name='kinAddress' value={editedProfile.kinAddress || ''} onChange={handleInputChange} />
                              </div>

                              <div className="form-group col-md-4">
                                <label>Country</label>
                                <input type="text" className="form-control" name='kinCountry' value={editedProfile.kinCountry || ''} onChange={handleInputChange} />
                              </div>
                              <div className="form-group col-md-4">
                                <label>City</label>
                                <input type="text" className="form-control" name='kinCity' value={editedProfile.kinCity || ''} onChange={handleInputChange} />
                              </div>
                              <div className="form-group col-md-4">
                                <label>Phone Number</label>
                                <input type="email" className="form-control" name='kinPhoneNumber' value={editedProfile.kinPhoneNumber || ''} onChange={handleInputChange} />
                              </div>
                              <div className="form-group col-md-4">
                                <label>Suburb</label>
                                <input type="email" className="form-control" name='kinSuburb' value={editedProfile.kinSuburb || ''} onChange={handleInputChange} />
                              </div>
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <button
                              className="btn add-btn rounded btn-outline-danger"
                              onClick={() => setKinModal(false)}
                            >
                              Close
                            </button>
                            <button
                              className="ml-2 btn add-btn rounded text-white btn-info"
                              onClick={handleSave}
                            >
                              {loading ? <div className="spinner-grow text-light" role="status">
                                <span className="sr-only">Loading...</span>
                              </div> : "Send"}
                            </button>
                          </Modal.Footer>

                        </Modal>
                      </div>
                      <h3 className="card-title">Emergency Contact </h3>
                      <ul className="personal-info">
                        <li>
                          <div className="title">Name</div>
                          <div className="text">{staffOne.nextOfKin === "null" ? "---" : staffOne.nextOfKin}</div>
                        </li>
                        <li>
                          <div className="title">Relationship</div>
                          <div className="text">{staffOne.relationship === "null" ? "---" : staffOne.relationship}</div>
                        </li>
                        <li>
                          <div className="title">Email</div>
                          <div className="text">{staffOne.kinEmail === "null" ? "---" : staffOne.kinEmail}</div>
                        </li>
                        <li>
                          <div className="title">Phone </div>
                          <div className="text">{staffOne.kinPhoneNumber === "null" ? "---" : staffOne.kinPhoneNumber}</div>
                        </li>

                        <li>
                          <div className="title">Country</div>
                          <div className="text">{staffOne.kinCountry === "null" ? "---" : staffOne.kinCountry}</div>
                        </li>
                        <li>
                          <div className="title">State</div>
                          <div className="text">{staffOne.kinState === "null" ? "---" : staffOne.kinState}</div>
                        </li>
                        <li>
                          <div className="title">City</div>
                          <div className="text">{staffOne.kinCity === "null" ? "---" : staffOne.kinCity}</div>
                        </li>
                        <li>
                          <div className="title">Post Code</div>
                          <div className="text">{staffOne.kinPostCode === "null" ? "---" : staffOne.kinPostCode}</div>
                        </li>

                      </ul>


                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Info */}
              <div className="row">
                <div className="col-md-6 d-flex">
                  <div className="card profile-box flex-fill">
                    <div className="card-body">
                      <div className="pro-edit">
                        <a className="edit-icon bg-info text-white" onClick={() => handleModal3(staffOne.staffId)}>
                          <i className="fa fa-pencil" />
                        </a>
                        <Modal
                          show={bankModal}
                          onHide={() => setBankModal(false)}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"

                        >
                          <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: "10px" }}>
                              Bank Information
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="row">
                              <div className="form-group col-md-4">
                                <label>Account Name</label>
                                <input type="text" className="form-control" name='accountName' value={editedProfile.accountName || ''} onChange={handleInputChange} />
                              </div>

                              <div className="form-group col-md-4">
                                <label>Bank Name</label>
                                <input type="text" className="form-control" name='bankName' value={editedProfile.bankName || ''} onChange={handleInputChange} />
                              </div>
                              <div className="form-group col-md-4">
                                <label>BSB</label>
                                <input type="text" className="form-control" name='bsb' value={editedProfile.bsb || ''} onChange={handleInputChange} />
                              </div>
                              <div className="form-group col-md-4">
                                <label>Account Number</label>
                                <input type="text" className="form-control" name='accountNumber' value={editedProfile.accountNumber || ''} onChange={handleInputChange} />
                              </div>
                              <div className="form-group col-md-4">
                                <label>Branch</label>
                                <input type="text" className="form-control" name='branch' value={editedProfile.branch || ''} onChange={handleInputChange} />
                              </div>
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <button
                              className="btn add-btn rounded btn-outline-danger"
                              onClick={() => setBankModal(false)}
                            >
                              Close
                            </button>
                            <button
                              className="ml-2 btn add-btn rounded text-white btn-info"
                              onClick={handleSave}
                            >
                              {loading ? <div className="spinner-grow text-light" role="status">
                                <span className="sr-only">Loading...</span>
                              </div> : "Send"}
                            </button>
                          </Modal.Footer>

                        </Modal>

                      </div>
                      <h3 className="card-title">Bank information</h3>
                      <ul className="personal-info">
                        <li>
                          <div className="title">Bank name</div>
                          <div className="text">{staffOne.bankName === "null" ? "---" : staffOne.bankName}</div>
                        </li>
                        <li>
                          <div className="title">Account Name</div>
                          <div className="text">{staffOne.accountName === "null" ? "---" : staffOne.accountName}</div>
                        </li>
                        <li>
                          <div className="title">Account Number</div>
                          <div className="text">{staffOne.accountNumber === "null" ? "---" : staffOne.accountNumber}</div>
                        </li>
                        <li>
                          <div className="title">Branch</div>
                          <div className="text">{staffOne.branch === "null" ? "---" : staffOne.branch}</div>
                        </li>
                        <li>
                          <div className="title">BSB</div>
                          <div className="text">{staffOne.bsb === "null" ? "---" : staffOne.bsb}</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                        {/* Employment Details */}
                <div className="col-md-6 d-flex">
                  <div className="card profile-box flex-fill">
                    <div className="card-body">
                      <div className="pro-edit">
                        <a className="edit-icon bg-info text-white" onClick={() => handleModal4(staffOne.staffId)}>
                          <i className="fa fa-pencil" />
                        </a>
                        <Modal
                          show={employmentModal}
                          onHide={() => setEmploymentModal(false)}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"

                        >
                          <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: "10px" }}>
                            Employment Details
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label>Employment Type</label>
                                  <input type="text" className="form-control" placeholder='' name='employmentType' value={editedProfile.employmentType || ''} onChange={handleInputChange} />
                                </div>

                                <div className="form-group">
                                  <label>PayRate</label>
                                  <input type="text" className="form-control" placeholder='' name='payRate' value={editedProfile.payRate || ''} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                  <label>Earning Rate</label>
                                  <input type="text" className="form-control" placeholder='' name='earningRate' value={editedProfile.earningRate || ''} onChange={handleInputChange} />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label>Date Joined</label>
                                  <input type="date" className="form-control" placeholder='' name='dateJoined' value={editedProfile.dateJoined || ''} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                  <label>Salary</label>
                                  <input type="text" className="form-control" placeholder='' name='salary' value={editedProfile.salary || ''} onChange={handleInputChange} />
                                </div>
                                
                                <div className="form-group">
                                  <label>Level</label>
                                  <input type="number" className="form-control" placeholder='' name='level' value={editedProfile.level || ''} onChange={handleInputChange} />
                                </div>

                              </div>
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <button
                              className="btn add-btn rounded btn-outline-danger"
                              onClick={() => setEmploymentModal(false)}
                            >
                              Close
                            </button>
                            <button
                              className="ml-2 btn add-btn rounded text-white btn-info"
                              onClick={handleSave}
                            >
                              {loading ? <div className="spinner-grow text-light" role="status">
                                <span className="sr-only">Loading...</span>
                              </div> : "Send"}
                            </button>
                          </Modal.Footer>

                        </Modal>

                      </div>
                      <h3 className="card-title">Employment Details</h3>
                      <ul className="personal-info">
                        <li>
                          <div className="title"> Employment Status</div>
                          <div className="text">{staffOne.employmentType === "null" || staffOne.employmentType === "undefined" || staffOne.employmentType === "" ? "---" : staffOne.employmentType}</div>
                        </li>
                        <li>
                          <div className="title"> Date Joined</div>
                          <div className="text">{staffOne.dateJoined === "null" || staffOne.dateJoined === "undefined" || staffOne.dateJoined === "" ? "---" : staffOne.dateJoined}</div>
                        </li>
                        <li>
                          <div className="title"> Salary</div>
                          <div className="text">{staffOne.salary === "null" || staffOne.salary === "undefined" || staffOne.salary === "" ? "---" : staffOne.salary}</div>
                        </li>
                        <li>
                          <div className="title"> Pay Rate</div>
                          <div className="text">{staffOne.payRate === "null" || staffOne.payRate === "undefined" || staffOne.payRate === "" ? "---" : staffOne.payRate}</div>
                        </li>
                        <li>
                          <div className="title"> Earning Rate</div>
                          <div className="text">{staffOne.earningRate === null || staffOne.earningRate === "undefined" || staffOne.earningRate === " " ? "---" : staffOne.earningRate}</div>
                        </li>
                        <li>
                          <div className="title"> Level</div>
                          <div className="text">{staffOne.level === null || staffOne.level === "undefined" || staffOne.level === " " ? "---" : staffOne.level}</div>
                        </li>

                      </ul>
                    </div>
                  </div>
                </div>


                          {/* Social */}
                <div className="col-md-6 d-flex">
                  <div className="card profile-box flex-fill">
                    <div className="card-body">
                      <div className="pro-edit">
                        <a className="edit-icon bg-info text-white" onClick={() => handleModal5(staffOne.staffId)}>
                          <i className="fa fa-pencil" />
                        </a>
                        <Modal
                          show={socialModal}
                          onHide={() => setSocialModal(false)}
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"

                        >
                          <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: "10px" }}>
                              Other Information
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label>Instagram</label>
                                  <input type="text" className="form-control" placeholder='https:......' name='instagram' value={editedProfile.instagram || ''} onChange={handleInputChange} />
                                </div>

                                <div className="form-group">
                                  <label>Facebook</label>
                                  <input type="text" className="form-control" placeholder='https:......' name='facebook' value={editedProfile.facebook || ''} onChange={handleInputChange} />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label>Twitter</label>
                                  <input type="text" className="form-control" placeholder='https:......' name='twitter' value={editedProfile.twitter || ''} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                  <label>LinkedIn</label>
                                  <input type="text" className="form-control" placeholder='https:......' name='linkedIn' value={editedProfile.linkedIn || ''} onChange={handleInputChange} />
                                </div>

                              </div>
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <button
                              className="btn add-btn rounded btn-outline-danger"
                              onClick={() => setSocialModal(false)}
                            >
                              Close
                            </button>
                            <button
                              className="ml-2 btn add-btn rounded text-white btn-info"
                              onClick={handleSave}
                            >
                              {loading ? <div className="spinner-grow text-light" role="status">
                                <span className="sr-only">Loading...</span>
                              </div> : "Send"}
                            </button>
                          </Modal.Footer>

                        </Modal>

                      </div>
                      <h3 className="card-title">Other Informations</h3>
                      <ul className="personal-info">
                        <li>
                          <div className="title"><FaInstagram /> Instagram</div>
                          <div className="text">{staffOne.instagram === "null" || staffOne.instagram === "undefined" || staffOne.instagram === "" ? "---" : staffOne.instagram}</div>
                        </li>
                        <li>
                          <div className="title"><FaFacebook /> Facebook</div>
                          <div className="text">{staffOne.facebook === "null" || staffOne.facebook === "undefined" || staffOne.facebook === "" ? "---" : staffOne.facebook}</div>
                        </li>
                        <li>
                          <div className="title"><FaTwitter /> Twitter</div>
                          <div className="text">{staffOne.twitter === "null" || staffOne.twitter === "undefined" || staffOne.twitter === "" ? "---" : staffOne.twitter}</div>
                        </li>
                        <li>
                          <div className="title"><FaLinkedin /> Linked-In</div>
                          <div className="text">{staffOne.linkedIn === "null" || staffOne.linkedIn === "undefined" || staffOne.linkedIn === "" ? "---" : staffOne.linkedIn}</div>
                        </li>
                        <li>
                          <div className="title"><FaYoutube /> Youtube</div>
                          <div className="text">{staffOne.youtube === null || staffOne.youtube === "undefined" || staffOne.youtube === " " ? "---" : staffOne.youtube}</div>
                        </li>

                      </ul>
                    </div>
                  </div>
                </div>


              </div>


            </div>
          </div>
        </div>
        {/* /Experience Modal */}
      </div>
      <Offcanvas />
    </>


  );
}
export default StaffProfile;
