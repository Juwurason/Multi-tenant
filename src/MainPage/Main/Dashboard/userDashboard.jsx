
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory } from 'react-router-dom';
import Offcanvas from '../../../Entryfile/offcanvance';
import heroImg from '../../../assets/img/office.jpg';
import axiosInstance from '../../../store/axiosInstance';



const UserDashboard = () => {

    const id = JSON.parse(localStorage.getItem('user'));


    const [companyOne, setCompanyOne] = useState({});

    const FetchCompany = async () => {
        try {
          const { data } = await axiosInstance.get(`/Companies/get_company/${id.companyId}`, { cacheTimeout: 300000 })
          // console.log(data.company);
          setCompanyOne(data.company)
          // console.log(data.company);
          // setEditedCompany({ ...data.company })
    
    
        } catch (error) {
          console.log(error);
        }
      }
      useEffect(() => {
        FetchCompany()
      }, []);


    return (
        <>
            <div className="page-wrapper">
                <Helmet>
                    <title>User Dashboard</title>
                    <meta name="description" content="All user" />
                </Helmet>
                {/* Page Content */}
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">User Dashboard</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/app/main/user-dashboard">Dashboard</Link></li>
                            </ul>
                        </div>

                    </div>

                    <div className="row mt-4">
                        <div className="col-md-12">
                            <div className="card">

                                <div className="card-body">

                                    <div className="hero-container" id="hero-sec">
                                        <div className="container-fluid ">
                                            <div className="row d-flex">
                                                <div className="col">
                                                    <div className="px-5 py-5 mt-5">
                                                        <div className="px-2 py-2 align-middle">
                                                            <h2>Welcome to {companyOne.companyName}</h2>
                                                            <p></p>
                                                        </div>
                                                        <div className="px-2 py-2">
                                                            <button type="button" className="btn btn-outline-primary">Contact Administrator</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col align-middle">
                                                    <div className="px-2 py-2">
                                                        <img src={heroImg} className="img-fluid" alt="..." />
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


            </div>
            <Offcanvas />
        </>


    );
}

export default UserDashboard;
