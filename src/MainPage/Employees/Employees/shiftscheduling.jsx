
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import { Avatar_02, Avatar_05, Avatar_11, Avatar_12, Avatar_09, Avatar_10, Avatar_13 } from "../../../Entryfile/imagepath"
import Offcanvas from '../../../Entryfile/offcanvance';
import Addschedule from "../../../_components/modelbox/Addschedule"
import useHttp from '../../../hooks/useHttp';
import '../../../assets/css/table2.css'
import { FaSearch } from 'react-icons/fa';
import { useCompanyContext } from '../../../context';

const ShiftScheduling = () => {
  const id = JSON.parse(localStorage.getItem('user'));
  const { get } = useHttp();
  const { loading, setLoading } = useCompanyContext();
  const [staff, setStaff] = useState([]);
  const [clients, setClients] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const FetchSchedule = async () => {
    setLoading(true)
    try {
      const scheduleResponse = await get(`ShiftRosters/get_all_shift_rosters?companyId=${id.companyId}`, { cacheTimeout: 300000 });
      const schedule = scheduleResponse.data;
      setSchedule(schedule);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
    try {
      const staffResponse = await get(`Staffs?companyId=${id.companyId}`, { cacheTimeout: 300000 });
      const staff = staffResponse.data;
      setStaff(staff);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }

    try {
      const clientResponse = await get(`/Profiles?companyId=${id.companyId}`, { cacheTimeout: 300000 });
      const client = clientResponse.data;
      setClients(client);
      setLoading(false)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }

  };
  useEffect(() => {
    FetchSchedule()
  }, []);





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
                <h3 className="page-title">Shift Roaster</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link to="/app/employee/allemployees">Employees</Link></li>
                  <li className="breadcrumb-item active">Shift Roaster</li>
                </ul>
              </div>
              <div className="col-auto float-end ml-auto">
                <Link to="/app/employee/add-shift" className="btn add-btn m-r-5">Add Shift</Link>
                {/* <a href="#" className="btn add-btn m-r-5" data-bs-toggle="modal" data-bs-target="#add_schedule"> Assign Shifts</a> */}
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


          <main className="table">
            <section className="table__header">
              {/* <h1>Customer's Orders</h1> */}
              <div className="input-group">
                <input type="search" className='form-control' placeholder="Search Data..." />
                <FaSearch />
              </div>
              <div className="export__file">
                <label htmlFor="export-file" className="export__file-btn" title="Export File" />
                <input type="checkbox" id="export-file" />
                <div className="export__file-options ">
                  <label>Export As &nbsp; ➜</label>
                  <label htmlFor="export-file" id="toPDF">PDF <img src="images/pdf.png" alt /></label>
                  <label htmlFor="export-file" id="toJSON">JSON <img src="images/json.png" alt /></label>
                  <label htmlFor="export-file" id="toCSV">CSV <img src="images/csv.png" alt /></label>
                  <label htmlFor="export-file" id="toEXCEL">EXCEL <img src="images/excel.png" alt /></label>
                </div>
              </div>
            </section>
            <section className="table__body">
              <table>
                <thead>
                  <tr>
                    <th> Id <span className="icon-arrow">↑</span></th>
                    <th> Customer <span className="icon-arrow">↑</span></th>
                    <th> Location <span className="icon-arrow">↑</span></th>
                    <th> Order Date <span className="icon-arrow">↑</span></th>
                    <th> Status <span className="icon-arrow">↑</span></th>
                    <th> Amount <span className="icon-arrow">↑</span></th>
                    <th> Actions <span className="icon-arrow">↑</span></th>
                    <th> Actions 2 <span className="icon-arrow">↑</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td> 1 </td>
                    <td> <img src="images/Zinzu Chan Lee.jpg" alt />Zinzu Chan Lee</td>
                    <td> Seoul </td>
                    <td> 17 Dec, 2022 </td>
                    <td>
                      <p className="">Delivered</p>
                    </td>
                    <td> <strong> $128.90 </strong></td>
                    <td> <strong> $128.90 </strong></td>
                    <td> <strong> $128.90 </strong></td>
                  </tr>


                </tbody>
              </table>

            </section>
          </main>







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
