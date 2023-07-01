
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Helmet } from "react-helmet";
import { FaCamera, FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Avatar_02, Avatar_05, Avatar_09, Avatar_10, Avatar_16 } from '../../../Entryfile/imagepath'
import Offcanvas from '../../../Entryfile/offcanvance';
import useHttp from '../../../hooks/useHttp'
import man from '../../../assets/img/man.png'
import { toast } from 'react-toastify';

const StaffProfile = ({staffOne, FetchData}) => {
  const { uid } = useParams()
  // const [staffOne, setStaffOne] = useState({});
  const [profile, setProfile] = useState({})
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [informModal, setInformModal] = useState(false);
  const [stateModal, setStateModal] = useState(false);
  const [kinModal, setKinModal] = useState(false);
  const [bankModal, setBankModal] = useState(false);
  const [socialModal, setSocialModal] = useState(false);

  const getStaffProfile = JSON.parse(localStorage.getItem('staffProfile'))
  const privateHttp = useHttp()

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        width: '100%',
        minimumResultsForSearch: -1,
      });
    }
  });
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
  const FetchExising = async (e) => {
    try {
      const {data} = await privateHttp.get(`/Staffs/${e}`, { cacheTimeout: 300000 })
    console.log(data)
      setProfile(data);
      setEditedProfile(data);
    } catch (error) {
      toast.error(error.response.data.message);
      toast.error(error.response.data.title);
    }
  }
  // http://localhost:3001/staff/main/edit-progress/7918/8260

  const handleModal0 = (e) => {
    setInformModal(true)
    FetchExising(e);

  }
  const handleModal1 = (e) => {
    setStateModal(true)
    FetchExising(e);

  }
  const handleModal2 = (e) => {
    setKinModal(true)
    FetchExising(e);
  }
  const handleModal3 = (e) => {
    setBankModal(true)
    FetchExising(e);
  }
  const handleModal4 = (e) => {
    setSocialModal(true);
    FetchExising(e);
  }


  function handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    const newValue = value === "" ? "" : value;
    setEditedProfile({
      ...editedProfile,
      [name]: newValue
    });
  }
  const handlechange = (e) => {
    setImage(e.target.files[0]);
  }

  const id = JSON.parse(localStorage.getItem('user'))

  const handleSave = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("CompanyId", id.companyId);
    formData.append("StaffId", getStaffProfile.staffId);
    formData.append("firstName", profile.firstName);
    formData.append("email", profile.email);
    formData.append("phoneNumber", profile.phoneNumber);
    formData.append("surName", profile.surName);
    formData.append("maxStaffId", profile.maxStaffId);
    formData.append("middleName", editedProfile.middleName);
    formData.append("gender", editedProfile.gender);
    formData.append("dateOfBirth", editedProfile.dateOfBirth);
    formData.append("aboutMe", editedProfile.aboutMe);
    formData.append("address", profile.address);
    formData.append("city", editedProfile.city);
    formData.append("country", editedProfile.country);
    formData.append("state", editedProfile.state);
    formData.append("Postcode", editedProfile.postcode);
    formData.append("accountName", editedProfile.accountName);
    formData.append("accountNumber", editedProfile.accountNumber);
    formData.append("bankName", editedProfile.bankName);
    formData.append("branch", editedProfile.branch);
    formData.append("bsb", editedProfile.bsb);
    formData.append("suburb", editedProfile.kinSuburb);
    formData.append("NextOfKin", editedProfile.nextOfKin);
    formData.append("kinAddress", editedProfile.kinAddress);
    formData.append("kinCity", editedProfile.kinCity);
    formData.append("kinCountry", editedProfile.kinCountry);
    formData.append("kinEmail", editedProfile.kinEmail);
    formData.append("kinPhoneNumber", editedProfile.kinPhoneNumber);
    formData.append("kinPostcode", editedProfile.kinPostCode);
    formData.append("kinState", editedProfile.kinState);
    formData.append("relationship", editedProfile.relationship);
    formData.append("imageFile", editedProfile.image);
    formData.append("twitter", editedProfile.twitter);
    formData.append("linkedIn", editedProfile.linkedIn);
    formData.append("instagram", editedProfile.instagram);
    formData.append("isActive", true);
    formData.append("facebook", editedProfile.facebook);
    try {
      setLoading(true)
      const { data } = await privateHttp.post(`/Staffs/edit/${getStaffProfile.staffId}?userId=${id.userId}`,
        formData
      )
      console.log(data)
      if (data.status === 'Success') {
        toast.success(data.message);
        setInformModal(false);
        setStateModal(false);
        setKinModal(false);
        setBankModal(false);
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
                  <li className="breadcrumb-item"><Link to="/staff/main/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link to="/staff/main/dashboard">Staff</Link></li>
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
                      <div className="profile-img">
                        <a className='text-primary' href="#"><img alt="" src={staffOne.imageUrl === null || staffOne.imageUrl === "" ? Avatar_02 : staffOne.imageUrl} /></a>
                      </div>
                    </div>
                    <div className="profile-basic">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="profile-info-left d-flex flex-column">
                            <h3 className="user-name m-t-0 mb-0">{staffOne.fullName}</h3>
                            <div className="staff-id">Staff ID : {staffOne.maxStaffId}</div>
                            <div className="small">About Me : {staffOne.aboutMe === "null" ? "" : staffOne.aboutMe}</div>
                            <div className="staff-msg d-flex gap-2">
                              {/* <Link to={`/app/profile/edit-profile/${staffOne.staffId}`} className="btn btn-primary" >Edit Profile</Link> */}
                              <Link style={{ backgroundColor: "#405189"}} to={`/staff/main/document`} className="py-1 px-2 rounded text-white">Staff Doc</Link>
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
                Update profile for {profile.firstName} {profile.lastName}
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
                  <input type="text" className="form-control" value={profile.surName} onChange={handleInputChange} readOnly />
                </div>
                <div className="form-group col-md-4">
                  <label>First Name</label>
                  <input type="text" className="form-control" value={profile.firstName} readOnly />
                </div>
                <div className="form-group col-md-4">
                  <label>Last Name</label>
                  <input type="text" className="form-control" name="middleName" value={editedProfile.middleName || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group col-md-4">
                  <label>Phone Number</label>
                  <input type="number" className="form-control" value={profile.phoneNumber} readOnly />
                </div>
                <div className="form-group col-md-4">
                  <label>Date Of Birth</label>
                  <input type="date" name='dateOfBirth' className="form-control" value={editedProfile.dateOfBirth || ''} onChange={handleInputChange} />
                </div>

                <div className="form-group col-md-4">
                  <label>Email</label>
                  <input type="text" className="form-control" value={profile.email} readOnly />
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
                  <textarea className='form-control' name="aboutMe" id="" style={{ width: "100%", height: "auto" }} value={editedProfile.aboutMe  || ''} onChange={handleInputChange}></textarea>
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
                              Update profile for {profile.firstName} {profile.lastName}
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
                        
                        <li>
                          <div className="title">Marital status</div>
                          <div className="text"></div>
                        </li>

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
                <div className="col-md-6 d-flex">
                  <div className="card profile-box flex-fill">
                    <div className="card-body">
                      <div className="pro-edit">
                        <a className="edit-icon bg-info text-white" onClick={() => handleModal4(staffOne.staffId)}>
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
                                  <input type="text" className="form-control" placeholder='https://WWW......' name='instagram' value={editedProfile.instagram || ''} onChange={handleInputChange} />
                                </div>

                                <div className="form-group">
                                  <label>Facebook</label>
                                  <input type="text" className="form-control" placeholder='https://WWW......' name='facebook' value={editedProfile.facebook || ''} onChange={handleInputChange} />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label>Twitter</label>
                                  <input type="text" className="form-control" placeholder='https://WWW......' name='twitter' value={editedProfile.twitter || ''} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                  <label>LinkedIn</label>
                                  <input type="text" className="form-control" placeholder='https://WWW......' name='linkedIn' value={editedProfile.linkedIn || ''} onChange={handleInputChange} />
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
                          <div className="text">{staffOne.instagram === "null" || staffOne.instagram === "undefined" || staffOne.instagram === ""  ?  "---" : staffOne.instagram}</div>
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
