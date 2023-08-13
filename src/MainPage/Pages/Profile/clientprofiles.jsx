
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Helmet } from "react-helmet";
import { FaCamera, FaFacebook, FaInstagram, FaLinkedin, FaLongArrowAltLeft, FaLongArrowAltRight, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Avatar_02, Avatar_05, Avatar_09, Avatar_10, Avatar_16 } from '../../../Entryfile/imagepath'
import Offcanvas from '../../../Entryfile/offcanvance';
import useHttp from '../../../hooks/useHttp'
import man from '../../../assets/img/man.png'
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaCopy, FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaTrash } from "react-icons/fa";
import { GoSearch, GoTrashcan } from 'react-icons/go';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.locale('en-au');
dayjs.extend(isBetween);

const ClientProfiles = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault('Australia/Sydney');
  const { uid } = useParams()
  const [staffOne, setStaffOne] = useState({});
  const [clientRoster, setClientRoster] = useState([]);
  const [profile, setProfile] = useState({})
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [informModal, setInformModal] = useState(false);
  const [stateModal, setStateModal] = useState(false);
  const [kinModal, setKinModal] = useState(false);
  const [bankModal, setBankModal] = useState(false);
  const [socialModal, setSocialModal] = useState(false);

  const { get, post } = useHttp()
  const FetchStaff = async () => {
    try {
      const { data } = await get(`/Profiles/${uid}`, { cacheTimeout: 300000 })
      setStaffOne(data);
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
    }

    try {
      const { data } = await get(`/ShiftRosters/get_shifts_by_user?client=${uid}&staff=`, { cacheTimeout: 300000 });
      setClientRoster(data.shiftRoster)

    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
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

  const columns = [
    {
      name: 'Staff',
      selector: row => row.staff?.fullName || 'N/A',
      sortable: true
    },
    {
      name: 'Date',
      selector: row => dayjs(row.dateFrom).format('YYYY-MM-DD'),
      sortable: true,
    },
    {
      name: 'Start Time',
      selector: row => dayjs(row.dateFrom).format('hh:mm A'),
      sortable: true
    },
    {
      name: 'End Time',
      selector: row => dayjs(row.dateTo).format('hh:mm A'),
      sortable: true
    },
    {
      name: 'Activities',
      selector: row => row.activities,
      sortable: true
    },

  ];

  const handleExcelDownload = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');

    // Add headers
    const headers = columns.map((column) => column.name);
    sheet.addRow(headers);

    // Add data
    clientRoster.forEach((dataRow) => {
      const values = columns.map((column) => {
        if (typeof column.selector === 'function') {
          return column.selector(dataRow);
        }
        return dataRow[column.selector];
      });
      sheet.addRow(values);
    });

    // Generate Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'data.xlsx';
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };


  const handlePDFDownload = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(13);
    doc.text("User Table", marginLeft, 40);
    const headers = columns.map((column) => column.name);
    const dataValues = clientRoster.map((dataRow) =>
      columns.map((column) => {
        if (typeof column.selector === "function") {
          return column.selector(dataRow);
        }
        return dataRow[column.selector];
      })
    );

    doc.autoTable({
      startY: 50,
      head: [headers],
      body: dataValues,
      margin: { top: 50, left: marginLeft, right: marginLeft, bottom: 0 },
    });
    doc.save("Admin.pdf");
  };

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
      const { data } = await get(`/Profiles/${e}`, { cacheTimeout: 300000 })
      // console.log(data);
      setProfile(data);
      setEditedProfile({ ...data })
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)


    }
  }

  const handleActivate = async (e) => {
    try {
      const response = await get(`/Profiles/activate_staff?userId=${id.userId}&clientid=${e}`,

      )


    } catch (error) {
      toast.error("Error Occurred")
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)


    }




  }
  const handleDeactivate = async (e) => {
    try {
      const response = await get(`/Profiles/deactivate_staff?userId=${id.userId}&clientid=${e}`,
      )


    } catch (error) {
      toast.error("Error Occurred")
      console.log(error);
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)


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
      const { data } = await post(`/Profiles/edit/${uid}?userId=${id.userId}`,
        formData
      )
      //   console.log(data)
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
      // console.log(error);
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
      setLoading(false);

    }
    finally {
      setLoading(false)
    }
  }

  const ButtonRow = ({ data }) => {
    return (

      <div className="p-2 d-flex gap-1 flex-column " style={{ fontSize: "12px" }}>
        <div ><span className='fw-bold'>Staff: </span>{data.staff.fullName}</div>
        <div><span className='fw-bold'>Client: </span>{data.profile.fullName}</div>
        <div><span className='fw-bold'>Activities: </span>{data.activities}</div>
        <div>
          {/* <button className="btn text-info fw-bold" style={{ fontSize: "12px" }} onClick={() => handleActivityClick(data.progressNoteId)}>
                    Edit
                </button> */}
        </div>

      </div>
    );
  };

  const [searchText, setSearchText] = useState("");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = clientRoster.filter((item) =>
    item.activities?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.staff?.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.dateFrom?.toLowerCase().includes(searchText.toLowerCase())
  );

  const history = useHistory();
  const goBack = () => {
    history.goBack(); // Go back in history
  };

  const goForward = () => {
    history.goForward(); // Go forward in history
  };
  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title>Client Profile </title>
          <meta name="description" content="Client Profile" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-10">
                <h3 className="page-title">Profile</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link to="/app/employee/clients">Client</Link></li>
                  <li className="breadcrumb-item active">Profile</li>
                </ul>
              </div>
              <div className="col-md-2 d-none d-md-block">
                <button className='btn' onClick={goBack}>
                  <FaLongArrowAltLeft className='fs-3' />
                </button> &nbsp;  <button className='btn' onClick={goForward}>
                  <FaLongArrowAltRight className='fs-3' />
                </button>
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
                      <div className="profile-img rounded-circle border">
                        <a href="">
                          <img src={staffOne.imageUrl || man} alt="" width={"100%"} className='rounded-cirle' />
                        </a>
                      </div>
                    </div>
                    <div className="profile-basic">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="profile-info-left">
                            <h3 className="user-name m-t-0">{staffOne.fullName}</h3>
                            {/* <h5 className="company-role m-t-0 mb-0">Barry Cuda</h5> */}
                            <small className="text-muted">{staffOne.email}</small>
                            <div className="staff-id">Client ID : {staffOne.contactId}</div>
                            <div className="staff-msg d-flex gap-2">

                              <Link to={`/app/profile/client-docUpload/${staffOne.profileId}`}
                                className="btn btn-primary py-2  btn-sm">Client's Doc</Link>
                              {
                                staffOne.isActive ?
                                  <button onClick={() => handleDeactivate(staffOne.profileId)} className="btn btn-sm py-1 px-2 rounded text-white bg-danger">
                                    Deactivate Client
                                  </button>
                                  :
                                  <button onClick={() => handleActivate(staffOne.profileId)} className="btn btn-sm py-1 px-2 rounded text-white bg-success">
                                    Activate Client
                                  </button>

                              }
                            </div>
                          </div>
                        </div>
                        <div className="col-md-7">
                          <ul className="personal-info">
                            <li>
                              <span className="title">Phone:</span>
                              <span className="text"><a href={`tel:${staffOne.phoneNumber}`}>{staffOne.phoneNumber}</a></span>
                            </li>
                            <li>
                              <span className="title">Email:</span>
                              <span className="text"><a href={`mailto:${staffOne.email}`}>{staffOne.email}</a></span>
                            </li>
                            <li>
                              <span className="title">Birthday:</span>
                              <span className="text">{!staffOne.dateOfBirth ? "Not Updated" : moment(staffOne.dateOfBirth).format('ll')}</span>
                            </li>
                            <li>
                              <span className="title">Address:</span>
                              <span className="text">{staffOne.address}</span>
                            </li>
                            <li>
                              <span className="title">Gender:</span>
                              <span className="text">{staffOne.gender}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    {/* <div className="pro-edit">
                      <Link to={`/app/profile/edit-client/${staffOne.profileId}`} className="edit-icon bg-info text-white">
                        <i className="fa fa-pencil" />
                      </Link>
                    </div> */}
                    <a className="edit-icon bg-info text-white" onClick={() => handleModal0(staffOne.profileId)}>
                      <i className="fa fa-pencil" />
                    </a>
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
                Update profile for {profile.surName} {profile.firstName}
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
                  <label>Last Name</label>
                  <input type="text" className="form-control" value={profile.surName} onChange={handleInputChange} readOnly />
                </div>
                <div className="form-group col-md-4">
                  <label>First Name</label>
                  <input type="text" className="form-control" value={profile.firstName} readOnly />
                </div>
                <div className="form-group col-md-4">
                  <label>Middle Name</label>
                  <input type="text" className="form-control" name="middleName" value={editedProfile.middleName || ""} onChange={handleInputChange} />
                </div>
                <div className="form-group col-md-4">
                  <label>Phone Number</label>
                  <input type="number" className="form-control" value={profile.phoneNumber} readOnly />
                </div>
                <div className="form-group col-md-4">
                  <label>Date Of Birth</label>
                  <input type="date" name='dateOfBirth' className="form-control" value={editedProfile.dateOfBirth || ""} onChange={handleInputChange} />
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


                {/* <div className="form-group col-md-12">
                  <label>About Me</label><br />
                  <textarea className='form-control' style={{ width: "100%", height: "auto" }} name="aboutMe" value={editedProfile.aboutMe || ''} onChange={handleInputChange}></textarea>
                </div> */}


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
                <div className="scrollable-tabs-container" style={{ width: "100%", overflowY: "hidden", overflowX: "auto" }}>
                  <ul className="nav nav-tabs nav-tabs-bottom" style={{ display: "flex", flexWrap: "nowrap", whiteSpace: "nowrap" }}>
                    <li className="nav-item"><a href="#emp_profile" data-bs-toggle="tab" className="nav-link active text-primary fw-bold">Profile</a></li>
                    <li className="nav-item"><Link to={`/app/forms/client-schedule/${uid}`} className="nav-link text-primary fw-bold">Schedule</Link></li>
                    <li className="nav-item"><Link to={`/app/forms/client-disability-support/${uid}`} className="nav-link text-primary fw-bold">Disability Support Needs</Link></li>
                    <li className="nav-item"><Link to={`/app/forms/client-daily-living/${uid}`} className="nav-link text-primary fw-bold">Daily Living & Night Support</Link></li>
                    <li className="nav-item"><Link to={`/app/forms/client-aids/${uid}`} className="nav-link text-primary fw-bold">Aids & Equipment</Link></li>
                    <li className="nav-item"><Link to={`/app/forms/client-health/${uid}`} className="nav-link text-primary fw-bold">Health Support Needs</Link></li>
                    <li className="nav-item"><Link to={`/app/forms/client-community-support/${uid}`} className="nav-link text-primary fw-bold">Community Support Needs</Link></li>
                    <li className="nav-item"><Link to={`/app/forms/client-behaviour/${uid}`} className="nav-link text-primary fw-bold">Behaviour Support Needs</Link></li>

                  </ul>
                </div>
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
                        <a className="edit-icon bg-info text-white" onClick={() => handleModal1(staffOne.profileId)}>
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
                              Update profile for {profile.surName} {profile.firstName}
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
                      <h3 className="card-title">Postal Address</h3>
                      <ul className="personal-info">
                        <li>
                          <div className="title">Address Line 1</div>
                          <div className="text">{staffOne.address}</div>
                        </li>
                        <li>
                          <div className="title">Country</div>
                          <div className="text">{staffOne.country === "null" ? "---" : staffOne.country}</div>
                        </li>
                        <li>
                          <div className="title">State</div>
                          <div className="text">{staffOne.state === "null" ? "---" : staffOne.state}</div>
                        </li>
                        <li>
                          <div className="title">City</div>
                          <div className="text">{staffOne.city === "null" ? "---" : staffOne.city}</div>
                        </li>
                        <li>
                          <div className="title">Post Code</div>
                          <div className="text">{staffOne.postcode === "null" ? "---" : staffOne.postcode}</div>
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
                        <a className="edit-icon bg-info text-white" onClick={() => handleModal2(staffOne.profileId)}>
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
                                <input type="email" className="form-control" name='kinPostcode' value={editedProfile.kinPostcode || ''} onChange={handleInputChange} />
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
                          <div className="text">{staffOne.kinPostcode === "null" ? "---" : staffOne.kinPostcode}</div>
                        </li>

                      </ul>


                    </div>
                  </div>
                </div>
              </div>

              {/* modal 3 */}
              <div className="row">
                <div className="col-md-6 d-flex">
                  <div className="card profile-box flex-fill">
                    <div className="card-body">
                      <div className="pro-edit">
                        <a className="edit-icon bg-info text-white" onClick={() => handleModal3(staffOne.profileId)}>
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

                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="row">

                              <div className="form-group col-md-4">
                                <label>Cultural Background</label>
                                <input type="text" className="form-control" name='culturalBackground' value={editedProfile.culturalBackground || ''} onChange={handleInputChange} />
                              </div>

                              <div className="form-group col-md-4">
                                <label>Preferred Language</label>
                                <input type="text" className="form-control" name='preferredLanguage' value={editedProfile.preferredLanguage || ''} onChange={handleInputChange} />
                              </div>

                              <div className="form-group col-md-4">
                                <label>Privacy Preferences</label><br />
                                <textarea className='form-control' name="privacyPreferences" id="" style={{ width: "100%", height: "auto" }} value={editedProfile.privacyPreferences || ''} onChange={handleInputChange}></textarea>
                              </div>

                              <div className="form-group col-md-4">
                                <label>Do you have an NDIS plan?</label>
                                <select className="form-control" name='ndisPlan' value={editedProfile.ndisPlan || ''} onChange={handleInputChange}>
                                  <option defaultValue hidden>Please select</option>
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                                </select>
                              </div>

                              <div className="form-group col-md-4">
                                <label>Indigenous Satatus</label>
                                <select className="form-control" name='indigenousSatatus' value={editedProfile.indigenousSatatus || ''} onChange={handleInputChange}>
                                  <option defaultValue hidden>Please select</option>
                                  <option value="Aboriginal and Torres Strait Islander">Aboriginal and Torres Strait Islander</option>
                                  <option value="Aboriginal">Aboriginal</option>
                                  <option value="Torres Strait Islander">Torres Strait Islander</option>
                                  <option value="Not Aboriginal or Torres Strait Islander">Not Aboriginal or Torres Strait Islander</option>
                                </select>
                              </div>

                              <div className="form-group col-md-4">
                                <label>Interpreter Required?</label>
                                <select className="form-control" name='requireInterpreter' value={editedProfile.requireInterpreter || ''} onChange={handleInputChange}>
                                  <option defaultValue hidden>Please select</option>
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                                </select>
                              </div>
                              <div className="form-group col-md-12">
                                <label>Financial Arrangement</label><br />
                                <textarea className='form-control' name="financialArrangement" id="" style={{ width: "100%", height: "auto" }} value={editedProfile.financialArrangement || ''} onChange={handleInputChange}></textarea>
                              </div>
                              <div className="form-group col-md-12">
                                <label>NDIS Plan Notes If Yes above, Include Plan approval Date and if No, State reason (e.g waiting for plan approval or plan review)</label><br />
                                <textarea className='form-control' name="ndisPlanNote" id="" style={{ width: "100%", height: "auto" }} value={editedProfile.ndisPlanNote || ''} onChange={handleInputChange}></textarea>
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
                      <h3 className="card-title"></h3>
                      <ul className="personal-info">
                        <li>
                          <div className="title">Cultural Background</div>
                          <div className="text">{staffOne.culturalBackground === "null" ? "---" : staffOne.culturalBackground}</div>
                        </li>
                        <li>
                          <div className="title">Preferred Language</div>
                          <div className="text">{staffOne.preferredLanguage === "null" ? "---" : staffOne.preferredLanguage}</div>
                        </li>
                        <li>
                          <div className="title">Privacy Preferences</div>
                          <div className="text">{staffOne.privacyPreferences === "null" ? "---" : staffOne.privacyPreferences}</div>
                        </li>
                        <li>
                          <div className="title">Do you have an NDIS plan </div>
                          <div className="text"> {staffOne.ndisPlan === "null" ? "---" : staffOne.ndisPlan}</div>
                        </li>
                        <li>
                          <div className="title">Indigenous Satatus</div>
                          <div className="text">{staffOne.indigenousSatatus === "null" ? "---" : staffOne.indigenousSatatus}</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
              <label className='d-flex justify-content-center align-items-center'>{staffOne.fullName} Shift Roster</label>
              <div className='mt-4 border'>
                <div className="row px-2 py-3 d-flex justify-content-between align-items-center gap-4">

                  <div className="col-md-3">
                    <div className='d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                      <input type="text" placeholder="Search...." className='border-0 outline-none' onChange={handleSearch} />
                      <GoSearch />
                    </div>
                  </div>
                  <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
                    <CSVLink
                      data={clientRoster}
                      filename={"document.csv"}

                    >
                      <button

                        className='btn text-info'
                        title="Export as CSV"
                      >
                        <FaFileCsv />
                      </button>

                    </CSVLink>
                    <button
                      className='btn text-danger'
                      onClick={handlePDFDownload}
                      title="Export as PDF"
                    >
                      <FaFilePdf />
                    </button>
                    <button
                      className='btn text-primary'

                      onClick={handleExcelDownload}
                      title="Export as Excel"
                    >
                      <FaFileExcel />
                    </button>
                    <CopyToClipboard text={JSON.stringify(clientRoster)}>
                      <button

                        className='btn text-warning'
                        title="Copy Table"
                        onClick={() => toast("Table Copied")}
                      >
                        <FaCopy />
                      </button>
                    </CopyToClipboard>
                  </div>
                </div>
                <DataTable data={filteredData} columns={columns}
                  pagination
                  highlightOnHover
                  searchable
                  searchTerm={searchText}
                  progressPending={loading}
                  progressComponent={<div className='text-center fs-1'>
                    <div className="spinner-grow text-secondary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>}
                  expandableRows
                  expandableRowsComponent={ButtonRow}
                  paginationTotalRows={filteredData.length}
                  responsive


                />



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
export default ClientProfiles;
