import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../api/http";
import { useCompanyContext } from "../context";
import usePublicHttp from "../hooks/usePublicHttp";
import Phone from "../_components/Phone/Phone";
import loggo from '../assets/img/promaxcare_logo_white.png';

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
    const [loading1, setLoading1] = useState(false)
    let errorsObj = { companyName: '', companyEmail: '', companyAddress: '', companyHead: '', Phone: '' };
    const [errors, setErrors] = useState(errorsObj);
    const publicHttp = usePublicHttp()
    useEffect(() => {
        const fetchPackages = async () => {
            setLoading1(true);
            try {
                const response = await publicHttp.get("/Packages/get_all_packages")
              setPackages(response.data)
                setLoading1(false)
            } catch (error) {
                console.log(error);
                setLoading1(false)
            }
        }
        fetchPackages()

    }, [])


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token && user.role === "CompanyAdmin") {
            navigate.push('/app/main/dashboard');
        }
        if (user && user.token && user.role === "Staff") {
            navigate.push('/staff/staff/staffDashboard');
        }
    }, []);
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
            toast.error('Company Name is Required')
            error = true;
        }
        if (info.companyEmail.trim() === '') {
            toast.error('Company Email is Required')
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
            const { data } = await publicHttp.post("/Companies/add_company", info)
            if (data.status === "Success") {
                toast.success(data.message)
                storeCompanyId(data.company?.companyId);
                navigate.replace(`/admin/${data.company?.companyId}`)
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
            <Helmet>
                <title>Company Setup</title>
                <meta name="description" content="Company Registration Page" />
            </Helmet>
            <div className="cover2-bg">
                <div className="header-left p-4">
                    <span className="logo p-4">
                        <img src={loggo} width={180} height={180} alt="" />
                    </span>
                </div>
                <div className="container pt-3">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="shadow bg-white p-2">
                                <div className="card-body bg-none">
                                    <form className="form-horizontal" onSubmit={handleSubmit}>
                                        <h4 className="mx-auto fw-bold text-center text-primary">CREATE COMPANY ACCOUNT</h4>
                                        <div className="form-group mt-3">
                                            <label htmlFor="name" className="cols-sm-2 control-label text-muted">Company Name</label>
                                            <div className="cols-sm-10">
                                                <div className="input-group">
                                                    <input type="text"
                                                        ref={companyName}
                                                        placeholder="Enter company name"
                                                        className="form-control" name="name" required />
                                                </div>

                                            </div>
                                        </div>
                                        <div className="form-group mt-3">
                                            <label className="cols-sm-2 control-label text-muted">Company Email</label>
                                            <div className="cols-sm-10">
                                                <div className="input-group">
                                                    <input type="email"
                                                        ref={companyEmail}

                                                        className="form-control" name="email" id="email" placeholder="Enter company Email"
                                                        required />
                                                </div>

                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="cols-sm-2 control-label text-muted">Company Phone Number</label>

                                            <Phone
                                                value={value}
                                                setValue={setValue}
                                            />
                                            {errors.Phone && (
                                                <span className="text-danger">{errors.Phone}</span>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label className="cols-sm-2 control-label text-muted">Company Address</label>
                                            <div className="cols-sm-10">
                                                <div className="input-group">
                                                    <input type="text"
                                                        ref={companyAddress}
                                                        className="form-control" placeholder="Enter company Address" required />
                                                </div>
                                                {errors.companyAddress && (
                                                    <span className="text-danger">{errors.companyAddress}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="cols-sm-2 control-label text-muted">Company Head</label>
                                            <div className="cols-sm-10">
                                                <div className="input-group">
                                                    <input type="text"
                                                        ref={companyHead}



                                                        className="form-control" autoComplete="false" placeholder="Name of Company Head"
                                                        required
                                                    />
                                                </div>
                                                {errors.companyHead && (
                                                    <span className="text-danger">{errors.companyHead}</span>
                                                )}
                                            </div>
                                        </div>


                                        <div className="form-group">
                                            {

                                                !loading1 && packages.length > 0 ?
                                                    <select className="form-select"
                                                        style={{ height: "3rem" }}
                                                        ref={packagesId}
                                                        aria-label="Default select example">

                                                        <option hidden>Choose a package</option>

                                                        {
                                                            packages?.slice(0, 1).map((item) =>
                                                                <option value={item.packagesId} key={item.packagesId}>{item.package}</option>
                                                            )
                                                        }
                                                    </select> :
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="spinner-grow" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>  <span className="fw-bold">Loading Packages</span>
                                                    </div>
                                            }

                                            {
                                                !loading1 && packages.length < 0 ?
                                                    <span className="text-danger">Packages not available.. Try Reloading this page</span>
                                                    : ""
                                            }
                                        </div>



                                        <div className="form-group w-100 ">
                                            <button type="submit" className="btn w-100 btn-info text-white btn-lg btn-block login-button"
                                                disabled={loading ? true : false}
                                            >{loading ? <div className="spinner-grow text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div> : "Continue"}

                                            </button>
                                        </div>
                                        <div className="form-group">
                                            <span>Already have an account ? </span>
                                            <a href="/" className="text-info"> Sign in here</a>

                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>

    );
}

export default CompanySetup;