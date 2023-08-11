/**
 * Form Elemets
 */
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';
import useHttp from '../../../hooks/useHttp';
const options = [
    { label: "Need Mobility Assistance?", value: "Need Mobility Assistance?" },
    { label: "Mobility Independency", value: "Mobility Independency" },

];
const optionsOther = [
    { label: "Need Communication Assistance?", value: "Need Communication Assistance?" },

];


const Registrar = () => {
    useEffect(() => {
        if ($('.select').length > 0) {
            $('.select').select2({
                minimumResultsForSearch: -1,
                width: '100%'
            });
        }
    });

    const [selected, setSelected] = useState([]);
    const [staffAvail, setStaffAvail] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [selectedDay, setSelectedDay] = useState("");
    const { get, post } = useHttp();
    const [selectedTimeFrom, setSelectedTimeFrom] = useState("");
    const [selectedTimeTo, setSelectedTimeTo] = useState("");
    const id = JSON.parse(localStorage.getItem('user'))
    const [showModal, setShowModal] = useState(false);
    // const clientProfile = JSON.parse(localStorage.getItem('clientProfile'))
    const handleSelected = (selectedOptions) => {
        setSelected(selectedOptions);
    }
    const selectedValues = selected.map(option => option.label).join(', ');


    const PostAvail = async (e) => {
        if (selectedDay === "" || selectedTimeFrom === "" || selectedTimeTo === "" || selectedValues === "") {
            return toast.error("Input Fields cannot be empty")
        }
        e.preventDefault()
        setLoading1(true)
        const info = {
            // profileId: clientProfile.profileId,
            days: selectedDay,
            fromTimeOfDay: selectedTimeFrom,
            toTimeOfDay: selectedTimeTo,
            activities: selectedValues,
            companyID: id.companyId
        }
        try {

            const { data } = await post(`/ClientSchedules/add_client_schedule?userId=${id.userId}`, info);
            console.log(data)
            if (data.status === 'Success') {
                toast.success(data.message)
            }
            setLoading1(false)
            FetchSchedule()
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
        finally {
            setLoading1(false)
        }
    }


    const FetchSchedule = async () => {
        // setLoading2(true)
        try {
            // const { data } = await get(`ClientSchedules/get_client_schedule?clientId=${clientProfile.profileId}`, { cacheTimeout: 300000 });
            // console.log(data);
            //  setStaffAvail(data)
            // setLoading2(false);
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
        // finally {
        //   setLoading2(false)
        // }


    };
    useEffect(() => {
        FetchSchedule()
    }, []);






    const handleDelete = async (e) => {
        Swal.fire({
            html: `<h3>Are you sure? you want to delete this Schedule</h3>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#405189',
            cancelButtonColor: '#C8102E',
            confirmButtonText: 'Confirm Delete',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await post(`/ClientSchedules/delete/${e}`)
                    // console.log(data);
                    if (data.status === 'Success') {
                        toast.success(data.message);
                        FetchSchedule()
                    } else {
                        toast.error(data.message);
                    }


                } catch (error) {
                    // console.log(error);
                    toast.error(error.response.data.message)
                    toast.error(error.response.data.title)


                }


            }
        })


    }

    const [editAvail, setEditAvail] = useState({});
    const [idSave, setIdSave] = useState('')
    const [selectedActivities, setSelectedActivities] = useState([]);
    const selectedValue = selectedActivities.map(option => option.label).join(', ');
    const handleEdit = async (e) => {
        setShowModal(true);
        setIdSave(e)
        // setLoading2(true)
        try {

            const { data } = await get(`/ClientSchedules/get_schedule/${e}`, { cacheTimeout: 300000 });
            // console.log(data);
            setSelectedActivities(data.activities.split(',').map((activity) => ({ label: activity, value: activity })));
            console.log();
            setEditAvail(data);
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
    };

    function handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        const newValue = value === "" ? "" : value;
        setEditAvail({
            ...editAvail,
            [name]: newValue
        });
    }

    const handleActivityChange = (selected) => {
        setSelectedActivities(selected);
    };

    const EditAvail = async (e) => {

        e.preventDefault()
        setLoading2(true)
        const info = {
            clientScheduleId: idSave,
            // profileId: clientProfile.profileId,
            days: editAvail.days,
            fromTimeOfDay: editAvail.fromTimeOfDay,
            toTimeOfDay: editAvail.toTimeOfDay,
            activities: selectedValue,
            companyID: id.companyId
        }
        try {

            const { data } = await post(`/ClientSchedules/edit/${idSave}?userId=${id.userId}`, info);
            // console.log(data);
            if (data.status === 'Success') {
                toast.success(data.message)
            }
            setLoading2(false)
            setShowModal(false)
            FetchSchedule()
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
        finally {
            setLoading2(false)
        }
    }


    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = staffAvail.filter((item) =>
        item.days.toLowerCase().includes(searchText.toLowerCase())
    );
    return (
        <div className="page-wrapper">
            <Helmet>
                <title> Registrar</title>
                <meta name="description" content="Registrar" />
            </Helmet>
            <div className="content container-fluid">
                {/* Page Header */}
                <div className="page-header">
                    <div className="row">
                        <div className="col">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Registrar</li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* /Page Header */}


                <div className="row">
                    <div className="col-md-12">
                        <div className="card">

                            <div className='d-flex flex-wrap-wrap justify-content-between'>

                            <div className='bg-primary p-5'>
                                        <button className='btn btn-light'>
                                            View Staff Registrar
                                        </button>
                        </div>

                                    <div className='bg-primary p-5'>
                                        <Link to="/app/employee/incident" className='btn btn-light'>
                                            View Incident Forms
                                        </Link>
                                    </div>
                                    
                                    <div className='bg-primary p-5'>
                                        <Link to="/app/employee/otherForms" className='btn btn-light'>
                                            View Other Forms
                                        </Link>
                                    </div>
                            </div>


                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title mb-0">Forms</h4>
                            </div>
                            <div className="card-body">
                               <label>Superannuation Form</label>
                               <Link to="#">view form</Link>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

        </div>
    );
}
export default Registrar;