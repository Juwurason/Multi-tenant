import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { FaBackspace } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import useHttp from '../../../hooks/useHttp';
import { useCompanyContext } from '../../../context';
const RoleList = () => {
    const { uid } = useParams();
    const { userProfile } = useCompanyContext();
    const [loading, setLoading] = useState(false)
    const [firstName, setFirstName] = useState('');
    const [surName, setSurName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [offerLetter, setOfferLetter] = useState(null);
    const privateHttp = useHttp();
    const navigate = useHistory();

    const FetchRole = async () => {
        try {
            const { data } = await privateHttp.get(`/Account/get_user_roles?userId=${uid}`, { cacheTimeout: 300000 })
            console.log(data);

        } catch (error) {
            console.log(error);
        }
        try {
            const { data } = await privateHttp.get(`/Account/get_user_claims?userId=${uid}`, { cacheTimeout: 300000 })
            console.log(data);

        } catch (error) {
            console.log(error);
        }

    }
    useEffect(() => {

        FetchRole()
    }, []);


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
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="col-form-label fw-bold">Email</label>
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>
                                </div>

                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <div className="form-group p-2 border">
                                            <label className="fw-bold fs-5">User Roles</label>
                                        </div>
                                        <div className="form-group p-2 border">
                                            <button className="btn btn-primary btn-sm">Manage Roles</button>

                                        </div>
                                    </div>
                                    <div className="col-sm-9 ">
                                        <div className="form-group p-2 border">
                                            <label className="fw-bold fs-5">User Priviledges</label>
                                        </div>
                                        <div className="form-group p-2 border">
                                            <button className="btn btn-primary btn-sm">Manage Priviledges</button>
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

export default RoleList;