
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, withRouter } from 'react-router-dom';
import Offcanvas from '../../../Entryfile/offcanvance/index.jsx';
import "../../index.css"
import { useCompanyContext } from '../../../context/index.jsx';
import DashboardCard from '../../../_components/cards/dashboardCard.jsx';
import useHttp from '../../../hooks/useHttp.jsx';
import { MdOutlineEventNote, MdOutlineFolderOpen, MdOutlinePeople, MdOutlineQueryBuilder } from 'react-icons/md';
import { FaArrowRight, FaLongArrowAltRight } from 'react-icons/fa';
import { GoNote } from 'react-icons/go';
import { GiNotebook } from 'react-icons/gi';
import { AiOutlineFolder } from 'react-icons/ai';
import man from "../../../assets/img/user.jpg"
import AdminHeader from '../Components/AdminHeader';
import AdminSidebar from '../Components/AdminSidebar';




const AdminDashboard = () => {
    const userObj = JSON.parse(localStorage.getItem('user'));
    const [staff, setStaff] = useState([]);
    const [clients, setClients] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [rosters, setRosters] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [progressNote, setProgressNote] = useState([]);
    const [loading, setLoading] = useState(false);
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
            const { data } = await get(`/Profiles?companyId=${userObj.companyId}`, { cacheTimeout: 300000 });
            setClients(data);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
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
            setLoading(false)
        }

        try {
            const { data } = await get(`Staffs?companyId=${userObj.companyId}`, { cacheTimeout: 300000 });
            setStaff(data);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }

        try {
            const { data } = await get(`ShiftRosters/get_all_shift_rosters?companyId=${userObj.companyId}`, { cacheTimeout: 300000 });
            setRosters(data);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }

        try {
            setLoading(true)
            const { data } = await get(`Attendances/get_all_attendances_by_company?companyId=${userObj.companyId}`, { cacheTimeout: 300000 });
            // console.log(data);
            setAttendance(data);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
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
            const { data } = await get(`ProgressNotes/get_all_progressnote_by_company?companyId=${userObj.companyId}`, { cacheTimeout: 300000 });
            setProgressNote(data);
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

    // useEffect(() => {
    //     let firstload = localStorage.getItem("firstload")
    //     if (firstload === "false") {
    //         setTimeout(function () {
    //             window.location.reload(1)
    //             localStorage.removeItem("firstload")
    //         }, 1000)
    //     }
    // });



    return (
        <>
            <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>

                {/* <AdminHeader />
                <AdminSidebar /> */}
                <div className="page-wrapper">
                    <Helmet>
                        <title>Dashboard - Promax Admin Dashboard</title>
                        <meta name="description" content="Admin Dashboard" />
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
                        <div className="row g-1 gap-5">
                            <div className='col-md-7'>
                                <div className="row">
                                    <h4>Overview</h4>
                                    <DashboardCard title={"Total Client"} content={clients.length} icon={<MdOutlinePeople className='fs-4' />}
                                        link={`/administrator/allClient`}
                                        sty={'primary'}
                                    />
                                    <DashboardCard title={"Total Staff"} content={staff.length} icon={<MdOutlinePeople className='fs-4' />}
                                        link={`/administrator/allStaff`}
                                        sty={'danger'}
                                    />
                                    <DashboardCard title={"Total Tickets"} content={0} icon={<MdOutlineEventNote className='fs-4' />}
                                        link={`/administrator/viewTickets`}
                                        sty={'warning'}
                                    />
                                    <DashboardCard title={"Total Documents"} content={document.length} icon={<AiOutlineFolder className='fs-4' />}
                                        linkTitle={"Total Documents"} link={`/administrator/allDocuments`} sty={'info'}
                                    />

                                    <DashboardCard title={"Total Progress Notes"} content={progressNote.length} icon={<GoNote className='fs-4' />}
                                        link={`/administrator/progressReport`} sty={'danger'}
                                    />

                                    <DashboardCard title={"Total Shift Roster"} content={rosters.length} icon={<MdOutlineQueryBuilder className='fs-4' />}
                                        link={`/administrator/shiftRoster`} sty={'success'}
                                    />
                                    <DashboardCard title={"Total Attendances"} content={attendance.length} icon={<GiNotebook className='fs-4' />}
                                        link={`/administrator/attendanceReport`} sty={'info'}
                                    />
                                    {/* <DashboardCard title={"Total Shift Roster For May"} content={0} icon={<MdOutlineSummarize className='fs-4' />}
                                        link={``} sty={'info'}
                                    /> */}
                                    <DashboardCard title={"Total Shift Roster for Today"} content={0} icon={<MdOutlineQueryBuilder className='fs-4' />}
                                        link={``} sty={'danger'}
                                    />
                                </div>

                            </div>


                            <div className='col-md-4 p-2 d-flex  flex-column gap-2 justify-content-start'>
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

                                            <Link to={`/administrator/clientProfile/${data.profileId}/${data.firstName}`} className="row mt-2" key={index}>
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
                                        <Link to={'/administrator/allClient'}
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

                                                    {/* <Link style={{ fontSize: "12px" }}

                                                        to={`/app/employee/document`} className='pointer text-dark text-end'>View all</Link> */}
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

                    </div>
                </div>
            </div>



            {/* /Page Content */}


            <Offcanvas />
        </>
    );
}

export default withRouter(AdminDashboard);
