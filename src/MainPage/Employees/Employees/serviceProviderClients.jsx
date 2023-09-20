
import React, { Component, useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../../index.css";
import Offcanvas from '../../../Entryfile/offcanvance';
import useHttp from '../../../hooks/useHttp';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import { GoEye, GoSearch, GoTrashcan } from 'react-icons/go';
import { FaCopy, FaFileCsv, FaFileExcel, FaFilePdf, } from "react-icons/fa";
import ExcelJS from 'exceljs';
import { MdCancel } from 'react-icons/md';

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

const cliClients = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const { uid, id } = useParams();
    const [details, setDetails] = useState('')
    const [cli, setCliName] = useState([])
    const { get, post } = useHttp();
    const [loading, setLoading] = useState(false);

    const FetchSchedule = async () => {
        setLoading(true)
        try {
            const { data } = await get(`/ClientReferrals/get_referral_clients?email=${uid}`, { cacheTimeout: 300000 });
            // console.log(data);
            setCliName(data);
            // setDetails(data);
            setLoading(false);
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
        finally {
            setLoading(false)
        }


    };
    useEffect(() => {
        FetchSchedule()
    }, []);

    const columns = [
        // {
        //     name: '#',
        //     cell: (row, index) => index + 1
        // },

        {
            name: 'FullName',
            selector: row => row.fullName,
            sortable: true,

        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,

        },

        {
            name: 'Gender',
            selector: row => row.gender,
            sortable: true,

        },
        

        {
            name: 'Phone',
            selector: row => row.contactNumber,
            sortable: true,

        }


    ];

    const handleExcelDownload = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet1');

        // Add headers
        const headers = columns.map((column) => column.name);
        sheet.addRow(headers);

        // Add data
        cli.forEach((dataRow) => {
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
            link.download = 'cli.xlsx';
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };



    const handleCSVDownload = () => {
        const csvData = Papa.unparse(cli);
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "cli.csv");
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
        doc.text("cli Table", marginLeft, 40);
        const headers = columns.map((column) => column.name);
        const dataValues = cli.map((dataRow) =>
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
        doc.save("cli.pdf");
    };

    // const ButtonRow = ({ data }) => {
        // return (
        //     <div className="p-2 d-flex gap-1 flex-column " style={{ fontSize: "12px" }}>
        //         <div ><span className='fw-bold'>Email: </span> {data.email}</div>
        //         <div ><span className='fw-bold'>Phone: </span> {data.phone}</div>
        //         {/* <div ><span className='fw-bold'>View Clients</span> </div> */}
        //         <Link
        //       className='fw-bold text-info'
        //       title='View Clients'
        //       to={`/app/employee/provider-list/${data.email}`}
        //         >
        //      View Clients
        //     </Link>

        //     </div>
        // );
    // };
    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = cli.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
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
                    <title>Clients</title>
                    <meta name="description" content="Clients-List" />
                </Helmet>
                {/* Page Content */}
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <h3 className="page-title">Referred Clients</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                    {/* <li className="breadcrumb-item active"><Link to="/app/reports/attendance-reports">Attendance</Link></li> */}
                                    <li className="breadcrumb-item active">Referred Clients</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h4 className="card-title mb-0">Clients Reffered by {uid}</h4>
                                    <Link to="/app/employee/provider" className="card-title mb-0 text-danger fs-3 "> <MdCancel /></Link>
                                </div>
                                <div className='mt-4 border'>
                                    <div className="row px-2 py-3">

                                        <div className="col-md-3">
                                            <div className='d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                                                <input type="text" placeholder="Search..." className='border-0 outline-none' onChange={handleSearch} />
                                                <GoSearch />
                                            </div>
                                        </div>
                                        <div className='col-md-8 d-flex  justify-content-center align-items-center gap-4'>
                                            <CSVLink
                                                data={cli}
                                                filename={"cli.csv"}

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
                                            <CopyToClipboard text={JSON.stringify(cli)}>
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
                                        // expandableRows
                                        // expandableRowsComponent={ButtonRow}
                                        paginationTotalRows={filteredData.length}
                                        customStyles={customStyles}
                                        responsive

                                    />


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Page Content */}
            </div>
            <Offcanvas />
        </>

    );

}


export default cliClients;
