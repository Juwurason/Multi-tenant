
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
                                <Link to={'/employee/shift-scheduling'} className="card-title mb-0 text-danger fs-3 "> <FaBackspace /></Link>
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
            </div>
        </div>
    );
}

export default AddShiftRoaster;