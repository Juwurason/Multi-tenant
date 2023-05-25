
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
import { SlSettings } from 'react-icons/sl'
import Swal from 'sweetalert2';
import { useCompanyContext } from '../../../context';
import useHttp from '../../../hooks/useHttp';
import { Modal } from 'react-bootstrap';
import dayjs from 'dayjs';
import { async } from '@babel/runtime/helpers/regeneratorRuntime';


const SupportType = () => {
    const { loading, setLoading } = useCompanyContext()
    const id = JSON.parse(localStorage.getItem('user'));
    const [getHoli, setGetHoli] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [editpro, setEditPro] = useState({})
    const [clients, setClients] = useState([]);
    const { get, post } = useHttp();

    const columns = [
        {
            name: '#',
            cell: (row, index) => index + 1
        },

        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'Date Created',
            selector: row => dayjs(row.dateCreated).format('YYYY-MM-DD'),
            sortable: true
        },
        {
            name: 'Date Modified',
            selector: row => dayjs(row.dateModified).format('DD/MM/YYYY HH:mm:ss'),
            sortable: true
        },

        {
            name: "Actions",
            cell: (row) => (
                <div className="d-flex gap-1">
                    <button
                        className="btn"
                        title='edit'
                        onClick={() => handleEdit(row.holidayId)}
                    >
                        <SlSettings />
                    </button>
                    <button
                        className='btn'
                        title='Delete'
                        onClick={() => handleDelete(row)}
                    >
                        <GoTrashcan />
                    </button>

                </div>
            ),
        },

    ];

    const [days, setDays] = useState({
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false
    });

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setDays((prevDays) => ({ ...prevDays, [name]: checked }));
    };

    const handleEdit = async (e) => {
        // console.log(e);
        setEditModal(true);
        try {
            setLoading(true)
            const { data } = await get(`/SetUp/holiday_details/${e}`, { cacheTimeout: 300000 });
            // console.log(data);
            setEditPro(data);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        } finally {
            setLoading(false)
        }
    };

    function handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        const newValue = value === "" ? "" : value;
        setEditPro({
            ...editpro,
            [name]: newValue
        });
    }



    const FetchClient = async () => {
        setLoading(true)
        try {
            const { data } = await get(`/SetUp/get_public_holidays`, { cacheTimeout: 300000 });
            // console.log(data);
            //   setGetHoli(data);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        } finally {
            setLoading(false)
        }

        try {
            const { data } = await get(`/Profiles?companyId=${id.companyId}`, { cacheTimeout: 300000 });
            // console.log(data);
            setClients(data);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        FetchClient()
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
        getHoli.forEach((dataRow) => {
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
            link.download = 'getHoli.xlsx';
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };



    const handleCSVDownload = () => {
        const csvData = Papa.unparse(getHoli);
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "getHoli.csv");
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
        doc.text("getHoli Table", marginLeft, 40);
        const headers = columns.map((column) => column.name);
        const dataValues = getHoli.map((dataRow) =>
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
        doc.save("getHoli.pdf");
    };

    const ButtonRow = ({ data }) => {
        return (
            <div className="p-4">
                {data.name}

            </div>
        );
    };
    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = getHoli.filter((item) =>
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

    const handleDelete = async (e) => {
        Swal.fire({
            html: `<h3>Are you sure? you want to delete Public Holiday "${e.name}"</h3>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#00AEEF',
            cancelButtonColor: '#777',
            confirmButtonText: 'Confirm Delete',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await post(`/SetUp/delete_holiday/${e.holidayId}`,
                        // { userId: id.userId }
                    )
                    if (data.status === 'Success') {
                        toast.success(data.message);
                        FetchClient();
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

    const [holidayName, setHolidayName] = useState('')
    const [holidayDate, setHolidayDate] = useState('')


    const addHoliday = async () => {

        if (holidayName === '' || holidayDate.length === 0) {
            return toast.error("Input Fields cannot be empty")
        }

        setLoading1(true)
        const info = {
            name: holidayName,
            date: holidayDate
        }
        try {
            const { data } = await post(`/SetUp/add_holiday`, info)
            // console.log(data);
            toast.success(data.message)
            setShowModal(false)
            FetchClient()
            setLoading1(false)
            setHolidayName('')
            setHolidayDate('')
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
        finally {
            setLoading1(false)
        }
    }

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
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Support Type</li>
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
                                data={getHoli}
                                filename={"getHoli.csv"}

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
                            <CopyToClipboard text={JSON.stringify(getHoli)}>
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
                            <button className="btn btn-info add-btn rounded-2 text-white" onClick={handleActivityClick}>Add Support Type</button>
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
                    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title> Add Support Type </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <div className="row">

                                    <div className="form-group">
                                        <label className="col-form-label">Item Number</label>
                                        <div>
                                            <input type="text" className='form-control' onChange={e => setHolidayName(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="col-form-label">Item Name</label>
                                        <div>
                                            <input type="text" className='form-control' onChange={e => setHolidayName(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="col-form-label">Unit</label>
                                        <div>
                                            <input type="text" className='form-control' onChange={e => setHolidayName(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="col-form-label">National</label>
                                        <div>
                                            <input type="text" className='form-control' onChange={e => setHolidayName(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="col-form-label">Remote</label>
                                        <div>
                                            <input type="text" className='form-control' onChange={e => setHolidayName(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="col-form-label">Very Remote</label>
                                        <div>
                                            <input type="text" className='form-control' onChange={e => setHolidayName(e.target.value)} />
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
                    <Modal show={editModal} onHide={() => setEditModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>View Holiday</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <div className="row">
                                    <div className="">
                                        <div className="form-group">
                                            <label className="col-form-label">Name of Holiday</label>
                                            <div>
                                                <input type="text" className='form-control' name="name" value={editpro.name || ''} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-form-label">Date</label>
                                        <div><input className="form-control date" type="date" name="date" value={editpro.date || ''} onChange={handleInputChange} /></div>
                                    </div>

                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            {/* <button className="btn btn-primary add-btn rounded-2 text-white" onClick={addHoliday}>Save</button> */}
                            <button className="btn btn-secondary" onClick={() => setEditModal(false)}>Close</button>
                        </Modal.Footer>
                    </Modal>

                </div>


                {/* </div> */}


            </div>

        </div>
    );
}

export default SupportType;
