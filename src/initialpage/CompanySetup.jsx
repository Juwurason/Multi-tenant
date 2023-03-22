import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../api/http";
import { useCompanyContext } from "../context";
import Phone from "../_components/Phone/Phone";
const CompanySetup = () => {

    const { storeCompanyId } = useCompanyContext();
    const [packages, setPackages] = useState([])
    const companyName = useRef(null);
    const companyEmail = useRef(null)
    const companyAddress = useRef(null)
    const companyHead = useRef(null)
    const packagesId = useRef(null)
    const [value, setValue] = useState("")
    const [loading, setLoading] = useState(false)
    let errorsObj = { companyName: '', companyEmail: '', companyAddress: '', companyHead: '', Phone: '' };
    const [errors, setErrors] = useState(errorsObj);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await http.get("/Packages/get_all_packages")
                setPackages(response.data)
            } catch (error) {
                console.log(error);
            }
        }
        fetchPackages()

    }, [])
    const navigate = useHistory()
    const handleSubmit = async (e) => {
        e.preventDefault()
        const info = {
            companyName: companyName.current.value,
            companyEmail: companyEmail.current.value,
            companyAddress: companyAddress.current.value,
            companyPhone: value,
            companyHead: companyHead.current.value,
            packagesId: packagesId.current.value,
        }
        let error = false;
        const errorObj = { ...errorsObj };
        if (info.companyName.trim() === '') {
            errorObj.companyName = 'Company Name is Required';
            error = true;
        }
        if (info.companyEmail.trim() === '') {
            errorObj.companyEmail = 'Company Email is Required';
            error = true;
        }
        if (info.companyPhone < 9) {
            errorObj.Phone = 'Enter a valid Phone Number';
            error = true;
        }

        if (info.companyAddress.trim() === '') {
            errorObj.companyAddress = 'Company Address is Required';
            error = true;
        }
        if (info.companyHead.trim() === '') {
            errorObj.companyHead = 'Company Head is Required';
            error = true;
        }
        setErrors(errorObj);
        if (error) return;
        setLoading(false)

        try {
            setLoading(true)
            const { data } = await axios.post("http://profitmax-001-site8.ctempurl.com/api/Companies/add_company", info)
            console.log(data);
            if (data.status === "Success") {
                toast.success(data.message)
                storeCompanyId(data.company?.companyId);
                navigate.push(`/admin-auth/${data.company?.companyId}`)
            } else {
                toast.error(data.message)
                return
            }
            setLoading(false)
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
        }
    }
    return (
        <>

            {/* <div className="container-lg bg-light mx-auto p-lg-4 p-md-4 p-sm-0 w-100 border border-2">
               
                <div className="mx-auto w-75">
                    <div className="bg-white rounded ">
                        <div className="border-bottom py-6 text-black text-center d-flex flex-column gap-2">
                            <small className="fw-1 fs-4">CREATE COMPANY ACCOUNT</small>
                            <small className="fs-5">Set up your new account to get started</small>
                        </div>
                        <form className="bg-light px-4 py-4" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">
                                    Company Name
                                    <input
                                        type="text"
                                        className="form-control mt-2"
                                        ref={companyName}
                                        placeholder="Enter company name"
                                    />
                                </label>
                                {errors.companyName && (
                                    <span className="text-danger fs-6">{errors.companyName}</span>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">
                                    Company Email
                                    <input
                                        type="email"
                                        className="form-control mt-2"
                                        ref={companyEmail}
                                        placeholder="Enter company email"
                                    />
                                </label>
                                {errors.companyEmail && (
                                    <span className="text-danger fs-6">{errors.companyEmail}</span>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">
                                    Phone
                                    <div className="input-group mt-2">
                                        <Phone value={value} setValue={setValue} />
                                    </div>
                                </label>
                                {errors.Phone && (
                                    <span className="text-danger fs-6">{errors.Phone}</span>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">
                                    Company Address
                                    <input
                                        type="text"
                                        className="form-control mt-2"
                                        ref={companyAddress}
                                        placeholder="Enter company address"
                                    />
                                </label>
                                {errors.companyAddress && (
                                    <span className="text-danger fs-6">{errors.companyAddress}</span>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">
                                    Company Head
                                    <input
                                        type="text"
                                        className="form-control mt-2"
                                        ref={companyHead}
                                        placeholder="Enter company head"
                                    />
                                </label>
                                {errors.companyHead && (
                                    <span className="text-danger fs-6">{errors.companyHead}</span>
                                )}
                            </div>
                            <button type="submit" className="btn btn-primary mt-4">
                                Create
                            </button>
                        </form>
                    </div>
                </div>
            </div> */}

            <Helmet>
                <title>Company Setup - Promax Multitenant APP</title>
                <meta name="description" content="Company Registration Page" />
            </Helmet>

            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow-none bg-none px-2">
                            <h4 className="card-header mx-auto font-bold">CREATE COMPANY ACCOUNT</h4>
                            <div className="card-body bg-none">
                                <form className="form-horizontal" onSubmit={handleSubmit}>
                                    <div className="form-group mt-3">
                                        <label htmlFor="name" className="cols-sm-2 control-label">Company Name</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                                <input type="text"
                                                    ref={companyName}
                                                    placeholder="Enter company name"
                                                    className="form-control" name="name" />
                                            </div>
                                            {errors.companyName && (
                                                <span className="text-danger">{errors.companyName}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group mt-3">
                                        <label htmlFor="email" className="cols-sm-2 control-label">Company Email</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                                <input type="email"
                                                    ref={companyEmail}

                                                    className="form-control" name="email" id="email" placeholder="Enter company Email" />
                                            </div>
                                            {errors.companyEmail && (
                                                <span className="text-danger">{errors.companyEmail}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="cols-sm-2 control-label">Company Phone Number</label>

                                        <Phone
                                            value={value}
                                            setValue={setValue}
                                        />
                                        {errors.Phone && (
                                            <span className="text-danger">{errors.Phone}</span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="cols-sm-2 control-label">Company Address</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                                <input type="email"
                                                    ref={companyAddress}
                                                    className="form-control" name="email" id="email" placeholder="Enter company Address" />
                                            </div>
                                            {errors.companyAddress && (
                                                <span className="text-danger">{errors.companyAddress}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="cols-sm-2 control-label">Company Head</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                                <input type="email"
                                                    ref={companyHead}



                                                    className="form-control" name="email" id="email" placeholder="Name of Company Head" />
                                            </div>
                                            {errors.companyHead && (
                                                <span className="text-danger">{errors.companyHead}</span>
                                            )}
                                        </div>
                                    </div>


                                    <div className="form-group">
                                        <select className="form-select"
                                            ref={packagesId}
                                            aria-label="Default select example">

                                            <option hidden>Choose a package</option>

                                            {
                                                packages.map((item) =>
                                                    <option value={item.packagesId} key={item.packagesId}>{item.package}</option>
                                                )
                                            }
                                        </select>

                                    </div>

                                    <div className="form-group">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" defaultValue id="flexCheckChecked" defaultChecked />
                                            <label className="form-check-label text-muted" htmlFor="flexCheckChecked">
                                                I consent to the collection and processing of my personal data in line with data regulations as described in the privacy policy
                                            </label>
                                        </div>

                                    </div>




                                    <div className="form-group w-100 ">
                                        <button type="submit" className="btn w-100 btn-primary btn-lg btn-block login-button">Continue</button>
                                    </div>
                                    <div className="form-group">
                                        <span>Already have an account ? </span>
                                        <a href="/login"> Sign in here</a>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>

    );
}

export default CompanySetup;