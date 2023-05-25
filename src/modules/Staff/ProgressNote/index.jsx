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

const ProgressNote = () => {
  const lat = JSON.parse(localStorage.getItem('latit'))
  const log = JSON.parse(localStorage.getItem('log'))
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
  const { loading, setLoading } = useCompanyContext();
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
      console.log(error);
    }
    finally {
      setLoading(false)
    }

    try {
      const { data } = await get(`/Attendances/clock_in?userId=${user.userId}&shiftId=${uid}&lat=${lat}&lng=${log}`, { cacheTimeout: 300000 });
      if (data.status === "Success") {
        Swal.fire(
          'You have successfully clocked in',
          "",
          'success'
        )
      }
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



  const SaveProgress = async (e) => {
    e.preventDefault()
    setLoading1(true)
    const info = {
      report: report,
      progress: progress,
      position: "",
      followUp: follow,
      staff: staff,
      startKm: kilometer,
      profileId: details.profileId,
      companyID: companyId
    }
    try {

      const { data } = await post(`/ProgressNotes/save_progressnote/?userId=${user.userId}&noteid=${''}`, info);
      if (data.status === 'Success') {
        navigate.push(`/staff/staff-edit-progress/${uid}/${data.progressNote.progressNoteId}`)
        toast.success(data.message)
      }
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
      report: report,
      progress: progress,
      position: "",
      followUp: follow,
      staff: staff,
      date: "",
      startKm: kilometer,
      profileId: details.profileId,
      companyID: companyId
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

        try {
          const { data } = await post(`/ProgressNotes/create_progressnote?userId=${user.userId}`, info);
          if (data.status === "Success") {
            Swal.fire(
              '',
              `${data.message}`,
              'success'
            )

            navigate.push(`/staff/staff-report/${uid}`)
          }
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message);

        }


      }
    })


  }

  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title>Progress Note</title>
          <meta name="description" content="Progress Note" />
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
                  <li className="breadcrumb-item active">Progress Note</li>
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
                            <button
                              className="btn add-btn text-white rounded-2 m-r-5 btn-primary ml-4" onClick={CreateProgress}>
                              Submit
                            </button>
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


export default ProgressNote;
