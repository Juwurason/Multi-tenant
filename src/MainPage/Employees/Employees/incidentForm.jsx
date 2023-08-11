/**
 * Form Elemets
 */
 import React, { useEffect, useState } from 'react';
 import { Helmet } from "react-helmet";
 import { Link } from 'react-router-dom';
 import DataTable from "react-data-table-component";
 import { CSVLink } from "react-csv";
 import { CopyToClipboard } from "react-copy-to-clipboard";
 import jsPDF from "jspdf";
 import "jspdf-autotable";
 import { FaCopy, FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaTrash } from "react-icons/fa";
 import { toast } from 'react-toastify';
 import { GoSearch, GoTrashcan } from 'react-icons/go';
 import dayjs from 'dayjs';
 import moment from 'moment';
 import Swal from 'sweetalert2';
 import { Modal } from 'react-bootstrap';
import useHttp from '../../../hooks/useHttp';
import { useCompanyContext } from '../../../context';
 
 
 const IncidentForm = () => {
     useEffect(() => {
         if ($('.select').length > 0) {
             $('.select').select2({
                 minimumResultsForSearch: -1,
                 width: '100%'
             });
         }
     });

     const [staffAvail, setStaffAvail] = useState([]);
     const { loading, setLoading } = useCompanyContext();
     const [loading2, setLoading2] = useState(false);
     const { get, post } = useHttp();
     const id = JSON.parse(localStorage.getItem('user'))
     const [showModal, setShowModal] = useState(false);
     const user = JSON.parse(localStorage.getItem('user'))
 

 
     const FetchSchedule = async () => {
         // setLoading2(true)
         try {
             const { data } = await get(`/Templates/get_incident_forms?companyId=${user.companyId}`, { cacheTimeout: 300000 });
            //   console.log(data.incidentforms);
             setStaffAvail(data.incidentforms)
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
             name: 'User',
             selector: row => row.applicationUser.fullName,
             sortable: true,
             expandable: true,
         },
         {
             name: 'Role',
             selector: row => row.applicationUser.role,
             sortable: true,
         },
         {
             name: 'Form Name',
             selector: row => row.phone || "Incident Forms",
             sortable: true
         },
         {
             name: 'User Created',
             selector: row => row.userCreated,
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
 
 
     const EditAvail = async (e) => {
 
         e.preventDefault()
         setLoading2(true)
         const info = {
             assistanceId: idSave,
            //  profileId: clientProfile.profileId,
             personel: editAvail.personel,
             fullName: editAvail.fullName,
             phone: editAvail.phone,
             email: editAvail.email,
             //  companyID: id.companyId
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
                 <div><span className='fw-bold'>User: </span> {data.applicationUser.fullName}</div>
                 <div ><span className='fw-bold'>User Created: </span> {data.userCreated}</div>
                 {/* <div>
                     <button className="btn text-info fw-bold" style={{ fontSize: "12px" }} 
                    //  onClick={() => handleEdit(data.assistanceId)}
                     >
                         Edit
                     </button> |
                     <button 
                    //  onClick={() => handleDelete(data.assistanceId)} 
                     className="btn text-danger fw-bold" style={{ fontSize: "12px" }}>
                         Delete
                     </button>
                 </div> */}
 
             </div>
         );
 
     };
 
     const [searchText, setSearchText] = useState("");
 
     const handleSearch = (event) => {
         setSearchText(event.target.value);
     };
 
     const filteredData = staffAvail.filter((item) =>
         item.applicationUser.fullName.toLowerCase().includes(searchText.toLowerCase())
     );
     return (
         <div className="page-wrapper">
             <Helmet>
                 <title> Incident Forms</title>
                 <meta name="description" content="Incident Forms" />
             </Helmet>
             <div className="content container-fluid">
                 {/* Page Header */}
                 <div className="page-header">
                     <div className="row">
                         <div className="col">
                             <ul className="breadcrumb">
                                 <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                 <li className="breadcrumb-item active">Incident Forms</li>
                             </ul>
                         </div>
                     </div>
                 </div>
                 {/* /Page Header */}
                
 
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
                                 data={staffAvail}
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
                             <CopyToClipboard text={JSON.stringify(staffAvail)}>
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
 export default IncidentForm;
 