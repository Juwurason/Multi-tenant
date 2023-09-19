import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { FaFileCsv, FaFileExcel, FaCopy, FaFilePdf, FaEye } from "react-icons/fa";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCompanyContext } from "../../context";
import useHttp from "../../hooks/useHttp";
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import ExcelJS from 'exceljs';
import { GoSearch } from 'react-icons/go';
import moment from 'moment';
import { MdCancel } from "react-icons/md";
import axiosInstance from "../../store/axiosInstance";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";

const ClientDoc = () => {
    const [loading, setLoading] = useState(false);
    const { uid } = useParams()
    const [clientOne, setClientOne] = useState({});
    const [documentOne, setDocumentOne] = useState([]);
    const [rejectModal, setRejectModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState("");
    const [reason, setReason] = useState("");
    const [deadline, setDeadline] = useState("");
    const navigate = useHistory();
    const { get, post } = useHttp();

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
                <div className='d-flex flex-column gap-1 p-2' style={{ overflow: "hidden" }}>
                    <span> {row.documentName}</span>
                    <span className='d-flex'>
                        <span className='bg-primary text-white pointer px-2 py-1 rounded-2'
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
                    {row.expirationDate === "null" || null
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
                <span className={`${row.status === 'Pending' ? "bg-warning" : row.status === 'Accepted' ? "bg-success text-white" :
                    row.status === 'Rejected' ? "bg-danger text-white" : "bg-transparent"
                    } px-2 py-1 rounded-pill fw-bold`}
                    style={{ fontSize: "10px" }}>{row.status}</span>
            ),
        },

    ];

    const FetchClient = async () => {
        try {
            const { data } = await get(`/Profiles/${uid}`, { cacheTimeout: 300000 })
            setClientOne(data)


        } catch (error) {
            console.log(error);
        }
        try {
            const { data } = await get(`/Documents/get_all_client_documents?clientId=${uid}`, { cacheTimeout: 300000 })
            setDocumentOne(data.clientDocuments);


        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {

        FetchClient()
    }, []);


    const [documentName, setDocumentName] = useState("");
    const [expire, setExpire] = useState("");
    const [document, setDocument] = useState(null);
    const [loading1, setLoading1] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const allowedExtensions = /(\.pdf|\.doc)$/i;

        if (allowedExtensions.exec(selectedFile.name)) {
            setDocument(selectedFile);
        } else {
            alert('Please select a PDF or DOC file');
        }
    };
    const id = JSON.parse(localStorage.getItem('user'));

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (documentName === "" || document === "") {
            return toast.error("Input Fields marked cannot be empty")
        }

        const formData = new FormData()
        formData.append("CompanyId", id.companyId);
        formData.append("DocumentFile", document);
        formData.append("DocumentName", documentName);
        formData.append("ExpirationDate", expire);
        formData.append("User", clientOne.fullName);
        formData.append("UserRole", 'Client');
        formData.append("Status", "Pending");
        formData.append("UserId", clientOne.profileId);

        try {
            setLoading1(true)
            const { data } = await post(`/Documents/add_document?userId=${id.userId}`,
                formData
            )
            toast.success(data.message)

            setLoading1(false)
            FetchClient();
            setDocumentName("");
            setDocument(null);
            setExpire("");

        } catch (error) {
            console.log(error);
            toast.error(error.message)
            setLoading1(false);

        }
        finally {
            setLoading1(false)
        }
    }
    const downloadLinkRef = useRef(null);
    const handleView = (documentUrl) => {
        window.open(documentUrl, '_blank');
    };

    const handleDownload = (documentUrl, documentName) => {
        downloadLinkRef.current.href = documentUrl;
        downloadLinkRef.current.download = documentName;
        downloadLinkRef.current.click();
    };
    const handleExcelDownload = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet1');

        // Add headers
        const headers = columns.map((column) => column.name);
        sheet.addRow(headers);

        // Add data
        documentOne.forEach((dataRow) => {
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
        const csvData = Papa.unparse(documentOne);
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
        const dataValues = documentOne.map((dataRow) =>
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
                <div className='d-flex gap-1'>
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
                        FetchClient()
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
            confirmButtonColor: '#405189',
            cancelButtonColor: '#C8102E',
            confirmButtonText: 'Confirm',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosInstance.get(`/Documents/accept_document?userId=${id.userId}&id=${e}`,
                    )
                    console.log(res);
                    if (data.status === 'Success') {
                        toast.success(data.message);
                        FetchClient()
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

    const handleRejectModal = (e) => {
        setRejectModal(true)
        setSelectedDocument(e);

    }



    const handleReject = async () => {
        if (reason.trim() === "" || deadline === "") {
            toast.error("provide valid reason and deadline")
        }
        try {
            const { data } = await axiosInstance.post(`/Documents/reject_document?userId=${id.userId}&docid=${selectedDocument}&reason=${reason}&deadline=${deadline}`,
            )
            console.log(data);
            if (data.status === 'Success') {
                toast.success(data.message);
                FetchClient()
            } else {
                toast.error(data.message);
            }


        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)


        }
    }
    const filteredData = documentOne.filter((item) =>
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

            <div className="page-wrapper">
                <Helmet>
                    <title>Client Document Upload</title>
                    <meta name="description" content="" />
                </Helmet>
                <div className="content container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">

                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h4 className="card-title mb-0">Upload Document for {clientOne.fullName} </h4>
                                    <Link to={`/app/profile/client-profile/${uid}/${clientOne.firstName}`} className="card-title mb-0 text-danger fs-3 "> <MdCancel /></Link>
                                </div>
                                <div className="card-body">
                                    <form
                                        onSubmit={handleSubmit}
                                    >
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label className="col-form-label">Select Document <span className="text-danger">*</span></label>
                                                    <input className="form-control" type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        maxsize={1024 * 1024 * 2}
                                                        onChange={handleFileChange}
                                                    />
                                                </div>
                                            </div>



                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label className="col-form-label">Document Name <span className="text-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        onChange={e => setDocumentName(e.target.value)} required
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label className="col-form-label">Expiration Date </label>
                                                    <input className="form-control" type="date" onChange={e => setExpire(e.target.value)} />
                                                </div>
                                            </div>



                                        </div>

                                        <div className="submit-section">
                                            <button className="btn btn-primary rounded submit-btn" type='submit'>

                                                {loading1 ? <div className="spinner-grow text-light" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div> : "Add"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                    data={documentOne}
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
                                <CopyToClipboard text={JSON.stringify(documentOne)}>
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
                            customStyles={customStyles}


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
        </>
    );
}

export default ClientDoc;