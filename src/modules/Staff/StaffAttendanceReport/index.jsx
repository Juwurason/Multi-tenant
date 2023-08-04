
import React, { Component, useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../../index.css";
import Offcanvas from '../../../Entryfile/offcanvance';
import { useCompanyContext } from '../../../context';
import useHttp from '../../../hooks/useHttp';
import Swal from 'sweetalert2';
import moment from 'moment';

const AttendanceReport = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { uid, pro } = useParams()
  const [document, setDocument] = useState('')
  const [editpro, setEditPro] = useState({})
  const { get, post } = useHttp();
  const { loading, setLoading } = useCompanyContext();
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const navigate = useHistory()


  const FetchSchedule = async () => {
    setLoading(true)
    try {
      const { data } = await get(`/Attendances/${uid}`, { cacheTimeout: 300000 });
      // console.log(data);
      setEditPro(data)

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


  // Pass `formattedDate` to your endpoint or perform any other actions here

  const SaveProgress = async (e) => {
    e.preventDefault()
    setLoading1(true)
    const info = {
      attendanceId: uid,
      report: editpro.report,
      clockIn: editpro.clockIn,
      clockOut: editpro.clockOut,
      duration: editpro.duration,
      inLongitude: editpro.inLongitude,
      inLatitude: editpro.inLatitude,
      startKm: editpro.startKm,
      endKm: editpro.endKm,
      staffId: editpro.staffId,
      imageURL: editpro.imageURL,
      companyID: user.companyId
    }
    try {
      const { data } = await post(`/Attendances/edit/${uid}?userId=${user.userId}`, info);
     
     if (data.status === "Success") {
      toast.success(data.message);
      setLoading1(false);
      navigate.push("/staff/staff/attendance")
     }
      // console.log(error);
    }
    catch (error){

      // toast.error("Error Updating Attendance Report")
      toast.error(error.response.data.message);
      toast.error(error.response.data.title);
      setLoading1(false);
    }
    finally {
      setLoading1(false);
    }
  }

  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title>Add A Report</title>
          <meta name="description" content="Add A Report" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Add A Report</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/staff/staff/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item active"><Link to="/staff/staff/attendance">Attendance</Link></li>
                  <li className="breadcrumb-item active">Add A Report</li>
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
                          <label htmlFor="">ClockIn</label>
                          <input type="text" placeholder="ClockIn" className="form-control" value={moment(editpro.clockIn).format('lll')} readOnly />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">ClockOut</label>
                          <input type="text" placeholder="ClockOut" className="form-control" value={moment(editpro.clockOut).format('lll')} readOnly />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">Starting KiloMetre (Km)</label>
                          <input type="text" placeholder="" name="startKm" value={editpro.startKm || ''} onChange={handleInputChange} className="form-control" />
                        </div>
                      </div>
                    </div>


                    <div className="col-md-4">
                      <div className="form-group">
                        <label htmlFor="">Ending KiloMetre (Km) </label>
                        <input type="text" placeholder="" name="endKm" value={editpro.endKm || ''} onChange={handleInputChange} className="form-control" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="">Additional Report <span className='text-success' style={{ fontSize: '12px' }}>This could be reasons why you were late or information you which your admin to be aware of</span></label>
                      <textarea rows={3} className="form-control summernote" placeholder="" name="report" value={editpro.report || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <div className="col-md-4">
                        <label htmlFor="">ImageURL </label>
                        <input type="file" className="form-control" accept=".pdf, .doc, .txt, .jpg, .jpeg, .png" onChange={e => setDocument(e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group text-center mb-0">
                      <div className="text-center d-flex gap-2">

                        <button
                          disabled={loading1 ? true : false}
                          className="btn btn-info add-btn text-white rounded-2 m-r-5"
                          onClick={SaveProgress}
                        >{loading1 ? <div className="spinner-grow text-light" role="status">
                          <span className="sr-only">Loading...</span>
                        </div> : "Save"}</button>
                        <div>

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


export default AttendanceReport;
