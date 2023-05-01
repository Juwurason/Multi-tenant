
import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from "react-helmet";
import Offcanvas from '../../../Entryfile/offcanvance';
import { Link } from 'react-router-dom';

const StaffAttendance = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const data = [
    { staff: 'Ajibola Sunday', clockIn: '2/8/2023 9:50:00 AM', duration: '8 Hrs 10 min', clockOut: '2/8/2023 6:00:00 PM' },
    { staff: 'John Doe', clockIn: '2/8/2023 8:30:00 AM', duration: '9 Hrs 30 min', clockOut: '2/8/2023 6:00:00 PM' }
  ];
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);
  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title> Attendance </title>
          <meta name="description" content="Attendance page" />
        </Helmet>

        <div className='content container-fluid'>

        <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Attendance</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/staff/staff/staffDashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Attendance</li>
                </ul>
              </div>
            </div>
          </div>
       
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
                <table className="table table-striped">
                  <thead className='text-white' style={{ backgroundColor: "#18225C" }}>
                    <tr style={{ backgroundColor: "#18225C" }}>
                      <th>#</th>
                      <th>Staff</th>
                      <th>ClockIn</th>
                      <th>Duration</th>
                      <th>ClockOut</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td><a href="#">Michael Holz</a></td>
                      <td>2/8/2023 9:50:00 AM</td>
                      <td>8 Hrs 10 min</td>
                      <td>2/8/2023 6:00:00 PM</td>
                      <td>
                        <a href="#" className="settings" title="Settings" data-toggle="tooltip"><i className="material-icons"></i></a>
                        <a href="#" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                      </td>
                    </tr>
          
                  </tbody>
                </table>
                <div className="clearfix">
                  <div className="hint-text">Showing <b>1</b> out of <b>1</b> entries</div>
                  <ul className="pagination">
                    <li className="page-item disabled"><a href="#">Previous</a></li>
                    <li className="page-item active"><a href="#" className="page-link">1</a></li>
                    <li className="page-item"><a href="#" className="page-link">2</a></li>
                    <li className="page-item"><a href="#" className="page-link">3</a></li>
                    <li className="page-item"><a href="#" className="page-link">4</a></li>
                    <li className="page-item"><a href="#" className="page-link">5</a></li>
                    <li className="page-item"><a href="#" className="page-link">Next</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
      <Offcanvas />
    </>

  );

}

export default StaffAttendance;
