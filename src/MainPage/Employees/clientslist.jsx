
import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import Editclient from "../../_components/modelbox/Editclient"
import 'antd/dist/antd.css';
import "../antdstyle.css"
import { useCompanyContext } from '../../context';
import AddClient from '../../_components/modelbox/Addclient';

const Clients = () => {
  const { clients } = useCompanyContext()

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%'
      });
    }
  });



  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Clients List</title>
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
            <div className="col-auto float-end ml-auto">
              <a href="#" className="btn add-btn" data-bs-toggle="modal" data-bs-target="#add_client"><i className="fa fa-plus" /> Add Client</a>
              <div className="view-icons">
                <Link to="/app/employees/clients" className="grid-view btn btn-link"><i className="fa fa-th" /></Link>
                <Link to="/app/employees/clients-list" className="list-view btn btn-link active"><i className="fa fa-bars" /></Link>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        {/* Search Filter */}
        <div className="row filter-row">
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
            <a href="#" className="btn btn-primary btn-block w-100"> Search </a>
          </div>
        </div>

        {/* Search Filter */}


        <div className="">
          <div className="table-responsive">
            <div className="row mt-4">

              <div className="col-sm-7 d-flex gap-2">
                <a href="#" className="btn btn-info"><i className="material-icons"></i> <span>Download PDF</span></a>
                <a href="#" className="btn btn-danger"><i className="material-icons"></i> <span>Export to Excel</span></a>
              </div>
            </div>
            <div className="table-wrapper">
              <div className="table-title bg-light">

              </div>
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Gender</th>
                    <th>State</th>
                    <th>City</th>
                    <th>Date of Birth</th>
                    <th>user Modified</th>
                    <th>Date Modified</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    clients.map(data =>

                      <tr key={data.profileId}>
                        <td>{data.profileId}</td>
                        <td>{data.fullName}</td>
                        <td><a href="#"> {data.address}</a></td>
                        <td><a href="#"> {data.email}</a></td>
                        <td>{data.phoneNumber}</td>
                        <td>{data.gender}</td>
                        <td>{data.state}</td>
                        <td>{data.state}</td>
                        <td>{data.dateOfBirth}</td>
                        <td>{data.dateOfBirth}</td>
                        <td>{data.dateOfBirth}</td>
                        <td><span className="status text-success">•</span> Active</td>
                        <td>
                          <Link to={`/app/profile/edit-profile/${data.staffId}`} className="settings" title="Settings" data-toggle="tooltip">
                            <i className="material-icons">mode_edit</i>
                          </Link>
                          <a href="#" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                        </td>
                      </tr>
                    )
                  }




                </tbody>
              </table>
              <div className="clearfix">
                <div className="hint-text">Showing <b>1</b> out of <b>25</b> entries</div>
                <ul className="pagination">
                  <li className="page-item disabled"><a href="#">Previous</a></li>
                  <li className="page-item"><a href="#" className="page-link">1</a></li>
                  <li className="page-item"><a href="#" className="page-link">2</a></li>
                  <li className="page-item active"><a href="#" className="page-link">3</a></li>
                  <li className="page-item"><a href="#" className="page-link">4</a></li>
                  <li className="page-item"><a href="#" className="page-link">5</a></li>
                  <li className="page-item"><a href="#" className="page-link">Next</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>



      </div>
      {/* /Page Content */}
      {/* Add Client Modal */}

      {/* /Add Client Modal */}
      <AddClient />
      {/* Edit Client Modal */}
      <Editclient />
      {/* /Edit Client Modal */}
      {/* Delete Client Modal */}
      <div className="modal custom-modal fade" id="delete_client" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Client</h3>
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
      {/* /Delete Client Modal */}
    </div>
  );
}

export default Clients;
