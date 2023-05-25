import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import { FaCopy, FaFileCsv, FaFileExcel, FaFilePdf, FaEye } from "react-icons/fa";
import ExcelJS from 'exceljs';
import { GoSearch } from 'react-icons/go';
import moment from 'moment';
import { MdCancel } from "react-icons/md";
import useHttp from "../../../hooks/useHttp";
import { useCompanyContext } from "../../../context";
const StaffDocum = () => {

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
    const { loading, setLoading } = useCompanyContext();
    const { uid } = useParams()
    const [staffOne, setStaffOne] = useState({});
    const [documentOne, setDocumentOne] = useState([]);
    const navigate = useHistory();


    const { get, post } = useHttp()
    const FetchStaff = async () => {
        setLoading(true)
        try {
            const { data } = await get(`/Staffs/${uid}`, { cacheTimeout: 300000 })

            setStaffOne(data)

        } catch (error) {
            console.log(error);
        }
        try {
            const { data } = await get(`Documents/get_all_staff_documents?staffId=${uid}`, { cacheTimeout: 300000 })
            setDocumentOne(data.staffDocuments)

        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        FetchStaff()
    }, [])


    const [documentName, setDocumentName] = useState(null)
    const [expire, setExpire] = useState(null)
    const [document, setDocument] = useState(null)

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
        setLoading(true);
        e.preventDefault()
        if (documentName === "" || document === "") {
            return toast.error("Fields marked red cannot be empty")
        }

        const formData = new FormData()
        formData.append("CompanyId", id.companyId);
        formData.append("DocumentFile", document);
        formData.append("DocumentName", documentName);
        formData.append("ExpirationDate", expire);
        formData.append("User", staffOne.fullName);
        formData.append("UserRole", 'Staff');
        formData.append("Status", "Pending");
        formData.append("UserId", staffOne.staffId);

        try {
            const { data } = await post(`/Staffs/document_upload?userId=${id.userId}`,
                formData
            )
            toast.success(data.message)

            setLoading(false)
            FetchStaff();
            setDocumentName("");
            setDocument(null);
            setExpire("");

        } catch (error) {
            console.log(error);
            toast.error(error.message)
            setLoading(false);

        }
        finally {
            setLoading(false)
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
            <div className="p-4">
                <table className='table'>

                    <thead>
                        <tr>
                            <th>User created</th>
                            <th>Date Created</th>
                            <th>Date Modified</th>
                            <th>Actions </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{data.createdBy}</td>
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
                                        className='bg-danger text-white pointer px-2 py-1 rounded-pill fw-bold' style={{ fontSize: "10px" }}
                                        title='Reject'
                                    // onClick={() => handleDelete(row.documentId)}
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
                    <title>Staff Document Upload</title>
                    <meta name="description" content="" />
                </Helmet>
                <div className="content container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">

                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h4 className="card-title mb-0">Upload Document for {staffOne.fullName} </h4>
                                    <Link to={`/administrator/staffProfile/${uid}/${staffOne.firstName}`} className="card-title mb-0 text-danger fs-3 "> <MdCancel /></Link>
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
                                                        maxSize={1024 * 1024 * 2}
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
                                                    <label className="col-form-label">Expiration Date</label>
                                                    <input className="form-control" type="date" onChange={e => setExpire(e.target.value)} />
                                                </div>
                                            </div>



                                        </div>

                                        <div className="submit-section">
                                            <button className="btn btn-primary submit-btn" type='submit'>

                                                {loading ? <div className="spinner-grow text-light" role="status">
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
                            responsive

                        />

                    </div>
                </div>
            </div>
        </>
    );
}

export default StaffDocum;