import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import { FaCopy, FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaLongArrowAltLeft, FaLongArrowAltRight, FaRegFileAlt, FaTrash } from "react-icons/fa";
import ExcelJS from 'exceljs';
import Offcanvas from '../../../Entryfile/offcanvance';
import { toast } from 'react-toastify';
import { GoSearch, GoTrashcan } from 'react-icons/go';
import dayjs, { utc } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff } from '../../../store/slices/StaffSlice';
import axiosInstance from '../../../store/axiosInstance';
import { fetchClient } from '../../../store/slices/ClientSlice';


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



const ShiftAttendanceReport = () => {
    const [total, setTotal] = useState({});
    const [shiftAttendance, setShiftAttendance] = useState([]);
    const [periodic, setPeriodic] = useState([]);
    const [loading2, setLoading2] = useState(false);


    const GetTimeshift = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get(`/Attendances/get_shift_attendance?companyId=${id.companyId}`);
            setTotal(data.shiftAttendance);
            setShiftAttendance(data.shiftAttendance?.attendanceSplits);

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching shift Attendance', error);
            throw error;
        }
    }

    useEffect(() => {
        GetTimeshift();
    }, []);

    const history = useHistory();
    const goBack = () => {
        history.goBack(); // Go back in history
    };

    const goForward = () => {
        history.goForward(); // Go forward in history
    };

    const GetPeriodic = async (e) => {
        e.preventDefault();
        setLoading1(true);
        try {
            const { data } = await axiosInstance.get(`/Attendances/get_periodic_shift_attendnace?companyId=${id.companyId}&fromDate=${dateFrom.current.value}&toDate=${dateTo.current.value}&staffId=${sta}&clientId=${cli}&shifttype=${type}`);
            // console.log(data);
            setTotal(data.shiftAttendance);
            setShiftAttendance(data.shiftAttendance?.attendanceSplits);
            setPeriodic(data.shiftAttendance?.attendanceSplits)
            setLoading1(false);
        } catch (error) {
            setLoading1(false);
            console.error('Error fetching shift Attendance', error);
            throw error;
        }
    }

    // const GenerateStaffandClient = async (e) => {
    //     e.preventDefault();
    //     setLoading2(true);
    //     setTimeout(() => {
    //         const url = `/staff-client/${sta}/${cli}/${dateFrom.current.value}/${dateTo.current.value}`;
    //         window.open(url, '_blank');
    //         setLoading2(false);
    //     }, 2000);
    // }

    const GenerateStaffandClient = async (e) => {
        e.preventDefault();
        setLoading2(true);
        setTimeout(() => {
            let url = `/staff-client`;
            if (sta && !cli) {
                url += `/${sta}/${dateFrom.current.value}/${dateTo.current.value}`;
            }
            if (!sta && cli) {
                url += `/${cli}/${dateFrom.current.value}/${dateTo.current.value}`;
            }
             else if (sta && cli) {
                url = `/staff-client/${sta}/${cli}/${dateFrom.current.value}/${dateTo.current.value}`;
             }
            window.open(url, '_blank');
            setLoading2(false);
        }, 2000);
    }
      

    const Generate = async (e) => {
        e.preventDefault();
        setLoading2(true);
        setTimeout(() => {
            const url = `/Alluser-shiftattendance/${dateFrom.current.value}/${dateTo.current.value}`;
            window.open(url, '_blank');
            setLoading2(false);
        }, 2000);
    }

    //Declaring Variables
    const dispatch = useDispatch();

    const id = JSON.parse(localStorage.getItem('user'));
    const claims = JSON.parse(localStorage.getItem('claims'));
    const hasRequiredClaims = (claimType) => {
        return claims.some(claim => claim.value === claimType);
    };

    useEffect(() => {
        dispatch(fetchStaff(id.companyId));
        dispatch(fetchClient(id.companyId));

    }, [dispatch]);

    // Access the entire state
    const staff = useSelector((state) => state.staff.data);
    const clients = useSelector((state) => state.client.data);





    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [sta, setSta] = useState('');
    const [cli, setCli] = useState('');
    const [type, setType] = useState('');
    const dateFrom = useRef(null);
    const dateTo = useRef(null);





    const columns = [

        {
            name: 'Staff',
            selector: row => row.shiftRoster?.staff?.fullName,
            sortable: true,
            cell: (row) => <span className="long-cell fw-bold" style={{ overflow: "hidden", cursor: "pointer" }}
                data-bs-toggle="tooltip" data-bs-placement="top" title={`${row.shiftRoster?.staff?.fullName}`}
            >{row.shiftRoster?.staff?.fullName}</span>

        },
        {

            name: 'Date',
            selector: row => dayjs(row.clockIn).format('ddd, MMMM DD YYYY'),
            sortable: true,
            expandable: true,

        },
        {

            name: 'Start Time',
            selector: row => dayjs(row.clockIn).format('h:mm A'),
            sortable: true,
            expandable: true,

        },
        {
            name: 'End Date',
            selector: row => dayjs(row.clockOut).format('ddd, MMM DD, h:mm A'),
            sortable: true,
            expandable: true,

        },
        {
            name: 'Km',
            selector: row => row.totalKm,
            sortable: true,
            expandable: true,

        },
        {
            name: 'Client',
            selector: row => row.shiftRoster?.clients,
            sortable: true,
            cell: (row) => <span className="long-cell fw-bold" style={{ overflow: "hidden", cursor: "pointer" }}
                data-bs-toggle="tooltip" data-bs-placement="top" title={`${row.shiftRoster?.clients}`}
            >{row.shiftRoster?.clients}</span>

        },
        {
            name: 'Duration',
            selector: row => formatDuration(row.duration),
            sortable: true,
            expandable: true,

        },







    ];










    const handleExcelDownload = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet1');

        // Add headers
        const headers = columns.map((column) => column.name);
        sheet.addRow(headers);

        // Add data
        shiftAttendance.forEach((dataRow) => {
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
        const csvData = Papa.unparse(shiftAttendance);
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
        const dataValues = shiftAttendance.map((dataRow) =>
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
                    <span className='fw-bold'>Attendance: </span>
                    <span className={`${data.attendance.clockInCheck ? "bg-success" : "bg-danger"
                        } px-2 py-1 rounded-pill text-white fw-bold`}
                        style={{ fontSize: "10px" }}>{data.attendance.clockInCheck ? "true" : "false"}</span>



                </span>



            </div>
        );
    };

    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = shiftAttendance.filter((item) =>
        item.clockIn.includes(searchText)
    );


    return (
        <>



            <div className="page-wrapper">
                <Helmet>
                    <title>Shift Attendance Reports</title>
                    <meta name="description" content="Shift Attendance Report" />
                </Helmet>

                <div className="content container-fluid">


                    <div className="page-header">
                        <div className="row align-items-center">
                            <div className="col">
                                <h3 className="page-title">Shift Attendance Reports</h3>
                                {id.role === "CompanyAdmin" ? <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item active">Shift Attendance Reports</li>
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
                                    <form className="row align-items-center py-3" onSubmit={GetPeriodic}>

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
                                                <label className="col-form-label">Client Name</label>
                                                <div>
                                                    <select className="form-select" onChange={e => setCli(e.target.value)}>
                                                        <option defaultValue value={""}>All Client</option>
                                                        {
                                                            clients.map((data, index) =>
                                                                <option value={data.profileId} key={index}>{data.fullName}</option>)
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

                                                {sta !== "" || cli !== "" || periodic.length <= 0 ? "" : <button
                                                    // type='submit'
                                                    onClick={Generate}
                                                    className="btn btn-info add-btn text-white rounded-2 m-r-5"
                                                    disabled={loading2 ? true : false}
                                                >


                                                    {loading2 ? <div className="spinner-grow text-light" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div> : "Generate Shift Attendance Report"}
                                                </button>}

                                                {sta === "" && cli === "" || periodic.length <= 0 ? "" : <button
                                                    // type='submit'
                                                    onClick={GenerateStaffandClient}
                                                    className="btn btn-info add-btn text-white rounded-2 m-r-5"
                                                    disabled={loading2 ? true : false}
                                                >


                                                    {loading2 ? <div className="spinner-grow text-light" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div> : "Generate Shift Attendance Report"}
                                                </button>}

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
                                    <input type="text" placeholder="Search Shift Attendance" className='border-0 outline-none' onChange={handleSearch} />
                                    <GoSearch />
                                </div>
                            </div>
                            <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
                                <CSVLink
                                    data={shiftAttendance}
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
                                <CopyToClipboard text={JSON.stringify(shiftAttendance)}>
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
                        <div className="d-flex px-2 py-3 justify-content-evenly align-items-center">
                            <div><span>Total Duration: </span><span className="fw-bold ">{formatDuration(total.totalDuration)}</span></div>

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





                </div>

            </div>


            <Offcanvas />
        </>

    );
}

export default ShiftAttendanceReport;
