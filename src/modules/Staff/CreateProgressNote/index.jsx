/**
 * Signin Firebase
 */

import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link, useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../../index.css";
import Offcanvas from '../../../Entryfile/offcanvance';
import { useCompanyContext } from '../../../context';
import useHttp from '../../../hooks/useHttp';
import Swal from 'sweetalert2';
const CreateProgressNote = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useHistory()
  const { uid, name } = useParams()

  const [details, setDetails] = useState('')
  const [staff, setStaff] = useState('')
  const [report, setReport] = useState('')
  const [progress, setProgress] = useState('')
  const [follow, setFollow] = useState('')
  const [kilometer, setKilometer] = useState(0)
  const [companyId, setCompanyId] = useState('')
  const { get, post } = useHttp();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);



  const FetchSchedule = async () => {
    setLoading(true)
    try {
      const staffResponse = await get(`/ShiftRosters/${uid}`, { cacheTimeout: 300000 });
      const staff = staffResponse.data;
      setCompanyId(staff.companyID)
      setStaff(staff.staff.fullName);
      setDetails(staff.profile);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
    }
    finally {
      setLoading(false)
    }

  };
  useEffect(() => {
    FetchSchedule()
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const today = new Date();
  const formattedDate = formatDate(today);

  const SaveProgress = async (e) => {
    e.preventDefault()
    setLoading1(true)
    const info = {
      report: report,
      progress: progress,
      position: "",
      followUp: follow,
      staff: staff,
      date: formattedDate,
      startKm: kilometer,
      profileId: details.profileId,
      companyID: companyId
    }
    try {
      const { data } = await post(`/ProgressNotes/create_progressnote?userId=${user.userId}`, info);
      if (data.status === 'Success') {
        localStorage.setItem("rosterId", uid);
        localStorage.setItem("progressNoteId", data.progressNote.progressNoteId);
        navigate.push(`/staff/main/edit-progress/${uid}/${data.progressNote.progressNoteId}`)
        toast.success(data.message)
      }
      setLoading1(false)
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
    }
    finally {
      setLoading1(false)
    }
  }


  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title>Create Progress Note</title>
          <meta name="description" content="Progress Note" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Create Progress Note</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/staff/main/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Create Progress Note</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className='d-flex justify-content-start p-2'>
                  <button className='btn btn-info text-white add-btn rounded-2' style={{ fontSize: "10px" }}>View Hand-over report by previous staff</button>
                </div>
                <div className="card-body">
                  {
                    loading ? <div className='d-flex justify-content-center w-100'>
                      <div className="spinner-grow text-secondary fs-1" role="status">
                        <span className="sr-only fs-1">Loading...</span>
                      </div>
                    </div>

                      :
                      <form>
                        <div className='col-md-4'>
                          <div className="form-group">
                            <label htmlFor="">Input Your Starting Kilometer</label>
                            <input type="text" placeholder="0" className="form-control" onChange={e => setKilometer(e.target.value)} />
                          </div>
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
                          <textarea rows={3} className="form-control summernote" placeholder="" onChange={e => setReport(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="">Progress towards goals</label>
                          <textarea rows={3} className="form-control summernote" placeholder="" onChange={e => setProgress(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="">Follow up <span className='text-success' style={{ fontSize: '10px' }}>Note: If restrictive practices were used or a serious included occurred, It must be reported immediately to the Position Title </span></label>
                          <textarea rows={3} className="form-control summernote" placeholder="" onChange={e => setFollow(e.target.value)} />
                        </div>
                        <div className="form-group text-center mb-0">
                          <div className="text-center d-flex gap-2">

                            <button className="btn btn-info add-btn text-white rounded-2 m-r-5"
                              disabled={loading1 ? true : false}
                              onClick={SaveProgress}>{loading1 ? <div className="spinner-grow text-light" role="status">
                                <span className="sr-only">Loading...</span>
                              </div> : "Save"}</button>


                          </div>
                        </div>
                      </form>
                  }
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


export default CreateProgressNote;;

