
import React, { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import { Avatar_02, Avatar_05, Avatar_11, Avatar_12, Avatar_09, Avatar_10, Avatar_13 } from "../../../Entryfile/imagepath"
import Offcanvas from '../../../Entryfile/offcanvance';
import Addschedule from "../../../_components/modelbox/Addschedule"
import useHttp from '../../../hooks/useHttp';
import '../../../assets/css/table.css'
import { useCompanyContext } from '../../../context';

const ShiftScheduling = () => {
  const { staff, clients } = useCompanyContext()

  // const privateHttp = useHttp()
  // useEffect(() => {
  //   const getShift = async () => {
  //     try {
  //       const { data } = await privateHttp.get('/ShiftRosters/get_all_shift_rosters')

  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   getShift()
  // }, [])



  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%'
      });
    }
  });
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <Helmet>
          <title>Shift Roaster</title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Roaster Calendar View</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link to="/app/employee/allemployees">Employees</Link></li>
                  <li className="breadcrumb-item active">Shift Scheduling</li>
                </ul>
              </div>
              <div className="col-auto float-end ml-auto">
                <Link to="/app/employee/shift-list" className="btn add-btn m-r-5">Shifts</Link>
                <a href="#" className="btn add-btn m-r-5" data-bs-toggle="modal" data-bs-target="#add_schedule"> Assign Shifts</a>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Content Starts */}
          {/* Search Filter */}




          <div className="row filter-row align-items-center">
            <div className="col-sm-6 col-md-3">
              <div className="form-group">
                <label className="col-form-label">Client Name</label>
                <div>
                  <select className="form-select">
                    <option defaultValue hidden>--Select a Client--</option>
                    {
                      staff.map((data, index) =>
                        <option value={data.staffId} key={index}>{data.fullName}</option>)
                    }
                  </select></div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="form-group">
                <label className="col-form-label">Client Name</label>
                <div>
                  <select className="form-select">
                    <option defaultValue hidden>--Select a Client--</option>
                    {
                      clients.map((data, index) =>
                        <option value={data.staffId} key={index}>{data.fullName}</option>)
                    }
                  </select></div>
              </div>
            </div>
            <div className="col-sm-6 col-md-2">
              <div className="form-group">
                <label className="col-form-label">Date From</label>
                <div>
                  <input className="form-control floating datetimepicker" type="date" />

                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-2">
              <div className="form-group">
                <label className="col-form-label">Date To</label>
                <div>
                  <input className="form-control floating datetimepicker" type="date" />

                </div>
              </div>
            </div>

            <div className="col-sm-6 col-md-2 ">
              <a href="#" className="btn btn-primary btn-block w-100"> Search </a>
            </div>
          </div>
          {/* Search Filter */}

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
                      <th>Name</th>
                      <th>Date Created</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td><a href="#"><img src="/examples/images/avatar/1.jpg" className="avatar" alt="Avatar" /> Michael Holz</a></td>
                      <td>04/10/2013</td>
                      <td>Admin</td>
                      <td><span className="status text-success">•</span> Active</td>
                      <td>
                        <a href="#" className="settings" title="Settings" data-toggle="tooltip"><i className="material-icons"></i></a>
                        <a href="#" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                      </td>
                    </tr>




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


          {/* /Content End */}
        </div>
        {/* /Page Content */}

      </div>
      {/* /Page Wrapper */}
      {/* Add Schedule Modal */}
      <Addschedule />
      {/* /Add Schedule Modal */}
      {/* Edit Schedule Modal */}






      {/* /Edit Schedule Modal */}
      <Offcanvas />
    </>
  );

}

export default ShiftScheduling;
