import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import Editemployee from "../../../_components/modelbox/Editemployee"
import Addemployee from "../../../_components/modelbox/Addemployee"
import Header from '../../../initialpage/Sidebar/header'
import Sidebar from '../../../initialpage/Sidebar/sidebar';
import Offcanvas from '../../../Entryfile/offcanvance';
import moment from 'moment';
import { FaArrowCircleLeft, FaArrowCircleRight, FaCheck, FaDownload, FaEye, FaFileCsv, FaFileExcel, FaFileExport, FaFilePdf, FaSearch, FaTrash } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import '../../../assets/css/table2.css'
import useHttp from '../../../hooks/useHttp';
import { useCompanyContext } from '../../../context';
const Document = () => {
    const id = JSON.parse(localStorage.getItem('user'));
    const { loading, setLoading } = useCompanyContext();
    const [document, setDocument] = useState([]);
    const [staff, setStaff] = useState([]);
    const [clients, setClients] = useState([]);
    const privateHttp = useHttp();

    const FetchDocument = async () => {
        try {
            const documentResponse = await privateHttp.get(`Documents/get_all_documents?companyId=${id.companyId}`, { cacheTimeout: 300000 });
            const document = documentResponse.data;
            setDocument(document);
        } catch (error) {
            console.log(error);
        }
        try {
            const staffResponse = await privateHttp.get(`Staffs?companyId=${id.companyId}`, { cacheTimeout: 300000 });
            const staff = staffResponse.data;
            setStaff(staff);
            setLoading(false)
        } catch (error) {
            console.log(error);
        }

        try {
            const clientResponse = await privateHttp.get(`/Profiles?companyId=${id.companyId}`, { cacheTimeout: 300000 });
            const client = clientResponse.data;
            setClients(client);
            setLoading(false)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }

    };
    useEffect(() => {
        FetchDocument()
    }, []);

    const [menu, setMenu] = useState(false)
    const downloadLinkRef = useRef(null);
    const [pageNumber, setPageNumber] = useState(0);


    const itemsPerPage = 10;
    const pageCount = Math.ceil(document.length / itemsPerPage);
    const displayData = document.slice(
        pageNumber * itemsPerPage,
        (pageNumber + 1) * itemsPerPage

    );

    const handleView = (documentUrl) => {
        window.open(documentUrl, '_blank');
    };

    const handleDownload = (documentUrl, documentName) => {
        downloadLinkRef.current.href = documentUrl;
        downloadLinkRef.current.download = documentName;
        downloadLinkRef.current.click();
    };


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
                        <title>Document</title>
                        <meta name="description" content="Document Upload" />
                    </Helmet>
                    {/* Page Content */}
                    <div className="content container-fluid">
                        {/* Page Header */}
                        <div className="page-header">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h3 className="page-title">Document</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                        <li className="breadcrumb-item active">Documents</li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                        {/* /Page Header */}

                        {/* Search Filter */}


                        <div className="row">
                            <div className="col-sm-4">
                                <div className="form-group">
                                    <label className="col-form-label">Staff Name</label>
                                    <div>
                                        <select className="form-select">
                                            <option defaultValue hidden>--Select a staff--</option>
                                            {
                                                staff.map((data, index) =>
                                                    <option value={data.staffId} key={index}>{data.fullName}</option>)
                                            }
                                        </select></div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="form-group">
                                    <label className="col-form-label">Client Name</label>
                                    <div>
                                        <select className="form-select">
                                            <option defaultValue hidden>--Select a Client--</option>
                                            {
                                                clients.map((data, index) =>
                                                    <option value={data.staffId} key={index}>{data.fullName}</option>)
                                            }
                                        </select>
                                    </div>
                                </div>

                            </div>
                            <div className="col-sm-4">
                                <div className="form-group">
                                    <label className="col-form-label">Date From</label>
                                    <div><input className="form-control datetimepicker" type="datetime-local" /></div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="form-group">
                                    <label className="col-form-label">Date To</label>
                                    <div><input className="form-control datetimepicker" type="datetime-local" /></div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="form-group">
                                    <label className="col-form-label">Status</label>
                                    <div>
                                        <select className="form-select">
                                            <option defaultValue hidden>--Select a Status...</option>
                                            <option value="">Accepted</option>
                                            <option value="">Rejected</option>
                                            <option value="">Pending</option>

                                        </select>
                                    </div>
                                </div>

                            </div>
                            <div className="col-sm-4">
                                <div className="form-group">
                                    <label className="col-form-label">User Role</label>
                                    <div>
                                        <select className="form-select">
                                            <option defaultValue hidden>--Select Role--</option>
                                            <option value="">Staff</option>
                                            <option value="">Client</option>

                                        </select>
                                    </div>
                                </div>

                            </div>
                            <div className="col-sm-4">
                                <div className="form-group">
                                    <button className="btn btn-primary submit-btn">Load</button>

                                </div>

                            </div>

                        </div>

                        {/* <div className="submit-section">
                        </div> */}


                        {/* /Search Filter */}


                        <main className="table">
                            <section className="table__header">
                                {/* <h1>Customer's Orders</h1> */}
                                <div className="input-group">
                                    <input type="search" className='form-control' placeholder="Search Data..." />
                                    <FaSearch className='text-dark' />
                                </div>
                                <div className="export__file">
                                    <label htmlFor="export-file" className="export__file-btn d-flex justify-content-center align-items-center" title="Export File" >
                                        <FaFileExport className='text-white fs-3' /></label>
                                    <input type="checkbox" id="export-file" />
                                    <div className="export__file-options ">
                                        <label>Export As &nbsp; ➜</label>
                                        <label htmlFor="export-file" id="toPDF">PDF <FaFilePdf className='text-danger' /></label>
                                        <label htmlFor="export-file" id="toCSV">CSV <FaFileCsv className='text-info' /></label>
                                        <label htmlFor="export-file" id="toEXCEL">EXCEL <FaFileExcel className='text-warning' /></label>
                                    </div>
                                </div>
                            </section>
                            <section className="table__body">
                                <table>
                                    <thead className='text-white' style={{ backgroundColor: "#18225C" }}>
                                        <tr style={{ backgroundColor: "#18225C" }}>
                                            <th>#</th>
                                            <th>User</th>
                                            <th>Role</th>
                                            <th>Document</th>
                                            <th>Expiration Date</th>
                                            <th>Status</th>
                                            <th>Date Created</th>
                                            <th>Date Modified</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            displayData.map((data, index) =>
                                                <tr key={index}>
                                                    <td>{data.documentId}</td>
                                                    <td>{data.user}</td>
                                                    <td>{data.userRole}</td>
                                                    <td className='fw-bold'>
                                                        {data.documentName}

                                                    </td>
                                                    <td>{moment(data.expirationDate).format('ll')}</td>
                                                    <td><span className='bg-warning px-2 py-1 rounded-pill fw-bold'>{data.status}</span></td>
                                                    <td>{moment(data.dateCreated).format('lll')}</td>
                                                    <td>{moment(data.dateModified).format('lll')}</td>
                                                    <td>
                                                        <span className='d-flex gap-2'>
                                                            <button className='btn text-primary btn-sm'
                                                                title='View'
                                                                onClick={() => handleView(data.documentUrl)}
                                                            >

                                                                <FaEye />
                                                            </button>
                                                            <button className='btn text-info btn-sm'
                                                                title='Download'
                                                                onClick={() => handleDownload(data.documentUrl, data.documentName)}
                                                            >
                                                                <FaDownload />
                                                            </button>
                                                            <a ref={downloadLinkRef} style={{ display: 'none' }} />
                                                            <button className='btn text-success btn-sm'
                                                                title='Accept'
                                                                onClick={() => handleView(data.documentUrl)}
                                                            >

                                                                <FaCheck />
                                                            </button>
                                                            <button className='btn text-danger btn-sm'
                                                                title='Delete'
                                                                onClick={() => handleDownload(data.documentUrl, data.documentName)}
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </span>

                                                    </td>
                                                </tr>
                                            )
                                        }




                                    </tbody>
                                </table>
                                <div className="clearfix">
                                    <div className="hint-text">Showing <b>{itemsPerPage}</b> out of <b>{document.length}</b> entries</div>

                                    <ReactPaginate
                                        pageCount={pageCount}
                                        onPageChange={page => setPageNumber(page.selected)}
                                        activeClassName={'items actives'}
                                        breakClassName={'items break-me '}
                                        breakLabel={'...'}
                                        containerClassName={'pagination'}
                                        disabledClassName={'disabled-page'}
                                        marginPagesDisplayed={2}
                                        nextClassName={"items next "}
                                        nextLabel={< FaArrowCircleRight style={{ fontSize: 18, width: 150 }} />}
                                        pageClassName={'items pagination-page '}
                                        pageRangeDisplayed={2}
                                        previousClassName={"items previous"}
                                        previousLabel={<FaArrowCircleLeft style={{ fontSize: 18, width: 150 }} />}
                                    />
                                </div>
                            </section>
                        </main>






                    </div>
                    {/* /Page Content */}
                    {/* Add Employee Modal */}
                    <Addemployee />
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

export default Document;