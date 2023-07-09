
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaBackspace } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { MultiSelect } from 'react-multi-select-component';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCompanyContext } from '../../context';
import useHttp from '../../hooks/useHttp';
import Edit from '../../MainPage/HR/Message/edit';



const AddFormTemplate = () => {
    const id = JSON.parse(localStorage.getItem('user'));


    const { get, post } = useHttp();
    const [loading, setLoading] = useState(false);
    const navigate = useHistory();
    const [employment, setEmployment] = useState(false);
    const [general, setGeneral] = useState(false);
    const [incident, setIncident] = useState(false);
    const [file, setFile] = useState(null);
    const templateName = useRef("");




    const [type, setType] = useState("");
    const handleTypeChange = (e) => {
        setType(e.target.value);
    };
    const handleEmploymentChange = (e) => {
        setEmployment(e.target.checked);
    };
    const handleGeneralChange = (e) => {
        setGeneral(e.target.checked);
    };
    const handleIncidentChange = (e) => {
        setIncident(e.target.checked);
    };
    const [editorValue, setEditorValue] = useState('');
    const handleEditorChange = (value) => {
        setEditorValue(value);
    };



    //     Templates/add_templates

    // formdata
    // TemplateName
    // TemplateType
    // Editable
    // Content
    // 
    // True

    // IsGeneral
    // False

    // IsIncidentForm
    // False

    // TemplateUrlFile
    // CompanyId


    const handleSubmit = async (e) => {
        e.preventDefault(e)

        const formData = new FormData()
        // Add input field values to formData
        formData.append("TemplateName", templateName.current.value);
        formData.append("TemplateType", type);
        formData.append("Content", editorValue);
        formData.append("IsEmploymentForm", employment);
        formData.append("IsGeneral", general);
        formData.append("IsIncidentForm", incident);
        formData.append("TemplateUrlFile", file);
        formData.append("CompanyId", id.companyId);

        try {
            setLoading(true)
            const { data } = await post(`/Templates/add_templates`,
                formData
            )
            toast.success(data.message)
            navigate.push('/app/setup/form-template')
            setLoading(false)

        } catch (error) {
            toast.error(error.response?.data?.message)

            setLoading(false)

        } finally {
            setLoading(false)
        }

    }


    return (
        <div className="page-wrapper">
            <Helmet>
                <title>Create Template</title>
                <meta name="description" content="Create Template" />
            </Helmet>
            <div className="content container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">

                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title mb-0">Create Template</h4>
                                <Link to={'/app/setup/form-template'} className="card-title mb-0 text-danger fs-3 "> <MdCancel /></Link>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="col-form-label">Template Name </label>
                                                <input className="form-control" type="text" required ref={templateName} />
                                            </div>
                                        </div>

                                        <div className="col-sm-6">

                                            <div className="form-group">
                                                <label className="col-form-label">Template Type</label>
                                                <div className='form-control d-flex justify-content-center align-items-center'>
                                                    <select className="form-select py-2 border-0 bg-transparent" required onChange={handleTypeChange}>
                                                        <option defaultValue value={""}>--Select Template Type--</option>

                                                        <option value={"Editable"}>Editable</option>
                                                        <option value={"Non-Editable"}>Non-Editable</option>

                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {type === "Non-Editable" && <div className="col-sm-12">
                                            <div className="form-group">
                                                <div>
                                                    <label htmlFor="formFile" className="form-label">Template Url</label>
                                                    <input className="form-control" type="file" id="formFile"
                                                        onChange={e => setFile(e.target.files[0])}
                                                    />
                                                </div>

                                            </div>
                                        </div>}

                                        {type === "Editable" && <div className="col-sm-12">
                                            <div className="form-group">
                                                <label className="col-form-label">Content</label>


                                                <Edit
                                                    value={editorValue}
                                                    placeholder="Enter text"
                                                    onChange={handleEditorChange}
                                                />


                                            </div>
                                        </div>}

                                        <div className='d-flex flex-column'>


                                            <div className="form-group">
                                                <input type="checkbox" checked={employment} onChange={handleEmploymentChange} />
                                                &nbsp; &nbsp;
                                                <label className="col-form-label">Is Employment Form</label>
                                            </div>
                                            <div className="form-group">
                                                <input type="checkbox" checked={general} onChange={handleGeneralChange} />
                                                &nbsp; &nbsp;
                                                <label className="col-form-label">Is General Form</label>
                                            </div>
                                            <div className="form-group">
                                                <input type="checkbox" checked={incident} onChange={handleIncidentChange} />
                                                &nbsp; &nbsp;
                                                <label className="col-form-label">Is Incident Form</label>
                                            </div>

                                        </div>

                                    </div>

                                    <div className="submit-section">
                                        <button className="btn btn-primary rounded submit-btn" type='submit'>

                                            {loading ? <div className="spinner-grow text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div> : "Create"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddFormTemplate;