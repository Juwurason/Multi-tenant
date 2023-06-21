import React, { useEffect, useRef, useState } from "react";
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
import { Modal } from "react-bootstrap";


function formatDuration(duration) {
    const durationInTicks = BigInt(duration);
    const durationInMilliseconds = Number(durationInTicks) / 10000; // Convert ticks to milliseconds

    const durationInMinutes = Math.floor(durationInMilliseconds / (1000 * 60));
    const hours = Math.floor(durationInMinutes / 60);
    // const minutes = durationInMinutes % 60;

    return `${hours} Hrs`;
}

const Integration = () => {
    const id = JSON.parse(localStorage.getItem('user'));
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [profileId, setProfileId] = useState(0);
    const { post, get } = useHttp();
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [type, setType] = useState('');
    const [invoice, setInvoice] = useState([]);
    const [name, setName] = useState({});
    const thirdParty = useRef(null);
    const secretID = useRef(null);
    const clientID = useRef(null);
    const scope = useRef("accounting.transactions accounting.settings accounting.contacts payroll.employees payroll.timesheets payroll.settings");
    const responseUrl = useRef("http://test.maxicareplus.com/Report/Auth");



    const columns = [

        {
            name: 'Description',
            selector: row => row.description,
            sortable: true,
            cell: (row) => <span className="long-cell" style={{ overflow: "hidden", cursor: "pointer" }}
                data-bs-toggle="tooltip" data-bs-placement="top" title={`${row.description} (${row.itemNumber})`}
            >{row.description} ({row.itemNumber})</span>
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

    const HandleSubmit = async () => {
        if (thirdParty.current.value === "" || secretID.current.value === "" || clientID.current.value === ""
            || scope.current.value === "" || responseUrl.current.value === ""
        ) {
            toast.error("Complete Form")
        }
        setLoading1(true)

        const info = {
            thirdParty: thirdParty.current.value,
            secretID: secretID.current.value,
            clientID: clientID.current.value,
            scope: scope.current.value,
            responseUrl: responseUrl.current.value,
            companyId: id.companyId,

        }
        try {
            const { data } = await post(`/Integrations/add_integration`, info)
            console.log(data);
            toast.success(data.message)
            setShowModal(false)

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
        finally {
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
                <title>Third Party Integration - Promax Care</title>
                <meta name="description" content="Inbox" />
            </Helmet>
            {/* Page Content */}
            <div className="content container-fluid">
                {/* Page Header */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Third Party Integration</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Third Party Integration</li>
                            </ul>
                        </div>

                    </div>
                </div>

                {/* /Page Content start */}



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
                        <div className='col-md-4'>

                            <button onClick={() => setShowModal(true)} className="btn btn-info add-btn rounded-2 text-white">Add New Integration</button>
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


                <Modal show={showModal} onHide={() => setShowModal(false)} centered size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title> Add Integration </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={HandleSubmit}>
                            <div className="row">

                                <div className="form-group col-md-12">
                                    <label className="col-form-label">Third Party</label>
                                    <div>
                                        <select name="" id="" className="form-select" ref={thirdParty}>
                                            <option defaultValue>--Select--</option>
                                            <option value="">Xero</option>
                                        </select>
                                    </div>
                                </div>




                                <div className="form-group col-md-12">
                                    <label className="col-form-label"> SecretID</label>
                                    <div>
                                        <input type="text" className='form-control' ref={secretID} />
                                    </div>
                                </div>

                                <div className="form-group col-md-12">
                                    <label className="col-form-label">ClientID</label>
                                    <div>
                                        <input type="text" className='form-control' ref={clientID} />
                                    </div>
                                </div>

                                <div className="form-group col-md-12">
                                    <label className="col-form-label">Scope</label>
                                    <div>
                                        <small className="text-danger">scopes should be seperated by space</small>
                                        <input type="text" className='form-control' ref={scope} />
                                    </div>
                                </div>

                                <div className="form-group col-md-12">
                                    <label className="col-form-label">ResponseUrl</label>

                                    <div>
                                        <small className="text-success">Copy and paste the below Response Url to your Xero App</small>
                                        <input type="text" className='form-control' ref={responseUrl} />
                                    </div>
                                </div>


                            </div>
                            <div className="d-flex justify-content-center">
                                <button
                                    // disabled={loading1 ? true : false}
                                    className="btn btn-primary add-btn rounded-2 text-white" >
                                    Add
                                </button>
                            </div>
                        </form>


                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>






                {/* /Page Content end */}

            </div>





        </div>

    );
}

export default Integration;