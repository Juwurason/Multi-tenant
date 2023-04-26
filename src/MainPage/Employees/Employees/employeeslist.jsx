
import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import '../../../assets/css/table2.css'
import Editemployee from "../../../_components/modelbox/Editemployee"
import Addemployee from "../../../_components/modelbox/Addemployee"
import Header from '../../../initialpage/Sidebar/header'
import Sidebar from '../../../initialpage/Sidebar/sidebar';
import Offcanvas from '../../../Entryfile/offcanvance';
import useHttp from '../../../hooks/useHttp';
import { toast } from 'react-toastify';
import { FaArrowCircleLeft, FaArrowCircleRight, FaEdit, FaFileCsv, FaFileExcel, FaFileExport, FaFilePdf, FaSearch, FaTrash } from 'react-icons/fa';
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
  const [searchQuery, setSearchQuery] = useState("");



  const filteredData = staff.filter((data) =>
    data?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data?.email.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const itemsPerPage = 10;
  const pageCount = Math.ceil(staff.length / itemsPerPage);
  const displayData = filteredData.slice(
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
              {/* <div className="table-responsive">
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
                    <tbody> */}
              <main className="table bg-white">
                <section className="table__header">
                  {/* <h1>Customer's Orders</h1> */}
                  <div className="input-group">
                    <input type="search" className='form-control' placeholder="Search Staffs..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className='text-dark' />
                  </div>
                  <div className="export__file">
                    <label htmlFor="export-file" className="export__file-btn d-flex justify-content-center align-items-center" title="Export File" >
                      <FaFileExport className='text-white fs-3' /></label>
                    <input type="checkbox" id="export-file" />
                    <div className="export__file-options ">
                      <label>Export As &nbsp; ➜</label>
                      <label htmlFor="export-file" id="toPDF">PDF <FaFilePdf className='text-danger' /></label>
                      <label htmlFor="export-file" id="toCSV">CSV <FaFileCsv className='text-info' /></label>
                      <label htmlFor="export-file" id="toEXCEL">EXCEL <FaFileExcel className='text-warning' /></label>
                    </div>
                  </div>
                </section>
                <section className="table__body">
                  <table>
                    <thead className='text-white' style={{ backgroundColor: "#18225C" }}>
                      <tr style={{ backgroundColor: "#18225C" }}>

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
                              <span className='d-flex gap-3 align-items-center'>
                                <Link to={`/app/profile/edit-profile/${data.staffId}`} className="settings" title="Settings" data-toggle="tooltip">
                                  <FaEdit className='text-info' />
                                </Link>
                                <a onClick={() => handleDelete(data.staffId)} className="delete" title="Delete" data-toggle="tooltip"><FaTrash className='text-danger' /></a>
                              </span>
                            </td>
                          </tr>
                        )
                      }

                      {displayData.length <= 0 && <tr>

                        <td></td>
                        <td></td>
                        <td></td>
                        <td className='text-danger fs-6'>No data to display</td>
                        <td></td>
                        <td></td>
                        <td></td>


                      </tr>}


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
                </section>
              </main>
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
