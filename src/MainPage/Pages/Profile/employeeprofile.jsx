
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
const EmployeeProfile = () => {
  const { uid } = useParams()
  const [staffOne, setStaffOne] = useState({});
  const [profile, setProfile] = useState({})
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [informModal, setInformModal] = useState(false);
  const [stateModal, setStateModal] = useState(false);
  const [kinModal, setKinModal] = useState(false);
  const [bankModal, setBankModal] = useState(false);
  const [socialModal, setSocialModal] = useState(false);


  const privateHttp = useHttp()
  const FetchStaff = async () => {
    try {
      const { data } = await privateHttp.get(`/Staffs/${uid}`, { cacheTimeout: 300000 })
      setStaffOne(data)



    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    FetchStaff()
  }, []);
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
      const response = await privateHttp.get(`/Staffs/${e}`, { cacheTimeout: 300000 })
      setProfile(response.data);
      setEditedProfile(response.data)
    } catch (error) {
      console.log(error);


    }
  }

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
    formData.append("StaffId", uid);
    formData.append("firstName", profile.firstName);
    formData.append("email", profile.email);
    formData.append("phoneNumber", profile.phoneNumber);
    formData.append("surName", profile.surName);
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
    formData.append("twitter", editedProfile.tweet);
    formData.append("linkedIn", editedProfile.linkd);
    formData.append("instagram", editedProfile.insta);
    formData.append("facebook", editedProfile.fbook);
    try {
      setLoading(true)
      const { data } = await privateHttp.post(`/Staffs/edit/${uid}?userId=${id.userId}`,
        formData
      )
      if (data.status === 'Success') {
        toast.success(data.message);
        setInformModal(false);
        setStateModal(false);
        setKinModal(false);
        setBankModal(false);
        setSocialModal(false);
        FetchStaff();
      } else {
        toast.error(data.message);
      }

      setLoading(false)

    } catch (error) {
      console.log(error);
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
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Profile</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link to="/app/employee/allemployees">Staff</Link></li>
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
                        <a className='text-primary' href="#"><img alt="" src={Avatar_02} /></a>
                      </div>
                    </div>
                    <div className="profile-basic">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="profile-info-left d-flex flex-column">
                            <h3 className="user-name m-t-0 mb-0">{staffOne.fullName}</h3>
                            <div className="staff-id">Staff ID : {staffOne.maxStaffId}</div>
                            <div className="small doj text-muted">{staffOne.aboutMe}</div>
                            <div className="staff-msg d-flex gap-2">
                              {/* <Link to={`/app/profile/edit-profile/${staffOne.staffId}`} className="btn btn-primary" >Edit Profile</Link> */}
                              <Link to={`/app/profile/staff-docUpload/${staffOne.staffId}`} className="py-1 px-2 rounded text-white bg-danger">Staff Doc</Link>
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
                  <li className="nav-item"><a href="#bank_statutory" data-bs-toggle="tab" className="nav-link text-primary">Bank &amp; Statutory <small className="text-danger">(Admin Only)</small></a></li>
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
                          <div className="title">Passport No.</div>
                          <div className="text"></div>
                        </li>
                        <li>
                          <div className="title">Passport Exp Date.</div>
                          <div className="text"></div>
                        </li>
                        <li>
                          <div className="title">Tel</div>
                          <div className="text"><a className='text-primary' href={`tel:${staffOne.phoneNumber}`}>{staffOne.phoneNumber}</a></div>
                        </li>
                        <li>
                          <div className="title">Religion</div>
                          <div className="text"></div>
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
                          <div className="text">{staffOne.kinCity === "null" ? "---" : staffOne.kinState}</div>
                        </li>
                        <li>
                          <div className="title">Post Code</div>
                          <div className="text">{staffOne.kinPostcode === "null" ? "---" : staffOne.kinPostCode}</div>
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
                                  <input type="text" className="form-control" placeholder='https://WWW......' name='insta' value={editedProfile.insta || ''} onChange={handleInputChange} />
                                </div>

                                <div className="form-group">
                                  <label>Facebook</label>
                                  <input type="text" className="form-control" placeholder='https://WWW......' name='fbook' value={editedProfile.fbook || ''} onChange={handleInputChange} />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label>Twitter</label>
                                  <input type="text" className="form-control" placeholder='https://WWW......' name='tweet' value={editedProfile.tweet || ''} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                  <label>LinkedIn</label>
                                  <input type="text" className="form-control" placeholder='https://WWW......' name='linkd' value={editedProfile.linkd || ''} onChange={handleInputChange} />
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
                          <div className="text">{staffOne.instagram === "null" || "" ? "---" : staffOne.instagram}</div>
                        </li>
                        <li>
                          <div className="title"><FaFacebook /> Facebook</div>
                          <div className="text">{staffOne.facebook === "null" || "" ? "---" : staffOne.facebook}</div>
                        </li>
                        <li>
                          <div className="title"><FaTwitter /> Twitter</div>
                          <div className="text">{staffOne.twitter === "null" || "" ? "---" : staffOne.twitter}</div>
                        </li>
                        <li>
                          <div className="title"><FaLinkedin /> Linked-In</div>
                          <div className="text">{staffOne.linkedIn === "null" || "" ? "---" : staffOne.linkedIn}</div>
                        </li>
                        <li>
                          <div className="title"><FaYoutube /> Youtube</div>
                          <div className="text">{staffOne.youtube === "null" || "" ? "---" : staffOne.youtube}</div>
                        </li>

                      </ul>
                    </div>
                  </div>
                </div>
              </div>



              <div className="row">
                <div className="col-md-6 d-flex">
                  <div className="card profile-box flex-fill">
                    <div className="card-body">
                      <h3 className="card-title">Education Information <a href="#" className="edit-icon text-primary" data-bs-toggle="modal" data-bs-target="#education_info"><i className="fa fa-pencil" /></a></h3>
                      <div className="experience-box">
                        <ul className="experience-list">
                          <li>
                            <div className="experience-user">
                              <div className="before-circle" />
                            </div>
                            <div className="experience-content">
                              <div className="timeline-content">
                                {/* <a className='text-primary' href="/" className="name">International College of Arts and Science (UG)</a>
                                <div>Bsc Computer Science</div>
                                <span className="time">2000 - 2003</span> */}
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="experience-user">
                              <div className="before-circle" />
                            </div>
                            <div className="experience-content">
                              <div className="timeline-content">
                                {/* <a className='text-primary' href="/" className="name">International College of Arts and Science (PG)</a>
                                <div>Msc Computer Science</div>
                                <span className="time">2000 - 2003</span> */}
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 d-flex">
                  <div className="card profile-box flex-fill">
                    <div className="card-body">
                      <h3 className="card-title">Experience <a href="#" className="edit-icon text-primary" data-bs-toggle="modal" data-bs-target="#experience_info"><i className="fa fa-pencil" /></a></h3>
                      <div className="experience-box">
                        <ul className="experience-list">
                          <li>
                            <div className="experience-user">
                              <div className="before-circle" />
                            </div>
                            <div className="experience-content">
                              <div className="timeline-content">

                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="experience-user">
                              <div className="before-circle" />
                            </div>
                            <div className="experience-content">
                              <div className="timeline-content">
                                {/* <a className='text-primary' href="/" className="name">Web Designer at Ron-tech</a>
                                <span className="time">Jan 2013 - Present (5 years 2 months)</span> */}
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="experience-user">
                              <div className="before-circle" />
                            </div>
                            <div className="experience-content">
                              <div className="timeline-content">
                                {/* <a className='text-primary' href="/" className="name">Web Designer at Dalt Technology</a>
                                <span className="time">Jan 2013 - Present (5 years 2 months)</span> */}
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Profile Info Tab */}
            {/* Projects Tab */}
            <div className="tab-pane fade" id="emp_projects">
              <div className="row">
                <div className="col-lg-4 col-sm-6 col-md-4 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="dropdown profile-action">
                        <a aria-expanded="false" data-bs-toggle="dropdown" className="action-icon dropdown-toggle" href="#"><i className="material-icons">more_vert</i></a>
                        <div className="dropdown-menu dropdown-menu-right">
                          <a data-bs-target="#edit_project" data-bs-toggle="modal" href="#" className="dropdown-item"><i className="fa fa-pencil m-r-5" /> Edit</a>
                          <a data-bs-target="#delete_project" data-bs-toggle="modal" href="#" className="dropdown-item"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                        </div>
                      </div>
                      <h4 className="project-title"><Link to="/app/projects/projects-view">Office Management</Link></h4>
                      <small className="block text-ellipsis m-b-15">
                        <span className="text-xs">1</span> <span className="text-muted">open tasks, </span>
                        <span className="text-xs">9</span> <span className="text-muted">tasks completed</span>
                      </small>
                      <p className="text-muted">Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. When an unknown printer took a galley of type and
                        scrambled it...
                      </p>
                      <div className="pro-deadline m-b-15">
                        <div className="sub-title">
                          Deadline:
                        </div>
                        <div className="text-muted">
                          17 Apr 2019
                        </div>
                      </div>
                      <div className="project-members m-b-15">
                        <div>Project Leader :</div>
                        <ul className="team-members">
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="Jeffery Lalor"><img alt="" src={Avatar_16} /></a>
                          </li>
                        </ul>
                      </div>
                      <div className="project-members m-b-15">
                        <div>Team :</div>
                        <ul className="team-members">
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="John Doe"><img alt="" src={Avatar_02} /></a>
                          </li>
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="Richard Miles"><img alt="" src={Avatar_09} /></a>
                          </li>
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="John Smith"><img alt="" src={Avatar_10} /></a>
                          </li>
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="Mike Litorus"><img alt="" src={Avatar_05} /></a>
                          </li>
                          <li>
                            <a href="#" className="all-users text-primary">+15</a>
                          </li>
                        </ul>
                      </div>
                      <p className="m-b-5">Progress <span className="text-success float-end">40%</span></p>
                      <div className="progress progress-xs mb-0">
                        <div style={{ width: '40%' }} data-bs-toggle="tooltip" role="progressbar" className="progress-bar bg-success" data-original-title="40%" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-md-4 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="dropdown profile-action">
                        <a aria-expanded="false" data-bs-toggle="dropdown" className="action-icon dropdown-toggle" href="#"><i className="material-icons">more_vert</i></a>
                        <div className="dropdown-menu dropdown-menu-right">
                          <a data-bs-target="#edit_project" data-bs-toggle="modal" href="#" className="dropdown-item"><i className="fa fa-pencil m-r-5" /> Edit</a>
                          <a data-bs-target="#delete_project" data-bs-toggle="modal" href="#" className="dropdown-item"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                        </div>
                      </div>
                      <h4 className="project-title"><Link to="/app/projects/projects-view">Project Management</Link></h4>
                      <small className="block text-ellipsis m-b-15">
                        <span className="text-xs">2</span> <span className="text-muted">open tasks, </span>
                        <span className="text-xs">5</span> <span className="text-muted">tasks completed</span>
                      </small>
                      <p className="text-muted">Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. When an unknown printer took a galley of type and
                        scrambled it...
                      </p>
                      <div className="pro-deadline m-b-15">
                        <div className="sub-title">
                          Deadline:
                        </div>
                        <div className="text-muted">
                          17 Apr 2019
                        </div>
                      </div>
                      <div className="project-members m-b-15">
                        <div>Project Leader :</div>
                        <ul className="team-members">
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="Jeffery Lalor"><img alt="" src={Avatar_16} /></a>
                          </li>
                        </ul>
                      </div>
                      <div className="project-members m-b-15">
                        <div>Team :</div>
                        <ul className="team-members">
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="John Doe"><img alt="" src={Avatar_02} /></a>
                          </li>
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="Richard Miles"><img alt="" src={Avatar_09} /></a>
                          </li>
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="John Smith"><img alt="" src={Avatar_10} /></a>
                          </li>
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="Mike Litorus"><img alt="" src={Avatar_05} /></a>
                          </li>
                          <li>
                            <a href="#" className="all-users text-primary">+15</a>
                          </li>
                        </ul>
                      </div>
                      <p className="m-b-5">Progress <span className="text-success float-end">40%</span></p>
                      <div className="progress progress-xs mb-0">
                        <div style={{ width: '40%' }} data-bs-toggle="tooltip" role="progressbar" className="progress-bar bg-success" data-original-title="40%" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-md-4 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="dropdown profile-action">
                        <a aria-expanded="false" data-bs-toggle="dropdown" className="action-icon dropdown-toggle" href="#"><i className="material-icons">more_vert</i></a>
                        <div className="dropdown-menu dropdown-menu-right">
                          <a data-bs-target="#edit_project" data-bs-toggle="modal" href="#" className="dropdown-item"><i className="fa fa-pencil m-r-5" /> Edit</a>
                          <a data-bs-target="#delete_project" data-bs-toggle="modal" href="#" className="dropdown-item"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                        </div>
                      </div>
                      <h4 className="project-title"><Link to="/app/projects/projects-view">Video Calling App</Link></h4>
                      <small className="block text-ellipsis m-b-15">
                        <span className="text-xs">3</span> <span className="text-muted">open tasks, </span>
                        <span className="text-xs">3</span> <span className="text-muted">tasks completed</span>
                      </small>
                      <p className="text-muted">Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. When an unknown printer took a galley of type and
                        scrambled it...
                      </p>
                      <div className="pro-deadline m-b-15">
                        <div className="sub-title">
                          Deadline:
                        </div>
                        <div className="text-muted">
                          17 Apr 2019
                        </div>
                      </div>
                      <div className="project-members m-b-15">
                        <div>Project Leader :</div>
                        <ul className="team-members">
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="Jeffery Lalor"><img alt="" src={Avatar_16} /></a>
                          </li>
                        </ul>
                      </div>
                      <div className="project-members m-b-15">
                        <div>Team :</div>
                        <ul className="team-members">
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="John Doe"><img alt="" src={Avatar_02} /></a>
                          </li>
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="Richard Miles"><img alt="" src={Avatar_09} /></a>
                          </li>
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="John Smith"><img alt="" src={Avatar_10} /></a>
                          </li>
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="Mike Litorus"><img alt="" src={Avatar_05} /></a>
                          </li>
                          <li>
                            <a href="#" className="all-users text-primary">+15</a>
                          </li>
                        </ul>
                      </div>
                      <p className="m-b-5">Progress <span className="text-success float-end">40%</span></p>
                      <div className="progress progress-xs mb-0">
                        <div style={{ width: '40%' }} data-bs-toggle="tooltip" role="progressbar" className="progress-bar bg-success" data-original-title="40%" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-md-4 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="dropdown profile-action">
                        <a aria-expanded="false" data-bs-toggle="dropdown" className="action-icon dropdown-toggle" href="#"><i className="material-icons">more_vert</i></a>
                        <div className="dropdown-menu dropdown-menu-right">
                          <a data-bs-target="#edit_project" data-bs-toggle="modal" href="#" className="dropdown-item"><i className="fa fa-pencil m-r-5" /> Edit</a>
                          <a data-bs-target="#delete_project" data-bs-toggle="modal" href="#" className="dropdown-item"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                        </div>
                      </div>
                      <h4 className="project-title"><Link to="/app/projects/projects-view">Hospital Administration</Link></h4>
                      <small className="block text-ellipsis m-b-15">
                        <span className="text-xs">12</span> <span className="text-muted">open tasks, </span>
                        <span className="text-xs">4</span> <span className="text-muted">tasks completed</span>
                      </small>
                      <p className="text-muted">Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. When an unknown printer took a galley of type and
                        scrambled it...
                      </p>
                      <div className="pro-deadline m-b-15">
                        <div className="sub-title">
                          Deadline:
                        </div>
                        <div className="text-muted">
                          17 Apr 2019
                        </div>
                      </div>
                      <div className="project-members m-b-15">
                        <div>Project Leader :</div>
                        <ul className="team-members">
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="Jeffery Lalor"><img alt="" src={Avatar_16} /></a>
                          </li>
                        </ul>
                      </div>
                      <div className="project-members m-b-15">
                        <div>Team :</div>
                        <ul className="team-members">
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="John Doe"><img alt="" src={Avatar_02} /></a>
                          </li>
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="Richard Miles"><img alt="" src={Avatar_09} /></a>
                          </li>
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="John Smith"><img alt="" src={Avatar_10} /></a>
                          </li>
                          <li>
                            <a className='text-primary' href="#" data-bs-toggle="tooltip" title="Mike Litorus"><img alt="" src={Avatar_05} /></a>
                          </li>
                          <li>
                            <a href="#" className="all-users text-primary">+15</a>
                          </li>
                        </ul>
                      </div>
                      <p className="m-b-5">Progress <span className="text-success float-end">40%</span></p>
                      <div className="progress progress-xs mb-0">
                        <div style={{ width: '40%' }} data-bs-toggle="tooltip" role="progressbar" className="progress-bar bg-success" data-original-title="40%" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Projects Tab */}
            {/* Bank Statutory Tab */}
            <div className="tab-pane fade" id="bank_statutory">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title"> Basic Salary Information</h3>
                  <form>
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Salary basis <span className="text-danger">*</span></label>
                          <select className="select">
                            <option>Select salary basis type</option>
                            <option>Hourly</option>
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Salary amount <small className="text-muted">per month</small></label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">$</span>
                            </div>
                            <input type="text" className="form-control" placeholder="Type your salary amount" defaultValue={0.00} />
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Payment type</label>
                          <select className="select">
                            <option>Select payment type</option>
                            <option>Bank transfer</option>
                            <option>Check</option>
                            <option>Cash</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <h3 className="card-title"> PF Information</h3>
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">PF contribution</label>
                          <select className="select">
                            <option>Select PF contribution</option>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">PF No. <span className="text-danger">*</span></label>
                          <select className="select">
                            <option>Select PF contribution</option>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Employee PF rate</label>
                          <select className="select">
                            <option>Select PF contribution</option>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Additional rate <span className="text-danger">*</span></label>
                          <select className="select">
                            <option>Select additional rate</option>
                            <option>0%</option>
                            <option>1%</option>
                            <option>2%</option>
                            <option>3%</option>
                            <option>4%</option>
                            <option>5%</option>
                            <option>6%</option>
                            <option>7%</option>
                            <option>8%</option>
                            <option>9%</option>
                            <option>10%</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Total rate</label>
                          <input type="text" className="form-control" placeholder="N/A" defaultValue="11%" />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Employee PF rate</label>
                          <select className="select">
                            <option>Select PF contribution</option>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Additional rate <span className="text-danger">*</span></label>
                          <select className="select">
                            <option>Select additional rate</option>
                            <option>0%</option>
                            <option>1%</option>
                            <option>2%</option>
                            <option>3%</option>
                            <option>4%</option>
                            <option>5%</option>
                            <option>6%</option>
                            <option>7%</option>
                            <option>8%</option>
                            <option>9%</option>
                            <option>10%</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Total rate</label>
                          <input type="text" className="form-control" placeholder="N/A" defaultValue="11%" />
                        </div>
                      </div>
                    </div>
                    <hr />
                    <h3 className="card-title"> ESI Information</h3>
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">ESI contribution</label>
                          <select className="select">
                            <option>Select ESI contribution</option>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">ESI No. <span className="text-danger">*</span></label>
                          <select className="select">
                            <option>Select ESI contribution</option>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Employee ESI rate</label>
                          <select className="select">
                            <option>Select ESI contribution</option>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Additional rate <span className="text-danger">*</span></label>
                          <select className="select">
                            <option>Select additional rate</option>
                            <option>0%</option>
                            <option>1%</option>
                            <option>2%</option>
                            <option>3%</option>
                            <option>4%</option>
                            <option>5%</option>
                            <option>6%</option>
                            <option>7%</option>
                            <option>8%</option>
                            <option>9%</option>
                            <option>10%</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Total rate</label>
                          <input type="text" className="form-control" placeholder="N/A" defaultValue="11%" />
                        </div>
                      </div>
                    </div>
                    <div className="submit-section">
                      <button className="btn btn-primary submit-btn" type="submit">Save</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* /Bank Statutory Tab */}
          </div>
        </div>
        {/* /Page Content */}
        {/* Profile Modal */}
        <div id="profile_info" className="modal custom-modal fade" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Profile Information</h5>
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="profile-img-wrap edit-img">
                        <img className="inline-block" src={Avatar_02} alt="user" />
                        <div className="fileupload btn">
                          <span className="btn-text">edit</span>
                          <input className="upload" type="file" />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>First Name</label>
                            <input type="text" className="form-control" defaultValue="John" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" className="form-control" defaultValue="Doe" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Birth Date</label>
                            <div>
                              <input className="form-control datetimepicker" type="date" defaultValue="05/06/1985" />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Gender</label>
                            <select className="select form-control">
                              <option value="male selected">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Address</label>
                        <input type="text" className="form-control" defaultValue="4487 Snowbird Lane" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>State</label>
                        <input type="text" className="form-control" defaultValue="New York" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Country</label>
                        <input type="text" className="form-control" defaultValue="United States" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Pin Code</label>
                        <input type="text" className="form-control" defaultValue={10523} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" className="form-control" defaultValue="631-889-3206" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Department <span className="text-danger">*</span></label>
                        <select className="select">
                          <option>Select Department</option>
                          <option>Web Development</option>
                          <option>IT Management</option>
                          <option>Marketing</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Designation <span className="text-danger">*</span></label>
                        <select className="select">
                          <option>Select Designation</option>
                          <option>Web Designer</option>
                          <option>Web Developer</option>
                          <option>Android Developer</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Reports To <span className="text-danger">*</span></label>
                        <select className="select">
                          <option>-</option>
                          <option>Wilmer Deluna</option>
                          <option>Lesley Grauer</option>
                          <option>Jeffery Lalor</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="submit-section">
                    <button className="btn btn-primary submit-btn">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Profile Modal */}
        {/* Personal Info Modal */}
        <div id="personal_info_modal" className="modal custom-modal fade" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Personal Information</h5>
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Passport No</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Passport Expiry Date</label>
                        <div>
                          <input className="form-control datetimepicker" type="date" />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Tel</label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Nationality <span className="text-danger">*</span></label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Religion</label>
                        <div>
                          <input className="form-control" type="date" />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Marital status <span className="text-danger">*</span></label>
                        <select className="select form-control">
                          <option>-</option>
                          <option>Single</option>
                          <option>Married</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Employment of spouse</label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>No. of children </label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                  </div>
                  <div className="submit-section">
                    <button className="btn btn-primary submit-btn">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Personal Info Modal */}
        {/* Family Info Modal */}
        <div id="family_info_modal" className="modal custom-modal fade" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"> Family Informations</h5>
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-scroll">
                    <div className="card">
                      <div className="card-body">
                        <h3 className="card-title">Family Member <a href="" className="delete-icon text-primary"><i className="fa fa-trash-o" /></a></h3>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Name <span className="text-danger">*</span></label>
                              <input className="form-control" type="text" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Relationship <span className="text-danger">*</span></label>
                              <input className="form-control" type="text" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Date of birth <span className="text-danger">*</span></label>
                              <input className="form-control" type="text" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Phone <span className="text-danger">*</span></label>
                              <input className="form-control" type="text" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="card">
                      <div className="card-body">
                        <h3 className="card-title">Education Informations <a className='text-primary' href="" className="delete-icon"><i className="fa fa-trash-o" /></a></h3>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Name <span className="text-danger">*</span></label>
                              <input className="form-control" type="text" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Relationship <span className="text-danger">*</span></label>
                              <input className="form-control" type="text" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Date of birth <span className="text-danger">*</span></label>
                              <input className="form-control" type="text" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Phone <span className="text-danger">*</span></label>
                              <input className="form-control" type="text" />
                            </div>
                          </div>
                        </div>
                        <div className="add-more">
                          <a className='text-primary' href=""><i className="fa fa-plus-circle" /> Add More</a>
                        </div>
                      </div>
                    </div> */}
                  </div>
                  <div className="submit-section">
                    <button className="btn btn-primary submit-btn">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Family Info Modal */}
        {/* Emergency Contact Modal */}
        <div id="emergency_contact_modal" className="modal custom-modal fade" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Personal Information</h5>
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">Primary Contact</h3>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Name <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Relationship <span className="text-danger">*</span></label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Phone <span className="text-danger">*</span></label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Phone 2</label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">Primary Contact</h3>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Name <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Relationship <span className="text-danger">*</span></label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Phone <span className="text-danger">*</span></label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Phone 2</label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="submit-section">
                    <button className="btn btn-primary submit-btn">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Emergency Contact Modal */}
        {/* Education Modal */}
        <div id="education_info" className="modal custom-modal fade" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"> Education Informations</h5>
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-scroll">
                    <div className="card">
                      <div className="card-body">
                        <h3 className="card-title">Education Informations <a href="" className="delete-icon text-primary"><i className="fa fa-trash-o" /></a></h3>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group form-focus focused">
                              <input type="text" defaultValue="Oxford University" className="form-control floating" />
                              <label className="focus-label">Institution</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus focused">
                              <input type="text" defaultValue="Computer Science" className="form-control floating" />
                              <label className="focus-label">Subject</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus focused">
                              <div>
                                <input type="date" defaultValue="01/06/2002" className="form-control floating datetimepicker" />
                              </div>
                              <label className="focus-label">Starting Date</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus focused">
                              <div>
                                <input type="date" defaultValue="31/05/2006" className="form-control floating datetimepicker" />
                              </div>
                              <label className="focus-label">Complete Date</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus focused">
                              <input type="text" defaultValue="BE Computer Science" className="form-control floating" />
                              <label className="focus-label">Degree</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus focused">
                              <input type="text" defaultValue="Grade A" className="form-control floating" />
                              <label className="focus-label">Grade</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-body">
                        <h3 className="card-title">Education Informations <a href="" className="delete-icon text-primary"><i className="fa fa-trash-o" /></a></h3>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group form-focus focused">
                              <input type="text" defaultValue="Oxford University" className="form-control floating" />
                              <label className="focus-label">Institution</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus focused">
                              <input type="text" defaultValue="Computer Science" className="form-control floating" />
                              <label className="focus-label">Subject</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus focused">
                              <div>
                                <input type="date" defaultValue="01/06/2002" className="form-control floating datetimepicker" />
                              </div>
                              <label className="focus-label">Starting Date</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus focused">
                              <div>
                                <input type="date" defaultValue="31/05/2006" className="form-control floating datetimepicker" />
                              </div>
                              <label className="focus-label">Complete Date</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus focused">
                              <input type="text" defaultValue="BE Computer Science" className="form-control floating" />
                              <label className="focus-label">Degree</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus focused">
                              <input type="text" defaultValue="Grade A" className="form-control floating" />
                              <label className="focus-label">Grade</label>
                            </div>
                          </div>
                        </div>
                        <div className="add-more">
                          <a className='text-primary' href=""><i className="fa fa-plus-circle" /> Add More</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="submit-section">
                    <button className="btn btn-primary submit-btn">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Education Modal */}
        {/* Experience Modal */}
        <div id="experience_info" className="modal custom-modal fade" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Experience Informations</h5>
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-scroll">
                    <div className="card">
                      <div className="card-body">
                        <h3 className="card-title">Experience Informations <a href="" className="delete-icon text-primary"><i className="fa fa-trash-o" /></a></h3>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group form-focus">
                              <input type="text" className="form-control floating" defaultValue="Digital Devlopment Inc" />
                              <label className="focus-label">Company Name</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus">
                              <input type="text" className="form-control floating" defaultValue="United States" />
                              <label className="focus-label">Location</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus">
                              <input type="text" className="form-control floating" defaultValue="Web Developer" />
                              <label className="focus-label">Job Position</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus">
                              <div>
                                <input type="date" className="form-control floating datetimepicker" defaultValue="01/07/2007" />
                              </div>
                              <label className="focus-label">Period From</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus">
                              <div>
                                <input type="date" className="form-control floating datetimepicker" defaultValue="08/06/2018" />
                              </div>
                              <label className="focus-label">Period To</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-body">
                        <h3 className="card-title">Experience Informations <a href="" className="delete-icon text-primary"><i className="fa fa-trash-o" /></a></h3>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group form-focus">
                              <input type="text" className="form-control floating" defaultValue="Digital Devlopment Inc" />
                              <label className="focus-label">Company Name</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus">
                              <input type="text" className="form-control floating" defaultValue="United States" />
                              <label className="focus-label">Location</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus">
                              <input type="text" className="form-control floating" defaultValue="Web Developer" />
                              <label className="focus-label">Job Position</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus">
                              <div>
                                <input type="date" className="form-control floating datetimepicker" defaultValue="01/07/2007" />
                              </div>
                              <label className="focus-label">Period From</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group form-focus">
                              <div>
                                <input type="date" className="form-control floating datetimepicker" defaultValue="08/06/2018" />
                              </div>
                              <label className="focus-label">Period To</label>
                            </div>
                          </div>
                        </div>
                        <div className="add-more">
                          <a className='text-primary' href=""><i className="fa fa-plus-circle" /> Add More</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="submit-section">
                    <button className="btn btn-primary submit-btn">Submit</button>
                  </div>
                </form>
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
export default EmployeeProfile;
