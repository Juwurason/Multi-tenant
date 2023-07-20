import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import { FaCopy, FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaRegEdit, FaTrash } from "react-icons/fa";
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
import { useSelector } from 'react-redux';
import { fetchAdmin } from '../../../store/slices/AdminSlice';
import { useDispatch } from 'react-redux';

const AllAdmin = () => {
    const dispatch = useDispatch();

    // Fetch admin data and update the state
    useEffect(() => {
        dispatch(fetchAdmin(id.companyId));
    }, [dispatch]);

    // Access the entire state
    const loading = useSelector((state) => state.admin.isLoading);
    const admin = useSelector((state) => state.admin.data);



    const id = JSON.parse(localStorage.getItem('user'));
    const claims = JSON.parse(localStorage.getItem('claims'));
    const hasRequiredClaims = (claimType) => {
        return claims.some(claim => claim.value === claimType);
    };
    const privateHttp = useHttp();


    const columns = [

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
                    {id.role === "CompanyAdmin" || hasRequiredClaims("Edit Administrator") ? <Link
                        className='btn'
                        title='Edit'
                        to={`/app/profile/admin-profile/${row.administratorId}/${row.firstName}`}
                    >
                        <FaRegEdit />
                    </Link> : ""}
                    {id.role === "CompanyAdmin" || hasRequiredClaims("Delete Administrator") ? <button
                        className='btn'
                        title='Delete'
                        onClick={() => {
                            // handle action here, e.g. open a modal or navigate to a new page
                            handleDelete(row.administratorId)
                        }}
                    >
                        <GoTrashcan />
                    </button> : ""}

                </div>
            ),
        },



    ];




    const handleDelete = async (e) => {
        Swal.fire({
            html: `<h3>Are you sure? you want to delete this Administrator</h3>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#405189',
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
                        dispatch(fetchAdmin(id.companyId));
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
            <div className="p-2 d-flex flex-column gap-1" style={{ fontSize: "12px" }}>
                <div ><span className='fw-bold'>Full Name: </span> {data.fullName}</div>
                <div><span className='fw-bold'>Email: </span> {data.email}</div>
            </div>
        );
    };
    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = admin.filter((item) =>
        item.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>

            <div className="page-wrapper">
                <Helmet>
                    <title>Admin</title>
                    <meta name="description" content="Login page" />
                </Helmet>

                <div className="content container-fluid">
                    {id.role === "CompanyAdmin" ?
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
                        </div> : ""}

                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">

                                <div className="card-body">
                                    <form  >
                                        <div className="row align-items-center py-2">
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label className="col-form-label">Select Admin</label>
                                                    <div>
                                                        <select className="form-select" >
                                                            <option defaultValue hidden>--Select Admin--</option>

                                                            {
                                                                admin.map((data, index) =>
                                                                    <option value={data.administratorId} key={index}>{data.fullName}</option>)
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label className="col-form-label">Registration Date From</label>
                                                    <input className="form-control" type="datetime-local"

                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label className="col-form-label">Registration Date To</label>
                                                    <input className="form-control" type="datetime-local"

                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label className="col-form-label">Select Status</label>
                                                    <div>
                                                        <select className="form-select">
                                                            <option defaultValue hidden>--Select Status--</option>
                                                            <option value="0">InActive</option>
                                                            <option value="1">Active</option>

                                                        </select>
                                                    </div>
                                                </div>
                                            </div>



                                            <div className="col-auto mt-3">
                                                <div className="form-group">
                                                    <button className="btn btn-info rounded-2 add-btn text-white" type='submit'

                                                    >
                                                        Load

                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>





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
                                {id.role === "CompanyAdmin" || hasRequiredClaims("Add Administrator") ? <Link to={'/app/employee/addadmin'} className="btn btn-info add-btn text-white rounded-2">
                                    Create New Admin</Link> : ""}
                            </div>
                        </div>
                        <DataTable data={filteredData} columns={columns}
                            pagination
                            highlightOnHover
                            searchable
                            searchTerm={searchText}


                            expandableRows
                            responsive
                            expandableRowsComponent={ButtonRow}
                            paginationTotalRows={filteredData.length}



                        />






                    </div>






                </div>

            </div>

            <Offcanvas />
        </>

    );
}

export default AllAdmin;
