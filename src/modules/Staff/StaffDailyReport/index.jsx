
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import { FaCopy, FaFileCsv, FaFileExcel, FaFilePdf, FaRegFileAlt, } from "react-icons/fa";
import ExcelJS from 'exceljs';
import { toast } from 'react-toastify';
import { GoEye, GoSearch, GoTrashcan } from 'react-icons/go';
import { SlSettings } from 'react-icons/sl'
import Swal from 'sweetalert2';
import { useCompanyContext } from '../../../context';
import useHttp from '../../../hooks/useHttp';
import dayjs from 'dayjs';
import moment from 'moment';

function formatDuration(duration) {
    if (duration) {
        const durationInMilliseconds = duration / 10000; // Convert ticks to milliseconds

        const durationInMinutes = Math.floor(durationInMilliseconds / (1000 * 60));
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;

        return `${hours} Hrs ${minutes} min`;
    }

    return "0 Hrs 0 min"; // Return an empty string if duration is not available
}



const StaffDailyReport = () => {
    const { loading, setLoading } = useCompanyContext()
    const id = JSON.parse(localStorage.getItem('user'));
    const staffProfile = JSON.parse(localStorage.getItem('staffProfile'));
    const [ticket, setTicket] = useState([]);

    const { get, post } = useHttp();

    const columns = [

        {
            name: 'Staff',
            selector: row => row.staff.fullName,
            sortable: true,
        },
        {
            name: 'ClockIn',
            selector: row => moment(row.clockIn).format('lll'),
            sortable: true,
        },
        {
            name: 'Duration',
            selector: row => formatDuration(row.duration),
            sortable: true,
        },
        {
            name: 'ClockOut',
            selector: row => moment(row.clockOut).format('lll'),
            sortable: true,
        },

    ];







    const FetchTicket = async () => {
        setLoading(true)
        try {
            const { data } = await get(`/StaffAttendances/get_staff_attendances?staffId=${staffProfile.staffId}`, { cacheTimeout: 300000 });
            // console.log(data)
            setTicket(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false)
        } finally {
            setLoading(false)
        }

    };
    useEffect(() => {
        FetchTicket()
    }, []);



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
        ticket.forEach((dataRow) => {
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
            link.download = 'ticket.xlsx';
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };



    const handleCSVDownload = () => {
        const csvData = Papa.unparse(ticket);
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "ticket.csv");
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
        doc.text("ticket Table", marginLeft, 40);
        const headers = columns.map((column) => column.name);
        const dataValues = ticket.map((dataRow) =>
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
        doc.save("ticket.pdf");
    };


    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = ticket.filter((item) =>
        item.staff.fullName.toLowerCase().includes(searchText.toLowerCase())
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


   

    const ButtonRow = ({ data }) => {
        return (
            <div className="p-2 d-flex gap-1 flex-column " style={{ fontSize: "12px" }}>
                <div><span className='fw-bold'>Staff: </span>{data.staff.fullName} </div>
                <div ><span className='fw-bold'>Total Km: </span> {data.endKm - data.startKm}</div>
                <div ><span className='fw-bold'>Date Created: </span> {moment(data.dateCreated).format('lll')}</div>
                <div>
                    <Link to={`/staff/staff/new-report-edit/${data.staffAttendanceId}`} className="btn text-info fw-bold" style={{ fontSize: "12px" }} 
        
                    >
                        Edit
                    </Link> |
                    <Link to={`/staff/staff/staff-report-details/${data.staffAttendanceId}`}
                    // onClick={() => handleDelete(data.documentId)}
                     className="btn text-info fw-bold" style={{ fontSize: "12px" }}>
                        Details
                    </Link>
                </div>

            </div>
        );


    };



    return (
        <div className="page-wrapper">
            <Helmet>
                <title>Staff Report</title>
                <meta name="description" content="Staff Report" />
            </Helmet>
            {/* Page Content */}
            <div className="content container-fluid">
                {/* Page Header */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Staff Report</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/staff/staff/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Staff Report</li>
                            </ul>
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
                                data={ticket}
                                filename={"ticket.csv"}

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
                            <CopyToClipboard text={JSON.stringify(ticket)}>
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

                            <Link to={'/staff/staff/new-report'} className="btn btn-info add-btn rounded-2 text-white">
                                Add New Report
                            </Link>
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


                {/* </div> */}


            </div>

        </div>
    );
}

export default StaffDailyReport;
