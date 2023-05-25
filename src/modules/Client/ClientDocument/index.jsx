
import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import useHttp from '../../../hooks/useHttp';
import { useCompanyContext } from '../../../context';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaCopy, FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaEye } from "react-icons/fa";
import Offcanvas from '../../../Entryfile/offcanvance';
import { toast } from 'react-toastify';
import { GoSearch, GoTrashcan } from 'react-icons/go';
import { SlSettings } from 'react-icons/sl'
import moment from 'moment';

const ClientDocument = () => {
  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%'
      });
    }
  });

  const { get } = useHttp();
  const { loading, setLoading } = useCompanyContext();
  const [documentName, setDocumentName] = useState("")
  const [expire, setExpire] = useState("")
  const [document, setDocument] = useState("")
  const [staffDocument, setStaffDocument] = useState([]);
  const id = JSON.parse(localStorage.getItem('user'));

  const handleView = (documentUrl) => {
    window.open(documentUrl, '_blank');
  };
  const downloadLinkRef = useRef(null);


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
      name: 'Document',
      selector: row => row.documentName,
      sortable: true,
      expandable: true,
      cell: (row) => (
        <div className='d-flex flex-column gap-1 p-2'>
          <span> {row.documentName}</span>
          <span className='d-flex'>
            <span className='bg-primary text-white pointer px-2 py-1 rounded-2'
              title='View'
              onClick={() => handleView(row.documentUrl)}
            >

              <FaEye />
            </span>

            <a ref={downloadLinkRef} style={{ display: 'none' }} />
          </span>
        </div>
      ),
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


  // const id = JSON.parse(localStorage.getItem('user'))
  const clientProfile = JSON.parse(localStorage.getItem('clientProfile'))

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedExtensions = /(\.pdf|\.doc)$/i;

    if (allowedExtensions.exec(selectedFile.name)) {
      setDocument(selectedFile);
    } else {
      alert('Please select a PDF or DOC file');
    }
  };

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


  const privateHttp = useHttp()
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (documentName === "" || expire.length === 0 || document === "") {
      return toast.error("Input Fields cannot be empty")
    }

    const formData = new FormData()
    formData.append("CompanyId", id.companyId);
    formData.append("DocumentFile", document);
    formData.append("DocumentName", documentName);
    formData.append("ExpirationDate", expire);
    formData.append("User", id.fullName);
    formData.append("UserRole", id.role);
    formData.append("Status", "Pending");
    formData.append("UserId", clientProfile.profileId);

    try {
      setLoading(true)
      const { data } = await privateHttp.post(`/Profiles/document_upload?userId=${id.userId}`,
        formData

      )
      // console.log(data);
      toast.success(data.message)

      setLoading(false)

    } catch (error) {
      console.log(error);
      toast.error(error.message)
      setLoading(false);

    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    const getStaffDocument = async () => {
      try {
        const response = await privateHttp.get(`/Documents/get_all_client_documents?clientId=${clientProfile.profileId}`, { cacheTimeout: 300000 })
        setStaffDocument(response.data.clientDocuments)
        setLoading(false)
        // console.log(response.data.clientDocuments);
      } catch (error) {
        console.log(error);
      }
    }
    getStaffDocument()
  }, [])

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
        <table className='table'>

          <thead>
            <tr>
              <th>User</th>
              <th>Date Created</th>
              <th>Date Modified</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.user}</td>
              <td>{moment(data.dateCreated).format('lll')}</td>
              <td>{moment(data.dateModified).format('lll')}</td>
              <td>

              </td>
            </tr>
          </tbody>

        </table>


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
    <>
      <div className="page-wrapper">
        <Helmet>
          <title> Upload document</title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">Documents</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/client/client/clientDashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Client Documents</li>
                </ul>
              </div>
              <div className="col-auto float-end ml-auto">
                <a href="" className="btn add-btn" data-bs-toggle="modal" data-bs-target="#add_policy"><i className="fa fa-plus" /> Add New Document</a>
              </div>
            </div>
          </div>

          <div className='mt-4 border'>
            <div className="d-flex p-2 justify-content-between align-items-center gap-4">

              <div className='d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                <input type="text" placeholder="Search Staff" className='border-0 outline-none' onChange={handleSearch} />
                <GoSearch />
              </div>
              <div className='d-flex  justify-content-center align-items-center gap-4'>
                <CSVLink
                  data={staffDocument}
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
              {/* <div>
                                    <Link to={'/app/employee/addadmin'} className="btn add-btn rounded-2">
                                        Create New Admin</Link>
                                </div> */}
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
        {/* /Page Content */}
        {/* Add Policy Modal */}
        <div id="add_policy" className="modal custom-modal fade" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Documents</h5>
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Document Name <span className="text-danger">*</span></label>
                    <input className="form-control" type="text" onChange={e => setDocumentName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Expiration Date <span className="text-danger">*</span></label>
                    <input className="form-control" type="date" onChange={e => setExpire(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label>Upload Document <span className="text-danger">*</span></label>
                    <div className="custom-file">
                      <input type="file" className="custom-file-input" accept=".pdf,.doc" id="policy_upload" onChange={handleFileChange} />
                    </div>
                  </div>
                  <div className="submit-section">
                    <button className="btn btn-primary submit-btn" data-bs-dismiss="modal" aria-label="Close" disabled={loading ? true : false} >
                      {loading ? <div className="spinner-grow text-light" role="status">
                        <span className="sr-only">Loading...</span>
                      </div> : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
      <Offcanvas />
    </>

  );

}

export default ClientDocument;


