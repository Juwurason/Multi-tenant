
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import { FaCopy, FaFileCsv, FaFileExcel, FaFilePdf, } from "react-icons/fa";
import ExcelJS from 'exceljs';
import { toast } from 'react-toastify';
import { GoSearch, GoTrashcan } from 'react-icons/go';
import Swal from 'sweetalert2';
import { useCompanyContext } from '../../../context';
import useHttp from '../../../hooks/useHttp';
import { Modal } from 'react-bootstrap';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplate } from '../../../store/slices/FormTemplateSlice';


const FormType = () => {
    const id = JSON.parse(localStorage.getItem('user'));
    const [showModal, setShowModal] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const { get, post } = useHttp();
    const dispatch = useDispatch();

    // Fetch user data and update the state
    useEffect(() => {
        dispatch(fetchTemplate(id.companyId));
    }, [dispatch]);

    // Access the entire state
    const loading = useSelector((state) => state.template.isLoading);
    const template = useSelector((state) => state.template.data);
    console.log(template);
    const columns = [

        {
            name: 'Template Name',
            selector: row => row.templateName,
            sortable: true,

        },
        {
            name: 'Template Type',
            selector: row => row.templateType,
            sortable: true,

        },


        {
            name: 'Is Employment Form',
            selector: row => row.isEmploymentForm,
            sortable: true,
            cell: row => (
                <input type="checkbox" checked={row.isEmploymentForm} readOnly />
            )
        },
        {
            name: 'Is General',
            selector: row => row.isGeneral,
            sortable: true,
            cell: row => (
                <input type="checkbox" checked={row.isGeneral} readOnly />
            )
        },
        {
            name: 'Is Incident Form',
            selector: row => row.isIncidentForm,
            sortable: true,
            cell: row => (
                <input type="checkbox" checked={row.isIncidentForm} readOnly />
            )
        },
        // {
        //     name: 'Is Care Plan',
        //     selector: row => row.isCarePlan,
        //     sortable: true,
        //     cell: row => (
        //         <input type="checkbox" checked={row.isCarePlan} readOnly />
        //     )
        // },


    ];






    const handleExcelDownload = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet1');

        // Add headers
        const headers = columns.map((column) => column.name);
        sheet.addRow(headers);

        // Add data
        template.forEach((dataRow) => {
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
            link.download = 'template.xlsx';
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };



    const handleCSVDownload = () => {
        const csvData = Papa.unparse(template);
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "template.csv");
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
        doc.text("template Table", marginLeft, 40);
        const headers = columns.map((column) => column.name);
        const dataValues = template.map((dataRow) =>
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
        doc.save("template.pdf");
    };
    const handleView = (templateUrl) => {
        window.open(templateUrl, '_blank');
    };
    const handleDetails = (e) => {
        setLoading2(true);
        setTimeout(() => {
            const url = `/form-details/${e}`;
            window.open(url, '_blank');
            setLoading2(false);
        }, 2000);
    };

    const ButtonRow = ({ data }) => {
        return (
            <div className="p-2 d-flex flex-column gap-2" style={{ fontSize: "12px" }}>
                <span>
                    <span className='fw-bold'>Template Name: </span>
                    <span> {data.templateName}</span>
                </span>

                <span>
                    <span className='fw-bold'>Date Created: </span>
                    <span>
                        {dayjs(data.dateCreated).format('DD/MM/YYYY HH:mm:ss')}
                    </span>
                </span>
                <span>
                    <span className='fw-bold'>Date Modified: </span>
                    <span>
                        {dayjs(data.dateModified).format('DD/MM/YYYY HH:mm:ss')}
                    </span>
                </span>
                <div>
                    <span className='fw-bold'>Actions: </span>
                    {
                        data.templateType === "Editable" ? <button className="btn text-primary" style={{ fontSize: "12px" }}>
                            Edit
                        </button> : ""
                    } |
                    {
                        data.templateUrl ?
                            <button className="btn text-secondary" style={{ fontSize: "12px" }}
                                onClick={() => handleView(data.templateUrl)}>

                                View
                            </button> :


                            <button className="btn text-secondary" style={{ fontSize: "12px" }}
                                onClick={() => handleDetails(data.templateId)}
                            >
                                {
                                    loading2 ?
                                        <>
                                            <span className="spinner-border text-white spinner-border-sm me-2" aria-hidden="true" />
                                            Please wait...
                                        </>
                                        :
                                        "View"

                                }
                            </button>
                    }
                    |
                    <button className="btn text-danger fw-bold" style={{ fontSize: "12px" }}
                        onClick={() => handleDelete(data.templateId)}
                    >

                        Delete
                    </button>
                </div>

            </div >
        );
    };
    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = template.filter((item) =>
        item.templateName.toLowerCase().includes(searchText.toLowerCase())
    );
    const customStyles = {

        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
            },
        },
    };

    const handleDelete = async (e) => {
        Swal.fire({
            html: `<h3>Are you sure? you want to delete this template</h3>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#405189',
            cancelButtonColor: '#777',
            confirmButtonText: 'Confirm Delete',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await post(`/Templates/delete/${e}`,

                    )
                    if (data.status === 'Success') {
                        toast.success(data.message);
                        dispatch(fetchTemplate(id.companyId));
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





    return (
        <div className="page-wrapper">
            <Helmet>
                <title>Form Templates</title>
                <meta name="description" content="Support Type" />
            </Helmet>
            {/* Page Content */}
            <div className="content container-fluid">
                {/* Page Header */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Form Templates</h3>
                            {id.role === "CompanyAdmin" ? <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Form Template</li>
                            </ul> : ""}
                        </div>
                    </div>
                </div>

                {/* Search Filter */}

                <div className='mt-4 border'>
                    <div className="row px-2 py-3">

                        <div className="col-md-3">
                            <div className='d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                                <input type="text" placeholder="Search..." className='border-0 outline-none' onChange={handleSearch} />
                                <GoSearch />
                            </div>
                        </div>
                        <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
                            <CSVLink
                                data={template}
                                filename={"template.csv"}

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
                            <CopyToClipboard text={JSON.stringify(template)}>
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
                            {/* <Link to="/administrator/createClient" className="btn btn-info add-btn rounded-2">
                Add New Holiday</Link> */}
                            <Link
                                to={"/app/setup/create-template"}
                                className="btn btn-info add-btn rounded-2 text-white">Add New Template</Link>
                        </div>
                    </div>
                    <DataTable data={filteredData} columns={columns}
                        pagination
                        highlightOnHover
                        searchable
                        searchTerm={searchText}
                        progressPending={loading}
                        progressComponent={<div className='text-center fs-1'>
                            <div className="spinner-grow text-secondary">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>}
                        expandableRows
                        expandableRowsComponent={ButtonRow}
                        paginationTotalRows={filteredData.length}
                        customStyles={customStyles}
                        responsive

                    />


                    {/*Edit Modal */}


                </div>


                {/* </div> */}


            </div>

        </div>
    );
}

export default FormType;
