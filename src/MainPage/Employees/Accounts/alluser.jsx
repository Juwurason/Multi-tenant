
import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import "../../antdstyle.css"
import '../../../assets/css/table.css'
import Editemployee from "../../../_components/modelbox/Editemployee"
import Addemployee from "../../../_components/modelbox/Addemployee"
import Header from '../../../initialpage/Sidebar/header'
import Sidebar from '../../../initialpage/Sidebar/sidebar';
import Offcanvas from '../../../Entryfile/offcanvance';
import useHttp from '../../../hooks/useHttp';
import { toast } from 'react-toastify';
import { FaArrowCircleLeft, FaArrowCircleRight, FaChartBar, FaDharmachakra, FaEdit, FaFileExport, FaSearch, FaTrash } from 'react-icons/fa';
import { useCompanyContext } from '../../../context';
import ReactPaginate from 'react-paginate';
import '../../../assets/css/table2.css'
import EditUser from '../../../_components/modelbox/EditUser';


const AllUser = () => {
    const { get } = useHttp()
    const [menu, setMenu] = useState(false)
    const [users, setUsers] = useState([]);
    const { loading, setLoading } = useCompanyContext();
    const id = JSON.parse(localStorage.getItem('user'));
    const [pageNumber, setPageNumber] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");



    const filteredUsers = users.filter((user) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const itemsPerPage = 10;
    const pageCount = Math.ceil(users.length / itemsPerPage);
    const displayData = filteredUsers.slice(
        pageNumber * itemsPerPage,
        (pageNumber + 1) * itemsPerPage

    );

    const FetchStaff = async () => {
        try {
            const UserResponse = await get(`Account/get_all_users?companyId=${id.companyId}`, { cacheTimeout: 300000 });
            const users = UserResponse.data;
            setUsers(users);
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {

        FetchStaff()
    }, []);




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
                                    {/* <a href="#" className="btn add-btn" data-bs-toggle="modal" data-bs-target="#edit_user"><i className="fa fa-plus" /> Add New User</a> */}

                                </div>
                            </div>
                        </div>
                        <main className='table'>
                            <section className="table__header">

                                <div className="input-group">
                                    <input type="search" className='form-control' placeholder="Search Data..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)} />
                                    <FaSearch className='text-dark' />
                                </div>
                                <div className="export__file">
                                    <label htmlFor="export-file" className="export__file-btn d-flex justify-content-center align-items-center" title="Export File" >
                                        <FaFileExport className='text-white fs-3' /></label>
                                    <input type="checkbox" id="export-file" />
                                    <div className="export__file-options ">
                                        <label>Export As &nbsp; ➜</label>
                                        <label htmlFor="export-file" id="toPDF">PDF <img src="images/pdf.png" alt /></label>
                                        <label htmlFor="export-file" id="toJSON">JSON <img src="images/json.png" alt /></label>
                                        <label htmlFor="export-file" id="toCSV">CSV <img src="images/csv.png" alt /></label>
                                        <label htmlFor="export-file" id="toEXCEL">EXCEL <img src="images/excel.png" alt /></label>
                                    </div>
                                </div>
                            </section>
                            <section className="table__body">
                                <table>
                                    <thead className='text-white' style={{ backgroundColor: "#18225C" }}>
                                        <tr style={{ backgroundColor: "#18225C" }}>

                                            <th>#</th>
                                            <th></th>
                                            <th>FullName</th>
                                            <th>Email</th>
                                            <th>Actions</th>


                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            displayData.map((data, index) =>
                                                <tr key={index}>

                                                    <td>{index + 1}</td>
                                                    <td><button className='btn'><FaDharmachakra className='text-warning' /></button></td>
                                                    <td className='fw-bold'>{data.fullName}</td>
                                                    <td><a href="#"> {data.email}</a></td>


                                                    <td>
                                                        <span className='d-flex gap-4 align-items-center'>
                                                            <Link to={`/app/profile/edit-profile/${data.staffId}`} className="settings" title="Settings" data-toggle="tooltip">
                                                                <FaEdit className='text-info' />
                                                            </Link>
                                                            <a href="#" className="delete" title="Delete" data-toggle="tooltip"><FaTrash className='text-danger' /></a>
                                                        </span>
                                                    </td>


                                                </tr>
                                            )
                                        }
                                        {displayData.length <= 0 && <tr>

                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td className='text-danger fs-6'>No user found</td>
                                            <td></td>

                                        </tr>}




                                    </tbody>
                                </table>
                                <div className="clearfix">
                                    <div className="hint-text">Showing <b>{itemsPerPage}</b> out of <b>{displayData.length}</b> entries</div>

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




                </div>
            </div>
            <EditUser />
            <Offcanvas />
        </>


    );
}

export default AllUser;
