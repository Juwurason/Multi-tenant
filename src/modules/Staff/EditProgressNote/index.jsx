
import React, { Component, useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../../index.css";
import Offcanvas from '../../../Entryfile/offcanvance';
import { useCompanyContext } from '../../../context';
import useHttp from '../../../hooks/useHttp';
import Swal from 'sweetalert2';

const EditProgressNote = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { uid, pro } = useParams()

  const [details, setDetails] = useState('')
  const [staff, setStaff] = useState('')
  const [kilometer, setKilometer] = useState('')
  const [editpro, setEditPro] = useState({})
  const [companyId, setCompanyId] = useState('')
  const { get, post } = useHttp();
  const { loading, setLoading } = useCompanyContext();
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const navigate = useHistory()


  const FetchSchedule = async () => {
    setLoading(true)
    try {
      const staffResponse = await get(`/ShiftRosters/${uid}`, { cacheTimeout: 300000 });
      const staff = staffResponse.data;
      // console.log(staff);
      setCompanyId(staff.companyID)
      setStaff(staff.staff.fullName);
      setDetails(staff.profile);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }

    try {
      const editProgress = await get(`/ProgressNotes/${pro}`, { cacheTimeout: 300000 });
      const editpro = editProgress;
      setEditPro(editpro.data);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }

  };
  useEffect(() => {
    FetchSchedule()
  }, []);

  function handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    const newValue = value === "" ? "" : value;
    setEditPro({
      ...editpro,
      [name]: newValue
    });
  }
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const today = new Date();
  const formattedDate = formatDate(today);


  // Pass `formattedDate` to your endpoint or perform any other actions here

  const SaveProgress = async (e) => {
    e.preventDefault()
    setLoading1(true)
    const info = {
      progressNoteId: pro,
      report: editpro.report,
      progress: editpro.progress,
      position: "0",
      followUp: editpro.followUp,
      date: formattedDate,
      staff: staff,
      startKm: editpro.startKm,
      profileId: details.profileId,
      companyID: companyId,
    }
    try {
      const saveProgress = await post(`/ProgressNotes/save_progressnote/?userId=${user.userId}&noteid=${pro}`, info);
      const savePro = saveProgress.data;
      toast.success(savePro.message)
      setLoading1(false)
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading1(false)
    }
  }

  const CreateProgress = async (e) => {
    e.preventDefault()
    const info = {
      progressNoteId: Number(pro),
      report: editpro.report,
      progress: editpro.progress,
      position: "",
      followUp: editpro.follow,
      staff: staff,
      startKm: editpro.startKm,
      profileId: details.profileId,
      companyID: companyId,
      date: ""
    }
    Swal.fire({
      html: `<h3>Submitting your progress note will automatically clock you out</h3> <br/> 
      <h5>Do you wish to proceed ?<h5/>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1C75BC',
      cancelButtonColor: '#777',
      confirmButtonText: 'Proceed',
      showLoaderOnConfirm: true,
    }).then(async (result) => {

      if (result.isConfirmed) {
        setLoading2(false)
        try {
          const { data } = await post(`/ProgressNotes/edit/${pro}?userId=${user.userId}`, info);
          if (data.status === "Success") {
            Swal.fire(
              '',
              `${data.message}`,
              'success'
            )
            setLoading2(false)
            navigate.push(`/staff/staff-report/${uid}`)
          }
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message);
          setLoading2(false)
        }
        finally {
          setLoading2(false)
        }


      }
    })


  }

  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title>Edit Progress Note</title>
          <meta name="description" content="Edit Progress Note" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Progress Note</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/staff/staff/staffDashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Edit Progress Note</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className='col-md-4'>

                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">Client</label>
                          <input type="text" placeholder="Client" className="form-control" value={details.fullName} readOnly />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">Staff</label>
                          <input type="text" placeholder="Staff" className="form-control" value={staff} readOnly />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">Position</label>
                          <input type="text" placeholder="Position" className="form-control" readOnly />
                        </div>
                      </div>
                    </div>


                    <div className="form-group">

                      <label htmlFor="">Report <span className='text-success' style={{ fontSize: '10px' }}>Only Include factual informations observations</span></label>
                      <textarea rows={3} className="form-control summernote" placeholder="" name="report" value={editpro.report || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="">Progress towards goals</label>
                      <textarea rows={3} className="form-control summernote" placeholder="" name="progress" value={editpro.progress || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="">Follow up <span className='text-success' style={{ fontSize: '10px' }}>Note: If restrictive practices were used or a serious included occurred, It must be reported immediately to the Position Title </span></label>
                      <textarea rows={3} className="form-control summernote" placeholder="" name="followUp" value={editpro.followUp || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group text-center mb-0">
                      <div className="text-center d-flex gap-2">
                        <button
                          disabled={loading1 ? true : false}
                          className="btn btn-info add-btn text-white rounded-2 m-r-5" onClick={SaveProgress}>{loading1 ? <div className="spinner-grow text-light" role="status">
                            <span className="sr-only">Loading...</span>
                          </div> : "Save"}</button>

                        <div>
                          <button
                            disabled={loading2 ? true : false}
                            className="btn btn-primary add-btn text-white rounded-2 m-r-5 ml-4" onClick={CreateProgress}>{loading2 ? <div className="spinner-grow text-light" role="status">
                              <span className="sr-only">Loading...</span>
                            </div> : "Submit"}</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </div>
      <Offcanvas />
    </>

  );

}


export default EditProgressNote;
