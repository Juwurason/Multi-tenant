
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
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
import { SlSettings } from 'react-icons/sl'
import useHttp from '../../../hooks/useHttp';

const StaffProgressNote = () => {
    useEffect(() => {
        if ($('.select').length > 0) {
            $('.select').select2({
                minimumResultsForSearch: -1,
                width: '100%'
            });
        }
    });

    const { get, } = useHttp();
    const { loading, setLoading } = useCompanyContext();
    const [documentName, setDocumentName] = useState("")
    const [expire, setExpire] = useState("")
    const [document, setDocument] = useState("")
    const [staffPro, setStaffPro] = useState([]);
    const id = JSON.parse(localStorage.getItem('user'));

    const columns = [
        {
            name: 'Staff',
            selector: row => row.staff,
            sortable: true
        },
        {
            name: 'Client',
            selector: row => row.user,
            sortable: true,
            expandable: true,
            cell: (row) => (
                <Link href={`https://example.com/${row.userId}`} className="fw-bold text-dark">
                    {row.userRole}
                </Link>
            ),
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'DateCreated',
            selector: row => row.dateCreated,
            sortable: true
        },
        {
            name: 'DateModified',
            selector: row => row.dateModified,
            sortable: true
        }



    ];


    // const id = JSON.parse(localStorage.getItem('user'))
    const getStaffProfile = JSON.parse(localStorage.getItem('staffProfile'))

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const allowedExtensions = /(\.pdf|\.doc)$/i;

        if (allowedExtensions.exec(selectedFile.name)) {
            setDocument(selectedFile);
        } else {
            alert('Please select a PDF or DOC file');
        }
    };

    const handleExcelDownload = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet1');

        // Add headers
        const headers = columns.map((column) => column.name);
        sheet.addRow(headers);

        // Add data
        staffPro.forEach((dataRow) => {
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


   
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (documentName === "" || expire.length === 0 || document === "") {
            return toast.error("Input Fields cannot be empty")
        }

        const formData = new FormData()
        formData.append("CompanyId", id.companyId);
        formData.append("DocumentFile", document);
        formData.append("DocumentName", documentName);
        formData.append("ExpirationDate", expire);
        formData.append("User", id.fullName);
        formData.append("UserRole", id.role);
        formData.append("Status", "Pending");
        formData.append("UserId", getStaffProfile.staffId);

        try {
            setLoading(true)
            const { data } = await privateHttp.post(`/Staffs/document_upload?userId=${id.userId}`,
                formData

            )
            // console.log(data);
            toast.success(data.message)

            setLoading(false)

        } catch (error) {
            console.log(error);
            toast.error(error.message)
            setLoading(false);

        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setLoading(true)
        const getStaffProgressNote = async () => {
            try {
                const response = await privateHttp.get(`/ProgressNotes/${19}`, { cacheTimeout: 300000 })
                // setStaffPro(response.data)
                console.log(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
            finally{
                setLoading(false);
            }
        }
        getStaffProgressNote()
    }, [])
    
    const handlePDFDownload = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(13);
        doc.text("User Table", marginLeft, 40);
        const headers = columns.map((column) => column.name);
        const dataValues = staffPro.map((dataRow) =>
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
                {data.staff}

            </div>
        );
    };

    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = staffPro.filter((item) =>
        item.staff.includes(searchText.toLowerCase())
    );


    return (
        <>
            <div className="page-wrapper">
                <Helmet>
                    <title> Progress Note Report</title>
                    <meta name="description" content="Progress Note" />
                </Helmet>
                {/* Page Content */}
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row align-items-center">
                            <div className="col">
                                <h3 className="page-title">Progress Note Report</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/staff/staff/staffDashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item active">Progress Note Report</li>
                                </ul>
                            </div>
                            {/* <div className="col-auto float-end ml-auto">
                <a href="" className="btn add-btn" data-bs-toggle="modal" data-bs-target="#add_policy"><i className="fa fa-plus" /> Add New Document</a>
              </div> */}
                        </div>
                    </div>

                    <div className='mt-4 border'>
                        <div className="d-flex p-2 justify-content-between align-items-center gap-4">

                            <div className='d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                                <input type="text" placeholder="Search..." className='border-0 outline-none' onChange={handleSearch} />
                                <GoSearch />
                            </div>
                            <div className='d-flex  justify-content-center align-items-center gap-4'>
                                <CSVLink
                                    data={staffPro}
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
                                <CopyToClipboard text={JSON.stringify(staffPro)}>
                                    <button

                                        className='btn text-warning'
                                        title="Copy Table"
                                        onClick={() => toast("Table Copied")}
                                    >
                                        <FaCopy />
                                    </button>
                                </CopyToClipboard>
                            </div>
                            {/* <div>
                                    <Link to={'/app/employee/addadmin'} className="btn add-btn rounded-2">
                                        Create New Admin</Link>
                                </div> */}
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



                        />


                    </div>

                </div>


            </div>
            <Offcanvas />
        </>

    );

}

export default StaffProgressNote;
