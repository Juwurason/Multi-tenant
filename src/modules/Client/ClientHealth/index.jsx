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
    { label: "Medication Supervision", value: "Medication Supervision" },
    { label: "Medication administering", value: "Medication administering" },
    { label: "Personal Support", value: "Personal Support" },
    { label: "Domestic Cleaning", value: "Domestic Cleaning" },
    { label: "Transport", value: "Transport" },
    { label: "Dog training", value: "Dog training" },
    { label: "Install phone", value: "Install phone" },
    { label: "Welfare check", value: "Welfare check" },
    { label: "Support Groceries shopping", value: "Support Groceries shopping" },
    { label: "Pick up", value: "Pick up" },
    { label: "Baby sitting", value: "Baby sitting" },
    { label: "Taking to solicitors appointment", value: "Taking to solicitors appointment" },
    { label: "Meal Preparation", value: "Meal Preparation" },
    { label: "Shopping", value: "Shopping" },
    { label: "Groceries Transport", value: "Groceries Transport" },
    { label: "Domestics Social Support", value: "Domestics Social Support" },



];


const ClientHealth = () => {
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
    const [staffAva, setStaffAva] = useState("");
    const { loading, setLoading } = useCompanyContext();
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [selectedDay, setSelectedDay] = useState("");
    const { get, post } = useHttp();
    const [selectedTimeFrom, setSelectedTimeFrom] = useState("");
    const [selectedTimeTo, setSelectedTimeTo] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const id = JSON.parse(localStorage.getItem('user'))
    const [showModal, setShowModal] = useState(false);
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
        if (selectedDay === "" || selectedTimeFrom === "" || selectedTimeTo === "") {
            return toast.error("Input Fields cannot be empty")
        }
        e.preventDefault()
        setLoading1(true)
        //  {
        //     "profileId": 0,
        //     "healthIssues": "string",
        //     "supportDetails": "string",
        //     "requireMedication": true,
        //     "support": "string",
        //     "healthPlan": "string",
        //     "documentation": "string",
        //     "documentationFile": "string"
        // }
        const info = {
            profileId: clientProfile.profileId,
            healthIssues: selectedDay,
            supportDetails: staffAva,
            requireMedication: selectedTimeFrom,
            support: selectedTime,
            healthPlan: selectedTimeTo,
            //  documentation: "",
            //  documentationFile: "",
            //  companyID: id.companyId
        }
        try {

            const { data } = await post(`/HealthSupports/get_all?clientId=${id.userId}`, info);
            //  console.log(data)
            if (data.status === 'Success') {
                toast.success(data.message)
            }
            setLoading1(false)
            FetchSchedule()
        } catch (error) {
            //  console.log(error);
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


    const columns = [
        // {
        //   name: 'User',
        //   selector: row => row.user,
        //   sortable: true
        // },
        {
            name: 'Days',
            selector: row => row.days,
            sortable: true,
            expandable: true,
        },
        {
            name: 'From Time of Day',
            selector: row => convertTo12HourFormat(row.fromTimeOfDay),
            sortable: true,
        },
        {
            name: 'To Time of Day',
            selector: row => convertTo12HourFormat(row.toTimeOfDay),
            sortable: true
        },
        {
            name: 'Activities',
            selector: row => row.activities,
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
            html: `<h3>Are you sure? you want to delete this Schedule</h3>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#405189',
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

    const ButtonRow = ({ data }) => {
        return (
            <div className="p-2 d-flex gap-1 flex-column " style={{ fontSize: "12px" }}>
                <div><span className='fw-bold'>Activities: </span> {data.activities}</div>
                <div ><span className='fw-bold'>Date Created: </span> {moment(data.dateCreated).format('lll')}</div>
                <div>
                    <button className="btn text-info fw-bold" style={{ fontSize: "12px" }} onClick={() => handleEdit(data.clientScheduleId)}>
                        Edit
                    </button> |
                    <button onClick={() => handleDelete(data.clientScheduleId)} className="btn text-danger fw-bold" style={{ fontSize: "12px" }}>
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
        item.days.toLowerCase().includes(searchText.toLowerCase())
    );
    return (
        <div className="page-wrapper">
            <Helmet>
                <title> Client Health Support Needs</title>
                <meta name="description" content="Client Health Support Needs" />
            </Helmet>
            <div className="content container-fluid">
                {/* Page Header */}
                <div className="page-header">
                    <div className="row">
                        <div className="col">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/client/app/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Health Support Needs</li>
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
                                <h4 className="card-title mb-0">Health Support Needs</h4>
                            </div>
                            <div className="card-body">
                                <form className="row">
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Describe any ongoing health issues you have, including mental health issues.</label>
                                            <textarea className="form-control" onChange={(e) => setSelectedDay(e.target.value)} rows="2" cols="20" />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Is additional support  for these issues? If so, please provide detail</label>
                                            <textarea className="form-control" rows="2" cols="20" onChange={(e) => setStaffAva(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Medication Required?</label>
                                            <select className='form-select' onChange={(e) => setSelectedTimeFrom(e.target.value)}>
                                                <option value={"false"}>Select...</option>
                                                <option value={"true"}>Yes</option>
                                                <option value={"false"}>No</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>How Often do you require medication?</label>
                                            <select className='form-select' onChange={(e) => setSelectedTimeTo(e.target.value)}>
                                                <option defaultValue hidden>Please Select</option>
                                                <option value={"Prompt Required"}>Prompt Required</option>
                                                <option value={"Assitance Required"}>Assitance Required</option>
                                                <option value={"Administration Required"}>Administrati Required</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Provide details of your medication and treatment plan</label>
                                            <textarea className="form-control" rows="2" cols="20" onChange={(e) => setSelectedTime(e.target.value)} />
                                        </div>
                                    </div>


                                </form>
                                <div className="text-start">
                                    <button type="submit" className="btn btn-primary px-2" disabled={loading1 ? true : false}
                                    //  onClick={PostAvail}
                                    >
                                        {loading1 ? <div className="spinner-grow text-light" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div> : "Save"}</button>
                                </div>
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
export default ClientHealth;