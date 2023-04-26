import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import {
    Avatar_02
} from "../../../Entryfile/imagepath"
import Addemployee from "../../../_components/modelbox/Addemployee"
import Editemployee from "../../../_components/modelbox/Editemployee"
import Sidebar from '../../../initialpage/Sidebar/sidebar';;
import Header from '../../../initialpage/Sidebar/header'
import Offcanvas from '../../../Entryfile/offcanvance';
import { toast } from 'react-toastify';
import useHttp from '../../../hooks/useHttp';
import AddAdmin from '../../../_components/modelbox/AddAdmin';
import { useCompanyContext } from '../../../context';

const AllAdmin = () => {
    const privateHttp = useHttp();
    const { loading, setLoading } = useCompanyContext();
    const id = JSON.parse(localStorage.getItem('user'));
    const [admin, setAdmin] = useState([]);
    const FetchStaff = async () => {
        try {
            setLoading(true)
            const { data } = await privateHttp.get(`Administrators?companyId=${id.companyId}`, { cacheTimeout: 300000 });
            console.log(data);

            setAdmin(data);
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {

        FetchStaff()
    }, []);

    const [menu, setMenu] = useState(false);

    const handleDelete = async (e) => {
        try {
            setLoading(true)
            const { data } = await privateHttp.post(`/Staffs/delete/${e}?userId=${id.userId}`,
                { userId: id.userId }
            )
            if (data.status === 'Success') {
                toast.success(data.message);
                FetchStaff()
            } else {
                toast.error(data.message);
            }

            setLoading(false)

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
            setLoading(false);

        }
        finally {
            setLoading(false)
        }
    }


    const toggleMobileMenu = () => {
        setMenu(!menu)
    }

    useEffect(() => {
        if ($('.select').length > 0) {
            $('.select').select2({
                minimumResultsForSearch: -1,
                width: '100%'
            });
        }
    });


    return (
        <>
            <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>

                <Header onMenuClick={(value) => toggleMobileMenu()} />
                <Sidebar />
                <div className="page-wrapper">
                    <Helmet>
                        <title>Admin</title>
                        <meta name="description" content="Login page" />
                    </Helmet>
                    {/* Page Content */}
                    <div className="content container-fluid">
                        {/* Page Header */}
                        <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h3 className="page-title">Admin</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                        <li className="breadcrumb-item active">Admin</li>
                                    </ul>
                                </div>
                                <div className="col-auto float-end ml-auto">
                                    <Link to={'/app/employee/addadmin'} className="btn add-btn"><i className="fa fa-plus" />
                                        Create New Admin</Link>
                                    <div className="view-icons">
                                        <Link to="/app/employee/AllAdmin" className="grid-view btn btn-link active"><i className="fa fa-th" /></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* /Page Header */}
                        {/* Search Filter */}
                        <div className="row filter-row">
                            <div className="col-sm-6 col-md-3">
                                <div className="form-group form-focus">
                                    <label className="focus-label">Admin ID</label>
                                    <input type="text" className="form-control floating" />
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-3">
                                <div className="form-group form-focus">
                                    <label className="focus-label">Admin Name</label>
                                    <input type="text" className="form-control floating" />
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-3">
                                <div className="form-group form-focus">
                                    <label className="focus-label">Admin Email</label>
                                    <input type="text" className="form-control " />
                                </div>
                            </div>

                            <div className="col-sm-6 col-md-3">
                                <a href="#" className="btn btn-primary btn-block w-100"> Search </a>
                            </div>
                        </div>
                        {/* Search Filter */}
                        <div className="row staff-grid-row">


                            <div className="col-md-4 col-sm-6 col-12 col-lg-4 col-xl-3" >

                                {
                                    loading && <div className='text-center fs-1'>
                                        <div className="spinner-grow text-secondary" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                }
                                {
                                    admin.map((data, index) =>

                                        <div className="profile-widget">
                                            <div className="profile-img">
                                                <Link to={``} className="avatar"><img src={Avatar_02} alt="" /></Link>
                                            </div>
                                            <div className="dropdown profile-action">
                                                <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></a>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    <Link to={``} className="dropdown-item">
                                                        <i className="fa fa-pencil m-r-5" /> Edit</Link>
                                                    <a className="dropdown-item" href="#" ><i className="fa fa-trash-o m-r-5" /> Delete</a>




                                                </div>
                                            </div>
                                            <h4 className="user-name m-t-10 mb-0 text-ellipsis"><Link to={``}>Admin Personnel</Link></h4>


                                        </div>
                                    )
                                }

                                {
                                    !loading && admin.length <= 0 && <div className='text-center text-danger fs-6'>
                                        <p>No data found</p>
                                    </div>
                                }


                            </div>










                        </div>
                    </div>
                    {/* /Page Content */}
                    {/* Add Employee Modal */}
                    <AddAdmin />
                    {/* /Add Employee Modal */}
                    {/* Edit Employee Modal */}
                    <Editemployee />
                    {/* /Edit Employee Modal */}
                    {/* Delete Employee Modal */}

                    {/* /Delete Employee Modal */}
                </div>
            </div>
            <div className="modal custom-modal fade" id="delete_employee" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="form-header">
                                <h3>Delete Staff</h3>
                                <p>Are you sure want to delete?</p>
                            </div>
                            <div className="modal-btn delete-action">
                                <div className="row">
                                    <div className="col-6">
                                        <a className="btn btn-primary continue-btn" >Delete</a>
                                    </div>
                                    <div className="col-6">
                                        <a href="" data-bs-dismiss="modal" className="btn btn-primary cancel-btn">Cancel</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Offcanvas />
        </>

    );
}

export default AllAdmin;
