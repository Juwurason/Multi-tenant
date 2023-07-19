
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import Offcanvas from '../../../Entryfile/offcanvance';
import useHttp from '../../../hooks/useHttp';
import { toast } from 'react-toastify';
import { FaCopy, FaDharmachakra, FaEdit, FaFileCsv, FaFileExcel, FaFileExport, FaFilePdf, FaRegEdit, FaSearch, FaTrash } from 'react-icons/fa';
import { GoSearch, GoTrashcan } from 'react-icons/go';
import { useCompanyContext } from '../../../context';
import EditUser from '../../../_components/modelbox/EditUser';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import ExcelJS from 'exceljs';
import Swal from 'sweetalert2';
import { fetchUser } from '../../../store/slices/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivity, filterActivityLogs } from '../../../store/slices/ActivitySlice';
import dayjs from 'dayjs';



const ActivityLog = () => {
    const id = JSON.parse(localStorage.getItem('user'));
    const dispatch = useDispatch();


    // Fetch user data and update the state
    useEffect(() => {
        dispatch(fetchActivity(id.companyId));
        dispatch(fetchUser(id.companyId));

    }, [dispatch]);

    // Access the entire state
    const loading = useSelector((state) => state.activity.isLoading);
    const activity = useSelector((state) => state.activity.data);
    const users = useSelector((state) => state.user.data);

    useEffect(() => {
        // Check if user data already exists in the store
        if (!activity.length) {
            // Fetch user data only if it's not available in the store
            dispatch(fetchActivity(id.companyId));
        }
    }, [dispatch, activity]);
    const [user, setUser] = useState("")
    const dateFrom = useRef("");
    const dateTo = useRef("");
    const [loading1, setLoading1] = useState(false);







    const columns = [


        {
            name: 'User',
            selector: row => row.user,
            sortable: true
        },
        {
            name: 'Activity',
            selector: row => row.activity,
            sortable: true
        },
        {
            name: 'Date Created',
            selector: row => dayjs(row.dateCreated).format('DD-MM-YYYY h:mm A'),
            sortable: true
        },





    ];
    const filterActivity = (e) => {
        e.preventDefault();
        setLoading1(true);

        dispatch(filterActivityLogs({ company: id.companyId, fromDate: dateFrom.current.value, toDate: dateTo.current.value, user: user, }));

        if (!loading) {
            setLoading1(false);
        }
    }

    const handleDelete = async (e) => {

        Swal.fire({
            html: `<h3>Are you sure? you want to delete this user</h3>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#405189',
            cancelButtonColor: '#777',
            confirmButtonText: 'Confirm Delete',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await post(`/Account/delete_user/${e}?userId=${id.userId}`,
                    )
                    if (data.status === 'Success') {
                        toast.success(data.message);
                        dispatch(fetchUser());
                    } else {
                        toast.error(data.message);
                    }


                } catch (error) {
                    toast.error("Ooops😔 Error Occurred")
                    console.log(error);



                }


            }
        })
    }

    const handleExcelDownload = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet1');

        // Add headers
        const headers = columns.map((column) => column.name);
        sheet.addRow(headers);

        // Add data
        activity.forEach((dataRow) => {
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



    const handleCSVDownload = () => {
        const csvData = Papa.unparse(activity);
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "data.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePDFDownload = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(13);
        doc.text("Activity log Table", marginLeft, 40);
        const headers = columns.map((column) => column.name);
        const dataValues = activity.map((dataRow) =>
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
        doc.save("Activity log.pdf");
    };


    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = activity.filter((item) =>
        item?.user.toLowerCase().includes(searchText.toLowerCase())
    );


    const ButtonRow = ({ data }) => {
        return (
            <div className="p-2 d-flex flex-column gap-1" style={{ fontSize: "12px" }}>
                <div ><span className='fw-bold'>Activity: </span> {data.activity}</div>
                <div><span className='fw-bold'>Medium: </span>{data.medium}</div>
            </div>
        );
    };
    return (
        <>
            <div className="page-wrapper">
                <Helmet>
                    <title>Activity Log</title>
                    <meta name="description" content="Activity Log" />
                </Helmet>
                {/* Page Content */}
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row align-items-center">
                            <div className="col">
                                <h3 className="page-title">Activity Log</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item active">Activity Log</li>
                                </ul>
                            </div>
                            <div className="col-auto float-end ml-auto">

                            </div>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">

                                <div className="card-body">
                                    <form className="row align-items-center py-3" onSubmit={filterActivity}>

                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="col-form-label">Select User</label>
                                                <div>
                                                    <select className="form-select" onChange={e => setUser(e.target.value)}>
                                                        <option defaultValue value={""}>All User</option>
                                                        {
                                                            users.map((data, index) =>
                                                                <option value={data.fullName} key={index}>{data.fullName}</option>)
                                                        }
                                                    </select></div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="col-form-label">Start Date</label>
                                                <div>
                                                    <input type="datetime-local" ref={dateFrom} className=' form-control' name="" id="" required />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="col-form-label">End Date</label>
                                                <div>
                                                    <input type="datetime-local" ref={dateTo} className=' form-control' name="" id="" required />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-auto mt-3">
                                            <div className="form-group">
                                                <button
                                                    type='submit'
                                                    className="btn btn-info add-btn text-white rounded-2 m-r-5"
                                                    disabled={loading1 ? true : false}
                                                >


                                                    {loading1 ? <div className="spinner-grow text-light" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div> : "Load"}
                                                </button>

                                            </div>
                                        </div>


                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className='mt-4 border'>
                        <div className="row px-2 py-3">

                            <div className='col-md-3'>
                                <div className=' d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                                    <input type="text" placeholder="Search Activity Log" className='border-0 outline-none' onChange={handleSearch} />
                                    <GoSearch />
                                </div>
                            </div>
                            <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
                                <CSVLink
                                    data={activity}
                                    filename={"data.csv"}

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
                                <CopyToClipboard text={JSON.stringify(activity)}>
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
                            progressPending={loading}
                            progressComponent={<div className='text-center fs-1'>
                                <div className="spinner-grow text-secondary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>}
                            expandableRows
                            responsive
                            expandableRowsComponent={ButtonRow}
                            searchTerm={searchText}

                        />
                    </div>

                </div>
                {/* /Page Content */}




            </div>
            <EditUser />
            <Offcanvas />
        </>


    );
}

export default ActivityLog;
