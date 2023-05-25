import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import { FaCopy, FaEdit, FaEye, FaFileCsv, FaFileExcel, FaFilePdf, FaTrash } from "react-icons/fa";
import ExcelJS from 'exceljs';
import Offcanvas from '../../../Entryfile/offcanvance';
import { toast } from 'react-toastify';
import useHttp from '../../../hooks/useHttp';
import { useCompanyContext } from '../../../context';
import { GoSearch, GoTrashcan } from 'react-icons/go';
import { SlSettings } from 'react-icons/sl'
import Swal from 'sweetalert2';
import moment from 'moment';
import AdminHeader from '../Components/AdminHeader';
import AdminSidebar from '../Components/AdminSidebar';

const ProgressReport = () => {
    const { get } = useHttp();
    const { loading, setLoading } = useCompanyContext();
    const id = JSON.parse(localStorage.getItem('user'));
    const [progress, setProgress] = useState([]);
    const [staff, setStaff] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading1, setLoading1] = useState(false);
    const [cli, setCli] = useState('');
    const [sta, setSta] = useState('');
    const columns = [
        {
            name: '',
            selector: row => row,
            sortable: true,
            cell: (row) => (
                <Link to={`/administrator/progressReportDetails/${row.progressNoteId}`} className='d-flex justify-content-center w-100 text-info pointer'>
                    view
                </Link>
            ),
        },
        {
            name: 'Staff',
            selector: row => row.staff,
            sortable: true
        },
        {
            name: 'Clients',
            selector: row => row.profile.fullName,
            sortable: true
        },



        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
            expandable: true,
            cell: (row) => (
                <span style={{ overflow: "hidden" }}> {moment(row.dateCreated).format('LLL')}</span>
            ),
        },
        {
            name: "Actions",
            cell: (row) => (


                <button
                    className='btn'
                    title='Delete'
                    onClick={() => {
                        // handle action here, e.g. open a modal or navigate to a new page

                    }}
                >
                    <GoTrashcan />
                </button>

            ),
        },


    ];


    const FetchProgress = async () => {
        try {
            setLoading(true)
            const { data } = await get(`ProgressNotes/get_all_progressnote_by_company?companyId=${id.companyId}`, { cacheTimeout: 300000 });
            // console.log(data);
            setProgress(data);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false);
        } finally {
            setLoading(false)
        }
        try {
            const staffResponse = await get(`/Staffs?companyId=${id.companyId}`, { cacheTimeout: 300000 });
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
        }



    };
    useEffect(() => {

        FetchProgress()
    }, []);

    const FilterReport = async () => {

        if (sta === "") {
            return Swal.fire(
                "Select either a staff or client",
                "",
                "error"
            )

        } else {
            setLoading1(true)

            try {
                const { data } = await get(`/ProgressNotes/get_progressnote_by_user?staffname=${sta}&profileId=${cli}`, { cacheTimeout: 300000 });
                setProgress(data.progressNote);
                setLoading1(false)
            } catch (error) {
                console.log(error);
                setLoading1(false)
            }
        }

    }


    const [menu, setMenu] = useState(false);

    // const handleDelete = async (e) => {
    //   Swal.fire({
    //     html: `<h3>Are you sure? you want to delete this user</h3></br><p>You won't be able to revert this!</p>`,
    //     icon: 'question',
    //     showCancelButton: true,
    //     confirmButtonColor: '#00AEEF',
    //     cancelButtonColor: '#777',
    //     confirmButtonText: 'Confirm Delete',
    //     showLoaderOnConfirm: true,
    //   }).then(async (result) => {
    //     if (result.isConfirmed) {
    //       try {
    //         const { data } = await privateHttp.post(`/Administrators/delete/${e}?userId=${id.userId}`,
    //         )
    //         if (data.status === 'Success') {
    //           toast.success(data.message);
    //           FetchStaff()
    //         } else {
    //           toast.error(data.message);
    //         }


    //       } catch (error) {
    //         console.log(error);
    //         toast.error(error.response.data.message)
    //         toast.error(error.response.data.title)


    //       }


    //     }
    //   })
    // }


    const toggleMobileMenu = () => {
        setMenu(!menu)
    }

    useEffect(() => {
        if ($('.select').length > 0) {
            $('.select').select2({
                minimumResultsForSearch: -1,
                width: '100%'
            });
        }
    });

    const handleExcelDownload = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet1');

        // Add headers
        const headers = columns.map((column) => column.name);
        sheet.addRow(headers);

        // Add data
        progress.forEach((dataRow) => {
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
        const csvData = Papa.unparse(progress);
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
        doc.text("User Table", marginLeft, 40);
        const headers = columns.map((column) => column.name);
        const dataValues = progress.map((dataRow) =>
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
        doc.save("ProgressReport.pdf");
    };


    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = progress.filter((item) =>
        item.staff.toLowerCase().includes(searchText.toLowerCase())
    );





    return (
        <>
            <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>

                <AdminHeader />
                <AdminSidebar />
                <div className="page-wrapper">
                    <Helmet>
                        <title>Progress Report</title>
                        <meta name="description" content="Progress Report" />
                    </Helmet>

                    <div className="content container-fluid">

                        <div className="page-header">
                            <div className="row">
                                <div className="col-sm-12">
                                    <h3 className="page-title">Progress Report</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/administrator/administrator/adminDashboard">Dashboard</Link></li>
                                        <li className="breadcrumb-item active">Progress Report</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="row align-items-center">
                            <span className='fw-bold'>Filter Progress Report </span>
                            <br />
                            <br />
                            <br />
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="col-form-label">Staff Name</label>
                                    <div>
                                        <select className="form-select" onChange={e => setSta(e.target.value)}>
                                            <option defaultValue value={""}>--Select a staff--</option>
                                            {
                                                staff.map((data, index) =>
                                                    <option value={data.fullName} key={index}>{data.fullName}</option>)
                                            }
                                        </select></div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="col-form-label">Client Name</label>
                                    <div>
                                        <select className="form-select" onChange={e => setCli(e.target.value)}>
                                            <option defaultValue value={""}>--Select a Client--</option>
                                            {
                                                clients.map((data, index) =>
                                                    <option value={data.profileId} key={index}>{data.fullName}</option>)
                                            }
                                        </select></div>
                                </div>
                            </div>
                            <div className="col-auto mt-3">
                                <div className="form-group">
                                    <button
                                        onClick={FilterReport}
                                        className="btn btn-info add-btn text-white rounded-2 m-r-5"
                                        disabled={loading1 ? true : false}
                                    >


                                        {loading1 ? <div className="spinner-grow text-light" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div> : "Load"}
                                    </button>

                                </div>
                            </div>
                            <div className="col-auto mt-3">
                                <div className="form-group">
                                    <button
                                        onClick={FetchProgress}
                                        className="btn btn-secondary add-btn rounded-2 m-r-5">All Progress Report</button>

                                </div>
                            </div>


                        </div>



                        <div className='mt-4 border'>
                            <div className="row px-2 py-3">

                                <div className="col-md-3">
                                    <div className='d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                                        <input type="text" placeholder="Search Progress Reports" className='border-0 outline-none' onChange={handleSearch} />
                                        <GoSearch />
                                    </div>
                                </div>
                                <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
                                    <CSVLink
                                        data={progress}
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
                                    <CopyToClipboard text={JSON.stringify(progress)}>
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

                                paginationTotalRows={filteredData.length}
                                responsive



                            />

                        </div>

                    </div>

                </div>
            </div>

            <Offcanvas />
        </>

    );
}

export default ProgressReport;
