import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, withRouter } from 'react-router-dom';
import man from "../../../assets/img/user.jpg"
import Offcanvas from '../../../Entryfile/offcanvance/index.jsx';
import "../../index.css"
import DashboardCard from '../../../_components/cards/dashboardCard.jsx';
import ClientChart from '../../../_components/chart/ClientChart.jsx';
import { MdCalendarMonth, MdCalendarToday, MdCalendarViewWeek, MdOutlineEventNote, MdOutlineFeed, MdOutlineFolderOpen, MdOutlineGroup, MdOutlinePages, MdOutlinePersonOutline, MdOutlineQueryBuilder, MdOutlineSwitchAccount } from 'react-icons/md';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceCount, fetchShiftRosterCount, fetchProgressNoteCount, fetchShiftAnalysisCount } from '../../../store/slices/CountsSlice';
import { fetchAdmin } from '../../../store/slices/AdminSlice';
import { fetchStaff } from '../../../store/slices/StaffSlice';
import { fetchClient } from '../../../store/slices/ClientSlice';
import { fetchDocument } from '../../../store/slices/DocumentSlice';

const AdminDashboard = () => {
  const userObj = JSON.parse(localStorage.getItem('user'));
  const [recentUsers, setRecentUsers] = useState([]);

  const dispatch = useDispatch();
  const shiftRosterCount = useSelector((state) => state.dashboard.shiftRosterCount);
  const attendanceCount = useSelector((state) => state.dashboard.attendanceCount);
  const progressNoteCount = useSelector((state) => state.dashboard.progressNoteCount);
  const perMonthCount = useSelector((state) => state.dashboard.shiftForMonth);
  const perDayCount = useSelector((state) => state.dashboard.shiftForDay);
  const month = useSelector((state) => state.dashboard.month);
  const monthPercentage = useSelector((state) => state.dashboard.monthPercentage);
  const fromWeek = useSelector((state) => state.dashboard.fromWeek);
  const toWeek = useSelector((state) => state.dashboard.toWeek);
  const weekCount = useSelector((state) => state.dashboard.weekCount);
  const weekPercentage = useSelector((state) => state.dashboard.weekPercentage);
  const dayPercentage = useSelector((state) => state.dashboard.dayPercentage);
  const admin = useSelector((state) => state.admin.data);
  const staff = useSelector((state) => state.staff.data);
  const clients = useSelector((state) => state.client.data);
  const document = useSelector((state) => state.document.data);
  const ticket = useSelector((state) => state.ticket.data);


  const isLoading = useSelector((state) => state.dashboard.isLoading);
  const error = useSelector((state) => state.dashboard.error);


  useEffect(() => {
    dispatch(fetchShiftRosterCount(userObj.companyId));
    dispatch(fetchAttendanceCount(userObj.companyId));
    dispatch(fetchAttendanceCount(userObj.companyId));
    dispatch(fetchProgressNoteCount(userObj.companyId));
    dispatch(fetchShiftAnalysisCount(userObj.companyId));
    dispatch(fetchAdmin());
    dispatch(fetchStaff());
    dispatch(fetchClient());
    dispatch(fetchDocument());
  }, [dispatch, userObj.companyId]);
  useEffect(() => {
    setRecentUsers(clients.slice(-5))

  }, [clients, admin, attendanceCount])










  return (
    <>


      <div className="page-wrapper">
        <Helmet>
          <title>Dashboard - Promax Admin Dashboard</title>
          <meta name="description" content="Dashboard" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                {/* <h3 className="page-title">Welcome {userObj.firstName}</h3> */}
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active">Dashboard</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row g-1">
            <div className='col-md-7'>
              <h4>Overview</h4>
              <div className="row">
                <DashboardCard title={"Admin"} sty={'info'}
                  content={admin.length} icon={<MdOutlinePersonOutline className='fs-4' />}
                  link={'/app/employee/alladmin'}
                  loading={isLoading}
                />
                <DashboardCard title={"Clients"} sty={'success'} content={clients.length} icon={<MdOutlineGroup className='fs-4' />}
                  loading={isLoading} link={`/app/employee/clients`}
                />


                <DashboardCard title={"Shift Roster"} content={shiftRosterCount} icon={<MdOutlineEventNote className='fs-4' />}
                  link={`/app/employee/shift-scheduling`}
                  sty={'danger'}

                  loading={isLoading}
                />
                <DashboardCard title={"Progress Notes "} content={progressNoteCount} icon={<MdOutlineFeed className='fs-4' />}
                  link={`/app/reports/progress-reports`} sty={'warning'}
                  loading={isLoading}
                />

                <DashboardCard title={"Tickets"} sty={'danger'}
                  content={ticket.length} icon={<MdOutlinePages className='fs-4' />}
                  link={'/app/support/view-tickets'}
                  loading={isLoading}
                />

                <DashboardCard title={"Attendances"} content={attendanceCount} icon={<MdOutlineQueryBuilder className='fs-4' />}
                  link={`/app/reports/attendance-reports`} sty={'warning'} loading={isLoading}
                />
                <DashboardCard title={`Total shift roaster for ${month}`} content={perMonthCount} icon={<MdCalendarMonth className='fs-4' />}
                  linkTitle={`${monthPercentage}% increase compared to last month`} link={``} sty={'secondary'}
                  loading={isLoading}
                />


                <DashboardCard title={`Total shift roaster for today`} sty={'danger'}
                  content={perDayCount} icon={<MdCalendarToday className='fs-4' />}
                  link={''}
                  linkTitle={`${dayPercentage}% increase compared to yesterday`}
                  loading={isLoading}
                />

              </div>

            </div>


            <div className='col-md-5 p-2'>



              <div className='p-3 shadow-sm mb-3'>
                <small className='fw-bold'>Staffs</small>
                <div className='d-flex justify-content-center flex-column p-2 gap-2'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <span><MdOutlineSwitchAccount className='fs-2' /> Total number of Staffs</span>
                    <h2 className='text-primary'>

                      {staff.length}
                    </h2>
                  </div>
                  <div className='d-flex justify-content-end'>
                    <Link style={{ fontSize: "12px" }}

                      to={`/app/employee/allstaff`} className='pointer text-dark'>View all</Link>
                  </div>
                  <div className='p-2 bg-1 rounded-2'>

                    <ClientChart />

                  </div>
                </div>
              </div>
              <div className={`card shadow-sm bg-white`}>
                <div className="card-content">
                  <div className="card-body">
                    <div className="media d-flex justify-content-between">
                      <div className="media-body text-left">
                        <span>{`Total shift roaster from ${fromWeek} - ${toWeek}`}</span>

                        {
                          isLoading ? (<div className=" d-flex py-2 justify-content-start fs-6">
                            <div className="spinner-grow text-light" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                          </div>
                          )

                            :
                            <h3 className='text-info'>{weekCount}</h3>
                        }

                        <Link style={{ fontSize: "12px" }}

                          to={``} className='pointer text-dark text-end'>{`${weekPercentage}% increase compared to last week`}</Link>
                      </div>
                      <div className="align-self-center">
                        <MdCalendarViewWeek className='fs-4' />
                      </div>
                    </div>
                    {/* <div className='d-flex justify-content-end'>
                        <span style={{ fontSize: "10px", }}>7 new documents uploaded today</span>
                      </div> */}
                  </div>
                </div>
              </div>
            </div>



            <div className='col-md-4 p-2 d-flex  flex-column gap-2 justify-content-start'>
              <div className='p-3 shadow-sm'>
                <small className='fw-bold'>Recently Onboarded Clients</small>
                {
                  isLoading && <div className='text-center fs-1'>
                    <div className="spinner-grow text-secondary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }


                {
                  !isLoading && clients.length >= 1 && recentUsers && recentUsers.length > 0 ? (
                    recentUsers.map((data, index) => (
                      <Link to={`/app/profile/client-profile/${data.profileId}/${data.firstName}`} className="row mt-2" key={index}>
                        <div className="col-2">
                          <div className='rounded-circle mt-2 bg-secondary' style={{ width: "35px", height: "35px" }}>
                            <img src={!data.imageUrl ? man : data.imageUrl} alt="" width={50} height={50} className='rounded-circle' />
                          </div>
                        </div>

                        <div className="col-10 d-flex flex-column justify-content-start text-dark">
                          <span className='text-primary fs-6 fw-bold'>{data.fullName}</span>
                          <span style={{ fontSize: "10px", }}>{data.address}</span>
                          <span style={{ fontSize: "7px", }}>{data.email}</span>
                        </div>

                      </Link>
                    ))
                  ) : !isLoading && clients.length <= 0 ? (
                    <div className="text-center text-danger fs-6">
                      <p>Not Available</p>
                    </div>
                  ) : null
                }




                <div className='d-flex justify-content-end mt-2'>
                  <Link to={'/app/employee/clients'}
                    className='text-primary pointer' style={{ fontSize: "12px", }}>
                    See all <FaLongArrowAltRight className='fs-3' />
                  </Link>
                </div>

              </div>

              <div className={`card border border-info`}>
                <div className="card-content">
                  <div className="card-body">
                    <div className="media d-flex justify-content-between">
                      <div className="media-body text-left">
                        <span>Documents</span>

                        {
                          isLoading ? (<div className=" d-flex py-2 justify-content-start fs-6">
                            <div className="spinner-grow text-light" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                          </div>
                          )

                            :
                            <h3 className='text-info'>{document.length}</h3>
                        }

                        <Link style={{ fontSize: "12px" }}

                          to={`/app/employee/document`} className='pointer text-dark text-end'>View all</Link>
                      </div>
                      <div className="align-self-center">
                        <MdOutlineFolderOpen className='fs-4' />
                      </div>
                    </div>
                    {/* <div className='d-flex justify-content-end'>
                        <span style={{ fontSize: "10px", }}>7 new documents uploaded today</span>
                      </div> */}
                  </div>
                </div>
              </div>
            </div>




          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="row">



              </div>
            </div>
          </div>



        </div>
      </div>



      {/* /Page Content */}


      {/* <Offcanvas /> */}
    </>
  );
}

export default withRouter(AdminDashboard);
