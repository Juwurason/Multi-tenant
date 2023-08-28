
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
import { GoEye, GoSearch, GoTrashcan } from 'react-icons/go';
import moment from 'moment';
import useHttp from '../../../hooks/useHttp';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import axiosInstance from '../../../store/axiosInstance';
import { fectchServiceProvider } from '../../../store/slices/ServiceProviderSlice';

const ServiceProvider = () => {
    
    const [editpro, setEditPro] = useState({})
    const [loading2, setLoading2] = useState(false);
    const { get, post } = useHttp();

    const dispatch = useDispatch();
    const id = JSON.parse(localStorage.getItem('user'));
 
     useEffect(() => {
         dispatch(fectchServiceProvider(id.companyId));
     }, [dispatch]);

     const loading = useSelector((state) => state.serviceProvider.isLoading);
     const serviceProvider = useSelector((state) => state.serviceProvider.data);
    const columns = [
        // {
        //     name: '#',
        //     cell: (row, index) => index + 1
        // },

        {
            name: 'FullName',
            selector: row => row.name,
            sortable: true,

        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,

        },
       
        {
            name: 'Phone',
            selector: row => row.phone,
            sortable: true,

        }


    ];



    useEffect(() => {
        if ($('.select').length > 0) {
            $('.select').select2({
                minimumResultsForSearch: -1,
                width: '100%'
            });
        }
        // handleEdit()
    },[]);

    const handleExcelDownload = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet1');

        // Add headers
        const headers = columns.map((column) => column.name);
        sheet.addRow(headers);

        // Add data
        serviceProvider.forEach((dataRow) => {
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
            link.download = 'serviceProvider.xlsx';
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };



    const handleCSVDownload = () => {
        const csvData = Papa.unparse(serviceProvider);
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "serviceProvider.csv");
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
        doc.text("serviceProvider Table", marginLeft, 40);
        const headers = columns.map((column) => column.name);
        const dataValues = serviceProvider.map((dataRow) =>
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
        doc.save("serviceProvider.pdf");
    };

    const handleDetails = (e) => {
        setLoading2(true);
        setTimeout(() => {
            const url = `/refferal-details/${e}`;
            window.open(url, '_blank');
            setLoading2(false);
        }, 2000);
    };

    const handleAccept = async (e) => {
        Swal.fire({
            html: `<h3>Accept This Referral</h3>`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#405189',
            cancelButtonColor: '#C8102E',
            confirmButtonText: 'Confirm',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await axiosInstance.get(`/ClientReferrals/accept_client_referral?id=${e}&userId=${id.userid}`,
                    )
                    if (data.status === 'Success') {
                        toast.success(data.message);
                        dispatch(fetchDocument(id.companyId));
                    } else {
                        toast.error("Error Accepting Document");
                    }


                } catch (error) {
                    toast.error("Ooooops😔 Error Occurred ")
                    console.log(error);



                }


            }
        })


    }

    const ButtonRow = ({ data }) => {
        return (
            <div className="p-2 d-flex gap-1 flex-column " style={{ fontSize: "12px" }}>
                <div ><span className='fw-bold'>Email: </span> {data.email}</div>
                <div ><span className='fw-bold'>Phone: </span> {data.phone}</div>

            </div>
        );
    };
    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = serviceProvider.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
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

    // const handleDelete = async (e) => {
    //     Swal.fire({
    //         html: `<h3>Are you sure? you want to delete Public Holiday "${e.name}"</h3>`,
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#405189',
    //         cancelButtonColor: '#777',
    //         confirmButtonText: 'Confirm Delete',
    //         showLoaderOnConfirm: true,
    //     }).then(async (result) => {
    //         if (result.isConfirmed) {
    //             try {
    //                 const { data } = await post(`/SetUp/delete_holiday/${e.holidayId}`,
    //                     // { userId: id.userId }
    //                 )
    //                 if (data.status === 'Success') {
    //                     toast.success(data.message);
    //                     FetchClient();
    //                 } else {
    //                     toast.error(data.message);
    //                 }


    //             } catch (error) {
    //                 console.log(error);
    //                 toast.error(error.response.data.message)
    //                 toast.error(error.response.data.title)

    //             }


    //         }
    //     })

    // }


    

    return (
        <div className="page-wrapper">
            <Helmet>
                <title>Referral</title>
                <meta name="description" content="Refferal" />
            </Helmet>
            {/* Page Content */}
            <div className="content container-fluid">
                {/* Page Header */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Referral</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Referral</li>
                            </ul>
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
                        <div className='col-md-8 d-flex  justify-content-center align-items-center gap-4'>
                            <CSVLink
                                data={serviceProvider}
                                filename={"serviceProvider.csv"}

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
                            <CopyToClipboard text={JSON.stringify(serviceProvider)}>
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
                        customStyles={customStyles}
                        responsive

                    />


                </div>
            </div>

        </div>
    );
}

export default ServiceProvider;
