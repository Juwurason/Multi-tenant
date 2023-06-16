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
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const privateHttp = useHttp();
    const navigate = useHistory();

    const FetchRole = async () => {
        try {
            const { data } = await privateHttp.get(`/Account/get_user_roles?userId=${uid}`, { cacheTimeout: 300000 })
            console.log(data);
            setRoles(data.userRoles);
        } catch (error) {
            console.log(error);
        }


    }
    const handleCheckboxChange = (roleId) => {
        const updatedRoles = roles.map((role) => {
            if (role.roleId === roleId) {
                return { ...role, isSelected: !role.isSelected };
            }
            return role;
        });
        setRoles(updatedRoles);
        console.log(roles);
    };

    const handleAssignRoles = async () => {
        try {
            const selectedRolesData = userRoles
                .filter((role) => role.isSelected)
                .map(({ isSelected, ...role }) => role);
            await post("/assignroles", selectedRolesData); // Replace with your actual endpoint
            // Show success message or perform other actions
        } catch (error) {
            console.log(error);
            // Show error message or handle the error
        }
    };

    useEffect(() => {

        FetchRole()
    }, []);
    // /Account/assign_role_to_user?userId=7a1cb5d1-1b6a-402e-a38c-b01b734f53fb



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
                                            <label className="col-form-label fw-bold">User Roles for</label>
                                            <div className='p-2 d-flex flex-column'>
                                                {
                                                    roles.map((role, index) =>
                                                        <span key={index}><input
                                                            type="checkbox"
                                                            checked={role.isSelected}
                                                            onChange={() => handleCheckboxChange(role.roleId)}

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


                                                DO NOT ASSIGN ANY OTHER ROLE TO A STAFF ASIDE "STAFF" & "ADMINSTAFF" ONLY
                                                DO NOT ASIDE ANY OTHER ROLE TO AN ADMIN EXCEPT "ADMIN" ONLY
                                            </p>
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

export default RoleList;