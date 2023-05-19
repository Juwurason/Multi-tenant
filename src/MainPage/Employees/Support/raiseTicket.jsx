import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { FaBackspace } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCompanyContext } from '../../../context';
import useHttp from '../../../hooks/useHttp';
import Editor from '../../HR/Message/editor';

const RaiseTicket = () => {

    const { userProfile, loading, setLoading } = useCompanyContext();
    const [subject, setSubject] = useState('');
    const [image, setImage] = useState(null);
    const privateHttp = useHttp();
    const navigate = useHistory();
    const [loading1, setLoading1] = useState(false)
    const [editorValue, setEditorValue] = useState('');
    const handleEditorChange = (value) => {
        setEditorValue(value);
    };

    const submitForm = async (e) => {
        e.preventDefault()
        if (subject.trim() === "" ||
            editorValue.trim() === ""
        ) {
            return toast.error("All Fields must be filled")
        }
        const formData = new FormData();
        formData.append("Subject", subject);
        formData.append("Description", editorValue);
        formData.append("ImageFIle", image);
        formData.append("CompanyId", 30);


        try {
            setLoading1(true)
            const { data } = await privateHttp.post(`/Tickets/raise_ticket?userId=${userProfile.userId}`,
                formData
            )
            toast.success(data.message)
            setLoading(false)

        } catch (error) {
            toast.error(error.response?.data?.message)

            setLoading1(false)

        } finally {
            setLoading1(false)
        }

    }
    return (
        <div className="page-wrapper">
            <Helmet>
                <title>Raise A Ticket</title>
                <meta name="description" content="" />
            </Helmet>
            <div className="content container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title mb-0">Raise A Ticket</h4>
                            </div>

                            <div className="card-body">
                                <form onSubmit={submitForm}>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label className="col-form-label">Subject</label>
                                                <input className="form-control" type="text"
                                                    value={subject}
                                                    onChange={e => setSubject(e.target.value)}
                                                />
                                            </div>
                                        </div>


                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label className="col-form-label">Description</label>

                                                <Editor
                                                    placeholder="Write something..."
                                                    onChange={handleEditorChange}
                                                    value={editorValue}
                                                ></Editor>
                                                <br />
                                                <br />
                                            </div>
                                        </div>

                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <div>
                                                    <input className="form-control" type="file"
                                                        accept=".png,.jpg,.jpeg"
                                                        maxSize={1024 * 1024 * 2}
                                                        onChange={e => setImage(e.target.files[0])} />
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="submit-section">
                                        <button className="btn btn-primary  rounded submit-btn" type='submit'

                                        >

                                            {loading1 ? <div className="spinner-grow text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div> : "Submit"}
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

export default RaiseTicket;