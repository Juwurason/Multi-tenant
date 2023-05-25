
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
import { async } from '@babel/runtime/helpers/regeneratorRuntime';

const StaffProgressNote = () => {
    useEffect(() => {
        if ($('.select').length > 0) {
            $('.select').select2({
                minimumResultsForSearch: -1,
                width: '100%'
            });
        }
    });

    const { get } = useHttp();
    const { loading, setLoading } = useCompanyContext();
    const [documentName, setDocumentName] = useState("")
    const [expire, setExpire] = useState("")
    const [document, setDocument] = useState("")
    const [staffPro, setStaffPro] = useState([]);
    const id = JSON.parse(localStorage.getItem('user'));

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


    // const id = JSON.parse(localStorage.getItem('user'))
    const getStaffProfile = JSON.parse(localStorage.getItem('staffProfile'))

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


    const privateHttp = useHttp()


    useEffect(() => {
        setLoading(true)
        const getStaffProgressNote = async () => {
            try {
                const response = await privateHttp.get(`/ProgressNotes/get_progressnote_by_user?staffname=${getStaffProfile.fullName}&profileId=`, { cacheTimeout: 300000 })
                setStaffPro(response.data.progressNote);
                // console.log(response.data.progressNote);
                // console.log(staffPro.profile);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false)
            }
        }
        getStaffProgressNote()
    }, [])

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

    const [showModal, setShowModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const handleActivityClick = async (e) => {
        try {
            const { data } = await privateHttp.get(`/ProgressNotes/${e}`, { cacheTimeout: 300000 })
            setSelectedActivity(data);
            // console.log(data.progress);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
        setShowModal(true);
    };

    const ButtonRow = ({ data }) => {
        return (
            <div className="p-4">
                <button className='btn btn-primary' onClick={() => handleActivityClick(data.progressNoteId)}>view</button>
            </div>
        );
    };

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
                                    <li className="breadcrumb-item"><Link to="/staff/staff/staffDashboard">Dashboard</Link></li>
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

                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Progress Notes Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedActivity && (
                                    <>
                                        <p><b>FollowUp:</b> {selectedActivity.followUp}</p>
                                        <p><b>Progress:</b> {selectedActivity.progress}</p>
                                        <p><b>Report:</b> {selectedActivity.report}</p>
                                    </>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
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
