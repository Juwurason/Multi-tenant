import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import { FaCopy, FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaLongArrowAltLeft, FaLongArrowAltRight, FaRegEdit, FaRegFileAlt, FaTrash } from "react-icons/fa";
import ExcelJS from 'exceljs';
import Offcanvas from '../../../Entryfile/offcanvance';
import { toast } from 'react-toastify';
import useHttp from '../../../hooks/useHttp';
import { GoSearch, GoTrashcan } from 'react-icons/go';
import LocationMapModal from '../../../_components/map/MapModal';
import { Modal } from 'react-bootstrap';
import dayjs, { utc } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff } from '../../../store/slices/StaffSlice';
import { fetchClient } from '../../../store/slices/ClientSlice';
import { fetchStaffAttendance } from '../../../store/slices/staffAttendanceSlice';

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

    //Declaring Variables
    const dispatch = useDispatch();

    const id = JSON.parse(localStorage.getItem('user'));
    const claims = JSON.parse(localStorage.getItem('claims'));
    const hasRequiredClaims = (claimType) => {
        return claims.some(claim => claim.value === claimType);
    };

    const history = useHistory();
    const goBack = () => {
        history.goBack(); // Go back in history
    };

    const goForward = () => {
        history.goForward(); // Go forward in history
    };
    // Fetch staff data and update the state
    useEffect(() => {
        dispatch(fetchStaffAttendance(id.companyId));
        dispatch(fetchStaff(id.companyId));
        dispatch(fetchClient(id.companyId));
    }, [dispatch]);

    // Access the entire state
    const loading = useSelector((state) => state.staffAttendance.isLoading);
    const staff = useSelector((state) => state.staff.data);
    const staffAttendance = useSelector((state) => state.staffAttendance.data);



    const { get } = useHttp();
    const [loading1, setLoading1] = useState(false);

    const [sta, setSta] = useState('');
    const dateFrom = useRef(null);
    const dateTo = useRef(null);
    const [editModal, setEditModal] = useState(false);
    const [periodic, setPeriodic] = useState([]);




    const columns = [

        {
            name: 'Staff',
            selector: row => row.staff.fullName,
            sortable: true,
            cell: (row) => <span className="long-cell fw-bold" style={{ overflow: "hidden", cursor: "pointer" }}
                data-bs-toggle="tooltip" data-bs-placement="top" title={`${row.staff.fullName}`}
                onClick={() => handleSplitted(row.attendanceId
                )}
            >{row.staff.fullName}</span>

        },
        {

            name: 'Clock-In',
            selector: row => dayjs(row.clockIn).format('DD/MM/YYYY h:mm A'),
            sortable: true,
            expandable: true,

        },
        {
            name: 'Duration',
            selector: row => formatDuration(row.duration),
            sortable: true,
            expandable: true,

        },


        {
            name: 'Clock-Out',
            selector: row => dayjs(row.clockOut).format('DD/MM/YYYY h:mm A'),
            sortable: true,
            expandable: true,

        },
        {
            name: 'Total Km',
            selector: row => (row.endKm + row.startKm || 0),
            sortable: true,
            expandable: true,

        },

        {
            name: "Actions",
            cell: (row) => (
                <div className="d-flex" style={{ overflow: "hidden" }}>
                    {id.role === "CompanyAdmin" || hasRequiredClaims("Edit Attendances") ? <Link
                        className='btn'
                        title='Edit'
                        to={`/app/reports/edit-staffAttendance/${row.staffAttendanceId}`}
                    // onClick={() => setEditModal(true)}

                    >
                        <FaRegEdit />
                    </Link> : ""}

                    <Link
                        className='btn'
                        title='Details'
                        to={`/app/reports/staffReport-details/${row.staffAttendanceId}`}


                    >
                        <FaRegFileAlt />
                    </Link>



                </div>
            ),
        },



    ];



    // const FilterAttendance = (e) => {
    //     e.preventDefault();
    //     setLoading1(true);

    //     dispatch(filterAttendance({ fromDate: dateFrom.current.value, toDate: dateTo.current.value, staffId: sta, companyId: id.companyId }));
    //     setPeriodic(attendance);

    //     if (!loading) {
    //         setLoading1(false);
    //     }
    // }











    const handleExcelDownload = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet1');

        // Add headers
        const headers = columns.map((column) => column.name);
        sheet.addRow(headers);

        // Add data
        staffAttendance.forEach((dataRow) => {
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
        const csvData = Papa.unparse(staffAttendance);
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
        const size = "A4"; // Use A1, A2, A3, or A4
        const orientation = "portrait"; // portrait or landscape
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(13);
        doc.text("User Table", marginLeft, 40);
        const headers = columns.map((column) => column.name);
        const dataValues = staffAttendance.map((dataRow) =>
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

        // Generate the PDF as a blob URL
        const pdfBlob = doc.output("bloburl");

        // Open the PDF in a new tab
        window.open(pdfBlob, "_blank");
    };

    // const handlePDFDownload = () => {
    //   const unit = "pt";
    //   const size = "A4"; // Use A1, A2, A3 or A4
    //   const orientation = "portrait"; // portrait or landscape
    //   const marginLeft = 40;
    //   const doc = new jsPDF(orientation, unit, size);
    //   doc.setFontSize(13);
    //   doc.text("User Table", marginLeft, 40);
    //   const headers = columns.map((column) => column.name);
    //   const dataValues = attendance.map((dataRow) =>
    //     columns.map((column) => {
    //       if (typeof column.selector === "function") {
    //         return column.selector(dataRow);
    //       }
    //       return dataRow[column.selector];
    //     })
    //   );

    //   doc.autoTable({
    //     startY: 50,
    //     head: [headers],
    //     body: dataValues,
    //     margin: { top: 50, left: marginLeft, right: marginLeft, bottom: 0 },
    //   });
    //   doc.save("Attendance.pdf");
    // };

    const ButtonRow = ({ data }) => {
        return (
            <div className="p-2 d-flex flex-column gap-2" style={{ fontSize: "12px" }}>
                <span>
                    <span className='fw-bold'>Staff: </span>
                    <span> {data.staff.fullName}</span>
                </span>
                <span>
                    <span className='fw-bold'>Latitude: </span>
                    <span> {data.inLatitude}</span>
                </span>
                <span>
                    <span className='fw-bold'>Longitude: </span>
                    <span> {data.inLongitude}</span>
                </span>
                <span>
                    <span className='fw-bold'>Date Created: </span>
                    <span>
                        {dayjs(data.dateCreated).format('DD/MM/YYYY h:mm A')}
                    </span>
                </span>
                <span>
                    <span className='fw-bold'>Date Modified: </span>
                    <span>
                        {dayjs(data.dateModified).format('DD/MM/YYYY h:mm A')}
                    </span>
                </span>


            </div>
        );
    };

    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = staffAttendance.filter((item) =>
        item.staff.fullName.toLowerCase().includes(searchText.toLowerCase())
    );


    return (
        <>



            <div className="page-wrapper">
                <Helmet>
                    <title>Staff Daily Reports</title>
                    <meta name="description" content="Login page" />
                </Helmet>

                <div className="content container-fluid">

                    <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Staff Daily Report</h3>
                            {id.role === "CompanyAdmin" ? <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item active">Staff Daily Report</li>
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


                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">

                                <div className="card-body">
                                    <form className="row align-items-center py-3">

                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="col-form-label">Staff Name</label>
                                                <div>
                                                    <select className="form-select" onChange={e => setSta(e.target.value)}>
                                                        <option defaultValue value={""}>All Staff</option>
                                                        {
                                                            staff.map((data, index) =>
                                                                <option value={data.staffId} key={index}>{data.fullName}</option>)
                                                        }
                                                    </select></div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="col-form-label">Start Date</label>
                                                <div>
                                                    <input type="datetime-local" ref={dateFrom} className=' form-control' name="" id="" required />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="col-form-label">End Date</label>
                                                <div>
                                                    <input type="datetime-local" ref={dateTo} className=' form-control' name="" id="" required />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-auto mt-3">
                                            <div className="form-group">
                                                <button
                                                    type='submit'
                                                    className="btn btn-info add-btn text-white rounded-2 m-r-5"
                                                    disabled={loading1 ? true : false}
                                                >


                                                    {loading1 ? <div className="spinner-grow text-light" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div> : "Load"}
                                                </button>

                                            </div>
                                        </div>
                                        <div className="col-auto mt-4">
                                            <div className="form-group">
                                                {
                                                    loading &&

                                                    <div className="spinner-border text-secondary" role="status">
                                                        <span className="visually-hidden">Loading...</span>

                                                    </div>
                                                }


                                            </div>
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
                                    <input type="text" placeholder="Search Staff Report" className='border-0 outline-none' onChange={handleSearch} />
                                    <GoSearch />
                                </div>
                            </div>
                            <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
                                <CSVLink
                                    data={staffAttendance}
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
                                <CopyToClipboard text={JSON.stringify(staffAttendance)}>
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
                            // progressPending={loading}
                            // progressComponent={<div className='text-center fs-1'>
                            //     <div className="spinner-grow text-secondary" role="status">
                            //         <span className="sr-only">Loading...</span>
                            //     </div>
                            // </div>}
                            responsive
                            expandableRows
                            expandableRowsComponent={ButtonRow}
                            paginationTotalRows={filteredData.length}



                        />






                    </div>


                    {/*Edit Modal */}
                    <Modal show={editModal} onHide={() => setEditModal(false)} centered size='lg'>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Attendance</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <div className="row">

                                    <form
                                    // onSubmit={SendReport}
                                    >

                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="">Clock In</label>
                                                    <input type="text" className="form-control"
                                                        // value={moment(attendance.clockIn).format("LLL")}
                                                        readOnly />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="">Clock Out</label>
                                                    <input type="text" className="form-control"
                                                        // value={moment(attendance.clockOut).format("LLL")}
                                                        readOnly />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="">Starting Kilometre (km)</label>
                                                    <input type="text"
                                                        // value={startKm}
                                                        // onChange={e => setStartKm(e.target.value)}
                                                        className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="">Ending Kilometre (km)</label>
                                                    <input type="text"
                                                        // value={endKm}
                                                        // onChange={e => setEndKm(e.target.value)}
                                                        className="form-control" />
                                                </div>
                                            </div>
                                        </div>


                                        <div className="form-group">
                                            {/* <DefaultEditor value={html} onChange={onChange} /> */}
                                            <label htmlFor="">Additional Report <span className='text-success' style={{ fontSize: '10px' }}>This could be reasons why you were late or information you want your admin to be aware of</span></label>
                                            <textarea rows={3} className="form-control summernote"
                                                name="report"
                                            // value={report} onChange={e => setReport(e.target.value)}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="">Image URL </label>
                                            <input className="form-control" type="file"
                                                accept=".png,.jpg,.jpeg"
                                                maxsize={1024 * 1024 * 2}
                                            // onChange={handleFileChange}
                                            />
                                        </div>
                                        <div className="form-group text-center mb-0">
                                            <div className="text-center d-flex gap-2">
                                                <button className="btn btn-info add-btn text-white rounded-2 m-r-5"
                                                    disabled={loading1 ? true : false}
                                                    type='submit'
                                                >

                                                    {loading1 ? <div className="spinner-grow text-light" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div> : "Save"}</button>


                                            </div>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </Modal.Body>

                    </Modal>





                </div>

            </div>


            <Offcanvas />
        </>

    );
}

export default StaffDailyReport;
