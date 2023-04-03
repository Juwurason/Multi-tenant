
import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from "react-helmet";
import Offcanvas from '../../../Entryfile/offcanvance';

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
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Staff</th>
                <th>ClockIn</th>
                <th>Duration</th>
                <th>ClockOut</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{startIndex + index + 1}</td>
                  <td>{item.staff}</td>
                  <td>{item.clockIn}</td>
                  <td>{item.duration}</td>
                  <td>{item.clockOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ marginRight: "1rem" }}>{`Page ${currentPage} of ${totalPages}`}</div>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <button onClick={handlePrevClick} disabled={currentPage === 1} style={{ backgroundColor: "blue", color: "white", marginRight: "0.5rem" }}>Prev</button>
              <button onClick={handleNextClick} disabled={currentPage === totalPages} style={{ backgroundColor: "blue", color: "white" }}>Next</button>
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
