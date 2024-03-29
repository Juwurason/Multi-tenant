
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaBackspace } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { MultiSelect } from 'react-multi-select-component';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCompanyContext } from '../../context';
import useHttp from '../../hooks/useHttp';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff } from '../../store/slices/StaffSlice';
import { fetchClient, formatClient } from '../../store/slices/ClientSlice';

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

    const dispatch = useDispatch();

    // Fetch staff data and update the state
    useEffect(() => {
        dispatch(fetchStaff(id.companyId));
        dispatch(formatClient(id.companyId));
    }, [dispatch]);

    // Access the entire state
    const staff = useSelector((state) => state.staff.data);
    const clients = useSelector((state) => state.client.data);

    useEffect(() => {
        // Check if staff data already exists in the store
        if (!staff.length) {
            // Fetch staff data only if it's not available in the store
            dispatch(fetchStaff(id.companyId));
        }
    }, [dispatch, staff]);

    const { get, post } = useHttp();
    const [loading, setLoading] = useState(false)
    const [selectedClient, setSelectedClient] = useState([]);
    const navigate = useHistory();
    const [selected, setSelected] = useState([]);
    const [staffId, setStaffId] = useState(0);
    const [dateFrom, setDatefrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [isNightShift, setIsNightShift] = useState(false);
    const [isExceptionalShift, setIsExceptionalShift] = useState(false);
    const [days, setDays] = useState({
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false
    });
    const [stopDate, setStopDate] = useState("");


    const [repeat, setRepeat] = useState(false);
    const [numOfDays, setNumOfDays] = useState(1);

    const handleSelectionChange = (selected) => {
        setSelectedClient(selected);
    };
    const selectClients = selectedClient.map(option => option.label).join(', ');

    const handleRepeatChange = (e) => {
        setRepeat(e.target.checked);
    };
    const handleExceptionChange = (e) => {
        setIsExceptionalShift(e.target.checked);
    };
    const handleNightChange = (e) => {
        setIsNightShift(e.target.checked);
    };
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setDays((prevDays) => ({ ...prevDays, [name]: checked }));
    };


    const handleSelected = (selectedOptions) => {
        setSelected(selectedOptions);
    }

    const selectedValues = selected.map(option => option.label).join(', ');


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (staffId === 0 && selected.length <= 0
        ) {
            return toast.error("Select Either a staff or client")
        }

        if (repeat && stopDate === "" ) {
            return toast.error("Select a Stop Date");
        }

        try {
            setLoading(true)
            const { data } = await post(`/ShiftRosters/add_multipleclient_shifts?userId=${id.userId}`,
                {
                    companyId: id.companyId,
                    staffId: Number(staffId),
                    dateFrom,
                    dateTo,
                    activities: selectedValues,
                    clientList: selectClients,
                    isNightShift,
                    isExceptionalShift,
                    repeat,
                    monday: days.monday,
                    tuesday: days.tuesday,
                    wednesday: days.wednesday,
                    thursday: days.thursday,
                    friday: days.friday,
                    saturday: days.saturday,
                    sunday: days.sunday,
                    stopDate: stopDate
                }
            )
            toast.success(data.message)
            navigate.push('/app/employee/shift-scheduling')
            console.log("sucess");
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
                <title>Add Shift Roster</title>
                <meta name="description" content="" />
            </Helmet>
            <div className="content container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">

                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title mb-0">Add Shift Roster</h4>
                                <Link to={'/app/employee/shift-scheduling'} className="card-title mb-0 text-danger fs-3 "> <MdCancel /></Link>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">

                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">Staff Name</label>
                                                <div>
                                                    <select className="form-select" onChange={e => setStaffId(e.target.value)}>
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
                                                <MultiSelect
                                                    options={clients}
                                                    value={selectedClient}
                                                    onChange={handleSelectionChange}
                                                    labelledBy="Select Clients"
                                                />

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
                                                    options={options}
                                                    value={selected}
                                                    onChange={handleSelected}
                                                    labelledBy="Select Task"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <input type="checkbox" checked={isExceptionalShift} onChange={handleExceptionChange} />
                                                &nbsp; &nbsp;
                                                <label className="col-form-label">Active Night</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <input type="checkbox" checked={isNightShift} onChange={handleNightChange} />
                                                &nbsp; &nbsp;
                                                <label className="col-form-label">Sleep Over</label>
                                            </div>
                                        </div>



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
                                                        <input type="checkbox" name="sunday" checked={days.sunday} onChange={handleCheckboxChange} />
                                                        &nbsp;
                                                        Sunday
                                                    </label>
                                                    &nbsp; &nbsp;
                                                    <label>
                                                        <input type="checkbox" name="monday" checked={days.monday} onChange={handleCheckboxChange} />
                                                        &nbsp;
                                                        Monday
                                                    </label> &nbsp; &nbsp;
                                                    <label>
                                                        <input type="checkbox" name="tuesday" checked={days.tuesday} onChange={handleCheckboxChange} />
                                                        &nbsp;
                                                        Tuesday
                                                    </label> &nbsp; &nbsp;
                                                    <label>
                                                        <input type="checkbox" name="wednesday" checked={days.wednesday} onChange={handleCheckboxChange} />
                                                        &nbsp;
                                                        wednesday
                                                    </label> &nbsp; &nbsp;
                                                    <label>
                                                        <input type="checkbox" name="thursday" checked={days.thursday} onChange={handleCheckboxChange} />
                                                        &nbsp;
                                                        Thursday
                                                    </label> &nbsp; &nbsp;
                                                    <label>
                                                        <input type="checkbox" name="friday" checked={days.friday} onChange={handleCheckboxChange} />
                                                        &nbsp;
                                                        Friday
                                                    </label> &nbsp; &nbsp;
                                                    <label>
                                                        <input type="checkbox" name="saturday" checked={days.saturday} onChange={handleCheckboxChange} />
                                                        &nbsp;
                                                        Saturday
                                                    </label> &nbsp; &nbsp;
                                                    <br />

                                                    <div className='row'>

                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="col-form-label">Select Date to End the Repitition</label>
                                                                <div><input className="form-control datetimepicker" type="datetime-local"
                                                                    onChange={e => setStopDate(e.target.value)}
                                                                /></div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="submit-section">
                                        <button className="btn btn-primary rounded submit-btn" type='submit'>

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

export default AddShiftRoaster;