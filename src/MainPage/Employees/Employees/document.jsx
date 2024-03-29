import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import { FaCopy, FaFileCsv, FaFileExcel, FaFilePdf, FaEye, FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import ExcelJS from 'exceljs';
import Offcanvas from '../../../Entryfile/offcanvance';
import { toast } from 'react-toastify';
import useHttp from '../../../hooks/useHttp';
import { GoSearch } from 'react-icons/go';
import Swal from 'sweetalert2';

import moment from 'moment';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocument, filterDocument } from '../../../store/slices/DocumentSlice';
import { fetchStaff } from '../../../store/slices/StaffSlice';
import { fetchClient } from '../../../store/slices/ClientSlice';
import { fetchAdmin } from '../../../store/slices/AdminSlice';
import axiosInstance from '../../../store/axiosInstance';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useHistory } from 'react-router-dom';


const Document = () => {

    const dispatch = useDispatch();
    const id = JSON.parse(localStorage.getItem('user'));
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault('Australia/Sydney');
    const nowInAustraliaTime = dayjs().tz().format('YYYY-MM-DD');

    // Fetch staff data and update the state
    useEffect(() => {
        dispatch(fetchDocument(id.companyId));
        dispatch(fetchStaff(id.companyId));
        // dispatch(fetchClient(id.companyId));
        dispatch(fetchAdmin(id.companyId));
    }, [dispatch, id.companyId]);

    // Access the entire state
    const loading = useSelector((state) => state.document.isLoading);
    const document = useSelector((state) => state.document.data);
    const staff = useSelector((state) => state.staff.data);
    const admin = useSelector((state) => state.admin.data);
    // console.log(document);
    //Declaring Variables
    const privateHttp = useHttp();
    const [rejectModal, setRejectModal] = useState(false);
    const [reason, setReason] = useState("");
    const [deadline, setDeadline] = useState("");
    const [selectedDocument, setSelectedDocument] = useState(0);
    const [loading1, setLoading1] = useState(false);
    const history = useHistory();
    const sta = useRef("");
    const cli = useRef("");
    const dateFrom = useRef("");
    const dateTo = useRef("");
    const status = useRef("");
    const role = useRef("");

    const goBack = () => {
        history.goBack(); // Go back in history
    };

    const goForward = () => {
        history.goForward(); // Go forward in history
    };


    const columns = [

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
                <div className='d-flex flex-column gap-1 p-2' style={{ overflow: 'hidden' }}>
                    <span

                        data-bs-toggle="tooltip" data-bs-placement="top" title={`${row.documentName}`}
                    > {row.documentName}</span>

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
            selector: row => !row.expirationDate ? "No Expiration Date" : moment(row.expirationDate).format('ll'),
            sortable: true,
            expandable: true
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            expandable: true,
            cell: (row) => {
                const isExpired = dayjs(row.expirationDate).format('YYYY-MM-DD') < (nowInAustraliaTime);
                let status;

                if (isExpired) {
                    status = 'Expired';
                } else if (row.status === 'Rejected') {
                    status = 'Rejected';
                } else {
                    status = row.status;
                }

                const statusClasses = `px-2 py-1 rounded-pill fw-bold ${isExpired ? 'bg-danger text-white' : ''
                    } ${row.status === 'Pending'
                        ? 'bg-warning'
                        : row.status === 'Accepted'
                            ? 'bg-success text-white'
                            : row.status === 'Rejected'
                                ? 'bg-danger text-white'
                                : 'bg-transparent'
                    }`;

                return (
                    <span className={statusClasses} style={{ fontSize: '10px' }}>
                        {status}
                    </span>
                );
            },
        },

    ];





    const downloadLinkRef = useRef(null);

    const handleView = (documentUrl) => {
        window.open(documentUrl, '_blank');
    };

    const handleDownload = (documentUrl, documentName) => {
        downloadLinkRef.current.href = documentUrl;
        downloadLinkRef.current.download = documentName;
        downloadLinkRef.current.click();
    };



    const handleRejectModal = (e) => {
        setRejectModal(true)
        setSelectedDocument(e);

    }




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
            <div className="p-2 d-flex gap-1 flex-column " style={{ fontSize: "12px" }}>
                <div ><span className='fw-bold'>Date Created: </span> {moment(data.dateCreated).format('lll')}</div>
                <div><span className='fw-bold'>Date Modified: </span>{moment(data.dateModified).format('lll')}</div>
                <div className=' d-flex gap-1'>
                    <button className="btn text-info fw-bold" style={{ fontSize: "12px" }}>
                        Edit
                    </button> |
                    <button onClick={() => handleDelete(data.documentId)} className="btn text-danger fw-bold" style={{ fontSize: "12px" }}>
                        Delete
                    </button> |

                    {
                        data.status === 'Pending' &&
                        <div>
                            <button onClick={() => handleAccept(data.documentId)} className="btn text-success fw-bold" style={{ fontSize: "12px" }}>
                                Accept
                            </button> |

                            <button onClick={() => handleRejectModal(data.documentId)} className="btn text-primary fw-bold" style={{ fontSize: "12px" }}>
                                Reject
                            </button>
                        </div>
                    }

                    {data.status === "Rejected" && <button onClick={() => handleAccept(data.documentId)} className="btn text-primary fw-bold" style={{ fontSize: "12px" }}>
                        Accept
                    </button>}
                    {data.status === "Accepted" && <button onClick={() => handleRejectModal(data.documentId)} className="btn text-primary fw-bold" style={{ fontSize: "12px" }}>
                            Reject
                        </button>}
{/* 
                    <button onClick={() => handleRejectModal(data.documentId)} className="btn text-primary fw-bold" style={{ fontSize: "12px" }}>
                            Reject
                        </button> */}

                    {/* | */}

                    {/* { data.status === 'Pending' ? <button onClick={() => handleRejectModal(data.documentId)} className="btn text-primary fw-bold" style={{ fontSize: "12px" }}>
                        Reject
                    </button>: ''} */}


                </div>

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
            confirmButtonColor: '#405189',
            cancelButtonColor: '#C8102E',
            confirmButtonText: 'Confirm Delete',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await axiosInstance.post(`/Documents/delete/${e}`,
                    )
                    if (data.status === 'Success') {
                        toast.success(data.message);
                        dispatch(fetchDocument(id.companyId));
                    } else {
                        toast.error(data.message);
                    }


                } catch (error) {
                    toast.error("Ooooops😔 Error Occurred ")
                    console.log(error);


                }


            }
        })


    }
    const handleAccept = async (e) => {
        Swal.fire({
            html: `<h3>Accept This Document</h3>`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#405189',
            cancelButtonColor: '#C8102E',
            confirmButtonText: 'Confirm',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await axiosInstance.get(`/Documents/accept_document?userId=${id.userId}&id=${e}`,
                    )

                    if (data.status === 'Success') {
                        toast.success(data.message);
                        dispatch(fetchDocument(id.companyId));
                    } else {
                        toast.error("Error Accepting Document");
                    }


                } catch (error) {
                    toast.error("Ooooops😔 Error Occurred ")
                    console.log(error);



                }


            }
        })


    }
    const handleReject = async () => {

        if (reason.trim() === "") {
            toast.error("provide valid reason")
        }
        setLoading1(false);
        try {
            const { data } = await axiosInstance.post(`/Documents/reject_document?userId=${id.userId}&docid=${selectedDocument}&reason=${reason}&deadline=${deadline}`,
            )
            if (data.status === 'Success') {
                toast.success(data.message);
                dispatch(fetchDocument(id.companyId));
                setLoading1(false);
                setRejectModal(false);
            } else {

                toast.error(data.message);
                setRejectModal(true);
                setLoading1(false);
            }


        } catch (error) {
            setLoading1(false);
            toast.error("Ooooops😔 Error Occurred ")
            console.log(error);



        }
    }


    const handleFilter = async (e) => {
        // company,dateFrom, dateTo, sta,cli, status, role
        e.preventDefault();
        dispatch(filterDocument({ company: id.companyId, dateFrom: dateFrom.current.value, dateTo: dateTo.current.value, sta: sta.current.value, cli: cli.current.value, status: status.current.value, role: role.current.value }));

    }



    const filteredData = document.filter((item) => {

        return (
            item?.user?.toLowerCase().includes(searchText?.toLowerCase()) ||
            item?.documentName?.toLowerCase().includes(searchText?.toLowerCase())
        );
    });




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
                            <div className="col-md-10">
                                <h3 className="page-title">Document</h3>
                                {id.role === "CompanyAdmin" ?
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                        <li className="breadcrumb-item active">Documents</li>
                                    </ul>
                                    : ""}
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

                    {/* Search Filter */}

                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">

                                <div className="card-body">
                                    <form className="row py-2" onSubmit={handleFilter}>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="col-form-label">Staff Name</label>
                                                <div>
                                                    <select className="form-select" ref={sta}>
                                                        <option defaultValue value={""} >--Select Staff--</option>
                                                        {
                                                            staff.map((data, index) =>
                                                                <option value={data.fullName} key={index}>{data.fullName}</option>)
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="col-form-label">Admin Name</label>
                                                <div>
                                                    <select className="form-select" ref={cli}>
                                                        <option defaultValue value={""}>--Select Admin--</option>
                                                        {
                                                            admin.map((data, index) =>
                                                                <option value={data.fullName} key={index}>{data.fullName}</option>)
                                                        }
                                                    </select>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="col-form-label">Date From</label>
                                                <div><input className="form-control datetimepicker" type="datetime-local" ref={dateFrom} /></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="col-form-label">Date To</label>
                                                <div><input className="form-control datetimepicker" type="datetime-local" ref={dateTo} /></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group" >
                                                <label className="col-form-label">Status</label>
                                                <div>
                                                    <select className="form-select" ref={status}>
                                                        <option defaultValue hidden value={""}>--Select a Status...</option>
                                                        <option value="Accepted">Accepted</option>
                                                        <option value="Rejected">Rejected</option>
                                                        <option value="Pending">Pending</option>

                                                    </select>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="col-form-label">User Role</label>
                                                <div>
                                                    <select className="form-select" ref={role}>
                                                        <option defaultValue hidden value={""}>--Select Role--</option>
                                                        <option value="Admin">Admin</option>
                                                        <option value="Staff">Staff</option>
                                                        <option value="Client">Client</option>

                                                    </select>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="col-auto text-left">
                                            <div className="form-group">
                                                <button
                                                    type='submit'
                                                    className="btn btn-info add-btn text-white rounded-2 m-r-5">
                                                    Load
                                                </button>


                                            </div>
                                        </div>
                                        <div className="col-auto text-left">
                                            <div className="form-group">
                                                {
                                                    loading &&

                                                    <div className="spinner-border" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>

                                                }

                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
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
                            {/* <div className='col-md-4'>
                                    <Link to={''} className="btn add-btn btn-info text-white rounded-2">
                                        Add New Document</Link>
                                </div> */}
                        </div>
                        <DataTable data={filteredData} columns={columns}
                            pagination
                            highlightOnHover
                            searchable
                            searchTerm={searchText}
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
                        <Modal.Title>Reject Document</Modal.Title>
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
                        <button onClick={handleReject} className="btn btn-danger">

                            {loading1 ? <div className="spinner-grow text-light" role="status">
                                <span className="sr-only">Loading...</span>
                            </div> : "Reject Document"}
                        </button>
                    </Modal.Footer>
                </Modal>

            </div>

            <Offcanvas />
        </>
    );
}

export default Document;