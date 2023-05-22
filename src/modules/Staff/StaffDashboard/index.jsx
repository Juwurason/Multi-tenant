/**
 * Signin Firebase
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, withRouter } from 'react-router-dom';

import Header from '../../../initialpage/Sidebar/header'
import Sidebar from '../../../initialpage/Sidebar/sidebar';
import Offcanvas from '../../../Entryfile/offcanvance/index.jsx';
import "../../index.css"
import { useCompanyContext } from '../../../context/index.jsx';
import DashboardCard from '../../../_components/cards/dashboardCard.jsx';
import useHttp from '../../../hooks/useHttp.jsx';
import { MdOutlineEventNote, MdOutlineFeed, MdOutlineFolderOpen, MdOutlineSummarize, MdOutlineQueryBuilder, MdOutlineSwitchAccount } from 'react-icons/md';
import man from "../../../assets/img/user.jpg"
import StaffHeader from '../StaffHeader';
import StaffSidebar from '../StaffSidebar';



const StaffDashboard = () => {
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

  const staffProfile = JSON.parse(localStorage.getItem('staffProfile'));

  async function FetchStaff() {
    setLoading(true)
    try {
      const staffResponse = await get(`/ShiftRosters/get_shifts_by_user?client=&staff=${staffProfile.staffId}`, { cacheTimeout: 300000 });
      const staff = staffResponse.data;
      // console.log(staff.shiftRoster);
      setStaff(staff.shiftRoster);
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

        <StaffHeader />
        <StaffSidebar />
        <div className="page-wrapper">
          <Helmet>
            <title>Dashboard - Promax Staff Dashboard</title>
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
                  <DashboardCard title={"Total Shift Roster"} content={staff.length} icon={<MdOutlineEventNote className='fs-4' />}
                    link={`/staff/staff-roster`}
                    sty={'danger'}
                  />
                  <DashboardCard title={"Progress Notes "} content={0} icon={<MdOutlineFeed className='fs-4' />}
                    linkTitle={"View Progress Notes"} link={``} sty={'success'}
                  />

                  <DashboardCard title={"Attendances"} content={0} icon={<MdOutlineQueryBuilder className='fs-4' />}
                    link={``} sty={'warning'}
                  />
                  <DashboardCard title={"Roster Summary"} content={0} icon={<MdOutlineSummarize className='fs-4' />}
                    link={``} sty={'warning'}
                  />
                </div>

              </div>


              <div className='col-md-4 p-2'>

                <div className='p-3 shadow-sm'>
                  <h3>Clients</h3>
                  <div className='d-flex justify-content-center flex-column p-2 gap-2'>
                    <div className='d-flex justify-content-between align-items-center'>
                      <span><MdOutlineSwitchAccount className='fs-3' /> Assign clients</span>
                      <h2 className='text-primary'>

                        {clients.length}
                      </h2>
                    </div>
                    <div className=''>
                      <Link style={{ fontSize: "12px" }}

                        to={``} className='pointer text-dark text-center'>View all</Link>
                    </div>

                    <div className='border p-2'>
                      <div>
                        <div className={`card shadow-none border border-primary`}>
                          <div className="card-content shadow-none">
                            <div className="card-body shadow-none">
                              <div className="media d-flex justify-content-between">
                                <div className="media-body text-left">
                                  <span>Attendance</span>

                                  {/* {
                             loading ? (<div className=" d-flex py-2 justify-content-start fs-6">
                               <div className="spinner-grow text-light" role="status">
                                 <span className="sr-only">Loading...</span>
                               </div>
                             </div>
                             )
 
                               : */}
                                  <div>
                                    <h4>3/26/2023</h4>
                                    <h4>6:12:00 PM</h4>
                                  </div>

                                  <small style={{ fontSize: "12px" }}>Last Clock in</small>
                                </div>
                                <div className="align-self-center pt-3">
                                  <div>
                                    <h4>3/26/2023</h4>
                                    <h4>6:12:00 PM</h4>
                                  </div>
                                  <small style={{ fontSize: "12px" }}>Last Clock out</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              </div>



              <div className='col-md-3 p-2 d-flex flex-column gap-2 justify-content-start'>
                <div className='p-3 shadow-sm'>
                  <h5>Recently Assign Clients</h5>
                  <div className="row mt-2">
                    <div className="col-2">
                      <div className='rounded-circle mt-3' style={{ width: "35px", height: "35px" }}>
                        <img src={man} alt="" width={50} height={50} className='rounded-circle' />
                      </div>
                    </div>

                    <div className="col-10 d-flex flex-column justify-content-start">
                      <span className='text-primary fs-5 fw-bold'>Joe Cole</span>
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
                          <span>Client Documents</span>

                          {
                            loading ? (<div className=" d-flex py-2 justify-content-start fs-6">
                              <div className="spinner-grow text-light" role="status">
                                <span className="sr-only">Loading...</span>
                              </div>
                            </div>
                            )

                              :
                              <h3 className='text-info'>3</h3>
                          }

                          <Link style={{ fontSize: "12px" }}

                            to={`/staff/staff-document`} className='pointer text-dark'>View all</Link>
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

          </div>
        </div>
      </div>



      {/* /Page Content */}


      <Offcanvas />
    </>
  );
}

export default withRouter(StaffDashboard);
