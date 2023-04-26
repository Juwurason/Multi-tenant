import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { FaFileCsv, FaFileExcel, FaFileExport, FaFilePdf, FaSearch } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useCompanyContext } from "../../context";
import useHttp from "../../hooks/useHttp";
const ClientDoc = () => {
    const { loading } = useCompanyContext();
    const { uid } = useParams()
    const [clientOne, setClientOne] = useState({});

    const { get } = useHttp()
    useEffect(() => {
        const FetchClient = async () => {
            try {
                const { data } = await get(`/Profiles/${uid}`, { cacheTimeout: 300000 })
                setClientOne(data)


            } catch (error) {
                console.log(error);
            }
        }
        FetchClient()
    }, [])

    return (
        <>

            <div className="page-wrapper">
                <Helmet>
                    <title>Client Document Upload</title>
                    <meta name="description" content="" />
                </Helmet>
                <div className="content container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title mb-0">Upload Document for {clientOne.fullName} </h4>
                                </div>
                                <div className="card-body">
                                    <form
                                    // onSubmit={submitForm}
                                    >
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label className="col-form-label">Select Document <span className="text-danger">*</span></label>
                                                    <input className="form-control" type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        maxSize={1024 * 1024 * 2}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label className="col-form-label">Document Name <span className="text-danger">*</span></label>
                                                    <input className="form-control" type="text" />
                                                </div>
                                            </div>

                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label className="col-form-label">Expiration Date <span className="text-danger">*</span></label>
                                                    <input className="form-control" type="date" />
                                                </div>
                                            </div>



                                        </div>

                                        <div className="submit-section">
                                            <button className="btn btn-primary submit-btn" type='submit'>

                                                {loading ? <div className="spinner-grow text-light" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div> : "Add"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <main className="table">
                                <section className="table__header">
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
                                                <th>Document</th>
                                                <th>Expiration Date</th>
                                                <th>Status</th>
                                                <th>Date Created</th>
                                                <th>User Created</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td> 1 </td>
                                                <td> <img src="images/Zinzu Chan Lee.jpg" alt />Zinzu Chan Lee</td>
                                                <td> Seoul </td>
                                                <td> 17 Dec, 2022 </td>
                                                <td>
                                                    <p className="">Delivered</p>
                                                </td>
                                                <td> <strong> $128.90 </strong></td>
                                            </tr>


                                        </tbody>
                                    </table>

                                </section>
                            </main>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ClientDoc;