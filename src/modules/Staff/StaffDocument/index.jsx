
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
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';

const StaffDocument = () => {
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
  const [showModal2, setShowModal2] = useState(false);

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
    }

  ];


  // const id = JSON.parse(localStorage.getItem('user'))
  const getStaffProfile = JSON.parse(localStorage.getItem('staffProfile'))

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

  

  const getStaffDocument = async () => {
    try {
      const {data} = await privateHttp.get(`/Documents/get_all_staff_documents?staffId=${getStaffProfile.staffId}`, { cacheTimeout: 300000 })
      setStaffDocument(data.staffDocuments)
    
      setLoading(false)
      // console.log(data.staffDocuments);

    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    setLoading(true)
    getStaffDocument()
  }, [])

  const privateHttp = useHttp()
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (documentName === "" || document === "") {
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
    formData.append("UserId", getStaffProfile.staffId);

    try {
      setLoading(true)
      const { data } = await privateHttp.post(`/Staffs/document_upload?userId=${id.userId}`,
        formData

      )
      // console.log(data);
      toast.success(data.message)
      setLoading(false)
      setShowModal2(false)
      getStaffDocument()

    } catch (error) {
      console.log(error);
      toast.error(error.message)
      setLoading(false);

    }
    finally {
      setLoading(false)
    }
  }


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

  const handleDelete = async (e) => {
    Swal.fire({
      html: `<h3>Are you sure? you want to delete this Document</h3>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1C75BC',
      cancelButtonColor: '#C8102E',
      confirmButtonText: 'Confirm Delete',
      showLoaderOnConfirm: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await privateHttp.post(`/Documents/delete/${e}`)
          // console.log(data);
          if (data.status === 'Success') {
            toast.success(data.message);
            getStaffDocument()
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

  const showModa = () =>{
    setShowModal2(true)
  }

  const [editAvail, setEditAvail] = useState({});
  const [loading2, setLoading2] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [documenti, setDocumenti] = useState("")
  const [idSave, setIdSave] = useState('')

  const handleEdit = async(e) => {
    setShowModal(true);
    setIdSave(e)
    // setLoading2(true)
    try {

      const { data } = await get(`/Documents/get_document/${e}`, { cacheTimeout: 300000 });
      // console.log(data.staffDocument);
      setEditAvail(data.staffDocument);
    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.message);
          toast.error(error.response.data.title);
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

const handleFileChan = (e) => {
  const selectedFile = e.target.files[0];
  const allowedExtensions = /(\.pdf|\.doc)$/i;

  if (allowedExtensions.exec(selectedFile.name)) {
    setDocumenti(selectedFile);
  } else {
    alert('Please select a PDF or DOC file');
  }
};

const EditAvail = async (e) => {
    e.preventDefault()
    if (editAvail.documentName === "" || documenti === "") {
      return toast.error("Input Fields cannot be empty")
    }
  
  const formData = new FormData()
  formData.append("CompanyId", id.companyId);
  formData.append("DocumentId", idSave);
  formData.append("DocumentName", editAvail.documentName);
  formData.append("ExpirationDate", editAvail.expirationDate);
  formData.append("User", id.fullName);
  formData.append("UserRole", id.role);
  formData.append("Status", "Pending");
  formData.append("DocumentFile", documenti);
    try {
      setLoading2(true)
      const { data } = await privateHttp.post(`/Documents/edit/${idSave}?userId=${id.userId}`, formData);
      console.log(data);
      if (data.status === 'Success') {
        toast.success(data.message)
      }
      setLoading2(false)
      setShowModal(false)
      getStaffDocument()
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
      <div className="p-4">
        <table className='table'>

          <thead>
            <tr>
              <th>Date Created</th>
              <th>Actions </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{moment(data.dateCreated).format('lll')}</td>
              <td>
                <div className="d-flex gap-1">

                  <span
                    className='bg-info pointer text-white px-2 py-1 rounded-pill fw-bold' style={{ fontSize: "10px" }}
                    title='Edit'
                    onClick={() => handleEdit(data.documentId)}
                  >
                    Edit
                  </span>
                  <span
                    className='bg-warning pointer px-2 py-1 rounded-pill fw-bold' style={{ fontSize: "10px" }}
                    title='Delete'
                    onClick={() => handleDelete(data.documentId)}
                  >
                    Delete
                  </span>

                </div>
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
                  <li className="breadcrumb-item"><Link to="/staff/staff/staffDashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item active">User Documents</li>
                </ul>
              </div>
              <div className="col-auto float-end ml-auto">
                {/* <a href="" className="btn add-btn btn-primary" data-bs-toggle="modal" data-bs-target="#add_policy"> */}
                <button
                className="btn add-btn btn-primary"
                onClick={showModa}
                >
                <i className="fa fa-plus" /> Add New Document
                </button>
                  
                  {/* </a> */}
              </div>
            </div>
          </div>

          <div className='mt-4 border'>

            <div className="row px-2 py-3 d-flex justify-content-between align-items-center gap-4">

              <div className="col-md-3">
                <div className='d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                  <input type="text" placeholder="Search Documents" className='border-0 outline-none' onChange={handleSearch} />
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

        </div>
        {/* /Page Content */}
        {/* Add Policy Modal */}
        {/* <div id="add_policy" className="modal custom-modal fade" role="dialog">
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
                    <button className="btn btn-primary submit-btn"  disabled={loading ? true : false} >
                      {loading ? <div className="spinner-grow text-light" role="status">
                        <span className="sr-only">Loading...</span>
                      </div> : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div> */}
        <Modal show={showModal2} onHide={() => setShowModal2(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Upload Documents</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <form className="row">
                <div className='col-md-12'>
                  <div className="form-group">
                    <label>Document Name</label>
                    <input className="form-control" type="text" onChange={e => setDocumentName(e.target.value)} />
                    
                  </div>
                </div>
                <div className='col-md-12'>
                  <div className="form-group">
                    <label>Expiration Date</label>
                    <input className="form-control" type="date" onChange={e => setExpire(e.target.value)}
                    />
                  </div>
                </div>
                <div className='col-md-12'>
                  <div className="form-group">
                    <label>Upload Document</label>
                    <input
                    type="file"
                      className="custom-file-input" accept=".pdf,.doc" id="policy_upload"
                      onChange={handleFileChange}
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
              onClick={handleSubmit}
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




        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Document</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <form className="row">
                <div className='col-md-6'>
                  <div className="form-group">
                    <label>Document Name</label>
                    <input className="form-control" type="text" name='documentName' value={editAvail.documentName || ''} onChange={handleInputChange} />
                    
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className="form-group">
                    <label>Expiration Date</label>
                    <input className="form-control" type="date" name='expirationDate' value={editAvail.expirationDate || ''} onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className='col-md-12'>
                  <div className="form-group">
                    <label>Upload Document</label>
                    <input
                    type="file"
                      className="custom-file-input" accept=".pdf,.doc" id="policy_upload"
                       onChange={handleFileChan}
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
      <Offcanvas />
    </>

  );

}

export default StaffDocument;
