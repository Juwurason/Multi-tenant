/**
 * Form Elemets
 */
 import React, { useEffect, useState } from 'react';
 import { Helmet } from "react-helmet";
 import { Link } from 'react-router-dom';
 import useHttp from '../../../hooks/useHttp';
 import { useCompanyContext } from '../../../context';
 import DataTable from "react-data-table-component";
 import { CSVLink } from "react-csv";
 import { CopyToClipboard } from "react-copy-to-clipboard";
 import jsPDF from "jspdf";
 import "jspdf-autotable";
 import { FaCopy, FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaTrash } from "react-icons/fa";
 import Offcanvas from '../../../Entryfile/offcanvance';
 import { toast } from 'react-toastify';
 import { GoSearch, GoTrashcan } from 'react-icons/go';
 import dayjs from 'dayjs';
 import moment from 'moment';
 import Swal from 'sweetalert2';
 import { Modal } from 'react-bootstrap';
 
 
 
 const PrivacyStatement = () => {
     useEffect(() => {
         if ($('.select').length > 0) {
             $('.select').select2({
                 minimumResultsForSearch: -1,
                 width: '100%'
             });
         }
     });
 
     const [selected, setSelected] = useState([]);
     const [staffAvail, setStaffAvail] = useState([]);
     const { loading, setLoading } = useCompanyContext();
     const [loading1, setLoading1] = useState(false);
     const [loading2, setLoading2] = useState(false);
     const [selectedDay, setSelectedDay] = useState("");
     const [selectedPosition, setSelectedPosition] = useState("");
     const [selectedPhone, setSelectedPhone] = useState("");
     const { get, post } = useHttp();
     const [selectedTimeFrom, setSelectedTimeFrom] = useState("");
     const [selectedTimeTo, setSelectedTimeTo] = useState("");
     const id = JSON.parse(localStorage.getItem('user'))
     const [showModal, setShowModal] = useState(false);
     const clientProfile = JSON.parse(localStorage.getItem('clientProfile'))
     
 
 
     const PostAvail = async (e) => {
         e.preventDefault()
         if (selectedDay === "" || selectedTimeFrom === "" || selectedPhone === "") {
             return toast.error("Input Fields cannot be empty")
         }
        
         setLoading1(true)
 
         const info = {
             profileId: clientProfile.profileId,
             question1: selectedDay,
             question2: selectedTimeFrom,
             question3: selectedTimeTo,
             behaviourPlan: selectedPhone,
             //  behaviourPlanFile: selectedPosition,
             riskAssessment: selectedPosition,
             //  riskAssessmentFile: ""
             //  companyID: id.companyId
         }
         try {
 
             const { data } = await post(`/BehaviourSupports`, info);
             console.log(data)
             if (data.status === 'Success') {
                 toast.success(data.message)
             }
             setLoading1(false)
             FetchSchedule()
         } catch (error) {
             console.log(error);
             toast.error(error.response.data.message)
             toast.error(error.response.data.title)
         }
         finally {
             setLoading1(false)
         }
     }
 
 
     const FetchSchedule = async () => {
         // setLoading2(true)
         try {
             const { data } = await get(`/BehaviourSupports/get_all?clientId=${clientProfile.profileId}`, { cacheTimeout: 300000 });
            //  console.log(data);
             //  setStaffAvail(data)
             // setLoading2(false);
         } catch (error) {
             // console.log(error);
             toast.error(error.response.data.message)
             toast.error(error.response.data.title)
         }
         // finally {
         //   setLoading2(false)
         // }
 
 
     };
     useEffect(() => {
         FetchSchedule()
     }, []);
 
 
     const columns = [
 
         {
             name: 'FullName',
             selector: row => row.fullName,
             sortable: true,
             expandable: true,
         },
         {
             name: 'Position',
             selector: row => row.personel,
             sortable: true,
         },
         {
             name: 'Home Phone',
             selector: row => row.phone,
             sortable: true
         },
         {
             name: 'Email',
             selector: row => row.email,
             sortable: true
         },
         {
             name: 'Date Created',
             selector: row => dayjs(row.dateCreated).format('DD/MM/YYYY HH:mm:ss'),
             sortable: true
         }
 
 
     ];
 
     const handleExcelDownload = () => {
         const workbook = new ExcelJS.Workbook();
         const sheet = workbook.addWorksheet('Sheet1');
 
         // Add headers
         const headers = columns.map((column) => column.name);
         sheet.addRow(headers);
 
         // Add data
         staffAvail.forEach((dataRow) => {
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
         const dataValues = staffAvail.map((dataRow) =>
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
 
     const handleDelete = async (e) => {
         Swal.fire({
             html: `<h3>Are you sure? you want to delete this</h3>`,
             icon: 'question',
             showCancelButton: true,
             confirmButtonColor: '#405189',
             cancelButtonColor: '#C8102E',
             confirmButtonText: 'Confirm Delete',
             showLoaderOnConfirm: true,
         }).then(async (result) => {
             if (result.isConfirmed) {
                 try {
                     const { data } = await post(`/Assistances/delete/${e}`)
                     // console.log(data);
                     if (data.status === 'Success') {
                         toast.success(data.message);
                         FetchSchedule()
                     } else {
                         toast.error(data.message);
                     }
 
 
                 } catch (error) {
                     // console.log(error);
                     toast.error(error.response.data.message)
                     toast.error(error.response.data.title)
 
 
                 }
 
 
             }
         })
 
 
     }
 
     const [editAvail, setEditAvail] = useState({});
     const [idSave, setIdSave] = useState('')
     const [selectedActivities, setSelectedActivities] = useState([]);
     const selectedValue = selectedActivities.map(option => option.label).join(', ');
     const handleEdit = async (e) => {
         setShowModal(true);
         setIdSave(e)
         // setLoading2(true)
         try {
 
             const { data } = await get(`/Assistances/${e}`, { cacheTimeout: 300000 });
             //  console.log(data);
             //  setSelectedActivities(data.activities.split(',').map((activity) => ({ label: activity, value: activity })));
             console.log();
             setEditAvail(data);
         } catch (error) {
             // console.log(error);
             toast.error(error.response.data.message)
             toast.error(error.response.data.title)
         }
     };
 
     function handleInputChange(event) {
         const target = event.target;
         const name = target.name;
         const value = target.value;
         const newValue = value === "" ? "" : value;
         setEditAvail({
             ...editAvail,
             [name]: newValue
         });
     }
 
     const handleActivityChange = (selected) => {
         setSelectedActivities(selected);
     };
 
     const EditAvail = async (e) => {
 
         e.preventDefault()
         setLoading2(true)
         const info = {
             assistanceId: idSave,
             profileId: clientProfile.profileId,
             personel: editAvail.personel,
             fullName: editAvail.fullName,
             phone: editAvail.phone,
             email: editAvail.email,
         
         }
         try {
 
             const { data } = await post(`/Assistances/edit/${idSave}`, info);
             //  console.log(data);
             if (data.status === 'Success') {
                 toast.success(data.message)
             }
             setLoading2(false)
             setShowModal(false)
             FetchSchedule()
         } catch (error) {
             // console.log(error);
             toast.error(error.response.data.message)
             toast.error(error.response.data.title)
         }
         finally {
             setLoading2(false)
         }
     }
 
     const ButtonRow = ({ data }) => {
         return (
             <div className="p-2 d-flex gap-1 flex-column " style={{ fontSize: "12px" }}>
                 <div><span className='fw-bold'>Email: </span> {data.email}</div>
                 <div ><span className='fw-bold'>Date Created: </span> {moment(data.dateCreated).format('lll')}</div>
                 <div>
                     <button className="btn text-info fw-bold" style={{ fontSize: "12px" }} onClick={() => handleEdit(data.assistanceId)}>
                         Edit
                     </button> |
                     <button onClick={() => handleDelete(data.assistanceId)} className="btn text-danger fw-bold" style={{ fontSize: "12px" }}>
                         Delete
                     </button>
                 </div>
 
             </div>
         );
 
     };
 
     const [searchText, setSearchText] = useState("");
 
     const handleSearch = (event) => {
         setSearchText(event.target.value);
     };
 
     const filteredData = staffAvail.filter((item) =>
         item.fullName.toLowerCase().includes(searchText.toLowerCase())
     );
     return (
         <div className="page-wrapper">
             <Helmet>
                 <title> Privacy Statement</title>
                 <meta name="description" content="Privacy Statement" />
             </Helmet>
             <div className="content container-fluid">
                 {/* Page Header */}
                 <div className="page-header">
                     <div className="row">
                         <div className="col">
                             <ul className="breadcrumb">
                                 <li className="breadcrumb-item"><Link to="/client/app/dashboard">Dashboard</Link></li>
                                 <li className="breadcrumb-item active">Privacy Statement</li>
                             </ul>
                         </div>
                     </div>
                 </div>
                 {/* /Page Header */}
                 <div className="row">
                     <div className="col-md-12">
                         <div className="card">
                             <div className="card-header">
                                 <h4 style={{ fontSize: "15px" }} className="card-title mb-0"></h4>
                             </div>
                             <div className="card-body">
                                <div>
                                    <p>Your personal information is protected by law (including the Privacy Act 1988) and is collected by [Business Name] in order to assess and administer its disability support services. Your information may be used by [Business Name] or given to other parties where you have agreed to that, or where it is required or authorised by law.
                                     More information about how we manage your privacy is contained in our Privacy Statement, which can be provided by a [Business Name] staff member.</p>

                                     <p>I have been informed and consent to the use of my information in the assessment and administration of my services. I understand that this information may be provided to external agencies where I 
                                        have consented to this, or where it is required by law.</p>
                                </div>

                                <div>
                                    <input type="checkbox" name="" id="" /> <b> I declare that all of the information I have provided in this form is, to my knowledge, true and correct.</b>
                                </div> <br />

                                <form className="row">
                                    <div className='col-md-4'>
                                        <div className="form-group">
                                            <label>Name of Client</label>
                                            <input className="form-control" value={id.fullName} type="text" readOnly /> <br />

                                            <label>Upload your signature</label>
                                            <input type="file"  />
                                        </div>
                                    </div>

                                    <div className="text-start">
                                        <button type="submit" className="btn btn-primary px-2" disabled={loading1 ? true : false}>
                                            {loading1 ? <div className="spinner-grow text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div> : "Save"}</button>
                                    </div>
                                </form>
                                
                             </div>
                         </div>
                     </div>
                 </div>
 
            
                 <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                     <Modal.Header closeButton>
                         <Modal.Title>Edit Schedule</Modal.Title>
                     </Modal.Header>
                     <Modal.Body>
                         <div className="card-body">
                             <form className="row">
                                 <div className='col-md-6'>
                                     <div className="form-group">
                                         <label>FullName</label>
                                         <input className="form-control" type="text" name="fullName" value={editAvail.fullName || ''} onChange={handleInputChange} />
                                     </div>
                                 </div>
 
                                 <div className="col-md-6">
                                     <div className="form-group">
                                         <label>Relationship</label>
                                         <input className="form-control" type="text" />
                                     </div>
                                 </div>
 
                                 <div className='col-md-6'>
                                     <div className="form-group">
                                         <label>Mobile Phone</label>
                                         <input className="form-control" type="number" name="phone" value={editAvail.phone || ''} onChange={handleInputChange} />
                                     </div>
                                 </div>
 
                                 <div className='col-md-6'>
                                     <div className="form-group">
                                         <label>Position</label>
                                         <input className="form-control" type="text" name="personel" value={editAvail.personel || ''} onChange={handleInputChange} />
                                     </div>
                                 </div>
 
                                 <div className='col-md-6'>
                                     <div className="form-group">
                                         <label>Organization</label>
                                         <input className="form-control" type="text" />
                                     </div>
                                 </div>
 
                                 <div className='col-md-6'>
                                     <div className="form-group">
                                         <label>Address</label>
                                         <textarea className="form-control" rows="2" cols="20" />
                                     </div>
                                 </div>
 
                                 <div className='col-md-12'>
                                     <div className="form-group">
                                         <label>Email</label>
                                         <input className="form-control" type="email" name="email" value={editAvail.email || ''} onChange={handleInputChange} />
                                     </div>
                                 </div>
 
 
                             </form>
                         </div>
                     </Modal.Body>
                     <Modal.Footer>
                         <button
                             type="submit"
                             className="btn btn-primary add-btn px-2"
                             disabled={loading2 ? true : false}
                             onClick={EditAvail}
                         >
                             {loading2 ? (
                                 <div className="spinner-grow text-light" role="status">
                                     <span className="sr-only">Loading...</span>
                                 </div>
                             ) : (
                                 "Add"
                             )}
                         </button>
                     </Modal.Footer>
                 </Modal>
 
 
             </div>
 
         </div>
     );
 }
 export default PrivacyStatement;