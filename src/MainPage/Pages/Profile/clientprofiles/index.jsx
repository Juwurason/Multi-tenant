
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Helmet } from "react-helmet";
import { FaCamera, FaFacebook, FaInstagram, FaLinkedin, FaLongArrowAltLeft, FaLongArrowAltRight, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link, useHistory, useParams } from 'react-router-dom';
import Offcanvas from '../../../../Entryfile/offcanvance';
import useHttp from '../../../../hooks/useHttp'
import man from '../../../../assets/img/man.png'
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
import axiosInstance from '../../../../store/axiosInstance';
import ProfileDetail from './profileDetail';
import ClientSchedule from '../../clientForms/ClientSchedule';
import ClientDisability from '../../clientForms/ClientDisability';
import ClientDailyLiving from '../../clientForms/ClientDailyNightAndLiving';
import ClientAidEquip from '../../clientForms/ClientAid';
import ClientHealth from '../../clientForms/ClientHealthSupport';
import ClientComunitySupport from '../../clientForms/ClientComminitySupport';
import ClientBehaviuor from '../../clientForms/ClientBehaviour';
import ClientDoc from '../../../../_components/forms/ClientsDoc';
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
    const [loading0, setLoading0] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const { get, post } = useHttp()
    const [activeTab, setActiveTab] = useState('emp_profile');
    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };
    const FetchStaff = async () => {
        setLoading0(true);
        try {
            const { data } = await get(`/Profiles/${uid}`, { cacheTimeout: 300000 })

            setStaffOne(data);
            setLoading0(false);
        } catch (error) {
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
            setLoading0(false);
        }

        try {
            const { data } = await get(`/ShiftRosters/get_shifts_by_user?client=${uid}&staff=`, { cacheTimeout: 300000 });
            setClientRoster(data.shiftRoster)
            setLoading0(false);

        } catch (error) {
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
            setLoading0(false);
        } finally {
            setLoading0(false);
        }
    }
    useEffect(() => {
        FetchStaff()
    }, []);


    const columns = [
        {
            name: 'Staff',
            selector: row => row.staff?.fullName || 'N/A',
            sortable: true
        },
        {
            name: 'Date',
            selector: row => dayjs(row.dateFrom).format('DD-MM-YYYY'),
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
        setLoading2(true)
        try {
            const { data } = await axiosInstance.get(`/Profiles/activate_client?userId=${id.userId}&clientid=${e}`,

            )

            if (data.status === 'Success') {
                toast.success(data.message)
                FetchStaff();
            }

        } catch (error) {

            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
            setLoading2(false)
        }
        finally {
            setLoading2(false)
        }


    }

    const handleDeactivate = async (e) => {
        setLoading1(true)
        try {
            const { data } = await axiosInstance.get(`/Profiles/deactivate_client?userId=${id.userId}&clientid=${e}`,
            )


            if (data.status === 'Success') {
                toast.success(data.message)
                FetchStaff();
            }

        } catch (error) {
            console.log(error);
            setLoading1(false)
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)


        }
        finally {
            setLoading1(false)
        }


    }

    const handleApproveAudit = async (e) => {
        setLoading2(true)
        try {
            const { data } = await axiosInstance.get(`/Profiles/approve_audit?userId=${id.userId}&id=${e}`,

            )

            if (data.status === 'Success') {
                toast.success(data.message)
                FetchStaff();
            }

        } catch (error) {

            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
            setLoading2(false)
        }
        finally {
            setLoading2(false)
        }
    }

    const handleDeapproveAudit = async (e) => {
        setLoading1(true)
        try {
            const { data } = await axiosInstance.get(`/Profiles/disapprove_audit?userId=${id.userId}&id=${e}`,
            )

            if (data.status === 'Success') {
                toast.success(data.message)
                FetchStaff();
            }

        } catch (error) {
            setLoading1(false)
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)


        }
        finally {
            setLoading1(false)
        }
    }

    const handleView = (xerolink) => {
        window.open(xerolink, '_blank');
    };

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
            // console.log(data)
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
            toast.error(error.response.data.errors.PhoneNumber[0])
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
                {loading0 ? <div className='mx-auto d-flex justify-content-center w-100 py-5'>
                    <div className="lds-spinner m-5"><div></div><div></div><div></div><div></div><div>
                    </div><div></div><div></div><div></div><div></div></div>
                </div> : <div className="content container-fluid">
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
                                                        <div className="staff-id">NDIS No: {staffOne.ndisNo}</div>
                                                        <div className="staff-id">Referral: {staffOne.referral}</div>

                                                        {/* <div className="staff-id">Employee ID : CLT-0001</div> */}
                                                        <div className="staff-msg d-flex gap-2 flex-wrap">

                                                            {/* <Link to={`/app/profile/client-docUpload/${staffOne.profileId}`}
                                                                className="btn btn-primary py-2  btn-sm">Client's Doc</Link> */}
                                                            {
                                                                staffOne.isActive ?
                                                                    <button onClick={() => handleDeactivate(staffOne.profileId)} className="btn btn-sm py-1 px-2 rounded text-white bg-danger">

                                                                        {loading1 ? <div className="spinner-grow text-light" role="status">
                                                                            <span className="sr-only">Loading...</span>
                                                                        </div> : "Deactivate Client"}
                                                                    </button>
                                                                    :
                                                                    <button onClick={() => handleActivate(staffOne.profileId)} className="btn btn-sm py-1 px-2 rounded text-white bg-success">

                                                                        {loading2 ? <div className="spinner-grow text-light" role="status">
                                                                            <span className="sr-only">Loading...</span>
                                                                        </div> : "Activate Client"}
                                                                    </button>

                                                            }
                                                            {
                                                                staffOne.auditApproved ?
                                                                    <button onClick={() => handleDeapproveAudit(staffOne.profileId)} className="btn py-1 px-2 rounded text-white bg-danger">

                                                                        {loading1 ? <div className="spinner-grow text-light" role="status">
                                                                            <span className="sr-only">Loading...</span>
                                                                        </div> : "Disapprove for Auditing"}
                                                                    </button>
                                                                    :
                                                                    <button onClick={() => handleApproveAudit(staffOne.profileId)} className="btn py-1 px-2 rounded text-white bg-success">

                                                                        {loading2 ? <div className="spinner-grow text-light" role="status">
                                                                            <span className="sr-only">Loading...</span>
                                                                        </div> : "Approve for Auditing"}
                                                                    </button>

                                                            }
                                                        </div>
                                                        <div>
                                                            {staffOne.clientId === null ? <button
                                                                className="btn py-1 rounded text-white mt-2 bg-primary" onClick={() => handleView(staffOne.xerolink)}>Update Record to Xero</button> : ""}
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
                                                        <li>
                                                            <span className="title">Agreement Start Date:</span>
                                                            <span className="text">{!staffOne.agreementStartDate ? "Not Updated" : moment(staffOne.agreementStartDate).format('ll')}</span>
                                                        </li>
                                                        <li>
                                                            <span className="title">Agreement End Date:</span>
                                                            <span className="text">{!staffOne.agreementEndDate ? "Not Updated" : moment(staffOne.agreementEndDate).format('ll')}</span>
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
                                    <input type="text" className="form-control" value={profile.surName || ''} onChange={handleInputChange} readOnly />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>First Name</label>
                                    <input type="text" className="form-control" value={profile.firstName || ''} readOnly />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Middle Name</label>
                                    <input type="text" className="form-control" name="middleName" value={editedProfile.middleName || ""} onChange={handleInputChange} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Phone Number</label>
                                    <input type="tel" className="form-control" value={profile.phoneNumber || ''} readOnly />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Date Of Birth</label>
                                    <input type="date" name='dateOfBirth' className="form-control" value={editedProfile.dateOfBirth || ""} onChange={handleInputChange} />
                                </div>

                                <div className="form-group col-md-4">
                                    <label>Email</label>
                                    <input type="text" className="form-control" value={profile.email || ''} readOnly />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Gender:</label>
                                    <select className="form-control" name="gender" value={editedProfile.gender || ''} onChange={handleInputChange}>
                                        <option defaultValue hidden>Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>

                                </div>

                                <div className="form-group col-md-4">
                                    <label>Agreement Start Date</label>
                                    <input type="date" className="form-control" name='agreementStartDate' value={editedProfile.agreementStartDate || ''} onChange={handleInputChange} />
                                </div>

                                <div className="form-group col-md-4">
                                    <label>Agreement End Date</label>
                                    <input type="date" className="form-control" name='agreementEndDate' value={editedProfile.agreementEndDate || ''} onChange={handleInputChange} />
                                </div>

                                <div className="form-group col-md-4">
                                    <label>Ndis No</label>
                                    <input type="text" className="form-control" name='ndisNo' value={editedProfile.ndisNo || ''} onChange={handleInputChange} />
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





                    {/* <div className="card tab-box">
                        <div className="row user-tabs">
                            <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                                <div className="scrollable-tabs-container" style={{ width: "100%", overflowY: "hidden", overflowX: "auto" }}>
                                    <ul className="nav nav-tabs nav-tabs-bottom" style={{ display: "flex", flexWrap: "nowrap", whiteSpace: "nowrap" }}>
                                        <li className="nav-item"><a href="#emp_profile" data-bs-toggle="tab" className="nav-link active text-primary fw-bold">Profile</a></li>
                                        <li className="nav-item"><a href="#client_schedule" data-bs-toggle="tab" className="nav-link text-primary fw-bold">Schedule</a></li>
                                        <li className="nav-item"><a href="#client-disability-support" data-bs-toggle="tab" className="nav-link text-primary fw-bold">Disability Support Needs</a></li>
                                        <li className="nav-item"><a href="#client-daily-living" data-bs-toggle="tab" className="nav-link text-primary fw-bold">Daily Living & Night Support</a></li>
                                        <li className="nav-item"><a href="#client-aids" data-bs-toggle="tab" className="nav-link text-primary fw-bold">Aids & Equipment</a></li>
                                        <li className="nav-item"><a href="#client-health" data-bs-toggle="tab" className="nav-link text-primary fw-bold">Health Support Needs</a></li>
                                        <li className="nav-item"><a href="#client-community-support" data-bs-toggle="tab" className="nav-link text-primary fw-bold">Community Support Needs</a></li>
                                        <li className="nav-item"><a href="#client-behaviour" data-bs-toggle="tab" className="nav-link text-primary fw-bold">Behaviour Support Needs</a></li>
                                       

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    <div className="card tab-box">
                        <div className="row user-tabs">
                            <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                                <div className="scrollable-tabs-container" style={{ width: "100%", overflowY: "hidden", overflowX: "auto" }}>
                                    <ul className="nav nav-tabs nav-tabs-bottom" style={{ display: "flex", flexWrap: "nowrap", whiteSpace: "nowrap" }}>
                                        <li className="nav-item">
                                            <a
                                                href="#emp_profile"
                                                data-bs-toggle="tab"
                                                className={`nav-link ${activeTab === 'emp_profile' ? 'active text-primary fw-bold' : ''}`}
                                                onClick={() => handleTabClick('emp_profile')}
                                            >
                                                Profile
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a
                                                href="#client-docUpload"
                                                data-bs-toggle="tab"
                                                className={`nav-link ${activeTab === 'client-docUpload' ? 'active text-primary fw-bold' : ''}`}
                                                onClick={() => handleTabClick('client-docUpload')}
                                            >
                                                Document
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a
                                                href="#client_schedule"
                                                data-bs-toggle="tab"
                                                className={`nav-link ${activeTab === 'client_schedule' ? 'active text-primary fw-bold' : ''}`}
                                                onClick={() => handleTabClick('client_schedule')}
                                            >
                                                Schedule
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a
                                                href="#client-disability-support"
                                                data-bs-toggle="tab"
                                                className={`nav-link ${activeTab === 'client-disability-support' ? 'active text-primary fw-bold' : ''}`}
                                                onClick={() => handleTabClick('client-disability-support')}
                                            >
                                                Disability Support Needs
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a
                                                href="#client-daily-living"
                                                data-bs-toggle="tab"
                                                className={`nav-link ${activeTab === 'client-daily-living' ? 'active text-primary fw-bold' : ''}`}
                                                onClick={() => handleTabClick('client-daily-living')}
                                            >
                                                Daily Living & Night Support
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a
                                                href="#client-aids"
                                                data-bs-toggle="tab"
                                                className={`nav-link ${activeTab === 'client-aids' ? 'active text-primary fw-bold' : ''}`}
                                                onClick={() => handleTabClick('client-aids')}
                                            >
                                                Aids & Equipment
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a
                                                href="#client-health"
                                                data-bs-toggle="tab"
                                                className={`nav-link ${activeTab === 'client-health' ? 'active text-primary fw-bold' : ''}`}
                                                onClick={() => handleTabClick('client-health')}
                                            >
                                                Health Support Needs
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a
                                                href="#client-community-support"
                                                data-bs-toggle="tab"
                                                className={`nav-link ${activeTab === 'client-community-support' ? 'active text-primary fw-bold' : ''}`}
                                                onClick={() => handleTabClick('client-community-support')}
                                            >
                                                Community Support Needs
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a
                                                href="#client-behaviour"
                                                data-bs-toggle="tab"
                                                className={`nav-link ${activeTab === 'client-behaviour' ? 'active text-primary fw-bold' : ''}`}
                                                onClick={() => handleTabClick('client-behaviour')}
                                            >
                                                Behaviour Support Needs
                                            </a>
                                        </li>
                                    </ul>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tab-content">
                        {/* Profile Info Tab */}
                        <div id="emp_profile" className="pro-overview tab-pane fade show active">

                            <ProfileDetail
                                handleModal1={handleModal1} profile={profile} stateModal={stateModal} setStateModal={setStateModal} editedProfile={editedProfile} handleInputChange={handleInputChange} handleSave={handleSave}
                                loading={loading} staffOne={staffOne} handleModal2={handleModal2} kinModal={kinModal} setKinModal={setKinModal} handleModal3={handleModal3} bankModal={bankModal} setBankModal={setBankModal} clientRoster={clientRoster}
                                handlePDFDownload={handlePDFDownload}
                                handleExcelDownload={handleExcelDownload}
                                filteredData={filteredData}
                                columns={columns}
                                searchText={searchText}
                                ButtonRow={ButtonRow}
                                handleSearch={handleSearch}
                                loading0={loading0}


                            />

                        </div>
                        <div id="client-docUpload" className="pro-overview tab-pane fade show ">

                            <ClientDoc uid={uid} />
                        </div>

                        <div id="client_schedule" className="pro-overview tab-pane fade show ">

                            <ClientSchedule uid={uid} />
                        </div>
                        
                        <div id="client-disability-support" className="pro-overview tab-pane fade show ">

                            <ClientDisability uid={uid} />
                        </div>
                        <div id="client-daily-living" className="pro-overview tab-pane fade show ">

                            <ClientDailyLiving uid={uid} />
                        </div>
                        <div id="client-aids" className="pro-overview tab-pane fade show ">

                            <ClientAidEquip uid={uid} />
                        </div>
                        <div id="client-health" className="pro-overview tab-pane fade show ">

                            <ClientHealth uid={uid} />
                        </div>
                        <div id="client-community-support" className="pro-overview tab-pane fade show ">

                            <ClientComunitySupport uid={uid} />
                        </div>
                        <div id="client-behaviour" className="pro-overview tab-pane fade show ">

                            <ClientBehaviuor uid={uid} />
                        </div>


                    </div>
                </div>}
                {/* /Experience Modal */}
            </div>
            <Offcanvas />
        </>


    );
}
export default ClientProfiles;
