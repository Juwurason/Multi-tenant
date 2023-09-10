/**
 * Form Elemets
 */
 import React, { useEffect, useRef, useState } from 'react';
 import { Helmet } from "react-helmet";
 import { Link, useHistory } from 'react-router-dom';
 import useHttp from '../../../hooks/useHttp';
 import { useCompanyContext } from '../../../context';
 import DataTable from "react-data-table-component";
 import { CSVLink } from "react-csv";
 import { CopyToClipboard } from "react-copy-to-clipboard";
 import jsPDF from "jspdf";
 import "jspdf-autotable";
 import { FaCopy, FaEdit, FaFileCsv, FaLongArrowAltLeft, FaLongArrowAltRight, FaFileExcel, FaFilePdf } from "react-icons/fa";
 import { toast } from 'react-toastify';
 import { GoSearch, GoTrashcan } from 'react-icons/go';
 import dayjs from 'dayjs';
 import moment from 'moment';
 import Swal from 'sweetalert2';
 import { Modal } from 'react-bootstrap';
 
 const TimePeriod = () => {
     useEffect(() => {
         if ($('.select').length > 0) {
             $('.select').select2({
                 minimumResultsForSearch: -1,
                 width: '100%'
             });
         }
     });
 
     const [selected, setSelected] = useState([]);
     const [timePeriod, setTimePeriod] = useState([]);
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
     const user = JSON.parse(localStorage.getItem('user'))
     const startTime = useRef(null);
     const endTime = useRef(null);
     const eveningStart = useRef(null);
     const eveningEnd = useRef(null);
     const sleepOverStart = useRef(null);
     const sleepOverEnd = useRef(null);
 
 
     const PostAvail = async (e) => {
         e.preventDefault()
         if (startTime.current.value === "" || endTime.current.value === "" || 
         eveningStart.current.value === "" || eveningEnd.current.value === "" ||
          sleepOverStart.current.value === "" || sleepOverEnd.current.value ==="") {
             return toast.error("Input Fields cannot be empty")
         }
         
         setLoading1(true)
         const info = {
 
            normalStartTimePeriod: startTime.current.value,
            normalEndTimePeriod: endTime.current.value,
            eveningStartTimePeriod: eveningStart.current.value,
            eveningEndTimePeriod: eveningEnd.current.value,
            sleepoverStartTimePeriod: sleepOverStart.current.value,
            sleepoverEndTimePeriod: sleepOverEnd.current.value,
            companyId: user.companyId
          }
          
         try {
 
             const { data } = await post(`/TimePeriods/add_timeperiod?userId=${user.userId}`, info);
            //   console.log(data)
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
             const { data } = await get(`/TimePeriods/get_timeperiod?companyId=${user.companyId}`, { cacheTimeout: 300000 });
            //   console.log(data);
             setTimePeriod(data)
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
     
     const history = useHistory();
    const goBack = () => {
        history.goBack(); // Go back in history
    };

    const goForward = () => {
        history.goForward(); // Go forward in history
    };
 
     const columns = [
        {
          name: 'Normal StartTime',
          selector: row => dayjs(row.normalStartTimePeriod).format('h:mm:ss A'),
          sortable: true,
          expandable: true,
        },
        {
          name: 'Normal EndTime',
          selector: row => dayjs(row.normalEndTimePeriod).format('h:mm:ss A'),
          sortable: true,
        },
        {
          name: 'Evening StartTime',
          selector: row => dayjs(row.eveningStartTimePeriod).format('h:mm:ss A'),
          sortable: true,
        },
        {
          name: 'Evening EndTime',
          selector: row => dayjs(row.eveningEndTimePeriod).format('h:mm:ss A'),
          sortable: true,
        },
        {
          name: 'Sleepover StartTime',
          selector: row => dayjs(row.sleepoverStartTimePeriod).format('h:mm:ss A'),
          sortable: true,
        },
        {
          name: 'Sleepover StartEnd',
          selector: row => dayjs(row.sleepoverEndTimePeriod).format('h:mm:ss A'),
          sortable: true,
        },
      ];
      
 
     const handleExcelDownload = () => {
         const workbook = new ExcelJS.Workbook();
         const sheet = workbook.addWorksheet('Sheet1');
 
         // Add headers
         const headers = columns.map((column) => column.name);
         sheet.addRow(headers);
 
         // Add data
         timePeriod.forEach((dataRow) => {
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
         const dataValues = timePeriod.map((dataRow) =>
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
                     const { data } = await post(`/TimePeriods/delete/${e}?userId=${user.userId}`)
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
 
             const { data } = await get(`/TimePeriods/get_timeperiod_details/${e}`, { cacheTimeout: 300000 });
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
             timePeriodsId: idSave,
             normalStartTimePeriod: editAvail.normalStartTimePeriod,
             normalEndTimePeriod: editAvail.normalEndTimePeriod,
             eveningStartTimePeriod: editAvail.eveningStartTimePeriod,
             eveningEndTimePeriod: editAvail.eveningEndTimePeriod,
             sleepoverStartTimePeriod: editAvail.sleepoverStartTimePeriod,
             sleepoverEndTimePeriod: editAvail.sleepoverEndTimePeriod,
             companyId: user.companyId
           }
         try {
             const { data } = await post(`/TimePeriods/edit/${idSave}?userId=${user.userId}`, info);
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
                 <div><span className='fw-bold'>Normal Start Time Period: </span> {dayjs(data.normalStartTimePeriod).format('h:mm:ss A')}</div>
                 <div><span className='fw-bold'>Normal End Time Period: </span> {dayjs(data.normalEndTimePeriod).format('h:mm:ss A')}</div>
                 <div><span className='fw-bold'>Evening Start Time Period: </span> {dayjs(data.eveningStartTimePeriod).format('h:mm:ss A')}</div>
                 <div><span className='fw-bold'>Evening EndTime Period: </span> {dayjs(data.eveningEndTimePeriod).format('h:mm:ss A')}</div>
                 <div><span className='fw-bold'>Sleepover StartTime Period: </span> {dayjs(data.sleepoverStartTimePeriod).format('h:mm:ss A')}</div>
                 <div><span className='fw-bold'>Sleepover End Time Period: </span> {dayjs(data.sleepoverEndTimePeriod).format('h:mm:ss A')}</div>
                 {/* <div ><span className='fw-bold'>Date Created: </span> {moment(data.dateCreated).format('lll')}</div> */}
                 <div>
                     <button className="btn text-info fw-bold" style={{ fontSize: "12px" }} onClick={() => handleEdit(data.timePeriodsId)}>
                         Edit
                     </button> |
                     <button onClick={() => handleDelete(data.timePeriodsId)} className="btn text-danger fw-bold" style={{ fontSize: "12px" }}>
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
 
     const filteredData = timePeriod.filter((item) =>
         item.normalStartTimePeriod.toLowerCase().includes(searchText.toLowerCase()) ||
         item.normalEndTimePeriod.toLowerCase().includes(searchText.toLowerCase())
     );

     return (
         <div className="page-wrapper">
             <Helmet>
                 <title> Time Period</title>
                 <meta name="description" content="Time Period" />
             </Helmet>
             <div className="content container-fluid">
                 {/* Page Header */}
                 <div className="page-header">
                     <div className="row">
                         <div className="col">
                             <ul className="breadcrumb">
                                 <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                 <li className="breadcrumb-item active">Time Period</li>
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
                 {timePeriod.length === 0 && <div className="row">
                     <div className="col-md-12">
                         <div className="card">
                             <div className="card-header">
                                 <h4 style={{ fontSize: "15px" }} className="card-title mb-0"> Add Time Period </h4>
                                 <h6>Kindly take note that you need not worry about the date, only the scheduled time is of significance</h6>
                             </div>
                             <div className="card-body">
                                 <form className="row">
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Normal Start Time Period</label>
                                             <input className="form-control" type="datetime-local" ref={startTime} />
                                         </div>
                                     </div>
 
                                     <div className="col-md-6">
                                         <div className="form-group">
                                             <label>Normal End Time Period</label>
                                             
                                             <input className="form-control" type="datetime-local" ref={endTime} />
                                         </div>
                                     </div>
 
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Evening Start Time Period</label>
                                             <input className="form-control" type="datetime-local" ref={eveningStart} />
                                         </div>
                                     </div>
 
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Evening EndTime Period</label>
                                             <input className="form-control" type="datetime-local" ref={eveningEnd} />
                                         </div>
                                     </div>

                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Sleepover StartTime Period</label>
                                             <input className="form-control" type="datetime-local" ref={sleepOverStart} />
                                         </div>
                                     </div>
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Sleepover End Time Period</label>
                                             <input className="form-control" type="datetime-local" ref={sleepOverEnd} />
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
                 </div>}
 
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
                                 data={timePeriod}
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
                             <CopyToClipboard text={JSON.stringify(timePeriod)}>
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
 
                 <Modal show={showModal} onHide={() => setShowModal(false)} centered size='lg'>
                     <Modal.Header closeButton>
                         <Modal.Title>Edit Time Period</Modal.Title>
                     </Modal.Header>
                     <Modal.Body>
                     <div className="card-body">
                                 <form className="row">
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Normal Start Time Period</label>
                                             <input className="form-control" type="datetime-local" name='normalStartTimePeriod' value={editAvail.normalStartTimePeriod || ''} onChange={handleInputChange} />
                                         </div>
                                     </div>
 
                                     <div className="col-md-6">
                                         <div className="form-group">
                                             <label>Normal End Time Period</label>
                                             
                                             <input className="form-control" type="datetime-local" name='normalEndTimePeriod' value={editAvail.normalEndTimePeriod || ''} onChange={handleInputChange} />
                                         </div>
                                     </div>
 
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Evening Start Time Period</label>
                                             <input className="form-control" type="datetime-local" name='eveningStartTimePeriod' value={editAvail.eveningStartTimePeriod || ''} onChange={handleInputChange} />
                                         </div>
                                     </div>
 
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Evening EndTime Period</label>
                                             <input className="form-control" type="datetime-local" name='eveningEndTimePeriod' value={editAvail.eveningEndTimePeriod || ''} onChange={handleInputChange} />
                                         </div>
                                     </div>

                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Sleepover StartTime Period</label>
                                             <input className="form-control" type="datetime-local" name='sleepoverStartTimePeriod' value={editAvail.sleepoverStartTimePeriod || ''} onChange={handleInputChange} />
                                         </div>
                                     </div>
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Sleepover End Time Period</label>
                                             <input className="form-control" type="datetime-local" name='sleepoverEndTimePeriod' value={editAvail.sleepoverEndTimePeriod || ''} onChange={handleInputChange} />
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
 export default TimePeriod;
 