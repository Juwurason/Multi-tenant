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
 import { async } from '@babel/runtime/helpers/regeneratorRuntime';
 import { MultiSelect } from 'react-multi-select-component';
 const options = [
     { label: "Need Mobility Assistance?", value: "Need Mobility Assistance?" },
     { label: "Mobility Independency", value: "Mobility Independency" },
 
 ];
 const optionsOther = [
     { label: "Need Communication Assistance?", value: "Need Communication Assistance?" },
 
 ];
 
 
 const ClientDisability = () => {
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
     const { get, post } = useHttp();
     const [selectedTimeFrom, setSelectedTimeFrom] = useState("");
     const [selectedTimeTo, setSelectedTimeTo] = useState("");
     const id = JSON.parse(localStorage.getItem('user'))
     const [showModal, setShowModal] = useState(false);
     const staffProfile = JSON.parse(localStorage.getItem('staffProfile'))
     const clientProfile = JSON.parse(localStorage.getItem('clientProfile'))
     const handleSelected = (selectedOptions) => {
         setSelected(selectedOptions);
     }
     const selectedValues = selected.map(option => option.label).join(', ');
     
 
     const convertTo12HourFormat = (time24h) => {
         let [hours, minutes] = time24h.split(':');
         let suffix = 'AM';
 
         if (hours >= 12) {
             suffix = 'PM';
             hours = hours - 12;
         }
 
         if (hours === 0) {
             hours = 12;
         }
 
         return `${hours}:${minutes} ${suffix}`;
     };
 
 
     const PostAvail = async (e) => {
         if (selectedDay === "" || selectedTimeFrom === "" || selectedTimeTo === "" || selectedValues === "") {
             return toast.error("Input Fields cannot be empty")
         }
         e.preventDefault()
         setLoading1(true)
         const info = {
             profileId: clientProfile.profileId,
             days: selectedDay,
             fromTimeOfDay: selectedTimeFrom,
             toTimeOfDay: selectedTimeTo,
             activities: selectedValues,
             companyID: id.companyId
         }
         try {
 
             const { data } = await post(`/ClientSchedules/add_client_schedule?userId=${id.userId}`, info);
             console.log(data)
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
             const { data } = await get(`ClientSchedules/get_client_schedule?clientId=${clientProfile.profileId}`, { cacheTimeout: 300000 });
             // console.log(data);
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
 
 
    
 
     
 
     const handleDelete = async (e) => {
         Swal.fire({
             html: `<h3>Are you sure? you want to delete this Schedule</h3>`,
             icon: 'question',
             showCancelButton: true,
             confirmButtonColor: '#1C75BC',
             cancelButtonColor: '#C8102E',
             confirmButtonText: 'Confirm Delete',
             showLoaderOnConfirm: true,
         }).then(async (result) => {
             if (result.isConfirmed) {
                 try {
                     const { data } = await post(`/ClientSchedules/delete/${e}`)
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
 
             const { data } = await get(`/ClientSchedules/get_schedule/${e}`, { cacheTimeout: 300000 });
             // console.log(data);
             setSelectedActivities(data.activities.split(',').map((activity) => ({ label: activity, value: activity })));
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
             clientScheduleId: idSave,
             profileId: clientProfile.profileId,
             days: editAvail.days,
             fromTimeOfDay: editAvail.fromTimeOfDay,
             toTimeOfDay: editAvail.toTimeOfDay,
             activities: selectedValue,
             companyID: id.companyId
         }
         try {
 
             const { data } = await post(`/ClientSchedules/edit/${idSave}?userId=${id.userId}`, info);
             // console.log(data);
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
 
 
     const [searchText, setSearchText] = useState("");
 
     const handleSearch = (event) => {
         setSearchText(event.target.value);
     };
 
     const filteredData = staffAvail.filter((item) =>
         item.days.toLowerCase().includes(searchText.toLowerCase())
     );
     return (
         <div className="page-wrapper">
             <Helmet>
                 <title> Disability Support Needs</title>
                 <meta name="description" content="Disability Support Needs" />
             </Helmet>
             <div className="content container-fluid">
                 {/* Page Header */}
                 <div className="page-header">
                     <div className="row">
                         <div className="col">
                             <ul className="breadcrumb">
                                 <li className="breadcrumb-item"><Link to="/client/client">Dashboard</Link></li>
                                 <li className="breadcrumb-item active">Disability Support Needs</li>
                                 <li className="breadcrumb-item active">Check if Yes and Uncheck if No</li>
                             </ul>
                         </div>
                     </div>
                 </div>
                 {/* /Page Header */}
                 <div className="row">
                     <div className="col-md-12">
                         <div className="card">
                             <div className="card-header">
                                 <h4 className="card-title mb-0">Mobility Related Issues</h4>
                             </div>
                             <div className="card-body">
                                 <form className="">
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Need Mobility Assistance?</label>
                                             <MultiSelect
                                                options={options}
                                                value={selectedActivities}
                                                onChange={handleActivityChange}
                                                labelledBy={'Select Issues'}
                                            />
                                         </div>
                                     </div>
 

                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Mobility Description</label>
                                             <textarea className="form-control"  rows="2" cols="10" />
                                         </div>
                                     </div>
 
                                 </form>
                             </div>
                         </div>
                     </div>
                 </div>

                 <div className="row">
                     <div className="col-md-12">
                         <div className="card">
                             <div className="card-header">
                                 <h4 className="card-title mb-0">Hearing Related Issues</h4>
                             </div>
                             <div className="card-body">
                                 <form className="">
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Hearing Issues</label>
                                             <select className='form-select' onChange={(e) => setSelectedDay(e.target.value)} required>
                                                <option defaultValue hidden >Select Issues</option>
                                                <option value={"No Issues"}>No Issues</option>
                                                <option value={"Some Issues"}>Some Issues</option>
                                                <option value={"Hearing Impaired"}>Hearing Impaired</option>
                                                
                                            </select>
                                         </div>
                                     </div>

                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Hearing Description</label>
                                             <textarea className="form-control"  rows="2" cols="10" />
                                         </div>
                                     </div>
                                 </form>
                             </div>
                         </div>
                     </div>
                 </div>

                 <div className="row">
                     <div className="col-md-12">
                         <div className="card">
                             <div className="card-header">
                                 <h4 className="card-title mb-0">Vision Related Issues</h4>
                             </div>
                             <div className="card-body">
                                 <form className="">
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Vision Related Issues</label>
                                             <select className='form-select' onChange={(e) => setSelectedDay(e.target.value)} required>
                                                <option defaultValue hidden >Select Issues</option>
                                                <option value={"No Issues"}>No Issues</option>
                                                <option value={"Some Issues"}>Some Issues</option>
                                                <option value={"Hearing Impaired"}>Hearing Impaired</option>
                                                
                                            </select>
                                         </div>
                                     </div>

                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Vision Description</label>
                                             <textarea className="form-control"  rows="2" cols="10" />
                                         </div>
                                     </div>
                                 </form>
                             </div>
                         </div>
                     </div>
                 </div>

                 <div className="row">
                     <div className="col-md-12">
                         <div className="card">
                             <div className="card-header">
                                 <h4 className="card-title mb-0">Memory Related Issues</h4>
                             </div>
                             <div className="card-body">
                                 <form className="">
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Memory Related Issues</label>
                                             <select className='form-select' onChange={(e) => setSelectedDay(e.target.value)} required>
                                                <option defaultValue hidden >Select Issues</option>
                                                <option value={"No Issues"}>No Issues</option>
                                                <option value={"Some Issues"}>Some Issues</option>
                                                <option value={"Hearing Impaired"}>Hearing Impaired</option>
                                                
                                            </select>
                                         </div>
                                     </div>

                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Memory Description</label>
                                             <textarea className="form-control"  rows="2" cols="10" />
                                         </div>
                                     </div>
                                 </form>
                             </div>
                         </div>
                     </div>
                 </div>

                 <div className="row">
                     <div className="col-md-12">
                         <div className="card">
                             <div className="card-header">
                                 <h4 className="card-title mb-0">Communication Related Issues</h4>
                             </div>
                             <div className="card-body">
                                 <form className="">
                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Need Communication Assistance?</label>
                                             <MultiSelect
                                                options={optionsOther}
                                                value={selectedActivities}
                                                onChange={handleActivityChange}
                                                labelledBy={'Select Issues'}
                                            />
                                         </div>
                                     </div>

                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Communication Preferences</label>
                                             <select className='form-select' onChange={(e) => setSelectedDay(e.target.value)} required>
                                                <option defaultValue hidden >Select Preferences</option>
                                                <option value={"Verbally"}>Verbally</option>
                                                <option value={"Ausian"}>Ausian</option>
                                                <option value={"Makaton"}>Makaton</option>
                                                <option value={"Combination of Ausian / Makaton"}>Combination of Ausian / Makaton</option>
                                                <option value={"Non-verbal / vocalize"}>Non-verbal / vocalize</option>
                                                <option value={"Point / Gesture"}>Point / Gesture</option>
                                                <option value={"IPad"}>IPad</option>
                                                <option value={"PECS"}>PECS</option>
                                                <option value={"Other"}>Other</option>
                                                
                                            </select>
                                         </div>
                                     </div>

                                     <div className='col-md-6'>
                                         <div className="form-group">
                                             <label>Communication Description</label>
                                             <textarea className="form-control"  rows="2" cols="10" />
                                         </div>
                                     </div>
                                 </form>
                             </div>
                         </div>
                         <div className="text-start">
                                         <button type="submit" className="btn btn-primary px-2" disabled={loading1 ? true : false} >
                                             {loading1 ? <div className="spinner-grow text-light" role="status">
                                                 <span className="sr-only">Loading...</span>
                                             </div> : "Submit"}</button>
                                     </div>
                     </div>
                 </div>
 
                 
                 <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                     <Modal.Header closeButton>
                         <Modal.Title>Edit Schedule</Modal.Title>
                     </Modal.Header>
                     <Modal.Body>
                         <form className="row">
                             <div className='col-md-12'>
                                 <div className="form-group">
                                     <label>Days</label>
                                     <select
                                         className='form-select'
                                         name="days" value={editAvail.days || ''} onChange={handleInputChange}
                                         required
                                     >
                                         <option defaultValue hidden>Select Days</option>
                                         <option value={"Monday"}>Monday</option>
                                         <option value={"Tuesday"}>Tuesday</option>
                                         <option value={"Wednessday"}>Wednessday</option>
                                         <option value={"Thursday"}>Thursday</option>
                                         <option value={"Friday"}>Friday</option>
                                         <option value={"Saturday"}>Saturday</option>
                                         <option value={"Sunday"}>Sunday</option>
                                     </select>
                                 </div>
                             </div>
                             <div className="col-md-12">
                                         <div className="form-group">
                                             <label>Activities</label>
                                             <MultiSelect
                                                 options={options}
                                                 value={selectedActivities}
                                                 onChange={handleActivityChange}
                                                 labelledBy={'Select Activities'}
                                             />
                                         </div>
                                     </div>
                             <div className='col-md-6'>
                                 <div className="form-group">
                                     <label>From Time of Day</label>
                                     <input className="form-control" type="time" name='fromTimeOfDay' value={editAvail.fromTimeOfDay || ''} onChange={handleInputChange}
                                     />
                                 </div>
                             </div>
                             <div className='col-md-6'>
                                 <div className="form-group">
                                     <label>To Time of Day</label>
                                     <input
                                         className="form-control"
                                         type="time"
                                         name="toTimeOfDay" value={editAvail.toTimeOfDay || ''} onChange={handleInputChange}
                                         required
                                     />
                                 </div>
                             </div>
                             
 
                         </form>
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
 export default ClientDisability;