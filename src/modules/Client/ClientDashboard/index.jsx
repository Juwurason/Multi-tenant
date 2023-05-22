/**
 * Signin Firebase
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, withRouter } from 'react-router-dom';

import Offcanvas from '../../../Entryfile/offcanvance/index.jsx';
import "../../index.css"
import { useCompanyContext } from '../../../context/index.jsx';
import DashboardCard from '../../../_components/cards/dashboardCard.jsx';
import useHttp from '../../../hooks/useHttp.jsx';
import { MdOutlineEventNote, MdOutlineFeed, MdOutlineFolderOpen, MdOutlineSummarize, MdOutlineQueryBuilder, MdOutlineSwitchAccount } from 'react-icons/md';
import ClientHeader from '../Components/ClientHeader/index.jsx';
import ClientSideBar from '../Components/ClientSideBar/index.jsx';



const ClientDashboard = () => {
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

  //  useEffect(() => {
  //    let firstload = localStorage.getItem("firstload")
  //    if (firstload === "false") {
  //      setTimeout(function () {
  //        window.location.reload(1)
  //        localStorage.removeItem("firstload")
  //      }, 1000)
  //    }
  //  });



  return (
    <>
      <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>

        <ClientHeader />
        <ClientSideBar />
        <div className="page-wrapper">
          <Helmet>
            <title>Dashboard - Promax Client Dashboard</title>
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
                  <DashboardCard title={" Shift Assign"} content={0} icon={<MdOutlineEventNote className='fs-4' />}
                    link={``}
                    sty={'danger'}
                  />

                  <DashboardCard title={"Attendances"} content={0} icon={<MdOutlineQueryBuilder className='fs-4' />}
                    link={``} sty={'warning'}
                  />
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


export default withRouter(ClientDashboard);
