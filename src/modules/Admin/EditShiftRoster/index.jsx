
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaBackspace } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { MultiSelect } from 'react-multi-select-component';
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCompanyContext } from '../../../context';
import useHttp from '../../../hooks/useHttp';

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
const EditShiftRoaster = () => {
    const { uid } = useParams();
    const id = JSON.parse(localStorage.getItem('user'));
    const { get, post } = useHttp();
    const { loading, setLoading } = useCompanyContext()
    const [staff, setStaff] = useState([]);
    const [clients, setClients] = useState([]);
    const navigate = useHistory();
    const [shiftOne, setShiftOne] = useState({});
    const [staffId, setStaffId] = useState(0);
    const [dateFrom, setDatefrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [profileId, setProfileId] = useState(0);
    const [isNightShift, setIsNightShift] = useState(false);
    const [isExceptionalShift, setIsExceptionalShift] = useState(false);
    const [activities, setActivities] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState("");
    const [selectedClient, setSelectedClient] = useState("");

    const FetchSchedule = async () => {

        try {
            const { data } = await get(`ShiftRosters/${uid}`, { cacheTimeout: 300000 });
            setShiftOne(data);
            const { activities } = data;
            setActivities(activities.split(',').map((activity) => ({ label: activity, value: activity })));
            setSelectedActivities(data.activities.split(',').map((activity) => ({ label: activity, value: activity })));
            setSelectedStaff(data.staff.fullName);
            setSelectedClient(data.profile.fullName);
            setStaffId(data.staff.staffId);
            setProfileId(data.profile.profileId);
            setDatefrom(data.dateFrom);
            setDateTo(data.dateTo);


            setLoading(false)
        } catch (error) {
            console.log(error);
        }
        try {
            const staffResponse = await get(`Staffs?companyId=${id.companyId}`, { cacheTimeout: 300000 });
            const staff = staffResponse.data;
            setStaff(staff);
            setLoading(false)
        } catch (error) {
            console.log(error);
        }

        try {
            const clientResponse = await get(`/Profiles?companyId=${id.companyId}`, { cacheTimeout: 300000 });
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

    const handleRepeatChange = (e) => {
        setRepeat(e.target.checked);
    };
    const handleExceptionChange = (e) => {
        setIsExceptionalShift(e.target.checked);
    };
    const handleNightChange = (e) => {
        setIsNightShift(e.target.checked);
    };

    const handleActivityChange = (selected) => {
        setSelectedActivities(selected);
    };

    const selectedValues = selectedActivities.map(option => option.label).join(', ');

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (staffId === 0 || profileId === 0
        ) {
            return toast.error("Invalid Request")
        }
        try {
            setLoading(true)
            const { data } = await post(`/ShiftRosters/edit_shift/${uid}?userId=${id.userId}`,
                {
                    companyId: id.companyId,
                    shiftRosterId: uid,
                    staffId: Number(staffId),
                    dateFrom,
                    dateTo,
                    activities: selectedValues,
                    profileId: Number(profileId),
                    isNightShift,
                    isExceptionalShift,

                }
            )
            toast.success(data.message)
            navigate.push('/administrator/shiftRoster')
            setLoading(false)

        } catch (error) {
            toast.error(error.response?.data?.message)

            setLoading(false)

        } finally {
            setLoading(false)
        }

    }


    return (
        <div className="page-wrapper">
            <Helmet>
                <title>Edit Shift Details</title>
                <meta name="description" content="" />
            </Helmet>
            <div className="content container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">

                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title mb-0">Edit Shift Details</h4>
                                <Link to={'/administrator/shiftRoster'} className="card-title mb-0 text-danger fs-3 "> <MdCancel /></Link>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">

                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">Staff Name</label>
                                                <div>
                                                    <select className="form-select"

                                                        onChange={e => setStaffId(e.target.value)}>
                                                        <option defaultValue hidden>{selectedStaff}</option>
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
                                                    <select className="form-select" onChange={e => setProfileId(e.target.value)}>
                                                        <option defaultValue hidden>{selectedClient}</option>
                                                        {
                                                            clients.map((data, index) =>
                                                                <option value={data.profileId} key={index}>{data.fullName}</option>)
                                                        }
                                                    </select></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">Start Time</label>
                                                <div><input className="form-control datetimepicker" type="datetime-local"
                                                    onChange={e => setDatefrom(e.target.value)}
                                                    value={dateFrom}
                                                /></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">End Time</label>
                                                <div><input className="form-control datetimepicker" type="datetime-local"
                                                    onChange={e => setDateTo(e.target.value)}
                                                    value={dateTo}
                                                /></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label className="col-form-label fw-bold">Activities</label>


                                                <MultiSelect
                                                    options={options.concat(activities)}
                                                    value={selectedActivities}
                                                    onChange={handleActivityChange}
                                                    labelledBy={'Select Activities'}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <input type="checkbox" checked={isExceptionalShift} onChange={handleExceptionChange} />
                                                &nbsp; &nbsp;
                                                <label className="col-form-label">Is Exceptional Shift</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <input type="checkbox" checked={isNightShift} onChange={handleNightChange} />
                                                &nbsp; &nbsp;
                                                <label className="col-form-label">Is Night Shift</label>
                                            </div>
                                        </div>
                                        {/* <div className="col-sm-6">
                                            <div className="form-group">
                                                <input type="checkbox" checked={isNightShift} onChange={handleNightChange} />
                                                &nbsp; &nbsp;
                                                <label className="col-form-label">Apply to Repeated Shifts </label>
                                            </div>
                                        </div> */}
                                    </div>

                                    <div className="submit-section">
                                        <button className="btn btn-primary submit-btn" type='submit'>

                                            {loading ? <div className="spinner-grow text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div> : "Submit"}
                                        </button>
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

export default EditShiftRoaster;