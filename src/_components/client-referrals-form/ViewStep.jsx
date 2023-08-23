import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { FaBackspace } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import MultiStep from "react-multistep";
import StepTwo from './stepTwo';
import StepOne from './stepOne';
// import "./prog-track.css";
// import "./styles.css";


const ViewStep = () => {

    // const steps = [
    //     { name: "Name A", component: <StepOne /> },
    //     { name: "Email", component: <StepTwo /> },
    //     { name: "Email", component: <StepTwo /> },
    //     { name: "Email", component: <StepTwo /> },
    //     { name: "Agreement", component: <StepTwo /> }

    // ];

    return (
        <div className="page-wrapper">
            <Helmet>
                <title> Client Referral Form </title>
                <meta name="description" content="" />
            </Helmet>
            <div className="content container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title mb-0">Fill in the</h4>
                                <Link to={'/app/employee/alladmin'} className="card-title mb-0 text-danger fs-3 "></Link>
                            </div>

                            <div>
                                <MultiStep activeStep={0}>
                                    <StepOne title='Step 1' style={{ display: 'flex', justifyContent: 'center' }} />
                                    <StepTwo title='Step 2' />
                                </MultiStep>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewStep;