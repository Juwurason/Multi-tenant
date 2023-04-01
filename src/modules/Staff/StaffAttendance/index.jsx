
import React, { useEffect,useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';

import {itemRender,onShowSizeChange} from "../../../MainPage/paginationfunction"
// import "../antdstyle.css"
import Offcanvas from '../../../Entryfile/offcanvance';

const StaffAttendance = () => {
      return (
        <>
       <h1>Attendance</h1>
      <Offcanvas/>
        </>
      
      );
   
}

export default StaffAttendance;
