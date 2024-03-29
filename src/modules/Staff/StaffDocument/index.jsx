
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
import moment from 'moment';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const StaffDocument = ({ staffDocument, FetchData, loading }) => {


  const { get } = useHttp();
  const [documentName, setDocumentName] = useState("")
  const [otherDocumentName, setOtherDocumentName] = useState("")
  const [expire, setExpire] = useState("")
  const [document, setDocument] = useState(null)
  // const [staffDocument, setStaffDocument] = useState([]);
  const id = JSON.parse(localStorage.getItem('user'));
  const staffPro = JSON.parse(localStorage.getItem('staffProfile'));
  const [showModal2, setShowModal2] = useState(false);

  const handleView = (documentUrl) => {
    window.open(documentUrl, '_blank');
  };
  const downloadLinkRef = useRef(null);
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault('Australia/Sydney');
  const nowInAustraliaTime = dayjs().tz().format('YYYY-MM-DD');

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
        <div className='d-flex flex-column gap-1 p-2 overflow-hidden'>
          <span title={row.documentName}> {row.documentName} </span>

          <span className='d-flex'>
            <span className='bg-primary text-white pointer px-2 py-1 rounded d-flex justify-content-center align-items-center'
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
      selector: row => !row.expirationDate ? "No Expiration Date" : moment(row.expirationDate).format('ll'),
      sortable: true,
      expandable: true
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      expandable: true,
      cell: (row) => {
        const isExpired = dayjs(row.expirationDate).format('YYYY-MM-DD') < (nowInAustraliaTime);
        let status;

        if (isExpired) {
          status = 'Expired';
        } else if (row.status === 'Rejected') {
          status = 'Rejected';
        } else {
          status = row.status;
        }

        const statusClasses = `px-2 py-1 rounded-pill fw-bold ${isExpired ? 'bg-danger text-white' : ''
          } ${row.status === 'Pending'
            ? 'bg-warning'
            : row.status === 'Accepted'
              ? 'bg-success text-white'
              : row.status === 'Rejected'
                ? 'bg-danger text-white'
                : 'bg-transparent'
          }`;

        return (
          <span className={statusClasses} style={{ fontSize: '10px' }}>
            {status}
          </span>
        );
      },
    },

  ];


  // const id = JSON.parse(localStorage.getItem('user'))
  const getStaffProfile = JSON.parse(localStorage.getItem('staffProfile'))


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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedExtensions = /(\.pdf|\.doc)$/i;

    if (allowedExtensions.exec(selectedFile.name)) {
      setDocument(selectedFile);
    } else {
      alert('Please select a PDF or DOC file');
    }
  };

  const privateHttp = useHttp()
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (documentName === "" || document === null) {
      return toast.error("Input Fields cannot be empty")
    }

    const formData = new FormData()
    formData.append("CompanyId", id.companyId);
    formData.append("DocumentFile", document);
    // formData.append("DocumentName", documentName);
    if (documentName === "Other") {
      formData.append("DocumentName", otherDocumentName);
    } else {
      formData.append("DocumentName", documentName);
    }
    formData.append("ExpirationDate", expire);
    formData.append("User", id.fullName);
    formData.append("UserRole", id.role);
    formData.append("Status", "Pending");
    formData.append("UserId", getStaffProfile.staffId);

    try {
      setLoading2(true)
      const { data } = await privateHttp.post(`/Staffs/document_upload?userId=${id.userId}`,
        formData

      )
      // console.log(data);
      toast.success(data.message)
      setLoading2(false)
      setShowModal2(false)
      FetchData()

    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
      setLoading2(false);

    }
    finally {
      setLoading2(false)
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
      confirmButtonColor: '#405189',
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

  const showModa = () => {
    setShowModal2(true)
  }

  const [editAvail, setEditAvail] = useState({});
  const [loading2, setLoading2] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [documenti, setDocumenti] = useState("")
  const [idSave, setIdSave] = useState('')

  const handleEdit = async (e) => {
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
    formData.append("UserId", staffPro.staffId);
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
        <div><span className='fw-bold'>Document Name: </span>{data.documentName} </div>
        <div ><span className='fw-bold'>Date Created: </span> {moment(data.dateCreated).format('lll')}</div>
        <div>
          <button className="btn text-info fw-bold" style={{ fontSize: "12px" }} onClick={() => handleEdit(data.documentId)}>
            Edit
          </button> |
          <button onClick={() => handleDelete(data.documentId)} className="btn text-danger fw-bold" style={{ fontSize: "12px" }}>
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
                  <li className="breadcrumb-item"><Link to="/staff/staff/dashboard">Dashboard</Link></li>
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

        <Modal show={showModal2} onHide={() => setShowModal2(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Upload Document</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="row">
              <div className='col-md-12'>
                <div className="form-group">
                  <label>Document Name</label>
                  <select className='form-select' onChange={(e) => setDocumentName(e.target.value)} required>
                    <option defaultValue hidden>Select Document Name</option>
                    <option value={"Current first aid certificate"}>Current first aid certificate</option>
                    <option value={"Current Police check"}>Current Police check</option>
                    <option value={"NDIS orientation module certificate"}>NDIS orientation module certificate</option>
                    <option value={"Working with vulnerable Peoples card"}>Working with vulnerable Peoples card</option>
                    <option value={"Australian Driver's license"}>Australian Driver's license</option>
                    <option value={"Comprehensive Car Insurance Certificate"}>Comprehensive Car Insurance Certificate</option>
                    <option value={"Relevant academic certificate"}>Relevant academic certificate</option>
                    <option value={"Other"}>Other</option>
                  </select>
                  {documentName === "Other" && (
                    <div className="mt-2">
                      <label>Other Document Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter the document name"
                        onChange={(e) => setOtherDocumentName(e.target.value)}
                        required
                      />
                    </div>
                  )}
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
                  <label>Select Document</label> <br />
                  <input className="form-control" type="file"
                    accept=".pdf,.doc,.docx"
                    maxsize={1024 * 1024 * 2}
                    onChange={handleFileChange}
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
              <div className='col-md-12'>
                <div className="form-group">
                  <label>Document Name</label>
                  <input className="form-control" type="text" name='documentName' value={editAvail.documentName || ''} onChange={handleInputChange} />

                </div>
              </div>
              <div className='col-md-12'>
                <div className="form-group">
                  <label>Expiration Date</label>
                  <input className="form-control" type="date" name='expirationDate' value={editAvail.expirationDate || ''} onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className='col-md-12'>
                <div className="form-group">
                  <label>Upload Document</label> <br />
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
