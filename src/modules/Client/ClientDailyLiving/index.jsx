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
 import { FaCopy, FaEdit, FaFileCsv, FaFileExcel, FaFilePdf } from "react-icons/fa";
 import { toast } from 'react-toastify';
 import { GoSearch, GoTrashcan } from 'react-icons/go';
 import dayjs from 'dayjs';
 import moment from 'moment';
 import Swal from 'sweetalert2';
 import { Modal } from 'react-bootstrap';

 const ClientDailyLiving = () => {
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
     const [selectedDetails, setSelectedDetails] = useState("");
     const [selectedForm, setSelectedForm] = useState("");
     const [selectedSupport, setSelectedSupport] = useState("");
     const { get, post } = useHttp();
     const [showModal, setShowModal] = useState(false);
     const clientProfile = JSON.parse(localStorage.getItem('clientProfile'))
 
 
     const PostAvail = async (e) => {
         if (selectedDay === "" || selectedForm === "") {
             return toast.error("Input Fields cannot be empty")
         }
         e.preventDefault()
         setLoading1(true)
         const info = {
             profileId: clientProfile.profileId,
             activities: selectedDay,
             support: selectedSupport,
             supportLevel: selectedDetails,
             details: selectedForm,
            //  companyID: id.companyId
         }
         try {
 
             const { data } = await post(`/DailyLivings`, info);
            //  console.log(data)
             if (data.status === 'Success') {
                 toast.success(data.message) 
             }
             setLoading1(false)
             FetchSchedule()
         } catch (error) {
             // console.log(error);
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
             const { data } = await get(`/DailyLivings/get_all?clientId=${clientProfile.profileId}`, { cacheTimeout: 300000 });
            //  console.log(data);
             setStaffAvail(data)
             // setLoading2(false);
         } catch (error) {
             // console.log(error);
             toast.error(error.response.data.message)
             toast.error(error.response.data.title)
         }
 
     };
     useEffect(() => {
         FetchSchedule()
     }, []);
 
 
     const columns = [
         {
             name: 'Activities',
             selector: row => row.activities,
             sortable: true,
             expandable: true,
         },
         {
             name: 'Support',
             selector: row => row.support,
             sortable: true,
         },
         {
             name: 'Level of Support',
             selector: row => row.supportLevel,
             sortable: true
         },
         {
             name: 'Details',
             selector: row => row.details,
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
             confirmButtonColor: '#1C75BC',
             cancelButtonColor: '#C8102E',
             confirmButtonText: 'Confirm Delete',
             showLoaderOnConfirm: true,
         }).then(async (result) => {
             if (result.isConfirmed) {
                 try {
                     const { data } = await post(`/DailyLivings/delete/${e}`)
                     // console.log(data);
                     if (data.status === 'Success') {
                         toast.success(data.message);
                         FetchSchedule()
                     } else {
                         toast.error(data.message);
                     }
 
 
                 } catch (error) {
                     console.log(error);
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
 
             const { data } = await get(`/DailyLivings/${e}`, { cacheTimeout: 300000 });
            //  console.log(data);
            //  setSelectedActivities(data.activities.split(',').map((activity) => ({ label: activity, value: activity })));
            //  console.log();
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
             dailyLivingId: idSave,
             profileId: clientProfile.profileId,
             activities: editAvail.activities,
             support: editAvail.support,
             supportLevel: editAvail.supportLevel,
             details: editAvail.details,
            //  companyID: id.companyId
         }
         try {
 
             const { data } = await post(`/DailyLivings/edit/${idSave}`, info);
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
                 <div><span className='fw-bold'>Activities: </span> {data.activities}</div>
                 <div><span className='fw-bold'>Support: </span> {data.support}</div>
                 <div><span className='fw-bold'>Level of Support: </span> {data.supportLevel}</div>
                 <div ><span className='fw-bold'>Date Created: </span> {moment(data.dateCreated).format('lll')}</div>
                 <div>
                     <button className="btn text-info fw-bold" style={{ fontSize: "12px" }} onClick={() => handleEdit(data.dailyLivingId)}>
                         Edit
                     </button> |
                     <button onClick={() => handleDelete(data.dailyLivingId)} className="btn text-danger fw-bold" style={{ fontSize: "12px" }}>
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
         item.activities.toLowerCase().includes(searchText.toLowerCase())
     );
     return (
         <div className="page-wrapper">
             <Helmet>
                 <title> Daily Living & Night Support</title>
                 <meta name="description" content="Daily Living & Night Support" />
             </Helmet>
             <div className="content container-fluid">
                 {/* Page Header */}
                 <div className="page-header">
                     <div className="row">
                         <div className="col">
                             <ul className="breadcrumb">
                                 <li className="breadcrumb-item"><Link to="/client/client">Dashboard</Link></li>
                                 <li className="breadcrumb-item active">Daily Living & Night Support</li>
                             </ul>
                         </div>
                     </div>
                 </div>
                 {/* /Page Header */}
                 <div className="row">
                     <div className="col-md-12">
                         <div className="card">
                             <div className="card-header">
                                 <h4 style={{fontSize: "15px"}} className="card-title mb-0"> Add one or more Daily Activities</h4>
                             </div>
                             <div className="card-body">
                                 <form className="row">
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Activities</label>
                                             <input className="form-control" type="text" onChange={(e) => setSelectedDay(e.target.value)} required />
                                         </div>
                                     </div>
 
                                     <div className="col-md-6">
                                         <div className="form-group">
                                             <label>Support</label>
                                             <select className='form-select' onChange={(e) => setSelectedSupport(e.target.value)}>
                                                <option defaultValue hidden >Select Issues</option>
                                                <option value={"No help required"}>No help required</option>
                                                <option value={"Aids used"}>Aids used</option>
                                                <option value={"Prompting required"}>Prompting required</option>
                                                <option value={"Some support required"}>Some support required</option>
                                                <option value={"Full physical support required"}>Full physical support required</option>

                                            </select>
                                         </div>
                                     </div>
 
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>How often do you require supervision or support throughout the day?</label>
                                             <select className='form-select' onChange={(e) => setSelectedDetails(e.target.value)}>
                                                <option defaultValue hidden >Select Issues</option>
                                                <option value={"None of the time"}>None of the time</option>
                                                <option value={"All the time"}>All the time</option>
                                                <option value={"Prompting required"}>Prompting required</option>
                                                <option value={"During active times"}>During active times</option>
                                            </select>
                                        </div>
                                    </div>

                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Details</label>
                                             <textarea className="form-control" onChange={(e) => setSelectedForm(e.target.value)} rows="2" cols="20" />
                                         </div>
                                     </div>
 
                                     <div className="text-start">
                                         <button type="submit" className="btn btn-primary px-2" disabled={loading1 ? true : false} onClick={PostAvail}>
                                             {loading1 ? <div className="spinner-grow text-light" role="status">
                                                 <span className="sr-only">Loading...</span>
                                             </div> : "Submit"}</button>
                                     </div>
                                 </form>
                             </div>
                         </div>
                     </div>
                 </div>
 
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
                         <Modal.Title>Edit Daily Living & Night Support</Modal.Title>
                     </Modal.Header>
                     <Modal.Body>
                         <div className="card-body">
                                 <form className="row">
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Activities</label>
                                             <input className="form-control" type="text" name="activities" value={editAvail.activities || ''} onChange={handleInputChange} />
                                         </div>
                                     </div>
 
                                     <div className="col-md-6">
                                         <div className="form-group">
                                             <label>Support</label>
                                             <select className='form-select' name="support" value={editAvail.support || ''} onChange={handleInputChange}>
                                                <option defaultValue hidden >Select Issues</option>
                                                <option value={"No help required"}>No help required</option>
                                                <option value={"Aids used"}>Aids used</option>
                                                <option value={"Prompting required"}>Prompting required</option>
                                                <option value={"Some support required"}>Some support required</option>
                                                <option value={"Full physical support required"}>Full physical support required</option>
                                                
                                            </select>
                                         </div>
                                     </div>
 
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>How often do you require supervision or support throughout the day?</label>
                                             <select className='form-select' name="supportLevel" value={editAvail.supportLevel || ''} onChange={handleInputChange}>
                                                <option defaultValue hidden >Select Issues</option>
                                                <option value={"None of the time"}>None of the time</option>
                                                <option value={"All the time"}>All the time</option>
                                                <option value={"Prompting required"}>Prompting required</option>
                                                <option value={"During active times"}>During active times</option>                                                
                                            </select>
                                         </div>
                                     </div>

                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Details</label>
                                             <textarea className="form-control" name="details" value={editAvail.details || ''} onChange={handleInputChange} rows="2" cols="20" />
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
                                 "Submit"
                             )}
                         </button>
                     </Modal.Footer>
                 </Modal>
 
 
             </div>
 
         </div>
     );
 }
 export default ClientDailyLiving;
