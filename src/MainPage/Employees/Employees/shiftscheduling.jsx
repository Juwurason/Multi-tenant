
import React, { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import { Avatar_02, Avatar_05, Avatar_11, Avatar_12, Avatar_09, Avatar_10, Avatar_13 } from "../../../Entryfile/imagepath"
import Offcanvas from '../../../Entryfile/offcanvance';
import Addschedule from "../../../_components/modelbox/Addschedule"
import { Events } from '../../../_components/modelbox/Events';
import { Scheduler } from "@aldabil/react-scheduler";
import useHttp from '../../../hooks/useHttp';

const ShiftScheduling = () => {
  const privateHttp = useHttp()
  useEffect(() => {
    const getShift = async () => {
      try {
        const { data } = await privateHttp.get('/ShiftRosters/get_all_shift_rosters')
        console.log(data)

      } catch (error) {
        console.log(error);
      }
    }
    getShift()
  }, [])



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




          <div className="row filter-row">
            <div className="col-sm-6 col-md-3">
              <div className="form-group form-focus">
                <input type="text" className="form-control floating" />
                <label className="focus-label">Employee</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="form-group form-focus select-focus">
                <select className="select floating">
                  <option>All Department</option>
                  <option value={1}>Finance</option>
                  <option value={2}>Finance and Management</option>
                  <option value={3}>Hr &amp; Finance</option>
                  <option value={4}>ITech</option>
                </select>
                <label className="focus-label">Department</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-2">
              <div className="form-group form-focus focused">
                <div>
                  <input className="form-control floating datetimepicker" type="date" />
                </div>
                <label className="focus-label">From</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-2">
              <div className="form-group form-focus focused">
                <div>
                  <input className="form-control floating datetimepicker" type="date" />
                </div>
                <label className="focus-label">To</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-2">
              <a href="#" className="btn btn-success btn-block w-100"> Search </a>
            </div>
          </div>
          {/* Search Filter */}




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
