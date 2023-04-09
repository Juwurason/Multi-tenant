/**
 * TermsCondition Page
 */
import React, { Component, useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useParams } from 'react-router-dom';
import { Avatar_01, Avatar_02, Avatar_05, Avatar_09, Avatar_10, Avatar_11, Avatar_12, Avatar_13, Avatar_16, Avatar_19 } from '../../../Entryfile/imagepath'
import Offcanvas from '../../../Entryfile/offcanvance';
import useHttp from '../../../hooks/useHttp';
import '../../../assets/css/table.css';

const ClientProfile = () => {
  const { uid } = useParams()
  const [clientOne, setClientOne] = useState({});

  const privateHttp = useHttp()
  useEffect(() => {
    const FetchClient = async () => {
      try {
        const { data } = await privateHttp.get(`/Profiles/${uid}`)
        setClientOne(data)


      } catch (error) {
        console.log(error);
      }
    }
    FetchClient()
  }, [])

  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title>Client Profile</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Profile</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Profile</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="card mb-0">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="profile-view">
                    <div className="profile-img-wrap">
                      <div className="profile-img">
                        <a href="">
                          <img src={Avatar_19} alt="" />
                        </a>
                      </div>
                    </div>
                    <div className="profile-basic">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="profile-info-left">
                            <h3 className="user-name m-t-0">{clientOne.fullName}</h3>
                            {/* <h5 className="company-role m-t-0 mb-0">Barry Cuda</h5> */}
                            <small className="text-muted">{clientOne.email}</small>
                            {/* <div className="staff-id">Employee ID : CLT-0001</div> */}
                            <div className="staff-msg"><Link to={`/app/employees/edit-client/${clientOne.profileId}`} className="btn btn-primary">Edit Profile</Link></div>
                          </div>
                        </div>
                        <div className="col-md-7">
                          <ul className="personal-info">
                            <li>
                              <span className="title">Phone:</span>
                              <span className="text"><a href={`tel:${clientOne.phoneNumber}`}>{clientOne.phoneNumber}</a></span>
                            </li>
                            <li>
                              <span className="title">Email:</span>
                              <span className="text"><a href={`mailto:${clientOne.email}`}>{clientOne.email}</a></span>
                            </li>
                            <li>
                              <span className="title">Birthday:</span>
                              <span className="text">{clientOne.dateOfBirth}</span>
                            </li>
                            <li>
                              <span className="title">Address:</span>
                              <span className="text">{clientOne.address}</span>
                            </li>
                            <li>
                              <span className="title">Gender:</span>
                              <span className="text">{clientOne.gender}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="table-responsive">
              <div className="table-wrapper">
                <div className="table-title bg-primary">
                  <div className="row">
                    <div className="col-sm-5">
                      <h3 className='text-white'>Client Shift Roaster</h3>
                    </div>
                    <div className="col-sm-7">
                      <a href="#" className="btn btn-secondary"><i className="material-icons"></i> <span>Download PDF</span></a>
                      <a href="#" className="btn btn-secondary"><i className="material-icons"></i> <span>Export to Excel</span></a>
                    </div>
                  </div>
                </div>
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Staff</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Activities</th>
                      <th>Attendance</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* <tr>
                      <td>1</td>
                      <td><a href="#">Michael Holz</a></td>
                      <td>04/10/2013</td>
                      <td>Admin</td>
                      <td><span className="status text-success">•</span> Active</td>
                      <td>
                        <a href="#" className="settings" title="Settings" data-toggle="tooltip"><i className="material-icons"></i></a>
                        <a href="#" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                      </td>
                    </tr> */}




                  </tbody>
                </table>
                <div className="clearfix">
                  <div className="hint-text">Showing <b>5</b> out of <b>25</b> entries</div>
                  <ul className="pagination">
                    <li className="page-item disabled"><a href="#">Previous</a></li>
                    <li className="page-item"><a href="#" className="page-link">1</a></li>
                    <li className="page-item"><a href="#" className="page-link">2</a></li>
                    <li className="page-item active"><a href="#" className="page-link">3</a></li>
                    <li className="page-item"><a href="#" className="page-link">4</a></li>
                    <li className="page-item"><a href="#" className="page-link">5</a></li>
                    <li className="page-item"><a href="#" className="page-link">Next</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* /Page Content */}
      </div>
      <Offcanvas />
    </>


  );
}
export default ClientProfile;
