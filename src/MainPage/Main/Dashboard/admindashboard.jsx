/**
 * Signin Firebase
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, withRouter } from 'react-router-dom';
import { User, Avatar_19, Avatar_07, Avatar_06, Avatar_14 } from '../../../Entryfile/imagepath.jsx'

import {
  BarChart, Bar, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import Header from '../../../initialpage/Sidebar/header'
import Sidebar from '../../../initialpage/Sidebar/sidebar';
import Offcanvas from '../../../Entryfile/offcanvance/index.jsx';
import "../../index.css"
import { FaCalendar, FaClock, FaFile, FaFileAlt, FaFolderOpen, FaRegUser, FaTicketAlt, FaUser, FaUsers } from 'react-icons/fa';
import { useCompanyContext } from '../../../context/index.jsx';
import DashboardCard from '../../../_components/cards/dashboardCard.jsx';
import useHttp from '../../../hooks/useHttp.jsx';
import ClientChart from '../../../_components/chart/ClientChart.jsx';
import { MdOutlineEventNote, MdOutlineFeed, MdOutlineFolderOpen, MdOutlineGroup, MdOutlinePages, MdOutlinePersonOutline, MdOutlineQueryBuilder, MdOutlineSwitchAccount } from 'react-icons/md';


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
  { y: '2006', "Total Sales": 50, 'Total Revenue': 90 },
  { y: '2007', "Total Sales": 75, 'Total Revenue': 65 },
  { y: '2008', "Total Sales": 50, 'Total Revenue': 40 },
  { y: '2009', "Total Sales": 75, 'Total Revenue': 65 },
  { y: '2010', "Total Sales": 50, 'Total Revenue': 40 },
  { y: '2011', "Total Sales": 75, 'Total Revenue': 65 },
  { y: '2012', "Total Sales": 100, 'Total Revenue': 50 }
];
const AdminDashboard = () => {
  const userObj = JSON.parse(localStorage.getItem('user'));
  const [staff, setStaff] = useState([]);
  const [clients, setClients] = useState([]);
  const { loading, setLoading } = useCompanyContext();
  const [document, setDocument] = useState([]);
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
      const { data } = await get(`Staffs?companyId=${userObj.companyId}`, { cacheTimeout: 300000 });
      setStaff(data);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }

    try {
      const clientResponse = await get(`/Profiles?companyId=${userObj.companyId}`, { cacheTimeout: 300000 });
      const client = clientResponse.data;
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

  useEffect(() => {
    let firstload = localStorage.getItem("firstload")
    if (firstload === "false") {
      setTimeout(function () {
        window.location.reload(1)
        localStorage.removeItem("firstload")
      }, 1000)
    }
  });



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
                <div className="row">
                  <h4>Overview</h4>
                  <DashboardCard title={"Admin"} sty={'info'}
                    content={0} icon={<MdOutlinePersonOutline className='fs-4' />}
                    link={''}
                  />
                  <DashboardCard title={"Staffs"} sty={'success'} content={staff.length} icon={<MdOutlineGroup className='fs-4' />}
                    linkTitle={"View Staffs"} loading={loading} link={`/app/employee/allemployees`}
                  />
                  <DashboardCard title={"Shift Roaster"} content={0} icon={<MdOutlineEventNote className='fs-4' />}
                    link={``}
                    sty={'danger'}
                  />
                  <DashboardCard title={"Progress Notes "} content={0} icon={<MdOutlineFeed className='fs-4' />}
                    linkTitle={"View Progress Notes"} link={``} sty={'warning'}
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
                  <DashboardCard title={"Attendances"} content={0} icon={<MdOutlineQueryBuilder className='fs-4' />}
                    link={``} sty={'warning'}
                  />
                </div>

              </div>


              <div className='col-md-4 p-2'>
                {/* <ClientChart /> */}
                <div className='p-3 shadow-sm'>
                  <h3>Clients</h3>
                  <div className='d-flex justify-content-center flex-column p-2 gap-2'>
                    <div className='d-flex justify-content-between align-items-center'>
                      <span><MdOutlineSwitchAccount className='fs-3' /> Total number of clients</span>
                      <h2 className='text-primary'>

                        {clients.length}
                      </h2>
                    </div>
                    <div className=''>
                      <Link style={{ fontSize: "12px" }}

                        to={`/app/employees/clients`} className='pointer text-dark text-center'>View all</Link>
                    </div>
                    <div className='border p-2'>
                      <div className='d-flex flex-column justify-content-start'>
                        <span>Satisfaction Stats</span>
                        <span style={{ fontSize: "10px" }}>From 1-6 Dec, 2021</span>
                      </div>
                      <ClientChart />
                      <div className="row">
                        <div className='d-flex align-items-start gap-2 col-4'>
                          <div className='rounded-circle mt-2' style={{ width: "10px", height: "10px", backgroundColor: "#5A6ACF" }}></div>
                          <div>
                            Excellent
                            <br />
                            60%
                          </div>

                        </div>
                        <div className='d-flex align-items-start gap-2 col-4'>
                          <div className='rounded-circle mt-2' style={{ width: "10px", height: "10px", backgroundColor: "#8593ED" }}></div>
                          <div>
                            Fair
                            <br />
                            30%
                          </div>

                        </div>
                        <div className='d-flex align-items-start gap-2 col-4'>
                          <div className='rounded-circle mt-2' style={{ width: "10px", height: "10px", backgroundColor: "#FF81C5" }}></div>
                          <div>
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



              <div className='col-md-3 p-2 d-flex flex-column gap-2 justify-content-start'>
                <div className='p-3 shadow-sm'>
                  <h5>Recently Onboarded Clients</h5>
                  <div className="row mt-2">
                    <div className="col-2">
                      <div className='rounded-circle mt-3' style={{ width: "35px", height: "35px", backgroundColor: "#5A6ACF" }}></div>
                    </div>

                    <div className="col-10 d-flex flex-column justify-content-start">
                      <span className='text-primary fs-5 fw-bold'>Gary Nevile</span>
                      <span style={{ fontSize: "10px", }}>Gum Nut Close, Kellyville, NSW, Australia</span>
                      <span style={{ fontSize: "7px", }}>garyneville@gmail.com</span>
                    </div>

                  </div>
                  <div className="row mt-2">
                    <div className="col-2">
                      <div className='rounded-circle mt-3' style={{ width: "35px", height: "35px", backgroundColor: "#5A6ACF" }}></div>
                    </div>

                    <div className="col-10 d-flex flex-column justify-content-start">
                      <span className='text-primary fs-5 fw-bold'>Gary Nevile</span>
                      <span style={{ fontSize: "10px", }}>Gum Nut Close, Kellyville, NSW, Australia</span>
                      <span style={{ fontSize: "7px", }}>garyneville@gmail.com</span>
                    </div>

                  </div>
                  <div className="row mt-2">
                    <div className="col-2">
                      <div className='rounded-circle mt-3' style={{ width: "35px", height: "35px", backgroundColor: "#5A6ACF" }}></div>
                    </div>

                    <div className="col-10 d-flex flex-column justify-content-start">
                      <span className='text-primary fs-5 fw-bold'>Gary Nevile</span>
                      <span style={{ fontSize: "10px", }}>Gum Nut Close, Kellyville, NSW, Australia</span>
                      <span style={{ fontSize: "7px", }}>garyneville@gmail.com</span>
                    </div>

                  </div>
                </div>
                <div className={`card shadow-none border border-info`}>
                  <div className="card-content shadow-none">
                    <div className="card-body shadow-none">
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

                            to={`/app/employee/document`} className='pointer text-dark'>View all</Link>
                        </div>
                        <div className="align-self-center">
                          <MdOutlineFolderOpen className='fs-4' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>




            </div>
            {/* <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-6 text-center">
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
                  </div>
                  <div className="col-md-6 text-center">
                    <div className="card">
                      <div className="card-body">
                        <h3 className="card-title">Incoming</h3>
                        <ResponsiveContainer width='100%' height={300}>
                          <LineChart data={linechartdata}
                            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                            <CartesianGrid />
                            <XAxis dataKey="y" />
                            <YAxis />

                            <Legend />
                            <Line type="monotone" dataKey="Total Sales" stroke="#4256D0" fill="#18225C" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 7 }} />
                            <Line type="monotone" dataKey="Total Revenue" stroke="#18225C" fill="#4256D0" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 7 }} />
                          </LineChart>
                        </ResponsiveContainer>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}


            {/* <div className="row">
              <div className="col-md-12">
                <div className="card-group m-b-30">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <div>
                          <span className="d-block">New Employees</span>
                        </div>
                        <div>
                          <span className="text-success">+10%</span>
                        </div>
                      </div>
                      <h3 className="mb-3">10</h3>
                      <div className="progress mb-2" style={{ height: '5px' }}>
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: '70%' }} aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} />
                      </div>
                      <p className="mb-0">Overall Employees 218</p>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <div>
                          <span className="d-block">Earnings</span>
                        </div>
                        <div>
                          <span className="text-success">+12.5%</span>
                        </div>
                      </div>
                      <h3 className="mb-3">$1,42,300</h3>
                      <div className="progress mb-2" style={{ height: '5px' }}>
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: '70%' }} aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} />
                      </div>
                      <p className="mb-0">Previous Month <span className="text-muted">$1,15,852</span></p>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <div>
                          <span className="d-block">Expenses</span>
                        </div>
                        <div>
                          <span className="text-danger">-2.8%</span>
                        </div>
                      </div>
                      <h3 className="mb-3">$8,500</h3>
                      <div className="progress mb-2" style={{ height: '5px' }}>
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: '70%' }} aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} />
                      </div>
                      <p className="mb-0">Previous Month <span className="text-muted">$7,500</span></p>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <div>
                          <span className="d-block">Profit</span>
                        </div>
                        <div>
                          <span className="text-danger">-75%</span>
                        </div>
                      </div>
                      <h3 className="mb-3">$1,12,000</h3>
                      <div className="progress mb-2" style={{ height: '5px' }}>
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: '70%' }} aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} />
                      </div>
                      <p className="mb-0">Previous Month <span className="text-muted">$1,42,000</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            {/* Statistics Widget */}

            {/* /Statistics Widget */}
          </div>
        </div>
      </div>



      {/* /Page Content */}


      <Offcanvas />
    </>
  );
}

export default withRouter(AdminDashboard);
