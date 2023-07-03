
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import { FaCopy, FaFileCsv, FaFileExcel, FaFilePdf, FaRegEdit, } from "react-icons/fa";
import ExcelJS from 'exceljs';
import { toast } from 'react-toastify';
import { GoSearch, GoTrashcan } from 'react-icons/go';
import Swal from 'sweetalert2';
import useHttp from '../../../hooks/useHttp';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClient } from '../../../store/slices/ClientSlice';

const Clients = () => {
  const dispatch = useDispatch();
  const id = JSON.parse(localStorage.getItem('user'));
  const user = JSON.parse(localStorage.getItem('user'));
  const claims = JSON.parse(localStorage.getItem('claims'));
  const hasRequiredClaims = (claimType) => {
    return claims.some(claim => claim.value === claimType);
  };

  // Fetch staff data and update the state
  useEffect(() => {
    dispatch(fetchClient(id.companyId));
  }, [dispatch]);

  // Access the entire state
  const loading = useSelector((state) => state.client.isLoading);
  const clients = useSelector((state) => state.client.data);

  useEffect(() => {
    // Check if staff data already exists in the store
    if (!clients.length) {
      // Fetch staff data only if it's not available in the store
      dispatch(fetchClient(id.companyId));
    }
  }, [dispatch, clients]);

  const { get, post } = useHttp();
  const status = useRef(false)
  console.log(clients);

  const columns = [


    {
      name: 'Full Name',
      selector: row => row.fullName,
      sortable: true,
      expandable: true,
      cell: (row) => (
        <Link style={{ overflow: "hidden" }} to={`/app/profile/client-profile/${row.profileId}/${row.firstName}`} className="fw-bold text-dark">
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
        <span className="d-flex gap-1">

         {user.role === "CompanyAdmin" || hasRequiredClaims("Edit Client") ? <div className='col-md-4'>
         <Link to={`/app/profile/edit-client/${row.profileId}`}
            className="btn"
            title='edit'
          >
            <FaRegEdit />
          </Link>
          </div> : ""}
         
          {user.role === "CompanyAdmin" || hasRequiredClaims("Delete Client") ? <div className='col-md-4'>
          <button
            className='btn'
            title='Delete'
            onClick={() => handleDelete(row)}
          >
            <GoTrashcan />
          </button>
          </div> : ""}
         
          

        </span>
      ),
    },



  ];


  const handleExcelDownload = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');

    // Add headers
    const headers = columns.map((column) => column.name);
    sheet.addRow(headers);

    // Add data
    clients.forEach((dataRow) => {
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
      link.download = 'clients.xlsx';
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };



  const handleCSVDownload = () => {
    const csvData = Papa.unparse(clients);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "clients.csv");
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
    doc.text("clients Table", marginLeft, 40);
    const headers = columns.map((column) => column.name);
    const dataValues = clients.map((dataRow) =>
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
    doc.save("clients.pdf");
  };
  const handleActivate = async (e) => {
    try {
      const response = await get(`Profiles/activate_staff?userId=${id.userId}&clientid=${e}`,

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
      const response = await get(`Profiles/deactivate_staff?userId=${id.userId}&clientid=${e}`,
      )
      console.log(response);


    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)


    }




  }

  const ButtonRow = ({ data }) => {
    return (
      <div className="p-2 d-flex gap-1 flex-column " style={{ fontSize: "12px" }}>
        <div ><span className='fw-bold'>Full Name: </span> {data.fullName}</div>
        <div><span className='fw-bold'>Email: </span> {data.email}</div>
        <div><span className='fw-bold'>Date Created: </span>  {dayjs(data.dateCreated).format('DD/MM/YYYY HH:mm:ss')}</div>
        <div>
        {user.role === "CompanyAdmin" || hasRequiredClaims("Activate Client") ?
        <button onClick={() => handleActivate(data.profileId)} className="btn text-primary fw-bold" style={{ fontSize: "12px" }}>
            Activate Client
            | </button> 
          : ""}
          {user.role === "CompanyAdmin" || hasRequiredClaims("Deactivate Client") ?
          <button onClick={() => handleDeactivate(data.profileId)} className="btn text-danger fw-bold" style={{ fontSize: "12px" }}>
            Deactivate Client
          </button>
         : ""}
        </div>

      </div>


    );
  };
  const [searchText, setSearchText] = useState("");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = clients.filter((item) =>
    item.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const HandleFilter = async (e) => {
    e.preventDefault()
    // Profiles/get_active_clients?companyId=1&IsActive=false
    try {
      const response = await get(`/Profiles/get_active_clients?companyId=${id.companyId}&IsActive=${status.current.value}`,
      )
      console.log(response);


    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)


    }




  }


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
      html: `<h3>Delete ${e.firstName} ${e.surName}</h3>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#405189',
      cancelButtonColor: '#777',
      confirmButtonText: 'Confirm',
      showLoaderOnConfirm: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await post(`Profiles/delete/${e.profileId}?userId=${id.userId}`,
            { userId: id.userId }
          )
          if (data.status === 'Success') {
            toast.success(data.message);
            dispatch(fetchClient(id.companyId));
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
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Clients</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Clients</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                <li className="breadcrumb-item active">Clients</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card">

              <div className="card-body">
                <form>
                  <div className="row align-items-center py-2">
                    <div className="col-sm-4">
                      <div className="form-group">
                        <label className="col-form-label">Select Client</label>
                        <div>
                          <select className="form-select" >
                            <option defaultValue hidden>--Select Client--</option>

                            {
                              clients.map((data, index) =>
                                <option value={data.profileId} key={index}>{data.fullName}</option>)
                            }
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="form-group">
                        <label className="col-form-label">Registration Date From</label>
                        <input className="form-control" type="datetime-local"

                        />
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="form-group">
                        <label className="col-form-label">Registration Date To</label>
                        <input className="form-control" type="datetime-local"

                        />
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="form-group">
                        <label className="col-form-label">Select Status</label>
                        <div>
                          <select className="form-select" ref={status}>
                            <option defaultValue hidden>--Select Status--</option>
                            <option value={false}>InActive</option>
                            <option value={true}>Active</option>

                          </select>
                        </div>
                      </div>
                    </div>



                    <div className="col-auto mt-3">
                      <div className="form-group">
                        <button className="btn btn-info rounded-2 add-btn text-white" type='button'
                          onClick={HandleFilter}
                        >
                          Load

                        </button>
                      </div>
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
                <input type="text" placeholder="Search clients" className='border-0 outline-none' onChange={handleSearch} />
                <GoSearch />
              </div>
            </div>
            <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
              <CSVLink
                data={clients}
                filename={"clients.csv"}

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
              <CopyToClipboard text={JSON.stringify(clients)}>
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
            {user.role === "CompanyAdmin" || hasRequiredClaims("Add Client") ?
            <Link to="/app/employee/addclients" className="btn btn-info text-white add-btn rounded-2">
                Create New clients</Link>
               : ""}         
            </div>
          </div>
          <DataTable data={filteredData} columns={columns}
            pagination
            highlightOnHover
            searchable
            searchTerm={searchText}
            // progressPending={loading}
            // progressComponent={<div className='text-center fs-1'>
            //   <div className="spinner-grow text-secondary" role="status">
            //     <span className="sr-only">Loading...</span>
            //   </div>
            // </div>}
            expandableRows
            responsive
            expandableRowsComponent={ButtonRow}
            paginationTotalRows={filteredData.length}
            customStyles={customStyles}


          />






        </div>


        {/* </div> */}


      </div>

    </div>
  );
}

export default Clients;
