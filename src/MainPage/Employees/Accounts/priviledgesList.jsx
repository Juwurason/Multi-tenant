import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { FaBackspace } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import useHttp from '../../../hooks/useHttp';
import { useCompanyContext } from '../../../context';
const PriviledgesList = () => {
    const { uid } = useParams();
    const { userProfile } = useCompanyContext();
    const [loading, setLoading] = useState(false)
    const [claims, setClaims] = useState([]);
    const privateHttp = useHttp();
    const navigate = useHistory();

    const FetchClaims = async () => {
        try {
            const { data } = await privateHttp.get(`/Account/get_user_roles?userId=${uid}`, { cacheTimeout: 300000 })


        } catch (error) {
            console.log(error);
        }
        try {
            const { data } = await privateHttp.get(`/Account/get_user_claims?userId=${uid}`, { cacheTimeout: 300000 })
            setClaims(data.userClaims.claims);


        } catch (error) {
            console.log(error);
        }

    }
    useEffect(() => {

        FetchClaims()
    }, []);
    const handleCheckboxChange = (index) => {
        const updatedClaims = [...claims];
        updatedClaims[index].isSelected = !updatedClaims[index].isSelected;
        setClaims(updatedClaims);
    };




    return (
        <div className="page-wrapper">
            <Helmet>
                <title>Manage User Role</title>
                <meta name="description" content="" />
            </Helmet>
            <div className="content container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title mb-0">Manage User Priviledges</h4>
                                <Link to={'/app/account/alluser'} className="card-title mb-0 text-danger fs-3 "> <MdCancel /></Link>
                            </div>

                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label className="col-form-label fw-bold">User Claims for</label>
                                            <div className='p-2 row'>
                                                {claims.map((claim, index) => (
                                                    <span key={index} className='col-md-4'>
                                                        <input
                                                            type="checkbox"
                                                            checked={claim.isSelected}
                                                            onChange={() => handleCheckboxChange(index)}
                                                        /> &nbsp;
                                                        <span className='fw-bold'>
                                                            {claim.claimType}
                                                        </span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="form-group text-center mb-0">
                                    <div className="text-center d-flex gap-2">



                                        <button className="btn btn-info add-btn text-white rounded-2 m-r-5">
                                            Update
                                        </button>
                                        <button
                                            className="btn add-btn rounded-2 m-r-5 btn-outline-secondary ml-4">
                                            Cancel
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PriviledgesList;