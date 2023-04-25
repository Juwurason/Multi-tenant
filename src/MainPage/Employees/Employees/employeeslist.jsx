
import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import "../../antdstyle.css"
import '../../../assets/css/table.css'
import Editemployee from "../../../_components/modelbox/Editemployee"
import Addemployee from "../../../_components/modelbox/Addemployee"
import Header from '../../../initialpage/Sidebar/header'
import Sidebar from '../../../initialpage/Sidebar/sidebar';
import Offcanvas from '../../../Entryfile/offcanvance';
import useHttp from '../../../hooks/useHttp';
import { toast } from 'react-toastify';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';
import { useCompanyContext } from '../../../context';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';


const Employeeslist = () => {
  const privateHttp = useHttp()
  const [menu, setMenu] = useState(false)
  const [staff, setStaff] = useState([]);
  const { loading, setLoading } = useCompanyContext();
  const id = JSON.parse(localStorage.getItem('user'));
  const [pageNumber, setPageNumber] = useState(0);


  const itemsPerPage = 10;
  const pageCount = Math.ceil(staff.length / itemsPerPage);
  const displayData = staff.slice(
    pageNumber * itemsPerPage,
    (pageNumber + 1) * itemsPerPage

  );

  const FetchStaff = async () => {
    try {
      const staffResponse = await privateHttp.get(`Staffs?companyId=${id.companyId}`, { cacheTimeout: 300000 });
      const staff = staffResponse.data;
      setStaff(staff);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {

    FetchStaff()
  }, []);

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
            <title>Staff List</title>
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
                  <a href="#" className="btn add-btn" data-bs-toggle="modal" data-bs-target="#add_employee"><i className="fa fa-plus" /> Add Employee</a>
                  <div className="view-icons">
                    <Link to="/app/employee/allemployees" className="grid-view btn btn-link"><i className="fa fa-th" /></Link>
                    <Link to="/app/employee/employees-list" className="list-view btn btn-link active"><i className="fa fa-bars" /></Link>
                  </div>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Search Filter */}
            <div className="row filter-row">
              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <input type="text" className="form-control floating" />
                  <label className="focus-label">Staff ID</label>
                </div>
              </div>
              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <input type="text" className="form-control floating" />
                  <label className="focus-label">Staff Name</label>
                </div>
              </div>
              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <input type="text" className="form-control floating" />
                  <label className="focus-label">Staff Email</label>
                </div>
              </div>

              <div className="col-sm-6 col-md-3">
                <a href="#" className="btn btn-primary btn-block w-100"> Search </a>
              </div>
            </div>
            {/* /Search Filter */}


            <div className="">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title bg-primary">
                    <div className="row">
                      <div className="col-sm-5">

                      </div>
                      <div className="col-sm-7">
                        <a href="#" className="btn btn-secondary"><i className="material-icons"></i> <span>Download PDF</span></a>
                        <a href="#" className="btn btn-secondary"><i className="material-icons"></i> <span>Export to Excel</span></a>
                      </div>
                    </div>
                  </div>
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Staff ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Gender</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        displayData.map((data, index) =>

                          <tr key={data.staffId}>
                            <td>{index + 1}</td>
                            <td> {data.maxStaffId}</td>
                            <td><Link to={`/app/profile/employee-profile/${data.staffId}/${data.firstName}`}> {data.fullName}</Link></td>
                            <td>{data.email}</td>
                            <td>{data.phoneNumber}</td>
                            <td>{data.gender}</td>
                            <td>
                              <Link to={`/app/profile/edit-profile/${data.staffId}`} className="settings" title="Edit" data-toggle="tooltip">
                                <i className="material-icons">edit</i>
                              </Link>
                              <a onClick={() => handleDelete(data.staffId)} className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                            </td>
                          </tr>
                        )
                      }




                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text">Showing <b>1</b> out of <b>{staff.length}</b> entries</div>


                    <ReactPaginate
                      pageCount={pageCount}
                      onPageChange={page => setPageNumber(page.selected)}
                      activeClassName={'items actives'}
                      breakClassName={'items break-me '}
                      breakLabel={'...'}
                      containerClassName={'pagination'}
                      disabledClassName={'disabled-page'}
                      marginPagesDisplayed={2}
                      nextClassName={"items next "}
                      nextLabel={< FaArrowCircleRight style={{ fontSize: 18, width: 150 }} />}
                      pageClassName={'items pagination-page '}
                      pageRangeDisplayed={2}
                      previousClassName={"items previous"}
                      previousLabel={<FaArrowCircleLeft style={{ fontSize: 18, width: 150 }} />}
                    />
                  </div>


                </div>
              </div>
            </div>


          </div>
          {/* /Page Content */}
          {/* Add Employee Modal */}
          <Addemployee />
          {/* /Add Employee Modal */}
          {/* Edit Employee Modal */}
          <Editemployee />
          {/* /Edit Employee Modal */}
          {/* Delete Employee Modal */}
          <div className="modal custom-modal fade" id="delete_employee" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="form-header">
                    <h3>Delete Employee</h3>
                    <p>Are you sure want to delete?</p>
                  </div>
                  <div className="modal-btn delete-action">
                    <div className="row">
                      <div className="col-6">
                        <a href="" className="btn btn-primary continue-btn">Delete</a>
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
          {/* /Delete Employee Modal */}
        </div>
      </div>
      <Offcanvas />
    </>


  );
}

export default Employeeslist;
