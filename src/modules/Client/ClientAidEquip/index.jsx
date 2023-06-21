/**
 * Form Elemets
 */
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import useHttp from '../../../hooks/useHttp';
import { useCompanyContext } from '../../../context';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaCopy, FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaTrash } from "react-icons/fa";
import Offcanvas from '../../../Entryfile/offcanvance';
import { toast } from 'react-toastify';
import { GoSearch, GoTrashcan } from 'react-icons/go';
import dayjs from 'dayjs';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';
import { async } from '@babel/runtime/helpers/regeneratorRuntime';
import { MultiSelect } from 'react-multi-select-component';
const options = [
    { label: "Equipment Require Assistance", value: "Equipment Require Assistance" },
    { label: "Equipment Require Staff Training", value: "Equipment Require Staff Training" },

];


const ClientAidEquip = () => {
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
    const { loading, setLoading } = useCompanyContext();
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [info, setInfo] = useState("");
    const { get, post } = useHttp();
    const [selectedTimeFrom, setSelectedTimeFrom] = useState("");
    const [equipmentUsed, setEquipmentUsed] = useState("");
    const [selectedTimeTo, setSelectedTimeTo] = useState("");
    const id = JSON.parse(localStorage.getItem('user'));
    const [showModal, setShowModal] = useState(false);
    const clientProfile = JSON.parse(localStorage.getItem('clientProfile'));

    //  const handleSelected = (selectedOptions) => {
    //      setSelected(selectedOptions);
    //  }
    //  const selectedValues = selected.map(option => option.label).join(', ');

    const handleSelected = (selectedOptions) => {
        const updatedInfo = {
          equipmentAssistance: selectedOptions.some(option => option.value === 'Equipment Require Assistance'),
          requireStaffTraining: selectedOptions.some(option => option.value === 'Equipment Require Staff Training'),
        };
      
        setInfo(updatedInfo);
        setSelected(selectedOptions);
      };


    const convertTo12HourFormat = (time24h) => {
        let [hours, minutes] = time24h.split(':');
        let suffix = 'AM';

        if (hours >= 12) {
            suffix = 'PM';
            hours = hours - 12;
        }

        if (hours === 0) {
            hours = 12;
        }

        return `${hours}:${minutes} ${suffix}`;
    };


    const PostAvail = async (e) => {
        if (equipmentUsed === "") {
            return toast.error("Input Fields cannot be empty")
        }
        e.preventDefault()
        setLoading1(true)

        const inf = {
            profileId: clientProfile.profileId,
            equipmentUsed: equipmentUsed,
            equipmentAssistance: info.equipmentAssistance,
            requireStaffTraining: info.requireStaffTraining,
        }
        try {

            const { data } = await post(`/Aids`, inf);
            //  console.log(data)
            if (data.status === 'Success') {
                toast.success(data.message)
            }
            setLoading1(false)
            FetchSchedule()
        } catch (error) {
            //  console.log(error);
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
            const { data } = await get(`/Aids/get_client_aids?clientId=${clientProfile.profileId}`, { cacheTimeout: 300000 });
            //  console.log(data);
            setStaffAvail(data)
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


    const columns = [
        // {
        //   name: 'User',
        //   selector: row => row.user,
        //   sortable: true
        // },
        {
            name: 'Equipment Used',
            selector: row => row.equipmentUsed,
            sortable: true,
            expandable: true,
        },
        {
            name: 'Equipment Require Assistance',
            selector: row => (
                <input type="checkbox" checked={row.equipmentAssistance} readOnly />
            ),
            sortable: true,
        },
        {
            name: 'Equipment Require Staff Training',
            selector: row => (
                <input type="checkbox" checked={row.requireStaffTraining} readOnly />
            ),
            sortable: true
        },
        {
            name: 'Date Created',
            selector: row => dayjs(row.dateCreated).format('DD/MM/YYYY HH:mm:ss'),
            sortable: true
        }


    ];

    const handleExcelDownload = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet1');

        // Add headers
        const headers = columns.map((column) => column.name);
        sheet.addRow(headers);

        // Add data
        staffAvail.forEach((dataRow) => {
            const values = columns.map((column) => {
                if (typeof column.selector === 'function') {
                    return column.selector(dataRow);
                }
                return dataRow[column.selector];
            });
            sheet.addRow(values);
        });

        // Generate Excel file
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'data.xlsx';
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    const handlePDFDownload = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(13);
        doc.text("User Table", marginLeft, 40);
        const headers = columns.map((column) => column.name);
        const dataValues = staffAvail.map((dataRow) =>
            columns.map((column) => {
                if (typeof column.selector === "function") {
                    return column.selector(dataRow);
                }
                return dataRow[column.selector];
            })
        );

        doc.autoTable({
            startY: 50,
            head: [headers],
            body: dataValues,
            margin: { top: 50, left: marginLeft, right: marginLeft, bottom: 0 },
        });
        doc.save("Admin.pdf");
    };

    const handleDelete = async (e) => {
        Swal.fire({
            html: `<h3>Are you sure? you want to delete this </h3>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1C75BC',
            cancelButtonColor: '#C8102E',
            confirmButtonText: 'Confirm Delete',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await post(`/Aids/delete/${e}`)
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
    const [idSave, setIdSave] = useState('');
    const [selectedActivities, setSelectedActivities] = useState([]);
    const selectedValue = selectedActivities.map(option => option.label).join(', ');
    const handleEdit = async (e) => {
        setShowModal(true);
        setIdSave(e)
        // setLoading2(true)
        try {

            const { data } = await get(`/Aids/${e}`, { cacheTimeout: 300000 });
            // console.log(data);
            const { equipmentAssistance, requireStaffTraining } = data;

            const selectedValues = [];
            if (equipmentAssistance) {
                selectedValues.push({ label: 'Equipment Require Assistance', value: 'Equipment Require Assistance' });
            }
            if (requireStaffTraining) {
                selectedValues.push({ label: 'Equipment Require Staff Training', value: 'Equipment Require Staff Training' });
            }

            setSelectedActivities(selectedValues);
            setEditAvail(data);
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message);
            toast.error(error.response.data.title);
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
            aidsId: idSave,
            profileId: clientProfile.profileId,
            equipmentUsed: editAvail.equipmentUsed,
            equipmentAssistance: selectedActivities.find(option => option.value === 'Equipment Require Assistance') !== undefined,
            requireStaffTraining: selectedActivities.find(option => option.value === 'Equipment Require Staff Training') !== undefined,
          };
        try {

            const { data } = await post(`/Aids/edit/${idSave}`, info);
            console.log(data);
            if (data.status === 'Success') {
                toast.success(data.message)
            }
            setLoading2(false)
            setShowModal(false)
            FetchSchedule()
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
        finally {
            setLoading2(false)
        }
    }

    const ButtonRow = ({ data }) => {
        return (
            <div className="p-2 d-flex gap-1 flex-column " style={{ fontSize: "12px" }}>
                <div><span className='fw-bold'>Equipment Used: </span> {data.equipmentUsed}</div>
                <div ><span className='fw-bold'>Date Created: </span> {moment(data.dateCreated).format('lll')}</div>
                <div>
                    <button className="btn text-info fw-bold" style={{ fontSize: "12px" }} onClick={() => handleEdit(data.aidsId)}>
                        Edit
                    </button> |
                    <button onClick={() => handleDelete(data.aidsId)} className="btn text-danger fw-bold" style={{ fontSize: "12px" }}>
                        Delete
                    </button>
                </div>

            </div>
        );

    };

    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = staffAvail.filter((item) =>
        item.equipmentUsed.toLowerCase().includes(searchText.toLowerCase())
    );
    return (
        <div className="page-wrapper">
            <Helmet>
                <title> Aids & Equipments</title>
                <meta name="description" content="Aids & Equipments" />
            </Helmet>
            <div className="content container-fluid">
                {/* Page Header */}
                <div className="page-header">
                    <div className="row">
                        <div className="col">
                            {/* <h3 className="page-title">Staff Aids & Equipments</h3> */}
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/client/client">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Aids & Equipments</li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* /Page Header */}
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title mb-0">Aids & Equipments</h4>
                            </div>
                            <div className="card-body">
                                <form className="">
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Equipment Used</label>
                                            <input className="form-control" type="text" onChange={e => setEquipmentUsed(e.target.value)} required />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label></label>
                                            <MultiSelect
                                                options={options}
                                                value={selected}
                                                onChange={handleSelected}
                                                labelledBy="Select..."
                                            />
                                        </div>
                                    </div>



                                    <div className="text-start">
                                        <button type="submit" className="btn btn-primary px-2" disabled={loading1 ? true : false} onClick={PostAvail}>
                                            {loading1 ? <div className="spinner-grow text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div> : "Submit"}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-4 border'>
                    <div className="row px-2 py-3 d-flex justify-content-between align-items-center gap-4">

                        <div className="col-md-3">
                            <div className='d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                                <input type="text" placeholder="Search...." className='border-0 outline-none' onChange={handleSearch} />
                                <GoSearch />
                            </div>
                        </div>
                        <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
                            <CSVLink
                                data={staffAvail}
                                filename={"document.csv"}

                            >
                                <button

                                    className='btn text-info'
                                    title="Export as CSV"
                                >
                                    <FaFileCsv />
                                </button>

                            </CSVLink>
                            <button
                                className='btn text-danger'
                                onClick={handlePDFDownload}
                                title="Export as PDF"
                            >
                                <FaFilePdf />
                            </button>
                            <button
                                className='btn text-primary'

                                onClick={handleExcelDownload}
                                title="Export as Excel"
                            >
                                <FaFileExcel />
                            </button>
                            <CopyToClipboard text={JSON.stringify(staffAvail)}>
                                <button

                                    className='btn text-warning'
                                    title="Copy Table"
                                    onClick={() => toast("Table Copied")}
                                >
                                    <FaCopy />
                                </button>
                            </CopyToClipboard>
                        </div>
                    </div>
                    <DataTable data={filteredData} columns={columns}
                        pagination
                        highlightOnHover
                        searchable
                        searchTerm={searchText}
                        progressPending={loading}
                        progressComponent={<div className='text-center fs-1'>
                            <div className="spinner-grow text-secondary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>}
                        expandableRows
                        expandableRowsComponent={ButtonRow}
                        paginationTotalRows={filteredData.length}
                        responsive


                    />


                </div>
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Aids & Equipments</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="card-body">
                            <form className="">
                                <div className='col-md-12'>
                                    <div className="form-group">
                                        <label>Equipment Used</label>
                                        <input className="form-control" type="text" name='equipmentUsed' value={editAvail.equipmentUsed || ''} onChange={handleInputChange} required />
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label></label>
                                        <MultiSelect
                                            options={options}
                                            value={selectedActivities}
                                            onChange={handleActivityChange}
                                            labelledBy="Select..."
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type="submit"
                            className="btn btn-primary add-btn px-2"
                            disabled={loading2 ? true : false}
                            onClick={EditAvail}
                        >
                            {loading2 ? (
                                <div className="spinner-grow text-light" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ) : (
                                "Add"
                            )}
                        </button>
                    </Modal.Footer>
                </Modal>


            </div>

        </div>
    );
}
export default ClientAidEquip;