
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaBackspace } from 'react-icons/fa';
import { MultiSelect } from 'react-multi-select-component';
import { Link } from 'react-router-dom';
import { useCompanyContext } from '../../context';
import useHttp from '../../hooks/useHttp';

const options = [
    { label: "Medication Supervision", value: "Medication Supervision" },
    { label: "Medication administering", value: "Medication administering" },
    { label: "Personal Support", value: "Personal Support" },
    { label: "Domestic Cleaning", value: "Domestic Cleaning" },
    { label: "Transport", value: "Transport" },
    { label: "Dog training", value: "Dog training" },
    { label: "Install phone", value: "Install phone" },
    { label: "Welfare check", value: "Welfare check" },
    { label: "Support Groceries shopping", value: "Support Groceries shopping" },
    { label: "Pick up", value: "Pick up" },
    { label: "Baby sitting", value: "Baby sitting" },
    { label: "Taking to solicitors appointment", value: "Taking to solicitors appointment" },
    { label: "Meal Preparation", value: "Meal Preparation" },
    { label: "Shopping", value: "Shopping" },
    { label: "Groceries Transport", value: "Groceries Transport" },
    { label: "Domestics Social Support", value: "Domestics Social Support" },

];
const AddShiftRoaster = () => {
    const id = JSON.parse(localStorage.getItem('user'));
    const privateHttp = useHttp();
    const { loading, setLoading } = useCompanyContext()
    const [staff, setStaff] = useState([]);
    const [clients, setClients] = useState([]);
    const [selected, setSelected] = useState([]);
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

    const [repeat, setRepeat] = useState(false);
    const [numOfDays, setNumOfDays] = useState(1);

    const handleRepeatChange = (e) => {
        setRepeat(e.target.checked);
    };

    const handleNumOfDaysChange = (e, day) => {
        // get the value of the checkbox (true or false)
        const checked = e.target.checked;

        // update the state based on the checked value
        if (checked) {
            setNumOfDays(numOfDays + 1);
        } else {
            setNumOfDays(numOfDays - 1);
        }
    };


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


                                                <MultiSelect
                                                    options={options}
                                                    value={selected}
                                                    onChange={setSelected}
                                                    labelledBy="Select Task"
                                                />
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



                                        <div>
                                            <div className="form-group">
                                                <input type="checkbox" checked={repeat} onChange={handleRepeatChange} />
                                                &nbsp; &nbsp;
                                                <label className="col-form-label">Repeat</label>
                                            </div>

                                            {repeat && (
                                                <div>
                                                    <p>Select days:</p>
                                                    <label>
                                                        <input type="checkbox" onChange={(e) => handleNumOfDaysChange(e, 'Monday')} />
                                                        &nbsp;
                                                        Monday
                                                    </label>
                                                    &nbsp; &nbsp;
                                                    <label>
                                                        <input type="checkbox" onChange={(e) => handleNumOfDaysChange(e, 'Tuesday')} />
                                                        &nbsp;
                                                        Tuesday
                                                    </label> &nbsp; &nbsp;
                                                    <label>
                                                        <input type="checkbox" onChange={(e) => handleNumOfDaysChange(e, 'Wednesday')} />
                                                        &nbsp;
                                                        Wednesday
                                                    </label> &nbsp; &nbsp;
                                                    <label>
                                                        <input type="checkbox" onChange={(e) => handleNumOfDaysChange(e, 'Thursday')} />
                                                        &nbsp;
                                                        Thursday
                                                    </label> &nbsp; &nbsp;
                                                    <label>
                                                        <input type="checkbox" onChange={(e) => handleNumOfDaysChange(e, 'Friday')} />
                                                        &nbsp;
                                                        Friday
                                                    </label> &nbsp; &nbsp;
                                                    <label>
                                                        <input type="checkbox" onChange={(e) => handleNumOfDaysChange(e, 'Saturday')} />
                                                        &nbsp;
                                                        Saturday
                                                    </label> &nbsp; &nbsp;
                                                    <label>
                                                        <input type="checkbox" onChange={(e) => handleNumOfDaysChange(e, 'Sunday')} />
                                                        &nbsp;
                                                        Sunday
                                                    </label> &nbsp; &nbsp;
                                                    {/* <p>Number of days to repeat: {numOfDays}</p> */}
                                                </div>
                                            )}
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