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


const StaffForm = () => {
  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%'
      });
    }
  });

  const [staffDocument, setStaffDocument] = useState([]);
  const { loading, setLoading } = useCompanyContext();



  const columns = [
    {
      name: 'User',
      selector: row => row.user,
      sortable: true
    },
    {
      name: 'Role',
      selector: row => row.user,
      sortable: true,
      expandable: true,
      cell: (row) => (
        <Link href={`https://example.com/${row.userId}`} className="fw-bold text-dark">
          {row.userRole}
        </Link>
      ),
    },
    {
      name: 'Documnet Name',
      selector: row => row.documentName,
      sortable: true,
    },
    {
      name: 'Expiration Date',
      selector: row => row.expirationDate,
      sortable: true
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true
    }, {
      name: "Actions",
      // cell: (row) => (
      //   <div className="d-flex gap-1">
      //     <Link
      //       className='btn'
      //       title='Edit'
      //       to={''}
      //     >
      //       <SlSettings />
      //     </Link>
      //     <button
      //       className='btn'
      //       title='Delete'
      //       onClick={() => {
      //         alert(`Action button clicked for row with ID ${'row.id'}`);
      //       }}
      //     >
      //       <GoTrashcan />
      //     </button>

      //   </div>
      // ),
    },



  ];

  const handleExcelDownload = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');

    // Add headers
    const headers = columns.map((column) => column.name);
    sheet.addRow(headers);

    // Add data
    staffDocument.forEach((dataRow) => {
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
    const dataValues = staffDocument.map((dataRow) =>
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
      <div className="p-4">
        {data.fullName}

      </div>
    );
  };

  const [searchText, setSearchText] = useState("");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = staffDocument.filter((item) =>
    item.user.toLowerCase().includes(searchText.toLowerCase())
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
                <li className="breadcrumb-item"><Link to="/staff/staff/staffDashboard">Dashboard</Link></li>
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
                      <select className='form-select'>
                        <option>Select Days</option>
                        <option value={1}>Monday</option>
                        <option value={2}>Tuesday</option>
                        <option value={3}>Wednessday</option>
                        <option value={4}>Thursday</option>
                        <option value={5}>Friday</option>
                        <option value={6}>Saturday</option>
                        <option value={7}>Sunday</option>
                      </select>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className="form-group">
                      <label>From Time of Day</label>
                      <input type="time" className="form-control" />
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className="form-group">
                      <label>To Time of Day</label>
                      <input type="time" className="form-control" />
                    </div>
                  </div>
                  <div className="text-start">
                    <button type="submit" className="btn btn-primary px-2">Add</button>
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
                data={staffDocument}
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
              <CopyToClipboard text={JSON.stringify(staffDocument)}>
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
        {/* <div className="table-responsive">
        <table className="table table-striped">
          <thead className='text-white' style={{ backgroundColor: "#18225C" }}>
            <tr style={{ backgroundColor: "#18225C" }}>
              <th>Days</th>
              <th>From Time of Day</th>
              <th>To Time of Day</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Monday</td>
              <td>08:26 AM</td>
              <td>06:27 PM</td>
            </tr>
            <tr>
              <td>Thursday</td>
              <td>10:31 PM</td>
              <td>12:30 PM</td>
            </tr>
          </tbody>
        </table>
      </div> */}

      </div>

    </div>
  );
}
export default StaffForm;