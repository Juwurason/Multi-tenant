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
import { useCompanyContext } from '../../../context';
import Swal from 'sweetalert2';
import { FaEllipsisV } from 'react-icons/fa';
const AllEmployees = () => {
  const privateHttp = useHttp();
  const id = JSON.parse(localStorage.getItem('user'));
  const [staff, setStaff] = useState([]);
  const { loading, setLoading } = useCompanyContext();
  const FetchStaff = async () => {
    try {
      setLoading(true);
      const staffResponse = await privateHttp.get(`Staffs?companyId=${id.companyId}`, { cacheTimeout: 300000 });
      const staff = staffResponse.data;
      setStaff(staff);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    FetchStaff()
  }, []);

  const [menu, setMenu] = useState(false);

  const handleDelete = async (e) => {
    setLoading(true)
    Swal.fire({
      html: `<h3>Are you sure? you want to delete this staff</h3></br><p>You won't be able to revert this!</p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'rgb(29 78 216)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm Delete',
      showLoaderOnConfirm: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
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
    })


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
            <title>Staff</title>
            <meta name="description" content="Login page" />
          </Helmet>
          {/* Page Content */}
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col">
                  <h3 className="page-title">Staff</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Staff</li>
                  </ul>
                </div>
                <div className="col-auto float-end ml-auto">
                  <Link to={'/app/employee/addstaff'} className="btn add-btn"><i className="fa fa-plus" /> Add New Staff</Link>
                  {/* <a href="javascript:void(0)" className="btn add-btn" data-bs-toggle="modal" data-bs-target="#add_employee"><i className="fa fa-plus" /> Add New Staff</a> */}
                  <div className="view-icons">
                    <Link to="/app/employee/allemployees" className="grid-view btn btn-link active"><i className="fa fa-th" /></Link>
                    <Link to="/app/employee/employees-list" className="list-view btn btn-link"><i className="fa fa-bars" /></Link>
                  </div>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Search Filter */}
            <div className="row filter-row">
              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <label className="focus-label">Staff ID</label>
                  <input type="text" className="form-control floating" />
                </div>
              </div>
              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <label className="focus-label">Staff Name</label>
                  <input type="text" className="form-control floating" />
                </div>
              </div>
              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <label className="focus-label">Staff Email</label>
                  <input type="text" className="form-control " />
                </div>
              </div>

              <div className="col-sm-6 col-md-3">
                <a href="javascript:void(0)" className="btn btn-primary btn-block w-100"> Search </a>
              </div>
            </div>
            {/* Search Filter */}
            <div className="row staff-grid-row">
              {
                loading && <div className='text-center fs-1'>
                  <div className="spinner-grow text-secondary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }

              {
                staff.map((data, index) =>
                  <div className="col-md-4 col-sm-6 col-12 col-lg-4 col-xl-3" key={index}>
                    <div className="profile-widget">
                      <div className="profile-img">
                        <Link to={`/app/profile/employee-profile/${data.staffId}/${data.firstName}`} className="avatar"><img src={Avatar_02} alt="" /></Link>
                      </div>
                      <div className="dropdown profile-action">
                        <a href="javascript:void(0)" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><FaEllipsisV /></a>
                        <div className="dropdown-menu dropdown-menu-right">
                          <Link to={`/app/profile/edit-profile/${data.staffId}`} className="dropdown-item">
                            <i className="fa fa-pencil m-r-5" /> Edit</Link>
                          <a className="dropdown-item" href="javascript:void(0)" onClick={() => handleDelete(data.staffId)}><i className="fa fa-trash-o m-r-5" /> Delete</a>




                        </div>
                      </div>
                      <h4 className="user-name m-t-10 mb-0 text-ellipsis"><Link to={`/app/profile/employee-profile/${data.staffId}/${data.firstName}`}>{data.firstName} {data.surName}</Link></h4>
                      {/* <div className="small text-muted">Web Designer</div> */}
                    </div>




                  </div>
                )
              }

              {
                !loading && staff.length <= 0 && <div className='text-center text-danger fs-6'>
                  <p>No data found</p>
                </div>
              }







            </div>
          </div>
          {/* /Page Content */}
          {/* Add Employee Modal */}
          {/* <Addemployee /> */}
          {/* /Add Employee Modal */}
          {/* Edit Employee Modal */}
          {/* <Editemployee /> */}
          {/* /Edit Employee Modal */}
          {/* Delete Employee Modal */}

          {/* /Delete Employee Modal */}
        </div>
      </div>
      <Offcanvas />
    </>

  );
}

export default AllEmployees;
