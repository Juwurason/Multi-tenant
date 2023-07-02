
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import { useCompanyContext } from '../../../context';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaCopy, FaFileCsv, FaFileExcel, FaFilePdf } from "react-icons/fa";
import Offcanvas from '../../../Entryfile/offcanvance';
import { toast } from 'react-toastify';
import { GoSearch } from 'react-icons/go';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import moment from 'moment';

const StaffAttendance = ({ staffAtten }) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault('Australia/Sydney');

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%'
      });
    }
  });
  const { loading, setLoading } = useCompanyContext();
  const [document, setDocument] = useState("")
  const id = JSON.parse(localStorage.getItem('user'));


  const columns = [
    {
      name: 'Date',
      selector: row => dayjs(row.dateCreated).format('YYYY-MM-DD'),
      sortable: true
    },
    {
      name: 'Staff',
      selector: row => row.staff.fullName,
      sortable: true,
    },
    {
      name: 'Start Time',
      selector: row => dayjs(row.clockIn).tz().format('h:mm A'),
      sortable: true,
    },
    {
      name: 'End Time',
      selector: row => {
        const dateObject = new Date(row.clockOut);
        return dayjs(dateObject).format('h:mm A');
      },
      sortable: true
    },
    {
      name: 'Duration',
      selector: row => {
        const clockInTime = dayjs(row.clockIn);
        const clockOutTime = dayjs(row.clockOut);
        const duration = clockOutTime.diff(clockInTime, 'minutes');
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        return `${hours}h ${minutes}m`;
      },
      sortable: false,
    },
    {
      name: 'DateModified',
      selector: row => dayjs(row.dateModified).format('DD/MM/YYYY HH:mm:ss'),
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
    staffAtten.forEach((dataRow) => {
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
    const dataValues = staffAtten.map((dataRow) =>
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

  const ButtonRow = ({ data }) => {
    return (
      <div className="p-2 d-flex gap-1 flex-column " style={{ fontSize: "12px" }}>
        <div><span className='fw-bold'>Staff: </span>{data.staff.fullName} </div>
        <div ><span className='fw-bold'>Date Created: </span> {moment(data.dateCreated).format('lll')}</div>
        <div>
          <Link to={`/staff/staff/attendance-report/${data.attendanceId}`} className="btn text-info fw-bold" style={{ fontSize: "12px" }}
          >
            Add Report
          </Link> |
          <Link to={`/staff/staff/attendance-details/${data.attendanceId}`}
            className="btn text-secondary fw-bold" style={{ fontSize: "12px" }}>
            Details
          </Link>
        </div>

      </div>
    );
  };

  const [searchText, setSearchText] = useState("");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = staffAtten.filter((item) =>
    item.staff.fullName.toLowerCase().includes(searchText.toLowerCase())
  );


  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title> Attendance</title>
          <meta name="description" content="Attendance" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">Attendance</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/staff/staff/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Attendance</li>
                </ul>
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
                  data={staffAtten}
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
                <CopyToClipboard text={JSON.stringify(staffAtten)}>
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

        </div>



      </div>
      <Offcanvas />
    </>

  );

}

export default StaffAttendance;
