
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import Offcanvas from '../../../Entryfile/offcanvance';
import useHttp from '../../../hooks/useHttp';
import '../../../assets/css/table2.css'
import { FaAngleLeft, FaAngleRight, FaPlus, } from 'react-icons/fa';
import { useCompanyContext } from '../../../context';
import dayjs from 'dayjs';
import { Modal } from 'react-bootstrap';

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
  const currentDateTime = dayjs().utcOffset(10);


  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };
  return (
    <>
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
              <div className="col-auto float-end ml-auto p-4">
                <Link to="/app/employee/add-shift" className="btn add-btn m-r-5 rounded-2">Add New Roaster</Link>
              </div>
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-md-5">
              <div className="form-group">
                <label className="col-form-label">Staff Name</label>
                <div>
                  <select className="form-select" onChange={e => setStaffId(e.target.value)}>
                    <option defaultValue hidden>--Select a staff--</option>
                    {
                      staff.map((data, index) =>
                        <option value={data.staffId} key={index}>{data.fullName}</option>)
                    }
                  </select></div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="form-group">
                <label className="col-form-label">Client Name</label>
                <div>
                  <select className="form-select" onChange={e => setProfileId(e.target.value)}>
                    <option defaultValue hidden>--Select a Client--</option>
                    {
                      clients.map((data, index) =>
                        <option value={data.profileId} key={index}>{data.fullName}</option>)
                    }
                  </select></div>
              </div>
            </div>
            <div className="col-auto mt-2">
              <div className="form-group">
                <Link to="" className="btn add-btn rounded-2 m-r-5">Load</Link>

              </div>
            </div>

            {/* <div className="col-auto float-end ml-auto">
            </div> */}
          </div>
          <div className='row filter-row '>

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
                      {loading &&

                        <div className="spinner-grow text-secondary" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      }



                      {/* {activitiesByDay[index].map((activity, activityIndex) => (
                        <div key={activityIndex} className='bg-primary text-white rounded-2 d-flex flex-column align-items-start p-2 mt-2' style={{ fontSize: '10px' }}>
                          <span className='fw-bold'>{currentDateTime.format('hh:mm A')} - {currentDateTime.add(6, 'hour').format('hh:mm A')}</span>
                          <span className='text-warning'>Promax Staff</span>
                          <small className='text-truncate'>{activity.activities}</small>
                        </div>
                      ))} */}

                      {activitiesByDay[index].map((activity, activityIndex) => (
                        <div key={activityIndex}
                          onClick={() => handleActivityClick(activity)}
                          className='bg-primary text-white pointer rounded-2 d-flex flex-column align-items-start p-2 mt-2' style={{ fontSize: '10px' }}>
                          <span className='fw-bold' >
                            {dayjs(activity.dateFrom).tz('Australia/Sydney').format('hh:mm A')} - {dayjs(activity.dateTo).tz('Australia/Sydney').format('hh:mm A')}
                          </span>
                          <span className='text-warning'>Promax Staff</span>
                          <small className='text-truncate'>{activity.activities}</small>
                        </div>
                      ))}

                      {/* Modal */}
                      <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                          <Modal.Title>Activity Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          {selectedActivity && (
                            <>
                              <p><b>Date:</b> {dayjs(selectedActivity.dateFrom).tz('Australia/Sydney').format('YYYY-MM-DD')}</p>
                              <p><b>Time:</b> {dayjs(selectedActivity.dateFrom).tz('Australia/Sydney').format('hh:mm A')} - {dayjs(selectedActivity.dateTo).tz('Australia/Sydney').format('hh:mm A')}</p>
                              <p><b>Description:</b> {selectedActivity.activities}</p>
                            </>
                          )}
                        </Modal.Body>
                        <Modal.Footer>
                          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                        </Modal.Footer>
                      </Modal>

                      <button className='btn'>
                        <FaPlus />
                      </button>

                    </div>
                  </div>
                ))}

              </div>

            </div>
          </div>

        </div>


      </div>

      <Offcanvas />
    </>
  );

}

export default ShiftScheduling;
