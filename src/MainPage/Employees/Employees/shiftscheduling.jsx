
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
import { async } from '@babel/runtime/helpers/regeneratorRuntime';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ShiftScheduling = () => {
  const id = JSON.parse(localStorage.getItem('user'));
  const { get } = useHttp();
  const { loading, setLoading } = useCompanyContext();
  const [staff, setStaff] = useState([]);
  const [clients, setClients] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [staffOne, setStaffOne] = useState({});
  const [cli, setCli] = useState('');
  const [sta, setSta] = useState('');
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
  };
  useEffect(() => {
    FetchSchedule()
  }, []);


  const FilterSchedule = async () => {

    if (sta === "") {
      return Swal.fire(
        "",
        "Select either a staff or client",
        "error"
      )

    } else {

      try {
        const shiftResponse = await get(`/ShiftRosters/get_shifts_by_user?client=${cli}&staff=${sta}`, { cacheTimeout: 300000 });
        const shift = shiftResponse.data?.shiftRoster;
        setSchedule(shift);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    }

  }

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
                <Link to="/app/employee/add-shift" className="btn btn-info add-btn m-r-5 rounded-2">Add New Roaster</Link>
              </div>
            </div>
          </div>

          <div className="row align-items-center">
            <span className='fw-bold'>Filter Shift Roaster By User</span>
            <div className="col-md-4">
              <div className="form-group">
                <label className="col-form-label">Staff Name</label>
                <div>
                  <select className="form-select" onChange={e => setSta(e.target.value)}>
                    <option defaultValue hidden>--Select a staff--</option>
                    {
                      staff.map((data, index) =>
                        <option value={data.staffId} key={index}>{data.fullName}</option>)
                    }
                  </select></div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="col-form-label">Client Name</label>
                <div>
                  <select className="form-select" onChange={e => setCli(e.target.value)}>
                    <option defaultValue hidden>--Select a Client--</option>
                    {
                      clients.map((data, index) =>
                        <option value={data.profileId} key={index}>{data.fullName}</option>)
                    }
                  </select></div>
              </div>
            </div>
            <div className="col-auto mt-3">
              <div className="form-group">
                <button onClick={FilterSchedule} className="btn btn-info add-btn rounded-2 m-r-5">Load</button>

              </div>
            </div>
            <div className="col-auto mt-3">
              <div className="form-group">
                <button onClick={FetchSchedule} className="btn btn-secondary add-btn rounded-2 m-r-5">All Shifts</button>

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
                          <span><span className='fw-bold'>Staff: </span><span className='text-warning'>{activity.staff.fullName}</span></span>
                          <span><span className='fw-bold'>Client: </span><span className='text-warning'>{activity.profile.fullName}</span></span>
                          <small><span className='text-truncate'>{activity.activities}</span></small>
                        </div>
                      ))}
                      {!loading && activitiesByDay[index] <= 0 &&

                        <div>
                          <span>No Activity</span>
                        </div>
                      }


                      {/* Modal */}
                      <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                          <Modal.Title>Shift Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          {selectedActivity && (
                            <>
                              <p><b>Date:</b> {dayjs(selectedActivity.dateFrom).tz('Australia/Sydney').format('YYYY-MM-DD')}</p>
                              <p><b>Time:</b> {dayjs(selectedActivity.dateFrom).tz('Australia/Sydney').format('hh:mm A')} - {dayjs(selectedActivity.dateTo).tz('Australia/Sydney').format('hh:mm A')}</p>
                              <p><b>Staff:</b> {selectedActivity.staff.fullName}</p>
                              <p><b>Client:</b> {selectedActivity.profile.fullName}</p>
                              <p><b>Activities:</b> {selectedActivity.activities}</p>
                            </>
                          )}
                        </Modal.Body>
                        <Modal.Footer>
                          <Link to={`/app/employee/edit-shift/${selectedActivity?.shiftRosterId}`} className="btn btn-primary" >Edit Shift</Link>
                          <button className="ml-4 btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                        </Modal.Footer>
                      </Modal>


                      <div>
                        <button className='btn'>
                          <FaPlus />
                        </button>
                      </div>
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
