/**
 * Signin Firebase
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, withRouter } from 'react-router-dom';
import man from "../../../assets/img/user.jpg"
import Header from '../../../initialpage/Sidebar/header'
import Sidebar from '../../../initialpage/Sidebar/sidebar';
import Offcanvas from '../../../Entryfile/offcanvance/index.jsx';
import "../../index.css"
import { useCompanyContext } from '../../../context/index.jsx';
import DashboardCard from '../../../_components/cards/dashboardCard.jsx';
import useHttp from '../../../hooks/useHttp.jsx';
import ClientChart from '../../../_components/chart/ClientChart.jsx';
import { MdOutlineEventNote, MdOutlineFeed, MdOutlineFolderOpen, MdOutlineGroup, MdOutlinePages, MdOutlinePersonOutline, MdOutlineQueryBuilder, MdOutlineSwitchAccount } from 'react-icons/md';
import { FaArrowRight, FaLongArrowAltRight } from 'react-icons/fa';
import {
  BarChart, Bar, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';


const barchartdata = [
  { y: '2006', "Total Income": 100, 'Total Outcome': 90 },
  { y: '2007', "Total Income": 75, 'Total Outcome': 65 },
  { y: '2008', "Total Income": 50, 'Total Outcome': 40 },
  { y: '2009', "Total Income": 75, 'Total Outcome': 65 },
  { y: '2010', "Total Income": 50, 'Total Outcome': 40 },
  { y: '2011', "Total Income": 75, 'Total Outcome': 65 },
  { y: '2012', "Total Income": 100, 'Total Outcome': 90 }
];
const linechartdata = [

  { y: 'Week 1', "Total Sales": 75, 'Total Revenue': 65, 'Total Outcome': 0 },
  { y: 'Week 2', "Total Sales": 50, 'Total Revenue': 40, 'Total Outcome': 30 },
  { y: 'Week 3', "Total Sales": 75, 'Total Revenue': 65, 'Total Outcome': 45 },
  { y: 'Week 4', "Total Sales": 100, 'Total Revenue': 50, 'Total Outcome': 75 }
];
const AdminDashboard = () => {
  const userObj = JSON.parse(localStorage.getItem('user'));
  const [admin, setAdmin] = useState([]);
  const [staff, setStaff] = useState([]);
  const [clients, setClients] = useState([]);
  const { loading, setLoading } = useCompanyContext();
  const [document, setDocument] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [progress, setProgress] = useState([]);
  const { get } = useHttp();

  let isMounted = true;

  useEffect(() => {
    if (isMounted) {
      FetchStaff();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  async function FetchStaff() {
    setLoading(true)
    try {
      const { data } = await get(`Administrators?companyId=${userObj.companyId}`, { cacheTimeout: 300000 });
      setAdmin(data);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await get(`Staffs?companyId=${userObj.companyId}`, { cacheTimeout: 300000 });
      setStaff(data);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }

    try {
      const clientResponse = await get(`/Profiles?companyId=${userObj.companyId}`, { cacheTimeout: 300000 });
      const client = clientResponse.data;
      const recentUsers = client.slice(-5);
      setRecentUsers(recentUsers);
      setClients(client);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await get(`Documents/get_all_documents?companyId=${userObj.companyId}`, { cacheTimeout: 300000 });
      setDocument(data)
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    try {
      const scheduleResponse = await get(`/ShiftRosters/get_all_shift_rosters?companyId=${userObj.companyId}`, { cacheTimeout: 300000 });
      const schedule = scheduleResponse.data;
      setSchedule(schedule);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
    try {
      const attendanceResponse = await get(`/Attendances/get_all_attendances_by_company?companyId=${userObj.companyId}`, { cacheTimeout: 300000 });
      const attendance = attendanceResponse.data;
      setAttendance(attendance);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
    try {
      const progressResponse = await get(`/ProgressNotes/get_all_progressnote_by_company?companyId=${userObj.companyId}`, { cacheTimeout: 300000 });
      const progress = progressResponse.data;
      setProgress(progress);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }

    finally {
      setLoading(false)
    }
  }





  const [menu, setMenu] = useState(false);
  // const { staff, clients, FetchStaff, document } = useCompanyContext()
  const toggleMobileMenu = () => {
    setMenu(!menu)
  };

  useEffect(() => {
    FetchStaff()
  }, []);

  // useEffect(() => {
  //   let firstload = localStorage.getItem("firstload")
  //   if (firstload === "false") {
  //     setTimeout(function () {
  //       window.location.reload(1)
  //       localStorage.removeItem("firstload")
  //     }, 1000)
  //   }
  // });



  return (
    <>
      <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>

        <Header onMenuClick={(value) => toggleMobileMenu()} />
        <Sidebar />
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
              <div className='col-md-5'>
                <h4>Overview</h4>
                <div className="row">
                  <DashboardCard title={"Admin"} sty={'info'}
                    content={admin.length} icon={<MdOutlinePersonOutline className='fs-4' />}
                    link={'/app/employee/alladmin'}
                    loading={loading}
                  />
                  <DashboardCard title={"Staffs"} sty={'success'} content={staff.length} icon={<MdOutlineGroup className='fs-4' />}
                    linkTitle={"View Staffs"} loading={loading} link={`/app/employee/allstaff`}
                  />
                  <DashboardCard title={"Shift Roaster"} content={schedule.length} icon={<MdOutlineEventNote className='fs-4' />}
                    link={`/app/employee/shift-scheduling`}
                    sty={'danger'}

                    loading={loading}
                  />
                  <DashboardCard title={"Progress Notes "} content={progress.length} icon={<MdOutlineFeed className='fs-4' />}
                    linkTitle={"View Progress Notes"} link={`/app/reports/progress-reports`} sty={'warning'}
                    loading={loading}
                  />
                  {/* <DashboardCard title={"Clients"} sty={'warning'}
                    content={clients.length} icon={<MdOutlineGroup className='fs-4' />}
                    linkTitle={"View Clients"} loading={loading} link={`/app/employees/clients`}
                  /> */}
                  <DashboardCard title={"Tickets"} sty={'danger'}
                    content={0} icon={<MdOutlinePages className='fs-4' />}
                    link={''}
                  />
                  {/* <DashboardCard title={"Document"}
                    sty={'danger'} content={document.length} icon={<FaFolderOpen className='fs-4 text-danger' />}
                    linkTitle={"View Documents"} loading={loading} link={`/app/employee/document`}
                  /> */}
                  <DashboardCard title={"Attendances"} content={attendance.length} icon={<MdOutlineQueryBuilder className='fs-4' />}
                    link={`/app/reports/attendance-reports`} sty={'warning'} loading={loading}
                  />
                </div>

              </div>


              <div className='col-md-4 p-2'>
                {/* <ClientChart /> */}
                <div className='p-3 shadow-sm'>
                  <h3>Clients</h3>
                  <div className='d-flex justify-content-center flex-column p-2 gap-2'>
                    <div className='d-flex justify-content-between align-items-center'>
                      <span><MdOutlineSwitchAccount className='fs-2' /> Total number of clients</span>
                      <h2 className='text-primary'>

                        {clients.length}
                      </h2>
                    </div>
                    <div className='d-flex justify-content-end'>
                      <Link style={{ fontSize: "12px" }}

                        to={`/app/employees/clients`} className='pointer text-dark'>View all</Link>
                    </div>
                    <div className='p-2 bg-1 rounded-2'>
                      <div className='d-flex flex-column justify-content-start'>
                        <span className='fw-semibold'>Satisfaction Stats</span>
                        <span style={{ fontSize: "10px" }}>From 1-6 Dec, 2021</span>
                      </div>
                      <ClientChart />
                      <div className="row">
                        <div className='d-flex align-items-start gap-2 col-4'>
                          <div className='rounded-circle mt-2' style={{ width: "10px", height: "10px", backgroundColor: "#5A6ACF" }}></div>
                          <div style={{ fontSize: "10px" }}>
                            Excellent
                            <br />
                            60%
                          </div>

                        </div>
                        <div className='d-flex align-items-start gap-2 col-4'>
                          <div className='rounded-circle mt-2' style={{ width: "10px", height: "10px", backgroundColor: "#8593ED" }}></div>
                          <div style={{ fontSize: "10px" }}>
                            Fair
                            <br />
                            30%
                          </div>

                        </div>
                        <div className='d-flex align-items-start gap-2 col-4'>
                          <div className='rounded-circle mt-2' style={{ width: "10px", height: "10px", backgroundColor: "#FF81C5" }}></div>
                          <div style={{ fontSize: "10px" }}>
                            Poor
                            <br />
                            10%
                          </div>

                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>



              <div className='col-md-3 p-2 d-flex  flex-column gap-2 justify-content-start'>
                <div className='p-3 shadow-sm'>
                  <h5>Recently Onboarded Clients</h5>
                  {
                    loading && <div className='text-center fs-1'>
                      <div className="spinner-grow text-secondary" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  }

                  {
                    !loading && recentUsers.length >= 1 && recentUsers.map((data, index) =>

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
                    )
                  }
                  {
                    !loading && recentUsers.length <= 0 && <div className='text-center text-danger fs-6'>
                      <p>Not Available</p>
                    </div>
                  }

                  <div className='d-flex justify-content-end mt-2'>
                    <Link to={'/app/employees/clients'}
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
                            loading ? (<div className=" d-flex py-2 justify-content-start fs-6">
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
                  {/* <div className="col-md-6 text-center">
                    <div className="card">
                      <div className="card-body">
                        <h3 className="card-title">Total</h3>

                        <ResponsiveContainer width='100%' height={300}>
                          <BarChart

                            data={barchartdata}
                            margin={{
                              top: 5, right: 5, left: 5, bottom: 5,
                            }}
                          >
                            <CartesianGrid />
                            <XAxis dataKey="y" />
                            <YAxis />

                            <Legend />
                            <Bar dataKey="Total Income" fill="#4256D0" />
                            <Bar dataKey="Total Outcome" fill="#18225C" />
                          </BarChart>
                        </ResponsiveContainer>

                      </div>
                    </div>
                  </div> */}
                  {/* <div className="col-md-7 p-2">
                    <div className="card">
                      <div className="card-body">
                        <div className='d-flex justify-content-between'>
                          <h3 className="card-title">Clients Per</h3>
                          <div>

                          </div>
                        </div>
                        <ResponsiveContainer width='100%' height={300}>
                          <LineChart data={linechartdata}
                            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                            <CartesianGrid />
                            <XAxis dataKey="y" />
                            <YAxis />

                            <Legend />
                            <Line type="monotone" dataKey="Total Sales" stroke="#00A31A" fill="#000" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 7 }} />
                            <Line type="monotone" dataKey="Total Revenue" stroke="#C8102E" fill="#fff" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 7 }} />
                            <Line type="monotone" dataKey="Total Outcome" stroke="#000" fill="#fff" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 7 }} />
                          </LineChart>
                        </ResponsiveContainer>

                        <div className='d-flex justify-content-between'>
                          <span>20% increase, compared to Last week</span>
                          <div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="col-md-5 p-2">
                    <div className='p-3 shadow-sm'>
                      <h4>Staff log</h4>
                      <div className='d-flex mt-2 justify-content-between'>
                        <span>John A. clocked in</span>
                        <span>8:00AM</span>
                      </div>
                      <div className='d-flex mt-2 justify-content-between'>
                        <span>Mary C. clocked in</span>
                        <span>8:00AM</span>
                      </div>
                      <div className='d-flex mt-2 justify-content-between'>
                        <span>Nelly C. clocked out</span>
                        <span>8:00PM</span>
                      </div>
                    </div>


                  </div> */}


                </div>
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
