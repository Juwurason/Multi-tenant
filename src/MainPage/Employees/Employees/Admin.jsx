import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import { FaCopy, FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaTrash } from "react-icons/fa";
import ExcelJS from 'exceljs';
import Editemployee from "../../../_components/modelbox/Editemployee"
import Sidebar from '../../../initialpage/Sidebar/sidebar';;
import Header from '../../../initialpage/Sidebar/header'
import Offcanvas from '../../../Entryfile/offcanvance';
import { toast } from 'react-toastify';
import useHttp from '../../../hooks/useHttp';
import AddAdmin from '../../../_components/modelbox/AddAdmin';
import { useCompanyContext } from '../../../context';
import { GoSearch, GoTrashcan } from 'react-icons/go';
import { SlSettings } from 'react-icons/sl'
import Swal from 'sweetalert2';

const AllAdmin = () => {
    const { get } = useHttp();
    const { loading, setLoading } = useCompanyContext();
    const id = JSON.parse(localStorage.getItem('user'));
    const [admin, setAdmin] = useState([]);

    const columns = [
        {
            name: '#',
            cell: (row, index) => index + 1
        },
        {
            name: 'Staff ID',
            selector: row => row.maxStaffId,
            sortable: true
        },
        {
            name: 'Full Name',
            selector: row => row.fullName,
            sortable: true,
            expandable: true,
            cell: (row) => (
                <Link style={{ overflow: "hidden" }} to={`/app/profile/admin-profile/${row.administratorId}/${row.firstName}`} className="fw-bold text-dark">
                    {row.firstName} {row.surName}
                </Link>
            ),
        },
        {
            name: 'Address',
            selector: row => row.address,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true
        },
        {
            name: 'Phone Number',
            selector: row => row.phoneNumber,
            sortable: true
        }, {
            name: "Actions",
            cell: (row) => (
                <div className="d-flex gap-1" style={{ overflow: "hidden" }}>
                    <Link
                        className='btn'
                        title='Edit'
                        to={`/app/profile/edit-admin/${row.administratorId}`}
                    >
                        <SlSettings />
                    </Link>
                    <button
                        className='btn'
                        title='Delete'
                        onClick={() => {
                            // handle action here, e.g. open a modal or navigate to a new page
                            handleDelete(row.administratorId)
                        }}
                    >
                        <GoTrashcan />
                    </button>

                </div>
            ),
        },



    ];


    const FetchStaff = async () => {
        try {
            setLoading(true)
            const { data } = await get(`Administrators?companyId=${id.companyId}`, { cacheTimeout: 300000 });
            setAdmin(data);
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {

        FetchStaff()
    }, []);


    const [menu, setMenu] = useState(false);

    const handleDelete = async (e) => {
        Swal.fire({
            html: `<h3>Are you sure? you want to delete this Administrator</h3>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#00AEEF',
            cancelButtonColor: '#777',
            confirmButtonText: 'Confirm Delete',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await privateHttp.post(`/Administrators/delete/${e}?userId=${id.userId}`,
                    )
                    if (data.status === 'Success') {
                        toast.success(data.message);
                        FetchStaff()
                    } else {
                        toast.error(data.message);
                    }


                } catch (error) {
                    console.log(error);
                    toast.error(error.response.data.message)
                    toast.error(error.response.data.title)


                }


            }
        })
    }


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
        admin.forEach((dataRow) => {
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
        const csvData = Papa.unparse(admin);
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
        const dataValues = admin.map((dataRow) =>
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

    const ButtonRow = ({ data }) => {
        return (
            <div className="p-4">
                <div className='fw-bold'><span>Full NAME</span> {data.fullName}</div>
                <div>{data.email}</div>
            </div>
        );
    };
    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = admin.filter((item) =>
        item.fullName.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>

                <Header onMenuClick={(value) => toggleMobileMenu()} />
                <Sidebar />
                <div className="page-wrapper">
                    <Helmet>
                        <title>Admin</title>
                        <meta name="description" content="Login page" />
                    </Helmet>

                    <div className="content container-fluid">

                        <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h3 className="page-title">Administrators</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                        <li className="breadcrumb-item active">Administrators</li>
                                    </ul>
                                </div>
                                <div className="col-auto float-end ml-auto">

                                    <div className="view-icons">
                                        <Link to="/app/employee/AllAdmin" className="grid-view btn btn-link active"><i className="fa fa-th" /></Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="row filter-row">
                            <div className="col-sm-6 col-md-3">
                                <div className="form-group form-focus">
                                    <label className="focus-label">Admin ID</label>
                                    <input type="text" className="form-control floating" />
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-3">
                                <div className="form-group form-focus">
                                    <label className="focus-label">Admin Name</label>
                                    <input type="text" className="form-control floating" />
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-3">
                                <div className="form-group form-focus">
                                    <label className="focus-label">Admin Email</label>
                                    <input type="text" className="form-control " />
                                </div>
                            </div>

                            <div className="col-sm-6 col-md-3">
                                <a href="#" className="btn btn-primary btn-block w-100"> Search </a>
                            </div>
                        </div> */}





                        <div className='mt-4 border'>
                            <div className="row px-2 py-3">

                                <div className="col-md-3">
                                    <div className='d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                                        <input type="text" placeholder="Search Admins" className='border-0 outline-none' onChange={handleSearch} />
                                        <GoSearch />
                                    </div>
                                </div>
                                <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
                                    <CSVLink
                                        data={admin}
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
                                    <CopyToClipboard text={JSON.stringify(admin)}>
                                        <button

                                            className='btn text-warning'
                                            title="Copy Table"
                                            onClick={() => toast("Table Copied")}
                                        >
                                            <FaCopy />
                                        </button>
                                    </CopyToClipboard>
                                </div>
                                <div className='col-md-4'>
                                    <Link to={'/app/employee/addadmin'} className="btn btn-info add-btn text-white rounded-2">
                                        Create New Admin</Link>
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
                                responsive
                                expandableRowsComponent={ButtonRow}
                                paginationTotalRows={filteredData.length}



                            />






                        </div>






                    </div>

                </div>
            </div>

            <Offcanvas />
        </>

    );
}

export default AllAdmin;
