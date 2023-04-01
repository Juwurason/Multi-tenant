
import React, { useEffect,useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';

import { Table } from 'antd';
import 'antd/dist/antd.css';
import {itemRender,onShowSizeChange} from "../../../MainPage/paginationfunction"
// import "../antdstyle.css"
import Offcanvas from '../../../Entryfile/offcanvance';
import { toast } from "react-toastify";
import useHttp from '../../../hooks/useHttp';

const StaffDocument = () => {
  const [data, setData] = useState([
    {id:1,policyname:"John Doe",description:"Lorem ipsum dollar",department:"Staff",creatat:"1 Jan 2013",status:"Active"},
         {id:2,policyname:"Richard Miles",description:"Lorem ipsum dollar",department:"Staff",creatat:"18 Mar 2014",status:"Active"},
  ]);
  useEffect( ()=>{
    if($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%'
      });
    }
  });  

  const [loading, setLoading] = useState(false)
  const [documentName, setDocumentName] = useState(null)
  const [expire, setExpire] = useState(null)
  const [document, setDocument] = useState(null)

  const id = JSON.parse(localStorage.getItem('user'))

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
    if (documentName === "" ||  expire === "" || document === "")
     {
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

    try {
      setLoading(true)
      const { data } = await privateHttp.post(`/Staffs/document_upload?userId=${id.userId}`,
        formData

      )
      // console.log(data);
      toast.success(data.message)

      setLoading(false)

    } catch (error) {
      console.log(error);
      toast.error(data.error)
      setLoading(false);

    }
    finally{
        setLoading(false)
    }
}
  
    const columns = [
      
      {
        title: 'S/N',
        dataIndex: 'id',
          sorter: (a, b) => a.id.length - b.id.length,
      }, 
      {
        title: 'User',
        dataIndex: 'policyname', 
        sorter: (a, b) => a.policyname.length - b.policyname.length,
      }, 
      {
        title: 'Role',
        dataIndex: 'department', 
        sorter: (a, b) => a.department.length - b.department.length,
      },        
      {
        title: 'Document',
        dataIndex: 'description',
        sorter: (a, b) => a.description.length - b.description.length,
      },
      {
        title: 'Expires Date',
        // dataIndex: 'description',
        // sorter: (a, b) => a.description.length - b.description.length,
      },
      {
        title: 'Status',
        // dataIndex: 'description',
        // sorter: (a, b) => a.description.length - b.description.length,
      },
      {
        title: 'Created',
        dataIndex: 'creatat',
        sorter: (a, b) => a.creatat.length - b.creatat.length,
      },
      {
        title: 'Action',
        render: (text, record) => (
            <div className="dropdown dropdown-action text-end">
               <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
                <div className="dropdown-menu dropdown-menu-right">
                  {/* <a className="dropdown-item" href="#"><i className="fa fa-download m-r-5" /> Download</a> */}
                  <a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#edit_policy"><i className="fa fa-pencil m-r-5" /> Edit</a>
                  <a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#delete_policy"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                </div>
            </div>
          ),
      },
    ]
      return (
        <>
        <div className="page-wrapper">
        <Helmet>
            <title> Upload document</title>
            <meta name="description" content="Login page"/>					
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
                <a href="#" className="btn add-btn" data-bs-toggle="modal" data-bs-target="#add_policy"><i className="fa fa-plus" /> Add New Document</a>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <Table className="table-striped"
                  pagination= { {total : data.length,
                    showTotal : (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                    showSizeChanger : true,onShowSizeChange: onShowSizeChange ,itemRender : itemRender } }
                  style = {{overflowX : 'auto'}}
                  columns={columns}                 
                  // bordered
                  dataSource={data}
                  rowKey={record => record.id}
                  // onChange={this.handleTableChange}
                />
              </div>
            </div>
          </div> */}
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
                      {/* {document && <p>Selected file: {document.name}</p>} */}
                      {/* <label className="custom-file-label" htmlFor="policy_upload">Choose file</label> */}
                    </div>
                  </div>
                  <div className="submit-section">
                    <button className="btn btn-primary submit-btn" disabled={loading ? true : false}>
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
        {/* /Add Policy Modal */}
        {/* Edit Policy Modal */}
        <div id="edit_policy" className="modal custom-modal fade" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Policy</h5>
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>Policy Name <span className="text-danger">*</span></label>
                    <input className="form-control" type="text" defaultValue="Leave Policy" />
                  </div>
                  <div className="form-group">
                    <label>Description <span className="text-danger">*</span></label>
                    <textarea className="form-control" rows={4} defaultValue={""} />
                  </div>
                  <div className="form-group">
                    <label className="col-form-label">Department</label>
                    <select className="select">
                      <option>All Departments</option>
                      <option>Web Development</option>
                      <option>Marketing</option>
                      <option>IT Management</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Upload Policy <span className="text-danger">*</span></label>
                    <div className="custom-file">
                      <input type="file" className="custom-file-input" id="edit_policy_upload" />
                      <label className="custom-file-label" htmlFor="edit_policy_upload">Choose file</label>
                    </div>
                  </div>
                  <div className="submit-section">
                    <button className="btn btn-primary submit-btn">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Edit Policy Modal */}
        {/* Delete Policy Modal */}
        <div className="modal custom-modal fade" id="delete_policy" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Policy</h3>
                  <p>Are you sure want to delete?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <a href="" className="btn btn-primary continue-btn">Delete</a>
                    </div>
                    <div className="col-6">
                      <a href="" data-bs-dismiss="modal" className="btn btn-primary cancel-btn">Cancel</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Delete Policy Modal */}
      </div>
      <Offcanvas/>
        </>
      
      );
   
}

export default StaffDocument;
