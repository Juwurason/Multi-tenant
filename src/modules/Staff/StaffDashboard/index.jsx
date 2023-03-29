
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, withRouter } from 'react-router-dom';
import { User, Avatar_19, Avatar_07, Avatar_06, Avatar_14 } from '../../../Entryfile/imagepath.jsx'

import {
    BarChart, Bar, Cell, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { IoIosPeople } from "react-icons/io"
import { BsFillCalendarRangeFill } from "react-icons/bs"
import Offcanvas from '../../../Entryfile/offcanvance/index.jsx';
import "../../../MainPage/index.css"
import StaffSidebar from '../StaffSidebar/index.jsx';
import StaffHeader from '../StaffHeader/index.jsx';


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

const staffName = JSON.parse(localStorage.getItem('user'))
const StaffDashboard = () => {

    const [menu, setMenu] = useState(false)

    const toggleMobileMenu = () => {
        setMenu(!menu)
    }

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

                <StaffHeader onMenuClick={(value) => toggleMobileMenu()} />
                <StaffSidebar />
                <div className="page-wrapper">
                    <Helmet>
                        <title>Dashboard</title>
                        <meta name="description" content="Dashboard" />
                    </Helmet>
                    {/* Page Content */}
                    <div className="content container-fluid">
                        {/* Page Header */}
                        <div className="page-header">
                            <div className="row">
                                <div className="col-sm-12">
                                    <h3 className="page-title">Welcome Staff!</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item active">Dashboard</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                       
                        <div className="row">
                            <div className="col-md-6 d-flex">
                                <div className="card card-table flex-fill">
                                    <div className="card-header">
                                        <h3 className="card-title mb-0">Clients</h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table custom-table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Status</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <h2 className="table-avatar">
                                                                <a href="#" className="avatar"><img alt="" src={Avatar_19} /></a>
                                                                <Link to="/app/profile/client-profile">Barry Cuda <span>CEO</span></Link>
                                                            </h2>
                                                        </td>
                                                        <td>barrycuda@example.com</td>
                                                        <td>
                                                            <div className="dropdown action-label">
                                                                <a className="btn btn-white btn-sm btn-rounded dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i className="fa fa-dot-circle-o text-success" /> Active
                                                                </a>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-dot-circle-o text-success" /> Active</a>
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-dot-circle-o text-danger" /> Inactive</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="dropdown dropdown-action">
                                                                <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-pencil m-r-5" /> Edit</a>
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h2 className="table-avatar">
                                                                <a href="#" className="avatar"><img alt="" src={Avatar_19} /></a>
                                                                <Link to="/app/profile/client-profile">Tressa Wexler <span>Manager</span></Link>
                                                            </h2>
                                                        </td>
                                                        <td>tressawexler@example.com</td>
                                                        <td>
                                                            <div className="dropdown action-label">
                                                                <a className="btn btn-white btn-sm btn-rounded dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i className="fa fa-dot-circle-o text-danger" /> Inactive
                                                                </a>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-dot-circle-o text-success" /> Active</a>
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-dot-circle-o text-danger" /> Inactive</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="dropdown dropdown-action">
                                                                <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-pencil m-r-5" /> Edit</a>
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h2 className="table-avatar">
                                                                <Link to="/app/profile/client-profile" className="avatar"><img alt="" src={Avatar_07} /></Link>
                                                                <Link to="/app/profile/client-profile">Ruby Bartlett <span>CEO</span></Link>
                                                            </h2>
                                                        </td>
                                                        <td>rubybartlett@example.com</td>
                                                        <td>
                                                            <div className="dropdown action-label">
                                                                <a className="btn btn-white btn-sm btn-rounded dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i className="fa fa-dot-circle-o text-danger" /> Inactive
                                                                </a>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-dot-circle-o text-success" /> Active</a>
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-dot-circle-o text-danger" /> Inactive</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="dropdown dropdown-action">
                                                                <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-pencil m-r-5" /> Edit</a>
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h2 className="table-avatar">
                                                                <Link to="/app/profile/client-profile" className="avatar"><img alt="" src={Avatar_06} /></Link>
                                                                <Link to="/app/profile/client-profile"> Misty Tison <span>CEO</span></Link>
                                                            </h2>
                                                        </td>
                                                        <td>mistytison@example.com</td>
                                                        <td>
                                                            <div className="dropdown action-label">
                                                                <a className="btn btn-white btn-sm btn-rounded dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i className="fa fa-dot-circle-o text-success" /> Active
                                                                </a>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-dot-circle-o text-success" /> Active</a>
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-dot-circle-o text-danger" /> Inactive</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="dropdown dropdown-action">
                                                                <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-pencil m-r-5" /> Edit</a>
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h2 className="table-avatar">
                                                                <Link to="/app/profile/client-profile" className="avatar"><img alt="" src={Avatar_14} /></Link>
                                                                <Link to="/app/profile/client-profile"> Daniel Deacon <span>CEO</span></Link>
                                                            </h2>
                                                        </td>
                                                        <td>danieldeacon@example.com</td>
                                                        <td>
                                                            <div className="dropdown action-label">
                                                                <a className="btn btn-white btn-sm btn-rounded dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i className="fa fa-dot-circle-o text-danger" /> Inactive
                                                                </a>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-dot-circle-o text-success" /> Active</a>
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-dot-circle-o text-danger" /> Inactive</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="dropdown dropdown-action">
                                                                <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-pencil m-r-5" /> Edit</a>
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <Link to="/app/employees/clients">View all clients</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 d-flex">
                                <div className="card card-table flex-fill">
                                    <div className="card-header">
                                        <h3 className="card-title mb-0">Recent Projects</h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table custom-table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Project Name </th>
                                                        <th>Progress</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <h2><Link to="/app/projects/projects-view">Office Management</Link></h2>
                                                            <small className="block text-ellipsis">
                                                                <span>1</span> <span className="text-muted">open tasks, </span>
                                                                <span>9</span> <span className="text-muted">tasks completed</span>
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <div className="progress progress-xs progress-striped">
                                                                <div className="progress-bar" role="progressbar" data-bs-toggle="tooltip" title="65%" style={{ width: '65%' }} />
                                                            </div>
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="dropdown dropdown-action">
                                                                <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-pencil m-r-5" /> Edit</a>
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h2><Link to="/app/projects/projects-view">Project Management</Link></h2>
                                                            <small className="block text-ellipsis">
                                                                <span>2</span> <span className="text-muted">open tasks, </span>
                                                                <span>5</span> <span className="text-muted">tasks completed</span>
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <div className="progress progress-xs progress-striped">
                                                                <div className="progress-bar" role="progressbar" data-bs-toggle="tooltip" title="15%" style={{ width: '15%' }} />
                                                            </div>
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="dropdown dropdown-action">
                                                                <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-pencil m-r-5" /> Edit</a>
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h2><Link to="/app/projects/projects-view">Video Calling App</Link></h2>
                                                            <small className="block text-ellipsis">
                                                                <span>3</span> <span className="text-muted">open tasks, </span>
                                                                <span>3</span> <span className="text-muted">tasks completed</span>
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <div className="progress progress-xs progress-striped">
                                                                <div className="progress-bar" role="progressbar" data-bs-toggle="tooltip" title="49%" style={{ width: '49%' }} />
                                                            </div>
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="dropdown dropdown-action">
                                                                <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-pencil m-r-5" /> Edit</a>
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h2><Link to="/app/projects/projects-view">Hospital Administration</Link></h2>
                                                            <small className="block text-ellipsis">
                                                                <span>12</span> <span className="text-muted">open tasks, </span>
                                                                <span>4</span> <span className="text-muted">tasks completed</span>
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <div className="progress progress-xs progress-striped">
                                                                <div className="progress-bar" role="progressbar" data-bs-toggle="tooltip" title="88%" style={{ width: '88%' }} />
                                                            </div>
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="dropdown dropdown-action">
                                                                <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-pencil m-r-5" /> Edit</a>
                                                                    <a className="dropdown-item" href="#"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h2><Link to="/app/projects/projects-view">Digital Marketplace</Link></h2>
                                                            <small className="block text-ellipsis">
                                                                <span>7</span> <span className="text-muted">open tasks, </span>
                                                                <span>14</span> <span className="text-muted">tasks completed</span>
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <div className="progress progress-xs progress-striped">
                                                                <div className="progress-bar" role="progressbar" data-bs-toggle="tooltip" title="100%" style={{ width: '100%' }} />
                                                            </div>
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="dropdown dropdown-action">
                                                                <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" ><i className="fa fa-pencil m-r-5" /> Edit</a>
                                                                    <a className="dropdown-item"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <Link to="/app/projects/project_dashboard">View all projects</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /Page Content */}
                </div>
            </div>
            <Offcanvas />
        </>
    );
}

export default withRouter(StaffDashboard);
