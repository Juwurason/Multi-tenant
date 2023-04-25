
import React, { useEffect, useState } from 'react';
import { useCompanyContext } from '../../context';
import useHttp from '../../hooks/useHttp';

const Addschedule = () => {
  const id = JSON.parse(localStorage.getItem('user'));
  const privateHttp = useHttp();
  const { loading, setLoading } = useCompanyContext()
  const [staff, setStaff] = useState([]);
  const [clients, setClients] = useState([]);
  const FetchSchedule = async () => {

    try {
      const staffResponse = await privateHttp.get(`Staffs?companyId=${id.companyId}`, { cacheTimeout: 300000 });
      const staff = staffResponse.data;
      setStaff(staff);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }

    try {
      const clientResponse = await privateHttp.get(`/Profiles?companyId=${id.companyId}`, { cacheTimeout: 300000 });
      const client = clientResponse.data;
      setClients(client);
      setLoading(false)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }

  };
  useEffect(() => {
    FetchSchedule()
  }, []);
  return (
    <>
      {/* Add Schedule Modal */}
      <div id="add_schedule" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Schedule</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Staff Name</label>
                      <div>
                        <select className="form-select">
                          <option defaultValue hidden>--Select a staff--</option>
                          {
                            staff.map((data, index) =>
                              <option value={data.staffId} key={index}>{data.fullName}</option>)
                          }
                        </select></div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Client Name</label>
                      <div>
                        <select className="form-select">
                          <option defaultValue hidde>--Select a Client--</option>
                          {
                            clients.map((data, index) =>
                              <option value={data.staffId} key={index}>{data.fullName}</option>)
                          }
                        </select></div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Date From</label>
                      <div><input className="form-control datetimepicker" type="datetime-local" /></div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Date To</label>
                      <div><input className="form-control datetimepicker" type="datetime-local" /></div>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="form-group">
                      <label className="col-form-label">Activities</label>
                      <div><input className="form-control" type="text" /></div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <input type="checkbox" />
                      &nbsp; &nbsp;
                      <label className="col-form-label">Is Exceptional Shift</label>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <input type="checkbox" />
                      &nbsp; &nbsp;
                      <label className="col-form-label">Is Night Shift</label>
                    </div>
                  </div>



                </div>

                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Schedule Modal */}
    </>
  )
}

export default Addschedule