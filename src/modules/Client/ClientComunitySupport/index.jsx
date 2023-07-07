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
 
 
 const ClientComunitySupport = () => {
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
             communityAssistance: selectedDay,
             transportType: selectedTimeFrom,
             transportAssistance: selectedTimeTo,
             activitiesParticipation: selectedPhone,
             activitiesAssistance: selectedPosition,
         }
         try {
 
             const { data } = await post(`/CommunitySupports`, info);
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
             const { data } = await get(`/CommunitySupports/get_all?clientId=${clientProfile.profileId}`, { cacheTimeout: 300000 });
        
              setStaffAvail(data)
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
             name: 'Community Assistance',
             selector: row => row.communityAssistance,
             sortable: true,
             expandable: true,
         },
         {
             name: 'Transport Type',
             selector: row => row.transportType,
             sortable: true,
         },
         {
             name: 'Transport Assistance',
             selector: row => row.transportAssistance,
             sortable: true
         },
         {
             name: 'Activities Participation',
             selector: row => row.activitiesParticipation,
             sortable: true
         },
         {
             name: 'Activities Assistance',
             selector: row => row.activitiesAssistance,
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
                     const { data } = await post(`/CommunitySupports/delete/${e}`)
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
 
             const { data } = await get(`/CommunitySupports/${e}`, { cacheTimeout: 300000 });
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
            communitySupportId: idSave,
             profileId: clientProfile.profileId,
             communityAssistance: editAvail.communityAssistance,
             transportType: editAvail.transportType,
             transportAssistance: editAvail.transportAssistance,
             activitiesParticipation: editAvail.activitiesParticipation,
             activitiesAssistance: editAvail.activitiesAssistance,
         }
         try {
 
             const { data } = await post(`/CommunitySupports/edit/${idSave}`, info);
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
                 <div ><span className='fw-bold'>Date Created: </span> {moment(data.dateCreated).format('lll')}</div>
                 <div>
                     <button className="btn text-info fw-bold" style={{ fontSize: "12px" }} onClick={() => handleEdit(data.communitySupportId)}>
                         Edit
                     </button> |
                     <button onClick={() => handleDelete(data.communitySupportId)} className="btn text-danger fw-bold" style={{ fontSize: "12px" }}>
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
     
    
    const filteredData = staffAvail.filter((item) => {
        if (item.communityAssistance && typeof item.communityAssistance === "string") {
          return item.communityAssistance.toLowerCase().includes(searchText.toLowerCase());
        }
        return false;
      });
      

     return (
         <div className="page-wrapper">
             <Helmet>
                 <title> Community Support Needs</title>
                 <meta name="description" content="Community Support Needs" />
             </Helmet>
             <div className="content container-fluid">
                 {/* Page Header */}
                 <div className="page-header">
                     <div className="row">
                         <div className="col">
                             <ul className="breadcrumb">
                                 <li className="breadcrumb-item"><Link to="/client/app/dashboard">Dashboard</Link></li>
                                 <li className="breadcrumb-item active">Community Support Needs</li>
                             </ul>
                         </div>
                     </div>
                 </div>
                 {/* /Page Header */}
                 <div className="row">
                     <div className="col-md-12">
                         <div className="card">
                             <div className="card-header">
                                 <h4 style={{ fontSize: "15px" }} className="card-title mb-0">Community Support Needs</h4>
                             </div>
                             <div className="card-body">
                                 <form className="row">
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Do you need assistance getting around the community? If so, please provide detail</label>
                                             <textarea className="form-control" rows="2" onChange={(e) => setSelectedDay(e.target.value)} cols="20" />
                                         </div>
                                     </div>
 
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Do you need assistance to use transport? If so, please provide detail.</label>
                                             <textarea className="form-control" rows="2" onChange={(e) => setSelectedTimeFrom(e.target.value)} cols="20" />
                                         </div>
                                     </div>
 
                                     <div className="col-md-6">
                                         <div className="form-group">
                                             <label>What type of transport do you mainly use?</label>
                                             <textarea className="form-control" rows="2" onChange={(e) => setSelectedTimeTo(e.target.value)} cols="20" />
                                         </div>
                                     </div>
 
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Do you participate in any activities (such as employment, training or community activities)? If yes, please provide detail.</label>
                                             <textarea className="form-control" rows="2" onChange={(e) => setSelectedPhone(e.target.value)} cols="20" />
                                         </div>
                                     </div>
 
                                    
 
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Do you need assistance to access these activities? If yes, please provide detail.</label>
                                             <textarea className="form-control" onChange={(e) => setSelectedPosition(e.target.value)} rows="2" cols="20" />
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
                     <DataTable 
                     data={filteredData} 
                     columns={columns}
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
                         <Modal.Title>Edit Community Support Needs</Modal.Title>
                     </Modal.Header>
                     <Modal.Body>
                         {/* <div className="card-body">
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
                         </div> */}
                         <div className="card-body">
                                 <form className="row">
                                     <div className='col-md-12'>
                                         <div className="form-group">
                                             <label>Do you need assistance getting around the community? If so, please provide detail</label>
                                             <textarea className="form-control" rows="2" cols="20" name="communityAssistance" value={editAvail.communityAssistance || ''} onChange={handleInputChange} />
                                         </div>
                                     </div>
 
                                     <div className='col-md-12'>
                                         <div className="form-group">
                                             <label>Do you need assistance to use transport? If so, please provide detail.</label>
                                             <textarea className="form-control" rows="2"  cols="20" name="transportType" value={editAvail.transportType || ''} onChange={handleInputChange} />
                                         </div>
                                     </div>
 
                                     <div className="col-md-12">
                                         <div className="form-group">
                                             <label>What type of transport do you mainly use?</label>
                                             <textarea className="form-control" rows="2"  cols="20" name="transportAssistance" value={editAvail.transportAssistance || ''} onChange={handleInputChange} />
                                         </div>
                                     </div>
 
                                     <div className='col-md-12'>
                                         <div className="form-group">
                                             <label>Do you participate in any activities (such as employment, training or community activities)? If yes, please provide detail.</label>
                                             <textarea className="form-control" rows="2"  cols="20" name="activitiesParticipation" value={editAvail.activitiesParticipation || ''} onChange={handleInputChange} />
                                         </div>
                                     </div>
 
                                    
 
                                     <div className='col-md-12'>
                                         <div className="form-group">
                                             <label>Do you need assistance to access these activities? If yes, please provide detail.</label>
                                             <textarea className="form-control"  rows="2" cols="20" name="activitiesAssistance" value={editAvail.activitiesAssistance || ''} onChange={handleInputChange} />
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
 export default ClientComunitySupport;