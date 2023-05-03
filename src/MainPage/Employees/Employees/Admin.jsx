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
import moment from "moment";
import {
    Avatar_02
} from "../../../Entryfile/imagepath"
import Addemployee from "../../../_components/modelbox/Addemployee"
import Editemployee from "../../../_components/modelbox/Editemployee"
import Sidebar from '../../../initialpage/Sidebar/sidebar';;
import Header from '../../../initialpage/Sidebar/header'
import Offcanvas from '../../../Entryfile/offcanvance';
import { toast } from 'react-toastify';
import useHttp from '../../../hooks/useHttp';
import AddAdmin from '../../../_components/modelbox/AddAdmin';
import { useCompanyContext } from '../../../context';
import { FaEllipsisV } from 'react-icons/fa';

const AllAdmin = () => {
    const { get } = useHttp();
    const { loading, setLoading } = useCompanyContext();
    const id = JSON.parse(localStorage.getItem('user'));
    const [admin, setAdmin] = useState([]);

    const columns = [

        {
            name: 'ID',
            selector: row => row.id,
            sortable: true
        },
        {
            name: 'Full Name',
            selector: row => row.fullName,
            sortable: true,
            expandable: true,
            cell: (row) => (
                <a href={`https://example.com/${row.id}`} className="font-bold text-brand-600">
                    {row.fullName}
                </a>
            ),
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true
        },
        {
            name: 'Address',
            selector: row => row.address,
            sortable: true,
            // cell: row => {
            //     return (
            //         <span> {!row.createdDate ? "Not Modified" : moment(row.createdDate).format('LLL')}</span>
            //     )
            // },
        },


        // {
        //     name: "Actions",
        //     cell: (row) => (
        //         <div className="d-flex gap-2">
        //             <button
        //                 onClick={() => {
        //                     // handle action here, e.g. open a modal or navigate to a new page
        //                     alert(`Action button clicked for row with ID ${row.fullName}`);
        //                 }}
        //             >
        //                 <FaTrash />
        //             </button>
        //             <button
        //                 onClick={() => {
        //                     // handle action here, e.g. open a modal or navigate to a new page
        //                     alert(`Action button clicked to edit with ID ${row.fullName}`);
        //                 }}
        //             >
        //                 <FaEdit className="text-info" />
        //             </button>
        //         </div>
        //     ),
        // },

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
        try {
            setLoading(true)
            const { data } = await privateHttp.post(`/Staffs/delete/${e}?userId=${id.userId}`,
                { userId: id.userId }
            )
            if (data.status === 'Success') {
                toast.success(data.message);
                FetchStaff()
            } else {
                toast.error(data.message);
            }

            setLoading(false)

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
            setLoading(false);

        }
        finally {
            setLoading(false)
        }
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
        doc.setFontSize(15);
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
        doc.save("data.pdf");
    };

    const ButtonRow = ({ data }) => {
        return (
            <div className="p-4">
                {data.fullName}

            </div>
        );
    };

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
                    {/* Page Content */}
                    <div className="content container-fluid">
                        {/* Page Header */}
                        <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h3 className="page-title">Admin</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                        <li className="breadcrumb-item active">Admin</li>
                                    </ul>
                                </div>
                                <div className="col-auto float-end ml-auto">
                                    <Link to={'/app/employee/addadmin'} className="btn add-btn"><i className="fa fa-plus" />
                                        Create New Admin</Link>
                                    <div className="view-icons">
                                        <Link to="/app/employee/AllAdmin" className="grid-view btn btn-link active"><i className="fa fa-th" /></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* /Page Header */}
                        {/* Search Filter */}
                        <div className="row filter-row">
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
                        </div>
                        {/* Search Filter */}



                        <>
                            <div className="d-flex mt-4 border-2 py-4 justify-content-center gap-4">
                                <CSVLink
                                    data={admin}
                                    filename={"data.csv"}
                                >
                                    <FaFileCsv />
                                </CSVLink>
                                <button

                                    onClick={handlePDFDownload}
                                >
                                    <FaFilePdf />
                                </button>
                                <button

                                    onClick={handleExcelDownload}
                                >
                                    <FaFileExcel />
                                </button>
                                <CopyToClipboard text={JSON.stringify(admin)}>
                                    <button >
                                        <FaCopy />
                                    </button>
                                </CopyToClipboard>
                            </div>
                            <DataTable data={admin} columns={columns}
                                pagination
                                highlightOnHover
                                expandableRows
                                expandableRowsComponent={ButtonRow}


                                className="bg-dark"
                            />


                        </>







                    </div>
                    {/* /Page Content */}
                    {/* Add Employee Modal */}
                    <AddAdmin />
                    {/* /Add Employee Modal */}
                    {/* Edit Employee Modal */}
                    <Editemployee />
                    {/* /Edit Employee Modal */}
                    {/* Delete Employee Modal */}

                    {/* /Delete Employee Modal */}
                </div>
            </div>

            <Offcanvas />
        </>

    );
}

export default AllAdmin;
