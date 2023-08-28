
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
import { SlSettings } from 'react-icons/sl'
import { Modal } from 'react-bootstrap';
import dayjs from 'dayjs';



const StaffProgressNote = ({ staffPro, FetchData }) => {
    useEffect(() => {
        if ($('.select').length > 0) {
            $('.select').select2({
                minimumResultsForSearch: -1,
                width: '100%'
            });
        }
    });

    const { get, post } = useHttp();
    const [loading, setLoading] = useState(false);
    const [document, setDocument] = useState("")
    const user = JSON.parse(localStorage.getItem('user'));
    const staffProfile = JSON.parse(localStorage.getItem('staffProfile'));

    const columns = [
        {
            name: 'Staff',
            selector: row => row.staff,
            sortable: true
        },
        {
            name: 'Client',
            selector: row => row.profile.fullName,
            sortable: true
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'DateCreated',
            selector: row => dayjs(row.dateCreated).format('YYYY-MM-DD'),
            sortable: true
        },
        {
            name: 'DateModified',
            selector: row => dayjs(row.dateModified).format('DD/MM/YYYY HH:mm:ss'),
            sortable: true
        }

    ];

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const allowedExtensions = /(\.pdf|\.doc)$/i;

        if (allowedExtensions.exec(selectedFile.name)) {
            setDocument(selectedFile);
        } else {
            alert('Please select a PDF or DOC file');
        }
    };

    const handleExcelDownload = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet1');

        // Add headers
        const headers = columns.map((column) => column.name);
        sheet.addRow(headers);

        // Add data
        staffPro.forEach((dataRow) => {
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
        const dataValues = staffPro.map((dataRow) =>
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
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const today = new Date();
    const formattedDate = formatDate(today);

    const [showModal, setShowModal] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState({});

    const handleActivityClick = async (e) => {
        // console.log(e);
        try {
            const { data } = await get(`/ProgressNotes/${e}`, { cacheTimeout: 300000 })
            setSelectedActivity(data);
            // console.log(data);
            setLoading(false);
        } catch (error) {
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
        setShowModal(true);
    };

    const SaveProgress = async (e) => {
        e.preventDefault()
        setLoading1(true)
        const info = {
            progressNoteId: selectedActivity.progressNoteId,
            report: selectedActivity.report,
            progress: selectedActivity.progress,
            position: "0",
            followUp: selectedActivity.followUp,
            date: formattedDate,
            staff: selectedActivity.staff,
            staffId: staffProfile.staffId,
            startKm: selectedActivity.startKm,
            profileId: selectedActivity.profileId,
            companyID: selectedActivity.companyId,
        }
        try {
            const { data } = await post(`/ProgressNotes/edit/${selectedActivity.progressNoteId}?userId=${user.userId}`, info);
            //   console.log(data);
            toast.success(data.message)
            setShowModal(false);
            setLoading1(false);
            FetchData()
        } catch (error) {
            toast.error("Error Updating Progress Note")
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
            setLoading1(false)
        }
        finally {
            setLoading1(false)
        }
    }

    const ButtonRow = ({ data }) => {
        return (

            <div className="p-2 d-flex gap-1 flex-column " style={{ fontSize: "12px" }}>
                <div ><span className='fw-bold'>FollowUp: </span>{data.followUp}</div>
                <div><span className='fw-bold'>Progress: </span>{data.progress}</div>
                <div><span className='fw-bold'>Report: </span>{data.report}</div>
                <div>
                    <button className="btn text-info fw-bold" style={{ fontSize: "12px" }} onClick={() => handleActivityClick(data.progressNoteId)}>
                        Edit
                    </button>
                </div>

            </div>
        );
    };

    function handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        const newValue = value === "" ? "" : value;
        setSelectedActivity({
            ...selectedActivity,
            [name]: newValue
        });
    }
    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = staffPro.filter((item) =>
        item.staff.toLowerCase().includes(searchText.toLowerCase())
    );


    return (
        <>
            <div className="page-wrapper">
                <Helmet>
                    <title> Progress Note Report</title>
                    <meta name="description" content="Progress Note" />
                </Helmet>
                {/* Page Content */}
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row align-items-center">
                            <div className="col">
                                <h3 className="page-title">Progress Note Report</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/staff/staff/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item active">Progress Note Report</li>
                                </ul>
                            </div>
                            {/* <div className="col-auto float-end ml-auto">
                <a href="" className="btn add-btn" data-bs-toggle="modal" data-bs-target="#add_policy"><i className="fa fa-plus" /> Add New Document</a>
              </div> */}
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
                                    data={staffPro}
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
                                <CopyToClipboard text={JSON.stringify(staffPro)}>
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

                        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Progress Notes Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>
                                    <div className="row">

                                        <div className="form-group">
                                            <label className="col-form-label">FollowUp:</label>
                                            <div>
                                                <textarea rows={2} className="form-control summernote" placeholder="" name="followUp" value={selectedActivity.followUp || ''} onChange={handleInputChange} />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="col-form-label">Progress:</label>
                                            <div>
                                                <textarea rows={2} className="form-control summernote" placeholder="" name="progress" value={selectedActivity.progress || ''} onChange={handleInputChange} />

                                            </div>

                                        </div>

                                        <div className="form-group">
                                            <label className="col-form-label">Report:</label>
                                            <div>
                                                <textarea rows={2} className="form-control summernote" placeholder="" name="report" value={selectedActivity.report || ''} onChange={handleInputChange} />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button
                                    disabled={loading1 ? true : false}
                                    className="btn add-btn btn-primary" onClick={SaveProgress}>
                                    {loading1 ? <div className="spinner-grow text-light" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div> : "Save"}
                                </button>
                            </Modal.Footer>
                        </Modal>

                    </div>

                </div>


            </div>
            <Offcanvas />
        </>

    );

}

export default StaffProgressNote;
