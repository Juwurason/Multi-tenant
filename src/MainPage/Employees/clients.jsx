
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { FaEllipsisV } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useCompanyContext } from '../../context';
// import { useCompanyContext } from '../../context';
import { Avatar_19, } from "../../Entryfile/imagepath"
import useHttp from '../../hooks/useHttp';
import AddClient from '../../_components/modelbox/Addclient';
import Editclient from "../../_components/modelbox/Editclient"


const Clients = () => {
  const { loading, setLoading } = useCompanyContext()
  const id = JSON.parse(localStorage.getItem('user'));
  const [clients, setClients] = useState([]);
  const { get } = useHttp();
  const FetchClient = async () => {
    try {
      setLoading(true)
      const clientResponse = await get(`/Profiles?companyId=${id.companyId}`, { cacheTimeout: 300000 });
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
  const handleDelete = async (e) => {
    setLoading(true)
    Swal.fire({
      html: `<h3>Are you sure? you want to delete ${e.firstName} ${e.surName}</h3></br><p>This decision cannot be reverted!</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(29 78 216)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm Delete',
      showLoaderOnConfirm: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await privateHttp.post(`Profiles/delete/${e.profileId}?userId=${id.userId}`,
            { userId: id.userId }
          )
          if (data.status === 'Success') {
            toast.success(data.message);
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
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Clients</title>
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
              <Link to="/app/employees/addclients" className="btn add-btn"><i className="fa fa-plus" /> Add Client</Link>
              {/* <a href="javascript:void(0)" className="btn add-btn" data-bs-toggle="modal" data-bs-target="#add_client"><i className="fa fa-plus" /> Add Client</a> */}
              <div className="view-icons">
                <Link to="/app/employees/clients" className="grid-view btn btn-link active"><i className="fa fa-th" /></Link>
                <Link to="/app/employees/clients-list" className="list-view btn btn-link"><i className="fa fa-bars" /></Link>
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
            clients.map((data, index) =>
              <div className="col-md-4 col-sm-6 col-12 col-lg-4 col-xl-3" key={index}>
                <div className="profile-widget">
                  <div className="profile-img">
                    <Link to={`/app/profile/client-profile/${data.profileId}/${data.firstName}`} className="avatar"><img alt="" src={Avatar_19} /></Link>
                  </div>
                  <div className="dropdown profile-action">
                    <a href="javascript:void(0)" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><FaEllipsisV /></a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <Link className="dropdown-item" to={`/app/employees/edit-client/${data.profileId}`}><i className="fa fa-pencil m-r-5" /> Edit</Link>
                      <a className="dropdown-item" href="javascript:void(0)" onClick={() => handleDelete(data)}><i className="fa fa-trash-o m-r-5" /> Delete</a>
                    </div>
                  </div>
                  <h4 className="user-name m-t-10 mb-0 text-ellipsis"><Link to={`/app/profile/client-profile/${data.profileId}/${data.firstName}`}>{data.firstName} {data.surName}</Link></h4>
                  <h5 className="user-name m-t-10 mb-0 text-ellipsis"><Link to={`/app/profile/client-profile/${data.profileId}/${data.firstName}`}>{data.email}</Link></h5>
                  {/* <div className="small text-muted">CEO</div> */}
                  {/* <Link onClick={() => localStorage.setItem("minheight", "true")} to="/conversation/chat" className="btn btn-white btn-sm m-t-10 mr-1">Message</Link> */}
                  {/* <Link to={`/app/profile/client-profile/${data.profileId}/${data.firstName}`} className="btn btn-white btn-sm m-t-10">View Profile</Link> */}
                </div>
              </div>
            )
          }
          {
            !loading && clients.length <= 0 && <div className='text-center text-danger fs-6'>
              <p>No data founnd</p>
            </div>
          }


        </div>


      </div>


      {/* /Add Client Modal */}
      <AddClient />
      {/* Edit Client Modal */}
      <Editclient />
      {/* /Edit Client Modal */}
      {/* Delete Client Modal */}
      <div className="modal custom-modal fade" id="delete_client" role="dialog">
        <div className="modal-dialog modal-dialog-scrollable modal-lg">
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
