
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import { FaCopy, FaFileCsv, FaFileExcel, FaLongArrowAltLeft, FaLongArrowAltRight, FaFilePdf, } from "react-icons/fa";
import ExcelJS from 'exceljs';
import { toast } from 'react-toastify';
import { GoSearch, GoTrashcan } from 'react-icons/go';
import { SlSettings } from 'react-icons/sl'
import Swal from 'sweetalert2';
import { useCompanyContext } from '../../../context';
import useHttp from '../../../hooks/useHttp';
import { Modal } from 'react-bootstrap';
import dayjs from 'dayjs';
import { MultiSelect } from 'react-multi-select-component';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClient } from '../../../store/slices/ClientSlice';
import { fetchSupportSchedule } from '../../../store/slices/SupportSchedule';
const options = [
    { label: "Sunday", value: "Sunday" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },



];


const ScheduleSupport = () => {
    const { loading, setLoading } = useCompanyContext()
    const id = JSON.parse(localStorage.getItem('user'));
    const [showModal, setShowModal] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const { get, post } = useHttp();
    const [supportType, setSupportType] = useState([]);
    const [selectedSupportType, setSelectedSupportType] = useState(0);
    const [price, setPrice] = useState(''); // Price value based on the selected support type
    const [supportNumber, setSupportNumber] = useState(''); // Support Number value based on the selected support type
    const [supportName, setSupportName] = useState(''); // Support Name value based on the selected support type
    const quantity = useRef(null);
    const [selected, setSelected] = useState([]);
    const [profileId, setProfileId] = useState(0);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchClient(id.companyId));
        dispatch(fetchSupportSchedule(id.companyId));
    }, [dispatch, id.companyId]);

    // Access the entire state
    const clients = useSelector((state) => state.client.data);
    const supportSchedule = useSelector((state) => state.supportSchedule.data);

    const handleSelected = (selectedOptions) => {
        setSelected(selectedOptions);
    }

    const selectedValues = selected.map(option => option.label).join(', ');

    const history = useHistory();
    const goBack = () => {
        history.goBack(); // Go back in history
    };

    const goForward = () => {
        history.goForward(); // Go forward in history
    };

    const columns = [
        // {
        //     name: '#',
        //     cell: (row, index) => index + 1
        // },

        {
            name: 'Participant',
            selector: row => row.profile?.fullName,
            sortable: true,
        },
        {
            name: 'Support Type',
            selector: row => row.supportType,
            sortable: true,
            cell: (row) => <span className="long-cell" style={{ overflow: "hidden", cursor: "help" }}
                data-bs-toggle="tooltip" data-bs-placement="top" title={`${row.supportType}`}
            >{row.supportType}</span>
        },
        {
            name: 'Quantity of Service',
            selector: row => row.quantity,
            sortable: true,
            cell: (row) => <span className="long-cell" style={{ overflow: "hidden" }}

            >{row.quantity} hours per day</span>
        },
        {
            name: 'Cost of service per hour ($)',
            selector: row => row.cost,
            sortable: true
        },

        {
            name: "Actions",
            cell: (row) => (
                <div className="d-flex gap-1">
                    {/* <button
                        className="btn"
                        title='edit'
                        onClick={() => handleEdit(row.holidayId)}
                    >
                        <SlSettings />
                    </button> */}
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

    // const [days, setDays] = useState({
    //     sunday: false,
    //     monday: false,
    //     tuesday: false,
    //     wednesday: false,
    //     thursday: false,
    //     friday: false,
    //     saturday: false
    // });

    // const handleCheckboxChange = (event) => {
    //     const { name, checked } = event.target;
    //     setDays((prevDays) => ({ ...prevDays, [name]: checked }));
    // };



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

    };
    useEffect(() => {
        FetchData()
    }, []);


    // 

    const handleSupportTypeChange = (event) => {
        const selectedType = event.target.value;
        setSelectedSupportType(selectedType);
        const type = supportType.find((type) => type.ndiA_DPAId === Number(selectedType));
        if (type) {
            setSupportName(type.itemName);
            setPrice(type.remote);
            setSupportNumber(type.itemNumber);
        } else {
            setSupportName('');
            setPrice('');
            setSupportNumber('');
        }
    };




    const handleActivityClick = () => {
        setShowModal(true);
    };


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
                    <span className='fw-bold'>Support Type: </span>
                    <span> {data.supportType}</span>
                </span>
                <span>
                    <span className='fw-bold'>Frequency of Support: </span>
                    <span> {data.frequency}</span>
                </span>
                <span>
                    <span className='fw-bold'>Item Number: </span>
                    <span> {data.itemNumber}</span>
                </span>
                <span>
                    <span className='fw-bold'>Date Created: </span>
                    <span>
                        {dayjs(data.dateCreated).format('DD/MM/YYYY HH:mm:ss')}
                    </span>
                </span>

            </div>
        );
    };


    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = supportSchedule.filter(
        (item) =>
            item.profile?.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
            item.supportType.toLowerCase().includes(searchText.toLowerCase())
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
            html: `<h3>Delete this schedule of support</h3>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#405189',
            cancelButtonColor: '#777',
            confirmButtonText: 'Confirm',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await post(`/Invoice/delete_schedule/${e.scheduleId}`,
                        // { userId: id.userId }
                    )
                    if (data.status === 'Success') {
                        toast.success(data.message);
                        FetchData();
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


    const handleSubmit = async () => {
        if (quantity === "" || selectedValues === "") {
            return toast.error("Incomplete Request")
        }
        const info = {
            profileId,
            "supportType": supportName,
            "quantity": quantity.current.value,
            "cost": price,
            "frequency": selectedValues,
            "itemNumber": supportNumber,
            "companyID": id.companyId
        }
        try {
            setLoading1(true)
            const { data } = await post(`Invoice/add_schedule_of_support`, info);

            if (data.status === "Success") {
                toast.success(data.message);
                setSupportName('');
                setPrice('');
                setSupportNumber('');
                quantity.current.value = "";
                setProfileId(0);
                setSelected([]);
                setShowModal(false)
                FetchData()
            } else {
                toast.error(data.message);
            }
            console.log(data);
            setLoading1(false)
        } catch (error) {
            console.log(error);
            setLoading1(false)
        } finally {
            setLoading1(false)
        }
    };


    return (
        <div className="page-wrapper">
            <Helmet>
                <title>Support Schedule </title>
                <meta name="description" content="Schedule Supports" />
            </Helmet>
            {/* Page Content */}
            <div className="content container-fluid">
                {/* Page Header */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Support Schedule </h3>
                            {id.role === "CompanyAdmin" ? <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Support Schedule</li>
                            </ul> : ""}
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
                            <button className="btn btn-info add-btn rounded-2 text-white" onClick={handleActivityClick}>Add to Support Schedule</button>
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
                            <Modal.Title>Create A Schedule</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="row">

                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Participant</label>
                                        <div>
                                            <select className="form-select"
                                                onChange={e => setProfileId(e.target.value)}
                                            >
                                                <option defaultValue hidden>Select Client / Participant</option>
                                                {
                                                    clients.map((data, index) =>
                                                        <option value={data.profileId} key={index}>{data.fullName}</option>)
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Support Type</label>
                                        <div>
                                            <select
                                                name="supportType"
                                                id="supportType"
                                                className='form-select'
                                                value={selectedSupportType}
                                                onChange={handleSupportTypeChange}
                                                required
                                            >
                                                <option value="" hidden>Select Support Type</option>
                                                {supportType.map((type) => (
                                                    <option key={type.ndiA_DPAId} value={type.ndiA_DPAId}>
                                                        {type.itemName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Quantity of Service</label>
                                        <div>
                                            <input type="number" className='form-control'
                                                ref={quantity}
                                                required />

                                        </div>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Cost of Service per hour ($)</label>
                                        <div>
                                            <input type="text" className='form-control' value={price}

                                                readOnly />
                                        </div>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Frequency of Support</label>

                                        <MultiSelect
                                            options={options}
                                            value={selected}
                                            onChange={handleSelected}
                                            labelledBy="Select Days"
                                        />

                                    </div>

                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Item Number</label>
                                        <div>
                                            <input type="text" className='form-control'

                                                value={supportNumber} readOnly />
                                        </div>
                                    </div>


                                </div>
                            </form>


                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                disabled={loading1 ? true : false}
                                onClick={handleSubmit}
                                className="btn btn-primary add-btn rounded-2 text-white" >
                                {loading1 ? <div className="spinner-grow text-light" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : "Create"}
                            </button>
                        </Modal.Footer>
                    </Modal>



                </div>


                {/* </div> */}


            </div>

        </div>
    );
}

export default ScheduleSupport;
