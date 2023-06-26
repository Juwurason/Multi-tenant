import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import useHttp from "../../../hooks/useHttp";
import { GoSearch, GoTrashcan } from "react-icons/go";
import { CSVLink } from "react-csv";
import { FaCopy, FaFileCsv, FaFileExcel, FaFilePdf, FaRegEdit } from "react-icons/fa";
import CopyToClipboard from "react-copy-to-clipboard";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import moment from "moment";
import jsPDF from "jspdf";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchIntegration } from "../../../store/slices/IntegrationSlice";
import dayjs from "dayjs";
import Swal from "sweetalert2";


function formatDuration(duration) {
    const durationInTicks = BigInt(duration);
    const durationInMilliseconds = Number(durationInTicks) / 10000; // Convert ticks to milliseconds

    const durationInMinutes = Math.floor(durationInMilliseconds / (1000 * 60));
    const hours = Math.floor(durationInMinutes / 60);
    // const minutes = durationInMinutes % 60;

    return `${hours} Hrs`;
}

const Integration = () => {
    const dispatch = useDispatch();

    // Fetch user data and update the state
    useEffect(() => {
        dispatch(fetchIntegration());
    }, [dispatch]);

    // Access the entire state
    const integration = useSelector((state) => state.integration.data);



    const id = JSON.parse(localStorage.getItem('user'));
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const { post, get } = useHttp();
    const [thirdParty, setThirdParty] = useState("");
    const secretID = useRef(null);
    const clientID = useRef(null);
    const [scope, setScope] = useState("accounting.transactions accounting.settings accounting.contacts payroll.employees payroll.timesheets payroll.settings");
    const [responseUrl, setResponseUrl] = useState("http://test.maxicareplus.com/Report/Auth");

    const [editThirdParty, setEditThirdParty] = useState("");
    const [editSecretID, setEditSecretID] = useState("");
    const [editClientID, setEditClientID] = useState("");
    const [editScope, setEditScope] = useState("");
    const [editResponseUrl, setEditResponseUrl] = useState("");
    const [editId, setEditId] = useState(0);




    const columns = [

        {
            name: 'Third Party',
            selector: row => row.thirdParty,
            sortable: true,
            expandable: true,

        },


        {
            name: 'Secret ID',
            selector: row => row.secretID,
            sortable: true,
            cell: (row) => <span className="long-cell" style={{ overflow: "hidden", cursor: "help" }}
                data-bs-toggle="tooltip" data-bs-placement="top" title={`${row.secretID}`}
            >{row.secretID}</span>,
        },
        {
            name: 'client ID',
            selector: row => row.clientID,
            sortable: true,
            cell: (row) => <span className="long-cell" style={{ overflow: "hidden", cursor: "help" }}
                data-bs-toggle="tooltip" data-bs-placement="top" title={`${row.clientID}`}
            >{row.clientID}</span>,

        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="d-flex gap-1">
                    <button
                        className='btn'
                        title='Edit'
                        onClick={() => handleModal2(row.integrationId)}
                    >
                        <FaRegEdit />
                    </button>
                    <button
                        className='btn'
                        title='Delete'
                        onClick={() => handleDelete(row.integrationId)}
                    >
                        <GoTrashcan />
                    </button>

                </div>
            ),
        },




    ];


    const HandleSubmit = async (e) => {
        e.preventDefault();
        if (thirdParty.current.value === "" || secretID.current.value === "" || clientID.current.value === ""
            || scope.current.value === "" || responseUrl.current.value === ""
        ) {
            return toast.error("Form is not complete")
        }
        setLoading1(true)

        const info = {

            thirdParty: thirdParty,
            secretID: secretID.current.value,
            clientID: clientID.current.value,
            scope: scope,
            responseUrl: responseUrl,
            companyId: id.companyId,

        }
        try {
            const { data } = await post(`/Integrations/add_integration`, info)
            toast.success(data.message)
            dispatch(fetchIntegration());
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
    const HandleEdit = async (e) => {
        e.preventDefault();

        setLoading1(true)

        const info = {
            integrationId: Number(editId),
            thirdParty: editThirdParty,
            secretID: editSecretID,
            clientID: editClientID,
            scope: editScope,
            responseUrl: editResponseUrl,
            companyId: id.companyId,

        }
        try {
            const { data } = await post(`/Integrations/edit/${editId}`, info)
            console.log(data);
            toast.success(data.message)
            setEditModal(false)

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }

    }

    const handleExcelDownload = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet1');

        // Add headers
        const headers = columns.map((column) => column.name);
        sheet.addRow(headers);

        // Add data
        integration.forEach((dataRow) => {
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

    const handleModal2 = async (e) => {
        setEditModal(true);
        try {
            const { data } = await get(`/Integrations/integration_details/${e}`, { cacheTimeout: 300000 });
            console.log(data);
            setEditThirdParty(data.thirdParty);
            setEditSecretID(data.secretID || "");
            setEditClientID(data.clientID || "");
            setEditScope(data.scope || "");
            setEditResponseUrl(data.responseUrl || "");
            setEditId(data.integrationId)
        } catch (error) {
            console.log("Error Fetching Integration details");
            console.log(error);
        } finally {
            setLoading(false)
        }

    }


    const handleCSVDownload = () => {
        const csvData = Papa.unparse(integration);
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
        doc.text("Third Party Integration",
            marginLeft, 40);
        const headers = columns.map((column) => column.name);
        const dataValues = integration.map((dataRow) =>
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
        doc.save("integration.pdf");
    };

    const handleDelete = async (id) => {

        Swal.fire({
            html: `<h3>Are you sure? you want to delete this Third Party Integration</h3>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#405189',
            cancelButtonColor: '#777',
            confirmButtonText: 'Confirm Delete',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await post(`/Integrations/delete/${id}`,
                    )
                    if (data.status === 'Success') {
                        toast.success(data.message);
                        dispatch(fetchIntegration());
                    } else {
                        toast.error(data.message);
                    }


                } catch (error) {
                    toast.error("Ooops😔 Error Occurred")
                    console.log(error);



                }


            }
        })
    }

    const ButtonRow = ({ data }) => {
        return (
            <div className="p-2 d-flex flex-column gap-2" style={{ fontSize: "12px" }}>
                <span>
                    <span className='fw-bold'>Secret ID: </span>
                    <span> {data.secretID}</span>
                </span>
                <span>
                    <span className='fw-bold'>Client ID: </span>
                    <span> {data.clientID}</span>
                </span>
                <span>
                    <span className='fw-bold'>Scope: </span>
                    <span> {data.scope}</span>
                </span>
                <span>
                    <span className='fw-bold'>Response URL: </span>
                    <span> {data.responseUrl}</span>
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

            </div>
        );
    };

    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = integration.filter((item) =>
        item?.thirdParty.toLowerCase().includes(searchText.toLowerCase())
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
                                <input type="text" placeholder="Search integration" className='border-0 outline-none' onChange={handleSearch} />
                                <GoSearch />
                            </div>
                        </div>
                        <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
                            <CSVLink
                                data={integration}
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
                            <CopyToClipboard text={JSON.stringify(integration)}>
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
                                        <select name="" id="" className="form-select" value={thirdParty} onChange={e => setThirdParty(e.target.value)}>
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
                                        <input type="text" className='form-control' value={scope} onChange={e => setScope(e.target.value)} />
                                    </div>
                                </div>

                                <div className="form-group col-md-12">
                                    <label className="col-form-label">ResponseUrl</label>

                                    <div>
                                        <small className="text-success">Copy and paste the below Response Url to your Xero App</small>
                                        <input type="text" className='form-control' value={responseUrl} onChange={e => setResponseUrl(e.target.value)} />
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
                <Modal show={editModal} onHide={() => setEditModal(false)} centered size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title> Edit Integration </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={HandleEdit}>
                            <div className="row">

                                <div className="form-group col-md-12">
                                    <label className="col-form-label">Third Party</label>
                                    <div>
                                        <select name="" id="" className="form-select" value={editThirdParty} onChange={e => setEditThirdParty(e.target.value)}>
                                            <option defaultValue>--Select--</option>
                                            <option value="">Xero</option>
                                        </select>
                                    </div>
                                </div>




                                <div className="form-group col-md-12">
                                    <label className="col-form-label"> SecretID</label>
                                    <div>
                                        <input type="text" className='form-control' value={editSecretID} onChange={e => setEditSecretID(e.target.value)} />
                                    </div>
                                </div>

                                <div className="form-group col-md-12">
                                    <label className="col-form-label">ClientID</label>
                                    <div>
                                        <input type="text" className='form-control' value={editClientID} onChange={e => setEditClientID(e.target.value)} />
                                    </div>
                                </div>

                                <div className="form-group col-md-12">
                                    <label className="col-form-label">Scope</label>
                                    <div>
                                        <small className="text-danger">scopes should be seperated by space</small>
                                        <input type="text" className='form-control' value={editScope} onChange={e => setEditScope(e.target.value)} />
                                    </div>
                                </div>

                                <div className="form-group col-md-12">
                                    <label className="col-form-label">ResponseUrl</label>

                                    <div>
                                        <small className="text-success">Copy and paste the below Response Url to your Xero App</small>
                                        <input type="text" className='form-control' value={editResponseUrl} onChange={e => setEditResponseUrl(e.target.value)} />
                                    </div>
                                </div>


                            </div>
                            <div className="d-flex justify-content-center">
                                <button
                                    // disabled={loading1 ? true : false}
                                    type="submit"
                                    className="btn btn-primary add-btn rounded-2 text-white" >
                                    Save
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