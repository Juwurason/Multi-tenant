import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import useHttp from "../../../hooks/useHttp";
import { GoSearch } from "react-icons/go";
import { CSVLink } from "react-csv";
import { FaCopy, FaFileCsv, FaFileExcel, FaFilePdf } from "react-icons/fa";
import CopyToClipboard from "react-copy-to-clipboard";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import moment from "moment";
import jsPDF from "jspdf";
import dayjs from "dayjs";


function formatDuration(duration) {
    const durationInTicks = BigInt(duration);
    const durationInMilliseconds = Number(durationInTicks) / 10000; // Convert ticks to milliseconds

    const durationInMinutes = Math.floor(durationInMilliseconds / (1000 * 60));
    const hours = Math.floor(durationInMinutes / 60);
    // const minutes = durationInMinutes % 60;

    return `${hours} Hrs`;
}

const Invoice = () => {
    const id = JSON.parse(localStorage.getItem('user'));
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [profileId, setProfileId] = useState(0);
    const { post, get } = useHttp();
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [type, setType] = useState('');
    const [invoice, setInvoice] = useState([]);
    const [name, setName] = useState({});

    const columns = [

        {
            name: 'Description',
            selector: row => row.description,
            sortable: true,
            cell: (row) => <span className="long-cell" style={{ overflow: "hidden", cursor: "pointer" }}
                data-bs-toggle="tooltip" data-bs-placement="top" title={`${row.description} (${row.itemNumber})`}
            >{row.description} ({row.itemNumber})</span>
        },


        // {
        //     name: 'Date',
        //     selector: row => row.date,
        //     sortable: true,
        //     expandable: true,
        //     cell: (row) => (
        //         <span style={{ overflow: "hidden" }}> {moment(row.dateCreated).format('LLL')}</span>
        //     ),
        // },
        {
            name: 'Day/Date',
            selector: row => row.date ? dayjs(row.date).format('ddd, MMM D, YYYY') : row.day,
            sortable: true
        },
        {
            name: 'Actual Hours',
            selector: row => formatDuration(row.duration),
            sortable: true
        },
        {
            name: 'Agreed Hours',
            selector: row => row.agreedDuration,
            sortable: true
        },
        {
            name: 'Unit Price',
            selector: row => row.unitPrice,
            sortable: true
        },
        {
            name: 'Amount ($)',
            selector: row => row.amount,
            sortable: true
        },
        {
            name: 'Total Km',
            selector: row => row.totalKm,
            sortable: true
        },



    ];

    const FetchData = async () => {
        try {
            const clientResponse = await get(`/Profiles?companyId=${id.companyId}`, { cacheTimeout: 300000 });
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
        FetchData()
    }, []);

    const FetchInvoice = async (e) => {
        e.preventDefault();
        if (type.trim() === "" || profileId === 0) {
            return toast.error("Select a client and support type")
        }
        e.preventDefault();
        setLoading1(true);
        try {
            const { data } = await get(`/Invoice/load_invoice?userId=${id.userId}&fromDate=${dateFrom}&toDate=${dateTo}&clientId=${profileId}&type=${type}`, { cacheTimeout: 300000 });
            if (data.status === "Success") {
                console.log(data);
                toast.success(data.message);
                setInvoice(data?.invoiceItems?.grouped_Agreed_Actual);
                setName(data?.invoiceItems);
            }
            setLoading1(false)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading1(false)
        }
    }


    const handleExcelDownload = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet1');

        // Add headers
        const headers = columns.map((column) => column.name);
        sheet.addRow(headers);

        // Add data
        invoice.forEach((dataRow) => {
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



    const handleCSVDownload = () => {
        const csvData = Papa.unparse(invoice);
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "data.csv");
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
        doc.text(`Invoice for ${name?.profile?.fullName} from ${moment(dateFrom).format("LLL")} to ${moment(dateTo).format("LLL")}`,
            marginLeft, 40);
        const headers = columns.map((column) => column.name);
        const dataValues = invoice.map((dataRow) =>
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
        doc.save("invoiceReport.pdf");
    };
    const ButtonRow = ({ data }) => {
        return (
            <div className="p-2 d-flex flex-column gap-2" style={{ fontSize: "12px" }}>
                <span>
                    <span className='fw-bold'>Description: </span>
                    <span> {data.description} ({data.itemNumber})</span>
                </span>
            </div>
        );
    };

    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = invoice.filter((item) =>
        item.description.toLowerCase().includes(searchText.toLowerCase())
    );


    return (



        <div className="page-wrapper">
            <Helmet>
                <title>Invoice - Promax Care</title>
                <meta name="description" content="Inbox" />
            </Helmet>
            {/* Page Content */}
            <div className="content container-fluid">
                {/* Page Header */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Invoice</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Invoice</li>
                            </ul>
                        </div>

                    </div>
                </div>

                {/* /Page Content start */}


                <div className="row">
                    <div className="col-md-12">
                        <div className="card">

                            <div className="card-body">
                                <form onSubmit={FetchInvoice} >
                                    <div className="row align-items-center py-2">
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="col-form-label">Select Client</label>
                                                <div>
                                                    <select className="form-select" onChange={e => setProfileId(e.target.value)} required>
                                                        <option defaultValue hidden>--Select a Client--</option>

                                                        {
                                                            clients.map((data, index) =>
                                                                <option value={data.profileId} key={index}>{data.fullName}</option>)
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="col-form-label">Date From</label>
                                                <input className="form-control" type="datetime-local"
                                                    onChange={e => setDateFrom(e.target.value)} required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="col-form-label">Date To</label>
                                                <input className="form-control" type="datetime-local"
                                                    onChange={e => setDateTo(e.target.value)} required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="col-form-label">Support Type</label>
                                                <div>
                                                    <select className="form-select" onChange={e => setType(e.target.value)} required>
                                                        <option defaultValue hidden>--Select Type--</option>
                                                        <option value="Yes">Based on Schedule of Support</option>
                                                        <option value="No">Not Based on Schedule of Support</option>

                                                    </select>
                                                </div>
                                            </div>
                                        </div>



                                        <div className="col-auto mt-3">
                                            <div className="form-group">
                                                <button className="btn btn-info rounded-2 add-btn text-white" type='submit'

                                                >
                                                    {
                                                        loading1 ?
                                                            <div className="spinner-grow text-white" role="status">
                                                                <span className="sr-only">Loading...</span>
                                                            </div>

                                                            :


                                                            "Load invoice"
                                                    }

                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>

                </div>



                {
                    invoice.length <= 0 ? "" :
                        <div className="text-center"> <h5>Invoice for {name?.profile?.fullName} from
                            <span> {moment(dateFrom).format("LLL")} </span> to <span> {moment(dateTo).format("LLL")} </span>
                        </h5></div>

                }


                {
                    invoice.length <= 0 ?
                        "" :

                        <div className='mt-4 border'>



                            <div className="row px-2 py-3">

                                <div className="col-md-3">
                                    <div className='d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                                        <input type="text" placeholder="Search invoice" className='border-0 outline-none' onChange={handleSearch} />
                                        <GoSearch />
                                    </div>
                                </div>
                                <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
                                    <CSVLink
                                        data={invoice}
                                        filename={"data.csv"}

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
                                    <CopyToClipboard text={JSON.stringify(invoice)}>
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
                                invoicePending={loading}
                                invoiceComponent={<div className='text-center fs-1'>
                                    <div className="spinner-grow text-secondary" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>}
                                responsive
                                paginationTotalRows={filteredData.length}
                                expandableRows
                                expandableRowsComponent={ButtonRow}


                            />

                        </div>
                }








                {/* /Page Content end */}

            </div>





        </div>

    );
}

export default Invoice;