/**
 * Form Elemets
 */
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import useHttp from '../../../hooks/useHttp';
import { useCompanyContext } from '../../../context';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaCopy, FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaTrash } from "react-icons/fa";
import Offcanvas from '../../../Entryfile/offcanvance';
import { toast } from 'react-toastify';
import { GoSearch, GoTrashcan } from 'react-icons/go';
import dayjs from 'dayjs';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';
import { async } from '@babel/runtime/helpers/regeneratorRuntime';


const StaffForm = ({ staffAvail, FetchData }) => {
  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%'
      });
    }
  });

  // const [staffAvail, setStaffAvail] = useState([]);
  const { loading, setLoading } = useCompanyContext();
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const { get, post } = useHttp();
  const [selectedTimeFrom, setSelectedTimeFrom] = useState("");
  const [selectedTimeTo, setSelectedTimeTo] = useState("");
  const id = JSON.parse(localStorage.getItem('user'))
  const [showModal, setShowModal] = useState(false);
  const staffProfile = JSON.parse(localStorage.getItem('staffProfile'))

  const convertTo12HourFormat = (time24h) => {
    let [hours, minutes] = time24h.split(':');
    let suffix = 'AM';

    if (hours >= 12) {
      suffix = 'PM';
      hours = hours - 12;
    }

    if (hours === 0) {
      hours = 12;
    }

    return `${hours}:${minutes} ${suffix}`;
  };



  const PostAvail = async (e) => {
    if (selectedDay === "" || selectedTimeFrom === "" || selectedTimeTo === "") {
      return toast.error("Input Fields cannot be empty")
    }
    e.preventDefault()
    setLoading1(true)
    const info = {
      staffId: staffProfile.staffId,
      days: selectedDay,
      fromTimeOfDay: selectedTimeFrom,
      toTimeOfDay: selectedTimeTo,
      companyID: id.companyId
    }
    try {

      const { data } = await post(`/StaffAvailibilities/add_staff_availability?userId=${id.userId}`, info);
      if (data.status === 'Success') {
        toast.success(data.message)
      }
      setLoading1(false)
      FetchData()
    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
    }
    finally {
      setLoading1(false)
    }
  }


  // const FetchSchedule = async () => {
  //   try {
  //     const { data } = await get(`StaffAvailibilities/get_staff_availabilities?staffId=${staffProfile.staffId}`, { cacheTimeout: 300000 });
  //     setStaffAvail(data)
  //   } catch (error) {
  //     toast.error(error.response.data.message)
  //     toast.error(error.response.data.title)
  //   }
  // };
  // useEffect(() => {
  //   FetchSchedule()
  // }, []);


  const columns = [
    // {
    //   name: 'User',
    //   selector: row => row.user,
    //   sortable: true
    // },
    {
      name: 'Days',
      selector: row => row.days,
      sortable: true,
      expandable: true,
    },
    {
      name: 'From Time of Day',
      selector: row => convertTo12HourFormat(row.fromTimeOfDay),
      sortable: true,
    },
    {
      name: 'To Time of Day',
      selector: row => convertTo12HourFormat(row.toTimeOfDay),
      sortable: true
    },
    {
      name: 'Date Created',
      selector: row => dayjs(row.dateCreated).format('DD/MM/YYYY HH:mm:ss'),
      sortable: true
    }


  ];

  const handleExcelDownload = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');

    // Add headers
    const headers = columns.map((column) => column.name);
    sheet.addRow(headers);

    // Add data
    staffAvail.forEach((dataRow) => {
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

  const handlePDFDownload = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(13);
    doc.text("User Table", marginLeft, 40);
    const headers = columns.map((column) => column.name);
    const dataValues = staffAvail.map((dataRow) =>
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
    doc.save("Admin.pdf");
  };

  const handleDelete = async (e) => {
    Swal.fire({
      html: `<h3>Are you sure? you want to delete this Availability</h3>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#405189',
      cancelButtonColor: '#C8102E',
      confirmButtonText: 'Confirm Delete',
      showLoaderOnConfirm: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await post(`/StaffAvailibilities/delete/${e}`)
          // console.log(data);
          if (data.status === 'Success') {
            toast.success(data.message);
            FetchData()
          } else {
            toast.error(data.message);
          }


        } catch (error) {
          // console.log(error);
          toast.error(error.response.data.message)
          toast.error(error.response.data.title)


        }


      }
    })


  }

  const [editAvail, setEditAvail] = useState({});
  const [idSave, setIdSave] = useState('')

  const handleEdit = async (e) => {
    setShowModal(true);
    setIdSave(e)
    // setLoading2(true)
    try {

      const { data } = await get(`/StaffAvailibilities/get_availability/${e}`, { cacheTimeout: 300000 });
      // console.log(data);
      setEditAvail(data);
    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
    }
  };

  function handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    const newValue = value === "" ? "" : value;
    setEditAvail({
      ...editAvail,
      [name]: newValue
    });
  }

  const EditAvail = async (e) => {

    e.preventDefault()
    setLoading2(true)
    const info = {
      staffAvailibilityId: idSave,
      staffId: staffProfile.staffId,
      days: editAvail.days,
      fromTimeOfDay: editAvail.fromTimeOfDay,
      toTimeOfDay: editAvail.toTimeOfDay,
      companyID: id.companyId
    }
    try {

      const { data } = await post(`/StaffAvailibilities/edit/${idSave}?userId=${id.userId}`, info);
      // console.log(data);
      if (data.status === 'Success') {
        toast.success(data.message)
      }
      setLoading2(false)
      setShowModal(false)
      FetchData()
    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
    }
    finally {
      setLoading2(false)
    }
  }

  const ButtonRow = ({ data }) => {
    return (
      <div className="p-2 d-flex gap-1 flex-column " style={{ fontSize: "12px" }}>
        <div ><span className='fw-bold'>Date Created: </span> {moment(data.dateCreated).format('lll')}</div>
        <div><span className='fw-bold'>Date Modified: </span>{moment(data.dateModified).format('lll')}</div>
        <div>
          <button className="btn text-info fw-bold" style={{ fontSize: "12px" }} onClick={() => handleEdit(data.staffAvailibilityId)}>
            Edit
          </button> |
          <button onClick={() => handleDelete(data.staffAvailibilityId)} className="btn text-danger fw-bold" style={{ fontSize: "12px" }}>
            Delete
          </button>
        </div>

      </div>
    );

  };

  const [searchText, setSearchText] = useState("");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = staffAvail.filter((item) =>
    item.days.toLowerCase().includes(searchText.toLowerCase())
  );
  return (
    <div className="page-wrapper">
      <Helmet>
        <title> Availabilities</title>
        <meta name="description" content="Login page" />
      </Helmet>
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              {/* <h3 className="page-title">Staff Availabilities</h3> */}
              <ul className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/staff/main/dashboard">Dashboard</Link></li>
                <li className="breadcrumb-item active">Staff Availabilities</li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title mb-0">Add your availability & Schedule</h4>
              </div>
              <div className="card-body">
                <form className="row">
                  <div className='col-md-6'>
                    <div className="form-group">
                      <label>Days</label>
                      <select className='form-select' onChange={(e) => setSelectedDay(e.target.value)} required>
                        <option defaultValue hidden >Select Days</option>
                        <option value={"Monday"}>Monday</option>
                        <option value={"Tuesday"}>Tuesday</option>
                        <option value={"Wednessday"}>Wednessday</option>
                        <option value={"Thursday"}>Thursday</option>
                        <option value={"Friday"}>Friday</option>
                        <option value={"Saturday"}>Saturday</option>
                        <option value={"Sunday"}>Sunday</option>
                      </select>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className="form-group">
                      <label>From Time of Day</label>
                      <input className="form-control" type="time" onChange={(e) => setSelectedTimeFrom(e.target.value)} required />
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className="form-group">
                      <label>To Time of Day</label>
                      <input className="form-control" type="time" onChange={(e) => setSelectedTimeTo(e.target.value)} required />
                    </div>
                  </div>
                  <div className="text-start">
                    <button type="submit" className="btn btn-primary px-2" disabled={loading1 ? true : false} onClick={PostAvail}>
                      {loading1 ? <div className="spinner-grow text-light" role="status">
                        <span className="sr-only">Loading...</span>
                      </div> : "Add"}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-4 border'>
          <div className="row px-2 py-3 d-flex justify-content-between align-items-center gap-4">

            <div className="col-md-3">
              <div className='d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                <input type="text" placeholder="Search...." className='border-0 outline-none' onChange={handleSearch} />
                <GoSearch />
              </div>
            </div>
            <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
              <CSVLink
                data={staffAvail}
                filename={"document.csv"}

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
              <CopyToClipboard text={JSON.stringify(staffAvail)}>
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
            expandableRows
            expandableRowsComponent={ButtonRow}
            paginationTotalRows={filteredData.length}
            responsive


          />


        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Staff Availability</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="row">
              <div className='col-md-6'>
                <div className="form-group">
                  <label>Days</label>
                  <select
                    className='form-select'
                    name="days" value={editAvail.days || ''} onChange={handleInputChange}
                    required
                  >
                    <option defaultValue hidden>Select Days</option>
                    <option value={"Monday"}>Monday</option>
                    <option value={"Tuesday"}>Tuesday</option>
                    <option value={"Wednessday"}>Wednessday</option>
                    <option value={"Thursday"}>Thursday</option>
                    <option value={"Friday"}>Friday</option>
                    <option value={"Saturday"}>Saturday</option>
                    <option value={"Sunday"}>Sunday</option>
                  </select>
                </div>
              </div>
              <div className='col-md-6'>
                <div className="form-group">
                  <label>From Time of Day</label>
                  <input className="form-control" type="time" name='fromTimeOfDay' value={editAvail.fromTimeOfDay || ''} onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className='col-md-6'>
                <div className="form-group">
                  <label>To Time of Day</label>
                  <input
                    className="form-control"
                    type="time"
                    name="toTimeOfDay" value={editAvail.toTimeOfDay || ''} onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="submit"
              className="btn btn-primary add-btn px-2"
              disabled={loading2 ? true : false}
              onClick={EditAvail}
            >
              {loading2 ? (
                <div className="spinner-grow text-light" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                "Add"
              )}
            </button>
          </Modal.Footer>
        </Modal>


      </div>

    </div>
  );
}
export default StaffForm;