/**
 * Form Elemets
 */
import React, { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import StaffTable from '../StaffTable';

const StaffForm = () => {
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
        <title> Availabilities</title>
        <meta name="description" content="Login page" />
      </Helmet>
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              {/* <h3 className="page-title">Staff Availabilities</h3> */}
              <ul className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/staff/staff/staffDashboard">Dashboard</Link></li>
                <li className="breadcrumb-item active">Staff Availabilities</li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title mb-0">Add your availability & Schedule</h4>
              </div>
              <div className="card-body">
                <form action="#">
                  <div className="form-group">
                    <label>Days</label>
                    <select className="select">
                      <option>Select Days</option>
                      <option value={1}>Monday</option>
                      <option value={2}>Tuesday</option>
                      <option value={3}>Wednessday</option>
                      <option value={4}>Thursday</option>
                      <option value={5}>Friday</option>
                      <option value={6}>Saturday</option>
                      <option value={7}>Sunday</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>From Time of Day</label>
                    <input type="time" className="form-control" />
                  </div>
                  <div className="form-group">
                    <label>To Time of Day</label>
                    <input type="time" className="form-control" />
                  </div>
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary">Add</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
          </div>
        </div>

        <StaffTable />
      </div>

    </div>
  );
}
export default StaffForm;