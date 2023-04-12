import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import Editemployee from "../../../_components/modelbox/Editemployee"
import Addemployee from "../../../_components/modelbox/Addemployee"
import Header from '../../../initialpage/Sidebar/header'
import Sidebar from '../../../initialpage/Sidebar/sidebar';
import Offcanvas from '../../../Entryfile/offcanvance';
import { useCompanyContext } from '../../../context';
import moment from 'moment';
import { FaArrowCircleLeft, FaArrowCircleRight, FaCheckSquare, FaDownload, FaEye, FaTrash } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';

const Document = () => {
    const { staff, clients, document, FetchStaff } = useCompanyContext();
    const [menu, setMenu] = useState(false)
    const downloadLinkRef = useRef(null);
    const [pageNumber, setPageNumber] = useState(0);

    // useEffect(() => {
    //     FetchStaff()

    // }, [])

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


                        <div className="">
                            <div className="table-responsive">
                                <div className="table-title bg-primary ">
                                    <div className="row mt-4">
                                        <div className="col-sm-5">

                                        </div>
                                        <div className="col-sm-7">
                                            <a href="#" className="btn btn-secondary"><i className="material-icons"></i> <span>Download PDF</span></a>
                                            <a href="#" className="btn btn-secondary"><i className="material-icons"></i> <span>Export to Excel</span></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-wrapper">

                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
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
                                                        <td className='d-flex flex-column'>
                                                            <span>{data.documentName}</span>
                                                            <span className='d-flex gap-2'>
                                                                <button className='btn text-success btn-sm'
                                                                    onClick={() => handleView(data.documentUrl)}
                                                                >

                                                                    <FaEye />
                                                                </button>
                                                                <button className='btn text-info btn-sm'
                                                                    onClick={() => handleDownload(data.documentUrl, data.documentName)}
                                                                >
                                                                    <FaDownload />
                                                                </button>
                                                                <a ref={downloadLinkRef} style={{ display: 'none' }} />
                                                            </span>
                                                        </td>
                                                        <td>{moment(data.expirationDate).format('ll')}</td>
                                                        <td>{data.status}</td>
                                                        <td>{moment(data.dateCreated).format('lll')}</td>
                                                        <td>{moment(data.dateModified).format('lll')}</td>
                                                        <td className='d-flex justify-content-center align-items-center gap-2 h-100'>
                                                            <Link className="btn bg-success text-white fw-normal p-1" title="Approve" data-toggle="tooltip">
                                                                Accepted
                                                            </Link>
                                                            <Link className="btn bg-danger text-white p-1 fw-normal" title="Rejected " data-toggle="tooltip">
                                                                Rejected
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                )
                                            }



                                        </tbody>
                                    </table>
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
                            </div>
                        </div>


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