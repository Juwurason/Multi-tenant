import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import { FaCopy, FaFileCsv, FaFileExcel, FaFilePdf, FaEye } from "react-icons/fa";
import ExcelJS from 'exceljs';
import Sidebar from '../../../initialpage/Sidebar/sidebar';;
import Header from '../../../initialpage/Sidebar/header'
import Offcanvas from '../../../Entryfile/offcanvance';
import { toast } from 'react-toastify';
import useHttp from '../../../hooks/useHttp';
import { useCompanyContext } from '../../../context';
import { GoSearch } from 'react-icons/go';
import Swal from 'sweetalert2';

import moment from 'moment';
import { Modal } from 'react-bootstrap';

const Document = () => {
    //Declaring Variables
    const id = JSON.parse(localStorage.getItem('user'));
    const { loading, setLoading } = useCompanyContext();
    const [document, setDocument] = useState([]);
    const [staff, setStaff] = useState([]);
    const [clients, setClients] = useState([]);
    const privateHttp = useHttp();
    const [rejectModal, setRejectModal] = useState(false);
    const [reason, setReason] = useState("");
    const [deadline, setDeadline] = useState("");
    const [selectedDocument, setSelectedDocument] = useState(0);
    const columns = [
        // {
        //   name: '#',
        //   cell: (row, index) => index + 1
        // },
        {
            name: 'User',
            selector: row => row.user,
            sortable: true
        },
        {
            name: 'Role',
            selector: row => row.userRole,
            sortable: true
        },
        {
            name: 'Document',
            selector: row => row.documentName,
            sortable: true,
            expandable: true,
            cell: (row) => (
                <div className='d-flex flex-column gap-1 p-2'>
                    <span> {row.documentName}</span>

                    <span className='d-flex'>
                        <span className='bg-primary text-white pointer px-2 py-1 rounded d-flex justify-content-center align-items-center'
                            title='View'
                            onClick={() => handleView(row.documentUrl)}
                        >

                            <FaEye />
                        </span>

                        <a ref={downloadLinkRef} style={{ display: 'none' }} />
                    </span>
                </div>
            ),
        },
        {
            name: 'Expiration Date',
            selector: row => row.expirationDate,
            sortable: true,
            expandable: true,
            cell: (row) => (
                <span>
                    {row.expirationDate === "null" || undefined
                        ? "" : moment(row.expirationDate).format('ll')}
                </span>
            ),
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            expandable: true,
            cell: (row) => (
                <span className='bg-warning px-2 py-1 rounded-pill fw-bold' style={{ fontSize: "10px" }}>{row.status}</span>
            ),
        },

    ];



    const FetchDocument = async () => {
        setLoading(true);
        try {
            const documentResponse = await privateHttp.get(`/Documents/get_all_documents?companyId=${id.companyId}`, { cacheTimeout: 300000 });
            const document = documentResponse.data;
            console.log(document);
            setDocument(document);
        } catch (error) {
            console.log(error);
        }
        try {
            const staffResponse = await privateHttp.get(`/Staffs?companyId=${id.companyId}`, { cacheTimeout: 300000 });
            const staff = staffResponse.data;
            setStaff(staff);
            setLoading(false)
        } catch (error) {
            console.log(error);
        }

        try {
            const clientResponse = await privateHttp.get(`/Profiles?companyId=${id.companyId}`, { cacheTimeout: 300000 });
            const client = clientResponse.data;
            setClients(client);
            setLoading(false)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }

    };
    useEffect(() => {
        FetchDocument()
    }, []);

    const [menu, setMenu] = useState(false)
    const downloadLinkRef = useRef(null);








    const handleView = (documentUrl) => {
        window.open(documentUrl, '_blank');
    };

    const handleDownload = (documentUrl, documentName) => {
        downloadLinkRef.current.href = documentUrl;
        downloadLinkRef.current.download = documentName;
        downloadLinkRef.current.click();
    };


    const toggleMobileMenu = () => {
        setMenu(!menu)
    }


    const handleRejectModal = (e) => {
        setRejectModal(true)
        setSelectedDocument(e);

    }


    useEffect(() => {
        if ($('.select').length > 0) {
            $('.select').select2({
                minimumResultsForSearch: -1,
                width: '100%'
            });
        }
    });
    const handleExcelDownload = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet1');

        // Add headers
        const headers = columns.map((column) => column.name);
        sheet.addRow(headers);

        // Add data
        document.forEach((dataRow) => {
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
            link.download = 'Document.xlsx';
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };



    const handleCSVDownload = () => {
        const csvData = Papa.unparse(document);
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "Document.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePDFDownload = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(13);
        doc.text("Document Table", marginLeft, 40);
        const headers = columns.map((column) => column.name);
        const dataValues = document.map((dataRow) =>
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
        doc.save("document.pdf");
    };

    const ButtonRow = ({ data }) => {
        return (
            <div className="p-4">
                <table className='table'>

                    <thead>
                        <tr>
                            <th>Date Created</th>
                            <th>Date Modified</th>
                            <th>Actions </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{moment(data.dateCreated).format('lll')}</td>
                            <td>{moment(data.dateModified).format('lll')}</td>
                            <td>
                                <div className="d-flex gap-1">

                                    <span
                                        className='bg-info pointer text-white px-2 py-1 rounded-pill fw-bold' style={{ fontSize: "10px" }}
                                        title='Edit'
                                    >
                                        Edit
                                    </span>
                                    <span
                                        className='bg-warning pointer px-2 py-1 rounded-pill fw-bold' style={{ fontSize: "10px" }}
                                        title='Delete'
                                        onClick={() => handleDelete(data.documentId)}
                                    >
                                        Delete
                                    </span>
                                    <span
                                        className='bg-success text-white pointer px-2 py-1 rounded-pill fw-bold' style={{ fontSize: "10px" }}
                                        title='Accept'
                                        onClick={() => handleAccept(data.documentId)}
                                    >
                                        Accept
                                    </span>
                                    <span
                                        className='bg-danger text-white pointer px-2 py-1 rounded-pill fw-bold' style={{ fontSize: "10px" }}
                                        title='Reject'
                                        onClick={() => handleRejectModal(data.documentId)}
                                    >
                                        Reject
                                    </span>

                                </div>
                            </td>
                        </tr>
                    </tbody>

                </table>


            </div>
        );
    };
    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };
    const handleDelete = async (e) => {
        Swal.fire({
            html: `<h3>Are you sure? you want to delete this Document</h3>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1C75BC',
            cancelButtonColor: '#C8102E',
            confirmButtonText: 'Confirm Delete',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await privateHttp.post(`/Documents/delete/${e}`,
                    )
                    if (data.status === 'Success') {
                        toast.success(data.message);
                        FetchDocument()
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
    const handleAccept = async (e) => {
        Swal.fire({
            html: `<h3>Accept This Document</h3>`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#1C75BC',
            cancelButtonColor: '#C8102E',
            confirmButtonText: 'Confirm',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await privateHttp.post(`/Documents/accept_document?userId=${id.userId}&id=${e}`,
                    )
                    if (data.status === 'Success') {
                        toast.success(data.message);
                        FetchDocument()
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
    const handleReject = async () => {
        if (reason.trim() === "" || deadline === "") {
            toast.error("provide valid reason and deadline")
        }
        try {
            const { data } = await privateHttp.post(`/Documents/reject_document?userId=${id.userId}&docid=${selectedDocument}&reason=${reason}&deadline=${deadline}`,
            )
            if (data.status === 'Success') {
                toast.success(data.message);
                FetchDocument()
            } else {
                toast.error(data.message);
            }


        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)


        }
    }

    const filteredData = document.filter((item) =>
        item.documentName.toLowerCase().includes(searchText.toLowerCase())
    );
    const customStyles = {

        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
            },
        },
    };
    return (
        <>
            <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>

                <Header onMenuClick={(value) => toggleMobileMenu()} />
                <Sidebar />
                <div className="page-wrapper">
                    <Helmet>
                        <title>Document</title>
                        <meta name="description" content="Document Upload" />
                    </Helmet>
                    {/* Page Content */}
                    <div className="content container-fluid">
                        {/* Page Header */}
                        <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h3 className="page-title">Document</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                        <li className="breadcrumb-item active">Documents</li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                        {/* /Page Header */}

                        {/* Search Filter */}


                        <div className="row">
                            <div className="col-sm-4">
                                <div className="form-group">
                                    <label className="col-form-label">Staff Name</label>
                                    <div>
                                        <select className="form-select">
                                            <option defaultValue hidden>--Select a staff--</option>
                                            {
                                                staff.map((data, index) =>
                                                    <option value={data.staffId} key={index}>{data.fullName}</option>)
                                            }
                                        </select></div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="form-group">
                                    <label className="col-form-label">Client Name</label>
                                    <div>
                                        <select className="form-select">
                                            <option defaultValue hidden>--Select a Client--</option>
                                            {
                                                clients.map((data, index) =>
                                                    <option value={data.staffId} key={index}>{data.fullName}</option>)
                                            }
                                        </select>
                                    </div>
                                </div>

                            </div>
                            <div className="col-sm-4">
                                <div className="form-group">
                                    <label className="col-form-label">Date From</label>
                                    <div><input className="form-control datetimepicker" type="datetime-local" /></div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="form-group">
                                    <label className="col-form-label">Date To</label>
                                    <div><input className="form-control datetimepicker" type="datetime-local" /></div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="form-group">
                                    <label className="col-form-label">Status</label>
                                    <div>
                                        <select className="form-select">
                                            <option defaultValue hidden>--Select a Status...</option>
                                            <option value="">Accepted</option>
                                            <option value="">Rejected</option>
                                            <option value="">Pending</option>

                                        </select>
                                    </div>
                                </div>

                            </div>
                            <div className="col-sm-4">
                                <div className="form-group">
                                    <label className="col-form-label">User Role</label>
                                    <div>
                                        <select className="form-select">
                                            <option defaultValue hidden>--Select Role--</option>
                                            <option value="">Staff</option>
                                            <option value="">Client</option>

                                        </select>
                                    </div>
                                </div>

                            </div>
                            <div className="col-sm-4 text-left">
                                <button className="btn btn-primary rounded-2">Load</button>


                            </div>

                        </div>

                        {/* <div className="submit-section">
                        </div> */}


                        {/* /Search Filter */}





                        <div className='mt-4 border'>
                            <div className="row px-2 py-3">

                                <div className="col-md-3">
                                    <div className='d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                                        <input type="text" placeholder="Search Documents" className='border-0 outline-none' onChange={handleSearch} />
                                        <GoSearch />
                                    </div>
                                </div>
                                <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
                                    <CSVLink
                                        data={document}
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
                                    <CopyToClipboard text={JSON.stringify(document)}>
                                        <button

                                            className='btn text-warning'
                                            title="Copy Table"
                                            onClick={() => toast("Table Copied")}
                                        >
                                            <FaCopy />
                                        </button>
                                    </CopyToClipboard>
                                </div>
                                <div className='col-md-4'>
                                    <Link to={''} className="btn add-btn btn-info text-white rounded-2">
                                        Add New Document</Link>
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
                                customStyles={customStyles}
                                responsive

                            />

                        </div>



                    </div>
                    <Modal show={rejectModal} onHide={() => setRejectModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Reject Modal</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <label htmlFor="">Please provide reasons for rejecting document</label>
                                <br />
                                <textarea rows={3} className="form-control summernote" placeholder="" defaultValue={""}
                                    onChange={e => setReason(e.target.value)} />
                            </div>
                            <br />
                            <div>
                                <label htmlFor="">Set a new deadline</label>
                                <br />
                                <input type="date" className='form-control'
                                    onChange={e => setDeadline(e.target.value)}
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button onClick={handleReject} className="btn btn-danger">Reject Document</button>
                        </Modal.Footer>
                    </Modal>

                </div>
            </div>
            <Offcanvas />
        </>
    );
}

export default Document;