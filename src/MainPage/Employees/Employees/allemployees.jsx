import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import { FaCopy, FaEllipsisV, FaFileCsv, FaFileExcel, FaFilePdf, FaRegEdit, } from "react-icons/fa";
import ExcelJS from 'exceljs';
import Sidebar from '../../../initialpage/Sidebar/sidebar';;
import Header from '../../../initialpage/Sidebar/header'
import Offcanvas from '../../../Entryfile/offcanvance';
import { toast } from 'react-toastify';
import useHttp from '../../../hooks/useHttp';
import { GoSearch, GoTrashcan } from 'react-icons/go';
import { SlSettings } from 'react-icons/sl'
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { fetchStaff } from '../../../store/slices/StaffSlice';
import { useDispatch, useSelector } from 'react-redux';
const AllEmployees = () => {
  const dispatch = useDispatch();

  // Fetch staff data and update the state
  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  // Access the entire state
  const loading = useSelector((state) => state.staff.isLoading);
  const staff = useSelector((state) => state.staff.data);

  useEffect(() => {
    // Check if staff data already exists in the store
    if (!staff.length) {
      // Fetch staff data only if it's not available in the store
      dispatch(fetchStaff());
    }
  }, [dispatch, staff]);

  const { post, get } = useHttp();
  const id = JSON.parse(localStorage.getItem('user'));
  // const [staff, setStaff] = useState([]);

  const columns = [

    {
      name: 'Staff ID',
      selector: row => row.maxStaffId,
      sortable: true
    },
    {
      name: 'Full Name',
      selector: row => row.fullName,
      sortable: true,
      expandable: true,
      cell: (row) => (
        <Link style={{ overflow: "hidden" }} to={`/app/profile/employee-profile/${row.staffId}/${row.firstName}`} className="fw-bold text-dark">
          {row.firstName} {row.surName}
        </Link>
      ),
    },
    {
      name: 'Address',
      selector: row => row.address,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true
    },
    {
      name: 'Phone Number',
      selector: row => row.phoneNumber,
      sortable: true
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-1">
          <Link to={`/app/profile/employee-profile/${row.staffId}/${row.firstName}`}
            className="btn"
            title='edit'
          >
            <FaRegEdit />
          </Link>
          <button
            className='btn'
            title='Delete'
            onClick={() => handleDelete(row.staffId)}
          >
            <GoTrashcan />
          </button>


        </div>
      ),
    },



  ];





  const handleDelete = async (e) => {
    Swal.fire({
      html: `<h3>This will remove all info for this staff</h3>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#00AEEF',
      cancelButtonColor: '#777',
      confirmButtonText: 'Confirm',
      showLoaderOnConfirm: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await post(`/Staffs/delete/${e}?userId=${id.userId}`,
            { userId: id.userId }
          )
          if (data.status === 'Success') {
            toast.success(data.message);
            FetchData()
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
  const handleActivate = async (e) => {
    try {
      const response = await get(`Staffs/activate_staff?userId=${id.userId}&staffid=${e}`,

      )
      console.log(response);


    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)


    }




  }
  const handleDeactivate = async (e) => {
    try {
      const response = await get(`Staffs/deactivate_staff?userId=${id.userId}&staffid=${e}`,
      )
      console.log(response);


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
    staff.forEach((dataRow) => {
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
      link.download = 'Staff.xlsx';
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };



  const handleCSVDownload = () => {
    const csvData = Papa.unparse(staff);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Staff.csv");
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
    doc.text("Staff Table", marginLeft, 40);
    const headers = columns.map((column) => column.name);
    const dataValues = staff.map((dataRow) =>
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
    doc.save("staff.pdf");
  };

  const ButtonRow = ({ data }) => {
    return (
      <div className="p-2 d-flex gap-1 flex-column " style={{ fontSize: "12px" }}>
        <div ><span className='fw-bold'>Full Name: </span> {data.fullName}</div>
        <div><span className='fw-bold'>Email: </span> {data.email}</div>
        <div><span className='fw-bold'>Date Created: </span>  {dayjs(data.dateCreated).format('DD/MM/YYYY HH:mm:ss')}</div>
        <div>
          <button onClick={() => handleActivate(data.staffId)} className="btn text-primary fw-bold" style={{ fontSize: "12px" }}>
            Activate Staff
          </button> |
          <button onClick={() => handleDeactivate(data.staffId)} className="btn text-danger fw-bold" style={{ fontSize: "12px" }}>
            Deactivate Staff
          </button>
        </div>

      </div>
    );
  };
  const [searchText, setSearchText] = useState("");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = staff.filter((item) =>
    item.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.email.toLowerCase().includes(searchText.toLowerCase())
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

  return (
    <>

      <div className="page-wrapper">
        <Helmet>
          <title>Staff</title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">

          <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">Staffs</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Staffs</li>
                </ul>
              </div>
              <div className="col-auto float-end ml-auto">

              </div>
            </div>
          </div>





          {/* <div className="row filter-row">
              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <label className="focus-label">Staff ID</label>
                  <input type="text" className="form-control floating" />
                </div>
              </div>
              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <label className="focus-label">Staff Name</label>
                  <input type="text" className="form-control floating" />
                </div>
              </div>
              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <label className="focus-label">Staff Email</label>
                  <input type="text" className="form-control " />
                </div>
              </div>

              <div className="col-sm-6 col-md-3">
                <a href="javascript:void(0)" className="btn btn-primary btn-block w-100"> Search </a>
              </div>
            </div> */}



          {/* Search Filter */}


          <div className='mt-4 border'>
            <div className="row px-2 py-3">

              <div className="col-md-3">
                <div className='d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                  <input type="text" placeholder="Search staffs" className='border-0 outline-none' onChange={handleSearch} />
                  <GoSearch />
                </div>
              </div>
              <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
                <CSVLink
                  data={staff}
                  filename={"staff.csv"}

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
                <CopyToClipboard text={JSON.stringify(staff)}>
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
                <Link to={'/app/employee/addstaff'} className="btn btn-info text-white add-btn rounded-2">
                  Create New staff</Link>
              </div>
            </div>
            <DataTable data={filteredData} columns={columns}
              pagination
              highlightOnHover
              searchable
              searchTerm={searchText}
              expandableRows
              expandableRowsComponent={ButtonRow}
              paginationTotalRows={filteredData.length}
              customStyles={customStyles}
              responsive


            />

          </div>

        </div>
        {/* /Page Content */}

      </div>

      {/* <Offcanvas /> */}
    </>

  );
}

export default AllEmployees;
