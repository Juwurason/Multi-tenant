
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
import { useCompanyContext } from '../../context';
import useHttp from '../../hooks/useHttp';

const Clients = () => {
  const { loading, setLoading } = useCompanyContext()
  const id = JSON.parse(localStorage.getItem('user'));
  const [clients, setClients] = useState([]);
  const { get, post } = useHttp();

  const columns = [
    // {
    //   name: '#',
    //   cell: (row, index) => index + 1
    // },

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
          <Link to={`/app/profile/edit-client/${row.profileId}`}
            className="btn"
            title='edit'
          >
            <SlSettings />
          </Link>
          <button
            className='btn'
            title='Delete'
            onClick={() => handleDelete(row)}
          >
            <GoTrashcan />
          </button>

        </span>
      ),
    },



  ];

  const FetchClient = async () => {
    try {
      setLoading(true)
      const clientResponse = await get(`/Profiles?companyId=${id.companyId}`, { cacheTimeout: 300000 });
      const client = clientResponse.data;
      setClients(client);
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

      <div className="p-4 d-flex gap-3 align-items-center">
        <span>{data.fullName}</span>
        <div>
          <button onClick={() => handleActivate(data.profileId)} className="btn text-primary" style={{ fontSize: "12px" }}>
            Activate Client
          </button> |
          <button onClick={() => handleDeactivate(data.profileId)} className="btn text-danger" style={{ fontSize: "12px" }}>
            Deactivate Client
          </button>
        </div>

      </div>
    );
  };
  const [searchText, setSearchText] = useState("");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = clients.filter((item) =>
    item.fullName.toLowerCase().includes(searchText.toLowerCase())
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
      html: `<h3>Are you sure? you want to delete ${e.firstName} ${e.surName}</h3>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00AEEF',
      cancelButtonColor: '#777',
      confirmButtonText: 'Confirm Delete',
      showLoaderOnConfirm: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await post(`Profiles/delete/${e.profileId}?userId=${id.userId}`,
            { userId: id.userId }
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
        {/* /Page Header */}
        {/* Search Filter */}
        {/* <div className="row filter-row">
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus">
              <input type="text" className="form-control floating" />
              <label className="focus-label">Client ID</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus">
              <input type="text" className="form-control floating" />
              <label className="focus-label">Client Name</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus">
              <input type="text" className="form-control floating" />
              <label className="focus-label">Client Email</label>
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
              <Link to="/app/employees/addclients" className="btn btn-info text-white add-btn rounded-2">
                Create New clients</Link>
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
