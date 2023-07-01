import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import { FaCopy, FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaRegClock, FaRegEdit, FaRegFileAlt, FaTrash } from "react-icons/fa";
import ExcelJS from 'exceljs';
import Sidebar from '../../../initialpage/Sidebar/sidebar';;
import Header from '../../../initialpage/Sidebar/header'
import Offcanvas from '../../../Entryfile/offcanvance';
import { toast } from 'react-toastify';
import useHttp from '../../../hooks/useHttp';
import { useCompanyContext } from '../../../context';
import { GoSearch, GoTrashcan } from 'react-icons/go';
import { SlSettings } from 'react-icons/sl'
import Swal from 'sweetalert2';
import moment from 'moment';
import LocationMapModal from '../../../_components/map/MapModal';
import { Modal } from 'react-bootstrap';
import dayjs, { utc } from 'dayjs';
import { fetchAttendance, filterAttendance } from '../../../store/slices/AttendanceSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff } from '../../../store/slices/StaffSlice';
import { fetchClient } from '../../../store/slices/ClientSlice';
import { fetchSplittedAttendance } from '../../../store/slices/splittedAttendance';

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



const AttendanceReport = () => {

  //Declaring Variables
  const dispatch = useDispatch();

  // Fetch staff data and update the state
  useEffect(() => {
    dispatch(fetchAttendance());
    dispatch(fetchStaff());
    dispatch(fetchClient());
  }, [dispatch]);

  // Access the entire state
  const loading = useSelector((state) => state.attendance.isLoading);
  const attendance = useSelector((state) => state.attendance.data);
  const staff = useSelector((state) => state.staff.data);
  const splittedAttendance = useSelector((state) => state.splittedAttendance.data)

  useEffect(() => {
    // Check if staff data already exists in the store
    if (!attendance.length) {
      // Fetch staff data only if it's not available in the store
      dispatch(fetchAttendance());
    }
  }, [dispatch, attendance]);

  const { get } = useHttp();
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const id = JSON.parse(localStorage.getItem('user'));
  const [sta, setSta] = useState('');
  const dateFrom = useRef(null);
  const dateTo = useRef(null);
  const [editModal, setEditModal] = useState(false);
  const [splittedModal, setSplittedModal] = useState(false);
  const [periodic, setPeriodic] = useState([]);
  const history = useHistory();



  const columns = [
    {
      name: '',
      selector: "",
      sortable: true,
      expandable: true,
      cell: (row) => <div className='d-flex justify-content-center align-items-center'>
        <button
          className='btn'
          title='Details'
          to={`/app/reports/attendance-details/${row.attendanceId}`}


        >
          <FaRegClock />
        </button>
      </div>
    },
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
      selector: row => dayjs(row.clockIn).format('DD/MM/YYYY HH:mm'),
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
      selector: row => dayjs(row.clockOut).format('DD/MM/YYYY HH:mm'),
      sortable: true,
      expandable: true,

    },
    {
      name: 'Location',
      sortable: true,
      expandable: true,
      cell: (row) => (
        <span style={{ overflow: "hidden" }}>

          <LocationMapModal latitude={row.inLatitude} longitude={row.inLongitude} />
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex" style={{ overflow: "hidden" }}>
          <Link
            className='btn'
            title='Edit'
            to={`/app/reports/edit-attendance/${row.attendanceId}`}
          // onClick={() => setEditModal(true)}

          >
            <FaRegEdit />
          </Link>

          <Link
            className='btn'
            title='Details'
            to={`/app/reports/attendance-details/${row.attendanceId}`}


          >
            <FaRegFileAlt />
          </Link>



        </div>
      ),
    },



  ];



  const FilterAttendance = (e) => {
    e.preventDefault();
    setLoading1(true);

    dispatch(filterAttendance({ fromDate: dateFrom.current.value, toDate: dateTo.current.value, staffId: sta, companyId: id.companyId }));
    setPeriodic(attendance);

    if (!loading) {
      setLoading1(false);
    }
  }

  const GetTimeshift = async (e) => {
    e.preventDefault();

    setLoading2(true);
    setTimeout(() => {
      const url = `/staff-timesheet/${sta}/${dateFrom.current.value}/${dateTo.current.value}`;
      window.open(url, '_blank');
      setLoading2(false);
    }, 2000);
  }


  const GetAllTimeshift = async (e) => {
    e.preventDefault();


    setLoading2(true);
    setTimeout(() => {
      const url = `/Allstaff-timesheet/${dateFrom.current.value}/${dateTo.current.value}`;
      window.open(url, '_blank');
      setLoading2(false);
    }, 2000);


  }
  // /ShiftRosters/send_timesheet?userId=&fromDate=&toDate=&staffId=
  const SendTimesheet = async () => {

    setLoading3(true)

    try {
      const { data } = await get(`/ShiftRosters/send_timesheet?userId=${id.userId}&fromDate=${dateFrom.current.value}&toDate=${dateTo.current.value}&staffId=${sta}`, { cacheTimeout: 300000 });
      toast.success(data.message)
      setLoading3(false);


    } catch (error) {
      toast.error("Ooops!😔 Error Occurred")
      console.log(error);
      setLoading3(false)
    }

  }


  const [menu, setMenu] = useState(false);





  const handleExcelDownload = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');

    // Add headers
    const headers = columns.map((column) => column.name);
    sheet.addRow(headers);

    // Add data
    attendance.forEach((dataRow) => {
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
    const csvData = Papa.unparse(attendance);
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
    doc.text("User Table", marginLeft, 40);
    const headers = columns.map((column) => column.name);
    const dataValues = attendance.map((dataRow) =>
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
    doc.save("Attendance.pdf");
  };

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

  const filteredData = attendance.filter((item) =>
    item.staff.fullName.toLowerCase().includes(searchText.toLowerCase())
  );
  const handleSplitted = (e) => {
    console.log(e);
    dispatch(fetchSplittedAttendance({ value: e }));
    console.log(splittedAttendance);

    setSplittedModal(true);
  }

  return (
    <>
      <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>


        <div className="page-wrapper">
          <Helmet>
            <title>Attendance Reports</title>
            <meta name="description" content="Login page" />
          </Helmet>

          <div className="content container-fluid">

            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <h3 className="page-title">Attendance Reports</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Attendance Reports</li>
                  </ul>
                </div>
              </div>
            </div>

            <form className="row align-items-center shadow-sm py-3" onSubmit={FilterAttendance}>

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

              {
                sta === "" || periodic.length <= 0 || loading ? "" :
                  <div className="col-auto mt-3">
                    <div className="form-group">
                      <button
                        type='button'
                        onClick={GetTimeshift}
                        className="btn btn-primary add-btn text-white rounded-2 m-r-5"
                        disabled={loading2 ? true : false}
                      >
                        {loading2 ? (
                          <>
                            <span className="spinner-border text-white spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Please wait...
                          </>
                        ) : (
                          "Generate Timesheet"
                        )}


                      </button>
                      <button
                        type='button'
                        onClick={SendTimesheet}
                        className="btn btn-secondary add-btn text-white rounded-2 m-r-5"
                        disabled={loading3 ? true : false}
                      >
                        {loading3 ? (
                          <>
                            <span className="spinner-border text-white spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Please wait...
                          </>
                        ) : (
                          "Send Timesheet to staff"
                        )}


                      </button>

                    </div>
                  </div>
              }
              {
                sta !== "" || periodic.length <= 0 || loading ? "" :
                  <div className="col-auto mt-3">
                    <div className="form-group">
                      <button style={{ fontSize: "12px" }}
                        type='button'
                        onClick={GetAllTimeshift}
                        className="btn btn-dark add-btn text-white rounded-2 m-r-5"
                        disabled={loading2 ? true : false}
                      >
                        {loading2 ? (
                          <>
                            <span className="spinner-border text-white spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Please wait...
                          </>
                        ) : (
                          "Generate Timesheet for all staff"
                        )}


                      </button>

                    </div>
                  </div>
              }


            </form>



            <div className='mt-4 border'>
              <div className="row px-2 py-3">

                <div className="col-md-3">
                  <div className='d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                    <input type="text" placeholder="Search Attendance" className='border-0 outline-none' onChange={handleSearch} />
                    <GoSearch />
                  </div>
                </div>
                <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
                  <CSVLink
                    data={attendance}
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
                  <CopyToClipboard text={JSON.stringify(attendance)}>
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

            <Modal show={splittedModal} onHide={() => setSplittedModal(false)} size='lg'>
              <Modal.Header closeButton>
                <Modal.Title>Splitted Attendance</Modal.Title>
              </Modal.Header>
              <Modal.Body>

                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Clock In</th>
                      <th>Duration</th>
                      <th>Clock Out</th>
                      <th>Km</th>
                      <th>Shift</th>
                    </tr>
                  </thead>
                  <tbody>



                    {
                      splittedAttendance.map((data, index) =>
                        <tr key={index}>
                          <td>  {dayjs(data.clockIn).format('DD/MM/YYYY HH:mm')}</td>
                          <td>{formatDuration(data.duration)}</td>
                          <td>{dayjs(data.clockOut).format('DD/MM/YYYY HH:mm')}</td>
                          <td>{data.totalKm}</td>
                          <td><small style={{ fontSize: "12px" }} className={`px-2 py-1 rounded text-white
                          bg-${data.shift === 'M' ? 'primary' : data.shift === 'E' ? 'secondary' : data.shift === 'N' ? 'dark' : 'transparent'}
                          `}

                          >
                            {data.shift === 'M' ? 'Morning' : data.shift === 'E' ? 'Evening' : data.shift === 'N' ? 'Night' : data.shift}
                          </small></td>
                        </tr>

                      )
                    }
                  </tbody>
                </table>
              </Modal.Body>

            </Modal>



          </div>

        </div>
      </div>

      <Offcanvas />
    </>

  );
}

export default AttendanceReport;
