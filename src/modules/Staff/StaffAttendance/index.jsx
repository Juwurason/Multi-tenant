
import React, { useEffect,useState,useRef } from 'react';
import { Helmet } from "react-helmet";
import Offcanvas from '../../../Entryfile/offcanvance';

const StaffAttendance = () => {
      return (
        <>
        <div className="page-wrapper">
        <Helmet>
            <title> Attendance </title>
            <meta name="description" content="Attendance page"/>					
        </Helmet>
        
        
        <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Staff</th>
              <th>ClockIn</th>
              <th>Duration</th>
              <th>ClockOut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ajibola Sunday</td>
              <td>2/8/2023 9:50:00 AM</td>
              <td>8 Hrs 10 min</td>
              <td>2/8/2023 6:00:00 PM</td>
            </tr>
            <tr>
            <td>Ajibola Sunday</td>
              <td>2/8/2023 9:50:00 AM</td>
              <td>8 Hrs 10 min</td>
              <td>2/8/2023 6:00:00 PM</td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
      <Offcanvas/>
        </>
      
      );
   
}

export default StaffAttendance;
