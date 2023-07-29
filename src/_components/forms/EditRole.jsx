import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { FaBackspace, FaCaretRight } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCompanyContext } from '../../context';
import useHttp from '../../hooks/useHttp';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../store/axiosInstance';
const EditRole = () => {
    const { uid } = useParams();
    const [roles, setRoles] = useState([]);
    const [claims, setClaims] = useState([]);
    const [userName, setUserName] = useState({});

    const privateHttp = useHttp();
    const navigate = useHistory();

    const FetchRole = async () => {
        try {
            const { data } = await privateHttp.get(`/Account/get_a_user?userId=${uid}`, { cacheTimeout: 300000 })
            setUserName(data)

        } catch (error) {
            console.log(error);
        }
        try {
            const { data } = await privateHttp.get(`/Account/get_user_roles?userId=${uid}`, { cacheTimeout: 300000 })
            const selectedRoles = data.userRoles.filter(roles => roles.isSelected);
            setRoles(selectedRoles);

        } catch (error) {
            console.log(error);
        }
        try {
            const { data } = await axiosInstance.get(`/Account/get_user_claims?userId=${uid}`)
            const selectedClaims = data.userClaims.claims.filter(claims => claims.isSelected);
            setClaims(selectedClaims);

        } catch (error) {
            console.log(error);
        }

    }
    useEffect(() => {

        FetchRole()
    }, []);

    const selectedRoles = roles.filter(role => role.isSelected);


    return (
        <div className="page-wrapper">
            <Helmet>
                <title>Edit Role</title>
                <meta name="description" content="" />
            </Helmet>
            <div className="content container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title mb-0">Edit Role</h4>
                                <Link to={'/app/employee/allstaff'} className="card-title mb-0 text-danger fs-3 "> <MdCancel /></Link>
                            </div>

                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="col-form-label fw-bold">User Name</label>
                                            <input className="form-control" type="text" value={userName.firstName} readOnly />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="col-form-label fw-bold">Email</label>
                                            <input className="form-control" type="text" value={userName.email} readOnly />
                                        </div>
                                    </div>
                                </div>

                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <div className="form-group p-2 border">
                                            <label className="col-form-label fw-bold fs-5">User Roles</label>
                                            <ol>
                                                {roles.map((role) => (
                                                    <li key={role.roleId}><span className='fw-bold'><FaCaretRight /> </span> {role.roleName}</li>
                                                ))}
                                            </ol>
                                        </div>
                                        <div className="form-group p-2">
                                            <Link
                                                to={`/app/account/role-list/${uid}`}
                                                className="bg-primary p-2 rounded text-white">Manage Roles</Link>

                                        </div>
                                    </div>
                                    <div className="col-sm-9 ">
                                        <div className="form-group p-2 border">
                                            <label className="fw-bold fs-5 col-form-label">User Priviledges</label>
                                            <ol className='row'>
                                                {claims.map((claim, index) => (
                                                    <li key={index} className='col-md-3 px-3'><span className='fw-bold'><FaCaretRight /> </span> {claim.claimType}</li>
                                                ))}
                                            </ol>
                                        </div>
                                        <div className="form-group p-2">

                                            <Link
                                                to={`/app/account/priviledges-list/${uid}`}
                                                className="bg-primary p-2 rounded text-white">Manage Priviledges</Link>
                                        </div>
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

export default EditRole;