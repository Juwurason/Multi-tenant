
import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import "../../antdstyle.css"
import '../../../assets/css/table.css'
import Editemployee from "../../../_components/modelbox/Editemployee"
import Addemployee from "../../../_components/modelbox/Addemployee"
import Header from '../../../initialpage/Sidebar/header'
import Sidebar from '../../../initialpage/Sidebar/sidebar';
import Offcanvas from '../../../Entryfile/offcanvance';
import { useCompanyContext } from '../../../context';


const Employeeslist = () => {
  const { staff } = useCompanyContext()
  const [menu, setMenu] = useState(false)

  const toggleMobileMenu = () => {
    setMenu(!menu)
  }





  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%'
      });
    }
  });
  console.log(staff);
  return (
    <>
      <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>

        <Header onMenuClick={(value) => toggleMobileMenu()} />
        <Sidebar />
        <div className="page-wrapper">
          <Helmet>
            <title>Staff List</title>
            <meta name="description" content="Login page" />
          </Helmet>
          {/* Page Content */}
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col">
                  <h3 className="page-title">Staff</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Staff</li>
                  </ul>
                </div>
                <div className="col-auto float-end ml-auto">
                  <a href="#" className="btn add-btn" data-bs-toggle="modal" data-bs-target="#add_employee"><i className="fa fa-plus" /> Add Employee</a>
                  <div className="view-icons">
                    <Link to="/app/employee/allemployees" className="grid-view btn btn-link"><i className="fa fa-th" /></Link>
                    <Link to="/app/employee/employees-list" className="list-view btn btn-link active"><i className="fa fa-bars" /></Link>
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
                  <label className="focus-label">Staff ID</label>
                </div>
              </div>
              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <input type="text" className="form-control floating" />
                  <label className="focus-label">Staff Name</label>
                </div>
              </div>
              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <input type="text" className="form-control floating" />
                  <label className="focus-label">Staff Email</label>
                </div>
              </div>

              <div className="col-sm-6 col-md-3">
                <a href="#" className="btn btn-primary btn-block w-100"> Search </a>
              </div>
            </div>
            {/* /Search Filter */}


            <div className="">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title bg-primary">
                    <div className="row">
                      <div className="col-sm-5">

                      </div>
                      <div className="col-sm-7">
                        <a href="#" className="btn btn-secondary"><i className="material-icons"></i> <span>Download PDF</span></a>
                        <a href="#" className="btn btn-secondary"><i className="material-icons"></i> <span>Export to Excel</span></a>
                      </div>
                    </div>
                  </div>
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Staff ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Gender</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        staff.map(data =>

                          <tr key={data.staffId}>
                            <td>{data.staffId}</td>
                            <td><a href="#"> {data.maxStaffId}</a></td>
                            <td><Link to={`/app/profile/employee-profile/${data.staffId}/${data.firstName}`}> {data.fullName}</Link></td>
                            <td>{data.email}</td>
                            <td>{data.phoneNumber}</td>
                            <td>{data.gender}</td>
                            <td><span className="status text-success">•</span> Active</td>
                            <td>
                              <Link to={`/app/profile/edit-profile/${data.staffId}`} className="settings" title="Settings" data-toggle="tooltip">
                                <i className="material-icons"></i>
                              </Link>
                              <a href="#" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                            </td>
                          </tr>
                        )
                      }




                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text">Showing <b>5</b> out of <b>25</b> entries</div>
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
          {/* Add Employee Modal */}
          <Addemployee />
          {/* /Add Employee Modal */}
          {/* Edit Employee Modal */}
          <Editemployee />
          {/* /Edit Employee Modal */}
          {/* Delete Employee Modal */}
          <div className="modal custom-modal fade" id="delete_employee" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="form-header">
                    <h3>Delete Employee</h3>
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
          {/* /Delete Employee Modal */}
        </div>
      </div>
      <Offcanvas />
    </>


  );
}

export default Employeeslist;
