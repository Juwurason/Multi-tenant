
import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import Editclient from "../../_components/modelbox/Editclient"
import { useCompanyContext } from '../../context';
import AddClient from '../../_components/modelbox/Addclient';
import '../../assets/css/table2.css'
import ReactPaginate from 'react-paginate';
import { FaArrowCircleLeft, FaArrowCircleRight, FaEdit, FaFileExport, FaSearch, FaTrash } from 'react-icons/fa';
import useHttp from '../../hooks/useHttp';
import moment from 'moment';

const Clients = () => {
  const { loading, setLoading } = useCompanyContext()
  const id = JSON.parse(localStorage.getItem('user'));
  const [clients, setClients] = useState([]);
  const privateHttp = useHttp();
  const [pageNumber, setPageNumber] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = clients.filter((item) =>
    item.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );



  const itemsPerPage = 10;
  const pageCount = Math.ceil(clients.length / itemsPerPage);
  const displayData = filteredData.slice(
    pageNumber * itemsPerPage,
    (pageNumber + 1) * itemsPerPage

  );

  const FetchClient = async () => {
    try {
      setLoading(true)
      const clientResponse = await privateHttp.get(`/Profiles?companyId=${id.companyId}`, { cacheTimeout: 300000 });
      const client = clientResponse.data;
      setClients(client);

      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {
    FetchClient()
  }, []);

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%'
      });
    }
  });



  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Clients List</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Clients</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                <li className="breadcrumb-item active">Clients</li>
              </ul>
            </div>
            <div className="col-auto float-end ml-auto">
              <a href="#" className="btn add-btn" data-bs-toggle="modal" data-bs-target="#add_client"><i className="fa fa-plus" /> Add Client</a>
              <div className="view-icons">
                <Link to="/app/employees/clients" className="grid-view btn btn-link"><i className="fa fa-th" /></Link>
                <Link to="/app/employees/clients-list" className="list-view btn btn-link active"><i className="fa fa-bars" /></Link>
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
              <label className="focus-label">Client ID</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus">
              <input type="text" className="form-control floating" />
              <label className="focus-label">Client Name</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus">
              <input type="text" className="form-control floating" />
              <label className="focus-label">Client Email</label>
            </div>
          </div>

          <div className="col-sm-6 col-md-3">
            <a href="#" className="btn btn-primary btn-block w-100"> Search </a>
          </div>
        </div>

        {/* Search Filter */}


        <main className="table">
          <section className="table__header">
            {/* <h1>Customer's Orders</h1> */}
            <div className="input-group">
              <input type="search" className='form-control' placeholder="Search Data..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} />
              <FaSearch className='text-dark' />
            </div>
            <div className="export__file">
              <label htmlFor="export-file" className="export__file-btn d-flex justify-content-center align-items-center" title="Export File" >
                <FaFileExport className='text-white fs-3' /></label>
              <input type="checkbox" id="export-file" />
              <div className="export__file-options ">
                <label>Export As &nbsp; ➜</label>
                <label htmlFor="export-file" id="toPDF">PDF <img src="images/pdf.png" alt /></label>
                <label htmlFor="export-file" id="toJSON">JSON <img src="images/json.png" alt /></label>
                <label htmlFor="export-file" id="toCSV">CSV <img src="images/csv.png" alt /></label>
                <label htmlFor="export-file" id="toEXCEL">EXCEL <img src="images/excel.png" alt /></label>
              </div>
            </div>
          </section>
          <section className="table__body">
            <table>
              <thead className='text-white' style={{ backgroundColor: "#18225C" }}>
                <tr style={{ backgroundColor: "#18225C" }}>

                  <th>#</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Gender</th>
                  <th>State</th>
                  <th>City</th>
                  <th>Date of Birth</th>
                  <th>Date Created</th>
                  <th>Date Modified</th>

                  <th>Actions</th>

                </tr>
              </thead>
              <tbody>
                {
                  displayData.map((data, index) =>
                    <tr key={index}>

                      <td>{index + 1}</td>
                      <td className='fw-bold'>{data.fullName}</td>
                      <td><a href="#"> {data.address}</a></td>
                      <td><a href="#"> {data.email}</a></td>
                      <td>{data.phoneNumber}</td>
                      <td>{data.gender}</td>
                      <td>{!data.state ? "Not Updated" : data.state}</td>
                      <td>{data.state}</td>

                      <td>{!data.dateOfBirth ? "Not Updated" : moment(data.dateOfBirth).format('ll')}</td>
                      <td>{moment(data.dateCreated).format('lll')}</td>
                      <td>{moment(data.dateModified).format('lll')}</td>
                      <td>
                        <span className='d-flex gap-2 align-items-center'>
                          <Link to={`/app/profile/edit-profile/${data.profileId}`} className="settings" title="Settings" data-toggle="tooltip">
                            <FaEdit className='text-info' />
                          </Link>
                          <a href="#" className="delete" title="Delete" data-toggle="tooltip"><FaTrash className='text-danger' /></a>
                        </span>
                      </td>


                    </tr>
                  )
                }
                {!loading && displayData.length <= 0 && <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className='text-danger fs-6'>No data to display</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>}



              </tbody>
            </table>
            <div className="clearfix">
              <div className="hint-text">Showing <b>{1}</b> out of <b>{displayData.length}</b> entries</div>

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
      {/* /Page Content */}
      {/* Add Client Modal */}

      {/* /Add Client Modal */}
      <AddClient />
      {/* Edit Client Modal */}
      <Editclient />
      {/* /Edit Client Modal */}
      {/* Delete Client Modal */}
      <div className="modal custom-modal fade" id="delete_client" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Client</h3>
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
      {/* /Delete Client Modal */}
    </div>
  );
}

export default Clients;
