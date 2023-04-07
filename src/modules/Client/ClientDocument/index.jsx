
import React, { useEffect,useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';

import Offcanvas from '../../../Entryfile/offcanvance';
import { toast } from "react-toastify";
import useHttp from '../../../hooks/useHttp';

const ClientDocument = () => {
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
    finally{
        setLoading(false)
    }
}
  
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
                  <li className="breadcrumb-item"><Link to="/client/client/Dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item active">User Documents</li>
                </ul>
              </div>
              <div className="col-auto float-end ml-auto">
                <a href="" className="btn add-btn" data-bs-toggle="modal" data-bs-target="#add_policy"><i className="fa fa-plus" /> Add New Document</a>
              </div>
            </div>
          </div>

          <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Documnet</th>
              <th>Expiration Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ajibola Sunday</td>
              <td>Client</td>
              <td>Current first aid certificate</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
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
        
       
      </div>
      <Offcanvas/>
        </>
      
      );
   
}

export default ClientDocument;
