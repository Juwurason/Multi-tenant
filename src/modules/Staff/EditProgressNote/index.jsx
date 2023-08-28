
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
  const staffProfile = JSON.parse(localStorage.getItem('staffProfile'));
  const { uid, pro } = useParams()

  const [details, setDetails] = useState('')
  const [staff, setStaff] = useState('')
  const [kilometer, setKilometer] = useState('')
  const [endKm, setEndKm] = useState(0)
  const [editpro, setEditPro] = useState({})
  const [companyId, setCompanyId] = useState('')
  const { get, post } = useHttp();
  const { loading, setLoading } = useCompanyContext();
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const navigate = useHistory()
  const [clientNames, setClientName] = useState('')


  const FetchSchedule = async () => {
    setLoading(true)
    try {
      const staffResponse = await get(`/ShiftRosters/${uid}`, { cacheTimeout: 300000 });
      const staff = staffResponse.data;
      setStaff(staff.staff.fullName);
      setCompanyId(staff.companyID)
      setDetails(staff.profile);
      setClientName(staff.clients)
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
    }
    finally {
      setLoading(false)
    }

    try {
      const {data} = await get(`/ProgressNotes/${pro}`, { cacheTimeout: 300000 });
      // console.log(data);
      setEditPro(data);
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

  const SaveProgress = async (e) => {
    e.preventDefault()
    setLoading1(true)
    const info = {
      progressNoteId: pro,
      report: editpro.report,
      progress: editpro.progress,
      position: editpro.position,
      followUp: editpro.followUp,
      date: formattedDate,
      staff: staff,
      staffId: staffProfile.staffId,
      startKm: editpro.startKm,
      endKm: editpro.endKm,
      profileId: details.profileId,
      companyID: companyId,
      IsCompleted: editpro.isCompleted
    }
    try {
      const {data} = await post(`/ProgressNotes/save_progressnote/?userId=${user.userId}&noteid=${pro}&shiftId=${uid}`, info);     
      // console.log(data);
      toast.success(data.message);
      setLoading1(false);
    } catch (error) {
      toast.error("Error saving progress note");
      toast.error(error.response.data.message);
      toast.error(error.response.data.title);
      setLoading1(false);
    }
    finally {
      setLoading1(false);
    }
  }


  const CreateProgress = async (e) => {
    e.preventDefault();
    if (endKm === 0 ) {
      toast.error("Input end Kilometer");
      return; // Exit the function early if endKm is not provided
    }
  
    // Function to handle the SweetAlert confirmation
    const proceedWithConfirmation = async () => {
      try {
        const info = {
          progressNoteId: Number(pro),
          report: editpro.report,
          progress: editpro.progress,
          position: editpro.position,
          followUp: editpro.followUp,
          staff: staff,
          staffId: staffProfile.staffId,
          startKm: editpro.startKm,
          endKm: endKm,
          profileId: details.profileId,
          companyID: companyId,
          date: ""
        };
  
        const { data } = await post(`/ProgressNotes/edit/${pro}?userId=${user.userId}&shiftId=${uid}`, info);
        if (data.status === "Success") {
          Swal.fire(
            '', 
            `${data.message}`,
            'success'
          );
          setLoading2(false);
          navigate.push(`/staff/staff/report/${uid}`);
        }
      } catch (error) {
        toast.error("Error Clock Out");
        toast.error(error.response.data.message);
        toast.error(error.response.data.title);
        setLoading2(false);
      }
    };
  
    // Show the SweetAlert confirmation
    Swal.fire({
      html: `<h3>Submitting your progress note will automatically clock you out</h3> <br/> 
        <h5>Do you wish to proceed ?<h5/>
        `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#405189',
      cancelButtonColor: '#777',
      confirmButtonText: 'Proceed',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading2(false);
        proceedWithConfirmation(); // Call the function to proceed with the confirmation
      }
    });
  };
  

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
                  <li className="breadcrumb-item"><Link to="/staff/staff/dashboard">Dashboard</Link></li>
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
                    <p>Kindly Note: You are to click on <b>SUBMIT</b> if you are through filling your progress note and will like to clock out.</p>
                    <div className="row">
                    <div className='col-md-5'>
                          <div className="form-group">
                            <label htmlFor="">Provide your Starting KiloMetre if any</label>
                            <input type="number" placeholder="0" className="form-control" name="startKm" value={editpro.startKm || ''} onChange={handleInputChange} />
                          </div>
                     </div>
                    <div className='col-md-5'>
                          <div className="form-group">
                            <label htmlFor="">Provide your Ending KiloMetre if any</label>
                            <input type="number" placeholder="0" value={endKm} className="form-control" onChange={e => setEndKm(e.target.value)} />
                          </div>
                     </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">Client</label>
                          <input type="text" placeholder="Client" className="form-control" value={clientNames} readOnly />
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
                          disabled={loading2 ? true : false}
                          className="btn btn-outline-primary add-btn rounded-2 m-r-5 ml-4" onClick={CreateProgress}>{loading2 ? <div className="spinner-grow text-light" role="status">
                            <span className="sr-only">Loading...</span>
                          </div> : "Submit"}</button>
                        <div>
                          <button
                            disabled={loading1 ? true : false}
                            className="btn btn-info add-btn text-white rounded-2 m-r-5" onClick={SaveProgress}>{loading1 ? <div className="spinner-grow text-light" role="status">
                              <span className="sr-only">Loading...</span>
                            </div> : "Save"}</button>
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
