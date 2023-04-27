
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaBackspace } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCompanyContext } from '../../context';
import useHttp from '../../hooks/useHttp';
const AddShiftRoaster = () => {
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
        <div className="page-wrapper">
            <Helmet>
                <title>Add Shift Roaster</title>
                <meta name="description" content="" />
            </Helmet>
            <div className="content container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">

                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title mb-0">Add To Shift Roaster</h4>
                                <Link to={'/app/employee/shift-scheduling'} className="card-title mb-0 text-danger fs-3 "> <FaBackspace /></Link>
                            </div>
                            <div className="card-body">
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
                                                        <option defaultValue hidden>--Select a Client--</option>
                                                        {
                                                            clients.map((data, index) =>
                                                                <option value={data.staffId} key={index}>{data.fullName}</option>)
                                                        }
                                                    </select></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">Start Time</label>
                                                <div><input className="form-control datetimepicker" type="datetime-local" /></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">End Time</label>
                                                <div><input className="form-control datetimepicker" type="datetime-local" /></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label className="col-form-label fw-bold">Activities</label>

                                                <div className='d-flex gap-2 flex-wrap'>
                                                    <span className="form-group">
                                                        <input type="checkbox" />
                                                        &nbsp;
                                                        <label className="col-form-label">Medication Supervision</label>
                                                    </span>
                                                    <span className="form-group">
                                                        <input type="checkbox" />
                                                        &nbsp;
                                                        <label className="col-form-label">Medication administering</label>
                                                    </span>
                                                    <span className="form-group">
                                                        <input type="checkbox" />
                                                        &nbsp;
                                                        <label className="col-form-label">Personal Support</label>
                                                    </span>
                                                    <span className="form-group">
                                                        <input type="checkbox" />
                                                        &nbsp;
                                                        <label className="col-form-label">Domestic Cleaning</label>
                                                    </span>
                                                    <span className="form-group">
                                                        <input type="checkbox" />
                                                        &nbsp;
                                                        <label className="col-form-label">Transport</label>
                                                    </span>
                                                    <span className="form-group">
                                                        <input type="checkbox" />
                                                        &nbsp;
                                                        <label className="col-form-label">Dog training</label>
                                                    </span>
                                                    <span className="form-group">
                                                        <input type="checkbox" />
                                                        &nbsp;
                                                        <label className="col-form-label">Install phone</label>
                                                    </span>
                                                    <span className="form-group">
                                                        <input type="checkbox" />
                                                        &nbsp;
                                                        <label className="col-form-label">Welfare check</label>
                                                    </span>
                                                    <span className="form-group">
                                                        <input type="checkbox" />
                                                        &nbsp;
                                                        <label className="col-form-label">Support Groceries shopping</label>
                                                    </span>
                                                    <span className="form-group">
                                                        <input type="checkbox" />
                                                        &nbsp;
                                                        <label className="col-form-label">Pick up</label>
                                                    </span>
                                                    <span className="form-group">
                                                        <input type="checkbox" />
                                                        &nbsp;
                                                        <label className="col-form-label">Baby sitting</label>
                                                    </span>
                                                    <span className="form-group">
                                                        <input type="checkbox" />
                                                        &nbsp;
                                                        <label className="col-form-label">Taking to solicitors appointment</label>
                                                    </span>
                                                    <span className="form-group">
                                                        <input type="checkbox" />
                                                        &nbsp;
                                                        <label className="col-form-label">Meal Preparation</label>
                                                    </span>
                                                    <span className="form-group">
                                                        <input type="checkbox" />
                                                        &nbsp;
                                                        <label className="col-form-label">Shopping</label>
                                                    </span>
                                                    <span className="form-group">
                                                        <input type="checkbox" />
                                                        &nbsp;
                                                        <label className="col-form-label">Groceries Transport </label>
                                                    </span>
                                                    <span className="form-group">
                                                        <input type="checkbox" />
                                                        &nbsp;
                                                        <label className="col-form-label">Domestics Social Support </label>
                                                    </span>
                                                </div>

                                            </div>
                                        </div>

                                        <hr />
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
                                        <hr />


                                    </div>

                                    <div className="submit-section">
                                        <button className="btn btn-primary submit-btn">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddShiftRoaster;