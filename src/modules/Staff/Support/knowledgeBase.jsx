
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { CopyToClipboard } from "react-copy-to-clipboard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from 'papaparse';
import { FaCopy, FaFileCsv, FaFileExcel, FaFilePdf, FaEye } from "react-icons/fa";
import ExcelJS from 'exceljs';
import { toast } from 'react-toastify';
import { GoEye, GoSearch, GoTrashcan } from 'react-icons/go';

import dayjs from 'dayjs';
import useHttp from '../../../hooks/useHttp';
import { useCompanyContext } from '../../../context';


const KnowledgeBase = () => {
    const { loading, setLoading } = useCompanyContext()
    const [getHoli, setGetHoli] = useState([]);
    const { get, post } = useHttp();

    const columns = [
        
        {
            name: 'Subject',
            selector: row => row.subject,
            sortable: false,
            expandable: true,
            cell: (row) => (
                <div className='d-flex flex-column gap-1 p-2' style={{ overflow: 'hidden' }}>
                    <span

                        data-bs-toggle="tooltip" data-bs-placement="top" title={`${row.subject}`}
                    > {row.subject}</span>

                    <span className='d-flex'>
                        <Link to={`/staff/staff/knowledge-video/${row.knowledgeBaseId}`} className='bg-primary text-white pointer px-2 py-1 rounded d-flex justify-content-center align-items-center'
                            title='View'

                            // onClick={() => handleView(row.description)}
                        >

                            <FaEye />
                        </Link>

                        <a ref={downloadLinkRef} style={{ display: 'none' }} />
                    </span>
                </div>
            ),
        },
        {
            name: 'Vote',
            selector: row => row.vote,
            sortable: true,
        },
        {
            name: 'Date Created',
            selector: row => dayjs(row.dateCreated).format('DD-MM-YYYY'),
            sortable: true
        },

    ];

    const downloadLinkRef = useRef(null);


    const handleView = (description) => {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.open();
          newWindow.document.write(description);
          newWindow.document.close();
        }
      };

    const handleDownload = (description, documentName) => {
        downloadLinkRef.current.href = description;
        downloadLinkRef.current.download = documentName;
        downloadLinkRef.current.click();
    };




    const FetchClient = async () => {
        setLoading(true)
        try {
            const { data } = await get(`/Tickets/get_knowledgebase`, { cacheTimeout: 300000 });
            // console.log(data);
              setGetHoli(data);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        } finally {
            setLoading(false)
        }

    };
    useEffect(() => {
        FetchClient()
    }, []);


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
        getHoli.forEach((dataRow) => {
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
            link.download = 'getHoli.xlsx';
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };



    const handleCSVDownload = () => {
        const csvData = Papa.unparse(getHoli);
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "getHoli.csv");
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
        doc.text("getHoli Table", marginLeft, 40);
        const headers = columns.map((column) => column.name);
        const dataValues = getHoli.map((dataRow) =>
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
        doc.save("getHoli.pdf");
    };

    const ButtonRow = ({ data }) => {
        return (
            <div className="p-2 d-flex gap-1 flex-column " style={{ fontSize: "12px" }}>
              <div><span className='fw-bold'>Subject: </span>{data.subject} </div>
              <div ><span className='fw-bold'>Date Created: </span> {dayjs(data.dateCreated).format('DD-MM-YYYY')}</div>
              <div>
                <Link to={`/staff/staff/knowledge-details/${data.knowledgeBaseId}`}
                  className="btn text-secondary fw-bold" style={{ fontSize: "12px" }}>
                  Details
                </Link>
              </div>
      
            </div>
          );
    };
    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredData = getHoli.filter((item) =>
        item.subject.toLowerCase().includes(searchText.toLowerCase())
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


    return (
        <div className="page-wrapper">
            <Helmet>
                <title>Knowledge Base</title>
                <meta name="description" content="Knowledge Base" />
            </Helmet>
            {/* Page Content */}
            <div className="content container-fluid">
                {/* Page Header */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Knowledge Base</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/staff/staff/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Knowledge Base</li>
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
                                data={getHoli}
                                filename={"getHoli.csv"}

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
                            <CopyToClipboard text={JSON.stringify(getHoli)}>
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

                    {/* Modal */}
                

                </div>


                {/* </div> */}


            </div>

        </div>
    );
}

export default KnowledgeBase;
