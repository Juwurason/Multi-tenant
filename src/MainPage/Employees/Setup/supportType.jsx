
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import { FaCopy, FaFileCsv, FaFileExcel, FaFilePdf, } from "react-icons/fa";
import ExcelJS from 'exceljs';
import { toast } from 'react-toastify';
import { GoSearch, GoTrashcan } from 'react-icons/go';
import Swal from 'sweetalert2';
import { useCompanyContext } from '../../../context';
import useHttp from '../../../hooks/useHttp';
import { Modal } from 'react-bootstrap';
import dayjs from 'dayjs';


const SupportType = () => {
    const { loading, setLoading } = useCompanyContext()
    const id = JSON.parse(localStorage.getItem('user'));
    const [showModal, setShowModal] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const { get, post } = useHttp();
    const [supportType, setSupportType] = useState([]);

    const columns = [

        {
            name: 'Item Number',
            selector: row => row.itemNumber,
            sortable: true,

        },
        {
            name: 'Item Name',
            selector: row => row.itemName,
            sortable: true,
            cell: (row) => <span className="long-cell" style={{ overflow: "hidden", cursor: "pointer" }}
                data-bs-toggle="tooltip" data-bs-placement="top" title={`${row.itemName}`}
            >{row.itemName}</span>,

        },

        {
            name: 'Unit',
            selector: row => row.unit,
            sortable: true
        },
        {
            name: 'National',
            selector: row => row.national,
            sortable: true
        },
        {
            name: 'Remote',
            selector: row => row.remote,
            sortable: true
        },
        {
            name: 'Very Remote',
            selector: row => row.veryRemote,
            sortable: true
        },


    ];




    const FetchData = async () => {
        setLoading(true)
        try {
            const { data } = await get(`/Invoice/get_all_support_type`, { cacheTimeout: 300000 });
            setSupportType(data);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
        finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        FetchData()
    }, []);

    const handleActivityClick = () => {
        setShowModal(true);
    };

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
        supportType.forEach((dataRow) => {
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
            link.download = 'supportType.xlsx';
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };



    const handleCSVDownload = () => {
        const csvData = Papa.unparse(supportType);
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "supportType.csv");
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
        doc.text("supportType Table", marginLeft, 40);
        const headers = columns.map((column) => column.name);
        const dataValues = supportType.map((dataRow) =>
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
        doc.save("supportType.pdf");
    };

    const ButtonRow = ({ data }) => {
        return (
            <div className="p-2 d-flex flex-column gap-2" style={{ fontSize: "12px" }}>
                <span>
                    <span className='fw-bold'>Item Name: </span>
                    <span> {data.itemName}</span>
                </span>

                <span>
                    <span className='fw-bold'>Date Created: </span>
                    <span>
                        {dayjs(data.dateCreated).format('DD/MM/YYYY HH:mm:ss')}
                    </span>
                </span>
                <span>
                    <span className='fw-bold'>Date Modified: </span>
                    <span>
                        {dayjs(data.dateModified).format('DD/MM/YYYY HH:mm:ss')}
                    </span>
                </span>
                {/* <div>
                    <span className='fw-bold'>Actions: </span>
                    <button className="btn text-primary" style={{ fontSize: "12px" }}>
                        Edit
                    </button> |
                    <button className="btn text-danger fw-bold" style={{ fontSize: "12px" }}>
                        Delete
                    </button>
                </div> */}

            </div>
        );
    };
    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = supportType.filter((item) =>
        item.itemName.toLowerCase().includes(searchText.toLowerCase())
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
        <div className="page-wrapper">
            <Helmet>
                <title>Support Type</title>
                <meta name="description" content="Support Type" />
            </Helmet>
            {/* Page Content */}
            <div className="content container-fluid">
                {/* Page Header */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Support Type</h3>
                            {id.role === "CompanyAdmin" ? <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Support Type</li>
                            </ul> : ""}
                        </div>
                    </div>
                </div>

                {/* Search Filter */}

                <div className='mt-4 border'>
                    <div className="row px-2 py-3">

                        <div className="col-md-3">
                            <div className='d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                                <input type="text" placeholder="Search..." className='border-0 outline-none' onChange={handleSearch} />
                                <GoSearch />
                            </div>
                        </div>
                        <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
                            <CSVLink
                                data={supportType}
                                filename={"supportType.csv"}

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
                            <CopyToClipboard text={JSON.stringify(supportType)}>
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
                            {/* <Link to="/administrator/createClient" className="btn btn-info add-btn rounded-2">
                Add New Holiday</Link> */}
                            {/* <button className="btn btn-info add-btn rounded-2 text-white" onClick={handleActivityClick}>Add Support Type</button> */}
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

                    {/* Modal */}
                    <Modal show={showModal} onHide={() => setShowModal(false)} centered size='lg'>
                        <Modal.Header closeButton>
                            <Modal.Title> Add Support Type </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <div className="row">

                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Item Number</label>
                                        <div>
                                            <input type="text" className='form-control' />
                                        </div>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Item Name</label>
                                        <div>
                                            <input type="text" className='form-control' />
                                        </div>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Unit</label>
                                        <div>
                                            <input type="text" className='form-control' />
                                        </div>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">National</label>
                                        <div>
                                            <input type="text" className='form-control' />
                                        </div>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Remote</label>
                                        <div>
                                            <input type="text" className='form-control' />
                                        </div>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Very Remote</label>
                                        <div>
                                            <input type="text" className='form-control' />
                                        </div>
                                    </div>


                                </div>
                            </div>


                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                disabled={loading1 ? true : false}
                                className="btn btn-primary add-btn rounded-2 text-white" >
                                {loading1 ? <div className="spinner-grow text-light" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : "Create"}
                            </button>
                        </Modal.Footer>
                    </Modal>

                    {/*Edit Modal */}


                </div>


                {/* </div> */}


            </div>

        </div>
    );
}

export default SupportType;
