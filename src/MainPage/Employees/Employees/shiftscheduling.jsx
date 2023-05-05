
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import { Avatar_02, Avatar_05, Avatar_11, Avatar_12, Avatar_09, Avatar_10, Avatar_13 } from "../../../Entryfile/imagepath"
import Offcanvas from '../../../Entryfile/offcanvance';
import Addschedule from "../../../_components/modelbox/Addschedule"
import useHttp from '../../../hooks/useHttp';
import '../../../assets/css/table2.css'
import { FaAngleLeft, FaAngleRight, FaArrowCircleLeft, FaArrowCircleRight, FaArrowLeft, FaArrowRight, FaFilter, FaPlus, FaSearch, FaSlidersH } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward, IoMdArrowDropleft } from 'react-icons/io';
import { useCompanyContext } from '../../../context';
import dayjs from 'dayjs';

const ShiftScheduling = () => {
  const id = JSON.parse(localStorage.getItem('user'));
  const { get } = useHttp();
  const { loading, setLoading } = useCompanyContext();
  const [staff, setStaff] = useState([]);
  const [clients, setClients] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [staffOne, setStaffOne] = useState({});
  let staffNo;

  const FetchSchedule = async () => {
    setLoading(true)
    try {
      const scheduleResponse = await get(`/ShiftRosters/get_all_shift_rosters?companyId=${id.companyId}`, { cacheTimeout: 300000 });
      const schedule = scheduleResponse.data;
      console.log(schedule);
      setSchedule(schedule);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
    try {
      const staffResponse = await get(`/Staffs?companyId=${id.companyId}`, { cacheTimeout: 300000 });
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
    }
    try {
      const { data } = await privateHttp.get(`/Staffs/${staffNo}`, { cacheTimeout: 300000 })
      setStaffOne(data)

    } catch (error) {
      console.log(error);
    }
    finally {
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

  // Get the current date
  const [currentDate, setCurrentDate] = useState(dayjs());

  const handleNextClick = () => {
    setCurrentDate(currentDate.add(6, 'day'));
  };

  const handlePrevClick = () => {
    setCurrentDate(currentDate.subtract(6, 'day'));
  };

  const daysOfWeek = [
    currentDate.subtract(3, 'day'),
    currentDate.subtract(2, 'day'),
    currentDate.subtract(1, 'day'),
    currentDate,
    currentDate.add(1, 'day'),
    currentDate.add(2, 'day'),
  ];
  const startDate = currentDate.subtract(3, 'day');
  const endDate = currentDate.add(2, 'day');

  const activitiesByDay = daysOfWeek.map((day) =>
    schedule.filter((activity) => dayjs(activity.dateFrom).isSame(day, 'day'))
  );

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
                <Link to="/app/employee/add-shift" className="btn add-btn m-r-5">Add New Roaster</Link>
                {/* <a href="#" className="btn add-btn m-r-5" data-bs-toggle="modal" data-bs-target="#add_schedule"> Assign Shifts</a> */}
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Content Starts */}
          {/* Search Filter */}

          <div className='row filter-row '>
            {/* <div className="col-md-4 col-lg-2 " style={{ height: "50vh" }}>

              <div className=''>
                <div className="form-group">
                  <select className="form-select border-0 shadow-sm" style={{ backgroundColor: '#F4F4F4' }}>
                    <option defaultValue hidden>All clients</option>
                    {
                      staff.map((data, index) =>
                        <option value={data.staffId} key={index}>{data.fullName}</option>)
                    }
                  </select></div>
                <div className="d-flex flex-column gap-2 px-2 py-3" style={{ backgroundColor: "#F3FEFF" }}>
                  <div className='d-flex justify-content-between align-items-center'>
                    <span className='fw-bold'>
                      All Staffs

                    </span>
                    <span> <FaSlidersH /></span>
                  </div>

                  <div className=''>
                    <input className="form-control" type="search" placeholder='Search staff' />

                  </div>
                  <div>

                    {
                      staff.map((data, index) =>
                        <div className='d-flex gap-2 align-items-center overflow-hidden p-2' key={index}>
                          <span className='rounded-circle bg-success' style={{ width: "10px", height: "10px" }}></span>
                          <span className='rounded-circle bg-dark' style={{ width: "30px", height: "30px" }}></span>
                          <span className='text-truncate' style={{ fontSize: '12px' }}>{data.firstName} {data.surName}</span>
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
            </div> */}




            <div className="col-md-6 col-lg-12 ">
              <div className=' py-3 d-flex justify-content-between align-items-center'>
                <span className='shadow-sm p-3' style={{ backgroundColor: '#F4F4F4' }} >
                  <FaAngleLeft className='pointer' onClick={handlePrevClick} />
                  <span className='fw-bold text-primary'> {startDate.format('MMMM D')} - {endDate.format('MMMM D')}</span>
                  <FaAngleRight className='pointer' onClick={handleNextClick} />
                </span>
                <span>
                  <select className="form-select border-0 fw-bold" style={{ backgroundColor: '#F4F4F4' }}>
                    <option defaultValue hidden>Week</option>

                    <option value=''>Month</option>
                    <option value=''>Week</option>
                    <option value=''>Day</option>

                  </select>
                </span>
              </div>
              <div className='row g-0'>

                {daysOfWeek.map((day, index) => (
                  <div className="col-md-6 col-lg-2 py-2" key={day.format('YYYY-MM-DD')}>
                    <div className='border p-2'>
                      <span
                        className={`calendar-date text-muted text-truncate overflow-hidden ${day.isSame(currentDate, 'day') ? 'current-date' : ''}`}
                        style={{ fontSize: '12px' }}>
                        {day.format('dddd, MMMM D')}

                      </span>
                    </div>
                    <div className="col-sm-12 text-center border p-2">

                      {activitiesByDay[index].map((activity, activityIndex) => (

                        <div key={activityIndex} className='bg-primary text-white rounded-2 d-flex flex-column align-items-start p-2' style={{ fontSize: '10px' }}>
                          <span className='fw-bold'>{dayjs(activity.dateFrom).format('hh:mm A')}</span>
                          <span>Kemi Spark</span>
                          <small className='text-truncate'>{activity.activities}</small>
                        </div>
                      ))}

                      {/* <button className='btn'>
                        <FaPlus />
                      </button> */}

                    </div>
                  </div>
                ))}

              </div>

            </div>
          </div>
          {/* /Content End */}
        </div>
        {/* /Page Content */}

      </div>
      {/* /Page Wrapper */}
      {/* Add Schedule Modal */}
      {/* /Add Schedule Modal */}
      {/* Edit Schedule Modal */}






      {/* /Edit Schedule Modal */}
      <Offcanvas />
    </>
  );

}

export default ShiftScheduling;
