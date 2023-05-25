
import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import Header from '../../../initialpage/Sidebar/header'
import Sidebar from '../../../initialpage/Sidebar/sidebar';
import Offcanvas from '../../../Entryfile/offcanvance';
import useHttp from '../../../hooks/useHttp';
import { toast } from 'react-toastify';
import { FaCopy, FaDharmachakra, FaEdit, FaFileCsv, FaFileExcel, FaFileExport, FaFilePdf, FaSearch, FaTrash } from 'react-icons/fa';
import { GoSearch, GoTrashcan } from 'react-icons/go';
import { SlSettings } from 'react-icons/sl'
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



const AllUser = () => {
    const { get, post } = useHttp()
    const [menu, setMenu] = useState(false)
    const [users, setUsers] = useState([]);
    const { loading, setLoading } = useCompanyContext();
    const id = JSON.parse(localStorage.getItem('user'));







    const columns = [


        {
            name: '',
            cell: (row) => (
                <span className='w-100 d-flex justify-content-center'>
                    <small className='py-1 px-2 rounded bg-warning d-flex justify-content-center align-items-center'>
                        <FaDharmachakra className='text-white' />
                    </small>

                </span>
            ),
        },
        {
            name: 'Full Name',
            selector: row => row.fullName,
            sortable: true,
            expandable: true,
            cell: (row) => (
                <Link href={`https://example.com/${row.id}`} className="fw-bold text-dark">
                    {row.fullName}
                </Link>
            ),
        },


        {
            name: 'Role',
            selector: row => row.role,
            sortable: true
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="d-flex gap-1">
                    <Link
                        className='btn'
                        title='Edit'
                        to={`/app/account/edituser/${row.id}`}
                    >
                        <SlSettings />
                    </Link>
                    <button
                        className='btn'
                        title='Delete'
                        onClick={() => handleDelete(row.id)}
                    >
                        <GoTrashcan />
                    </button>

                </div>
            ),
        },




    ];

    const FetchStaff = async () => {
        try {
            setLoading(true);
            const UserResponse = await get(`/Account/get_all_users?companyId=${id.companyId}`, { cacheTimeout: 300000 });
            const users = UserResponse.data;
            setUsers(users);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)

        } finally {
            setLoading(false)

        }
    };
    useEffect(() => {

        FetchStaff()
    }, []);

    const handleDelete = async (e) => {

        Swal.fire({
            html: `<h3>Are you sure? you want to delete this user</h3>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#00AEEF',
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

    const handleExcelDownload = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet1');

        // Add headers
        const headers = columns.map((column) => column.name);
        sheet.addRow(headers);

        // Add data
        users.forEach((dataRow) => {
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
        const csvData = Papa.unparse(users);
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
        const dataValues = users.map((dataRow) =>
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
        doc.save("Users.pdf");
    };


    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = users.filter((item) =>
        item.fullName.toLowerCase().includes(searchText.toLowerCase())
    );




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


    return (
        <>
            <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>

                <Header onMenuClick={(value) => toggleMobileMenu()} />
                <Sidebar />
                <div className="page-wrapper">
                    <Helmet>
                        <title>All User</title>
                        <meta name="description" content="All user" />
                    </Helmet>
                    {/* Page Content */}
                    <div className="content container-fluid">
                        {/* Page Header */}
                        <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h3 className="page-title">Users List</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                        <li className="breadcrumb-item active">users</li>
                                    </ul>
                                </div>
                                <div className="col-auto float-end ml-auto">

                                </div>
                            </div>
                        </div>


                        <div className='mt-4 border'>
                            <div className="row px-2 py-3">

                                <div className='col-md-3'>
                                    <div className=' d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                                        <input type="text" placeholder="Search Users" className='border-0 outline-none' onChange={handleSearch} />
                                        <GoSearch />
                                    </div>
                                </div>
                                <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
                                    <CSVLink
                                        data={users}
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
                                    <CopyToClipboard text={JSON.stringify(users)}>
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
                                    <button className='btn add-btn btn-info text-white rounded-2'>Add New User</button>
                                </div>
                            </div>


                            <DataTable data={filteredData} columns={columns}
                                pagination
                                highlightOnHover
                                searchable
                                responsive
                                searchTerm={searchText}
                                progressPending={loading}
                                progressComponent={<div className='text-center fs-1'>
                                    <div className="spinner-grow text-secondary" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>}
                            />
                        </div>

                    </div>
                    {/* /Page Content */}




                </div>
            </div>
            <EditUser />
            <Offcanvas />
        </>


    );
}

export default AllUser;
