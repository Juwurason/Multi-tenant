import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { FaBackspace } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import useHttp from '../../../hooks/useHttp';
const RoleList = () => {
    const { uid } = useParams();
    const [loading1, setLoading1] = useState(false)
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [userName, setUserName] = useState({});
    const privateHttp = useHttp();
    const navigate = useHistory();
    const [updatedRoles, setUpdatedRoles] = useState([]);

    const FetchRole = async () => {
        try {
            const { data } = await privateHttp.get(`/Account/get_a_user?userId=${uid}`, { cacheTimeout: 300000 })
            setUserName(data)

        } catch (error) {
            console.log(error);
        }
        try {
            const { data } = await privateHttp.get(`/Account/get_user_roles?userId=${uid}`, { cacheTimeout: 300000 })
            setRoles(data.userRoles);
        } catch (error) {
            console.log(error);
        }


    }

    useEffect(() => {

        FetchRole()
    }, []);
    // /Account/assign_role_to_user?userId=7a1cb5d1-1b6a-402e-a38c-b01b734f53fb

    const handleCheckboxChange = (index) => {
        const updatedRoles = [...roles];
        updatedRoles[index].isSelected = !updatedRoles[index].isSelected;
        setRoles(updatedRoles);

        // Filter the claims to include only selected claims
        const selectedRoles = updatedRoles.filter((role) => role.isSelected);
        setUpdatedRoles(selectedRoles);

    };
    console.log(updatedRoles);




    const HandleUpdate = async () => {
        try {
            setLoading1(true)
            const { data } = await privateHttp.post(`/Account/add_claims_to_user`,
                {
                    userId: uid,
                    claims: updatedClaims

                }
            )
            if (data.status === 'Success') {

                toast.success(data.message)
                FetchClaims()
                setLoading1(false);
            }
            setLoading1(false);

        } catch (error) {
            toast.error("Add Claim to user failed")
            toast.error(error.response?.data?.message)

            setLoading1(false)

        } finally {
            setLoading1(false)
        }

    }


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
                                <h4 className="card-title mb-0">Manage User Role</h4>
                                <Link to={'/app/account/alluser'} className="card-title mb-0 text-danger fs-3 "> <MdCancel /></Link>
                            </div>

                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="col-form-label fw-bold">User Roles for {userName.email}</label>
                                            <div className='p-2 d-flex flex-column'>
                                                {
                                                    roles.map((role, index) =>
                                                        <span key={index}><input
                                                            type="checkbox"
                                                            checked={role.isSelected}
                                                            onChange={() => handleCheckboxChange(index)}

                                                            name="" id="" /> &nbsp;
                                                            <span className='fw-bold'>
                                                                {role.roleName}
                                                            </span></span>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 pt-4">
                                        <div className=" bg-warning rounded p-2 text-white">
                                            <p>
                                                <h5 className='fw-bold'>
                                                    ALERT

                                                </h5>
                                                <h5 className='fw-bold'>
                                                    Instruction to Assigning Roles

                                                </h5>


                                                DO NOT ASSIGN ANY OTHER ROLE TO A STAFF ASIDE "STAFF" & "ADMINSTAFF" ONLY. <br />
                                                DO NOT ASSIGN ANY OTHER ROLE TO AN ADMIN EXCEPT "ADMIN" ONLY
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group text-center mb-0">
                                    <div className="text-center d-flex gap-2">
                                        <button className="btn btn-info add-btn text-white rounded-2 m-r-5">
                                            Update
                                        </button>
                                        <Link
                                            to={`/app/account/editrole/${uid}`}
                                            className="btn add-btn rounded-2 m-r-5 btn-outline-secondary ml-4">
                                            Cancel
                                        </Link>


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