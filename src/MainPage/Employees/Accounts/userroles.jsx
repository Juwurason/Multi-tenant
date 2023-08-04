
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import Offcanvas from '../../../Entryfile/offcanvance';
import useHttp from '../../../hooks/useHttp';
import { toast } from 'react-toastify';
import EditUser from '../../../_components/modelbox/EditUser';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';



const UserRoles = () => {
    const { get, post } = useHttp()
    const [menu, setMenu] = useState(false)
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const id = JSON.parse(localStorage.getItem('user'));
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const roleName = useRef();
    const [loading1, setLoading1] = useState(false);


    const FetchRoles = async () => {

        try {
            setLoading(true);
            const { data } = await get(`/Account/get_roles?companyId=${id.companyId}`, { cacheTimeout: 300000 });
            console.log(data);
            setRoles(data.roles);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)

        } finally {
            setLoading(false)

        }
    };
    useEffect(() => {

        FetchRoles()
    }, []);



    const handleSubmit = async () => {

        if (roleName.current.value === ""
        ) {
            return toast.error("Enter a Role Name")
        }
        try {
            setLoading1(true)
            const { data } = await post(`/Account/create_role?userId=${id.userId}`,
                {
                    companyId: id.companyId,
                    role: roleName.current.value

                }
            )
            if (data.status === 'Success') {

                toast.success(data.message)
                FetchRoles();
                setShowModal(false);
                setLoading1(false);
            }
            setLoading1(false);

        } catch (error) {
            toast.error(error.response?.data?.message)

            setLoading1(false)

        } finally {
            setLoading1(false)
        }

    }



    const handleDelete = async (e) => {

        Swal.fire({
            html: `<h3>Are you sure? you want to delete this Role</h3>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#405189',
            cancelButtonColor: '#777',
            confirmButtonText: 'Confirm Delete',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await post(`/Account/delete_role?userId=${id.userId}&roleId=${e}`,
                    )
                    if (data.status === 'Success') {
                        toast.success(data.message);
                        FetchRoles();

                    } else {
                        toast.error(data.message);
                    }


                } catch (error) {
                    console.log(error);
                    toast.error(error.response.data.message)
                    toast.error(error.response.data.title)


                }


            }
        })
    }




    return (
        <>
            <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>
                <div className="page-wrapper">
                    <Helmet>
                        <title>Manage Roles</title>
                        <meta name="description" content="All user" />
                    </Helmet>
                    {/* Page Content */}
                    <div className="content container-fluid">
                        {/* Page Header */}
                        {id.role === "CompanyAdmin" ? <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h3 className="page-title">Manage Roles</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                        <li className="breadcrumb-item active">Manage Roles</li>
                                    </ul>
                                </div>
                                <div className="col-auto float-end ml-auto">

                                </div>
                            </div>
                        </div> : ""}

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">

                                    <div className="card-body">
                                        <div className='mt-4 bg-white'>
                                            <div className="d-flex justify-content-between align-items-center flex-wrap px-2 py-3">
                                                <h4 className='fw-bold'>
                                                    All Roles
                                                </h4>
                                                <button
                                                    onClick={() => setShowModal(true)}
                                                    className='btn add-btn btn-info text-white rounded-2'>Create New Role</button>
                                            </div>
                                            <div className="row px-2 py-3">

                                                {
                                                    roles.length > 0 ? roles.map((data, index) =>
                                                        <div className="col-md-3" key={index}>
                                                            <div className="card" style={{ height: "10rem" }}>

                                                                <div className="card-body">
                                                                    <span className='fs-6'>
                                                                        <span className="card-title fw-bold">Role Name: </span>

                                                                        <span>{data.role} </span>
                                                                    </span>
                                                                </div>
                                                                <div className="card-body ">
                                                                    <div className='d-flex gap-3'>
                                                                        <button
                                                                            onClick={(e) =>
                                                                                setEditModal(true)
                                                                            }
                                                                            className="btn btn-primary btn-sm" >Edit</button>

                                                                        <span >
                                                                            <button
                                                                                onClick={() =>

                                                                                    handleDelete(data.uRolesId)
                                                                                }
                                                                                href="#" className="btn btn-outline-danger btn-sm" >Delete</button>
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>

                                                    ) : <div className='w-100'>
                                                        <h4 className='text-center text-bold'>No Roles Found</h4>

                                                    </div>
                                                }

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /Page Content */}



                    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <label htmlFor="">Enter Role Name</label>
                                <br />
                                <input ref={roleName} type='text' className="form-control" placeholder=""
                                // onChange={e => setReason(e.target.value)}
                                />
                            </div>


                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                onClick={handleSubmit}
                                className="btn btn-info add-btn rounded text-white">
                                {loading1 ? <div className="spinner-grow text-light" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : "Submit"}
                            </button>
                        </Modal.Footer>
                    </Modal>



                    <Modal show={editModal} onHide={() => setEditModal(false)} size='lg'>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Role Name</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <label htmlFor="">Enter Role Name</label>
                                <br />
                                <input type='text' className="form-control" placeholder=""
                                // onChange={e => setReason(e.target.value)}
                                />
                                <br />

                                <div className='d-flex gap-2'>
                                    <button className="btn btn-info text-white">Update Role</button>
                                    <button onClick={() => setEditModal(false)} className="btn btn-danger">Cancel</button>

                                </div>
                                <hr />
                                <h5>User in this Role</h5>
                            </div>


                        </Modal.Body>
                        <Modal.Footer>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
            <EditUser />
            <Offcanvas />
        </>


    );
}

export default UserRoles;
