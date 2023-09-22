import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { FaBackspace } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCompanyContext } from '../../../context';
import useHttp from '../../../hooks/useHttp';
import Editor from '../../HR/Message/editor';
import ReactHtmlParser from 'react-html-parser';
import moment from 'moment';
import Swal from 'sweetalert2';
import axiosInstance from '../../../store/axiosInstance';

const ticketDetails = () => {

    const [loading, setLoading] = useState(false);
    const id = JSON.parse(localStorage.getItem('user'));
    const { uid } = useParams();
    const history = useHistory()
    const [image, setImage] = useState(null);
    const { post, get } = useHttp();
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [editorValue, setEditorValue] = useState('');
    const [ticketDetails, setTicketDetails] = useState({});
    const [ticketReplies, setTicketReplies] = useState([]);
    const handleEditorChange = (value) => {
        setEditorValue(value);
    };

    const fetchTicket = async () => {
        setLoading(true)
        try {
            const { data } = await axiosInstance.get(`/Tickets/${uid}`, { cacheTimeout: 300000 });
            if (data.status === 'Success') {
                toast.success(data.status);
                setTicketDetails(data.ticket);
                setTicketReplies(data.ticketReplies);
            }
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        } finally {
            setLoading(false)
        }

    };
    useEffect(() => {
        fetchTicket()
    }, []);


    const submitForm = async (e) => {
        e.preventDefault()
        if (
            editorValue.trim() === ""
        ) {
            return toast.error("All Fields must be filled")
        }
        const formData = new FormData();
        formData.append("Reply", editorValue);
        formData.append("ImageFIle", image);
        formData.append("TicketId", uid);



        try {
            setLoading1(true)
            const { data } = await post(`/Tickets/reply_ticket/${uid}?userId=${id.userId}`,
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

    const handleClose = (e) => {
        e.preventDefault();
        Swal.fire({
            html: `<h3> You're about closing this ticket by ${ticketDetails.user}</h3>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#405189',
            cancelButtonColor: '#777',
            confirmButtonText: 'Confirm',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await post(`/Tickets/close_ticket/${uid}?userId=${id.userId}`,

                    )
                    if (data.status === 'Success') {
                        toast.success(data.message);
                        history.push('/app/support/view-tickets')

                    } else {
                        toast.error(data.message);
                    }


                } catch (error) {
                    console.log(error);
                    toast.error(error.response.data.message)
                    toast.error(error.response.data.title)

                }


            }
        })
    }
    const handleEscalate = async (e) => {
        setLoading2(true);
        try {   
            // Tickets/excalate/{id}?userId=
            const { data } = await get(`/Tickets/excalate/${uid}?userId=${id.userId}`, { cacheTimeout: 300000 });
            if (data.status === "Success") {
                toast.success(data.message);
            }
            setLoading2(false)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading2(false);
        }
    }

    return (
        <div className="page-wrapper">
            <Helmet>
                <title>Ticket Details</title>
                <meta name="description" content="" />
            </Helmet>


            {/* Page Header */}





            <div className="content container-fluid">
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Ticket Trail</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item"><Link to="/app/support/view-tickets">Ticket</Link></li>
                                <li className="breadcrumb-item active">Ticket Trail</li>
                            </ul>
                        </div>

                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title"><span className='fw-bold'>Title: </span> {ticketDetails.subject}</h5>
                        <p className="card-text"><span className='fw-bold'>Description: </span> {ReactHtmlParser(ticketDetails.description)}</p>
                        <button onClick={handleEscalate} className="btn btn-warning text-white">

                            {loading2 ? <div className="spinner-grow text-light" role="status">
                                <span className="sr-only">Loading...</span>
                            </div> : "Escalate Ticket"}
                        </button>
                    </div>

                    <h5 className="card-footer">Raised by {ticketDetails.user} on {moment(ticketDetails.dateCreated).format("LLL")} </h5>
                </div>

                <hr />
                <h4>Replies</h4>
                {
                    ticketReplies.map((reply, index) =>
                        <div className="card" key={index}>
                            <div className="card-body">
                                <h5 className="card-title"></h5>
                                <p className="card-text"> {ReactHtmlParser(reply.reply)}</p>
                            </div>
                            <h5 className="card-footer">Replied by {reply.user} on {moment(ticketDetails.dateCreated).format("LLL")} </h5>
                        </div>

                    )
                }
                {
                    ticketReplies.length <= 0 &&
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title"></h5>
                            <p className="card-text">No replies yet</p>
                        </div>
                    </div>
                }


                <div className="row">
                    <div className="col-md-12">
                        <div className="card">

                            <div className="card-body">
                                <form onSubmit={submitForm}>
                                    <div className="row">

                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <h3 className="col-form-label">Reply</h3>

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
                                                        maxsize={1024 * 1024 * 2}
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
                                        &nbsp;
                                        <button onClick={handleClose} className="btn  btn-outline-danger  rounded submit-btn" type='submit'

                                        >

                                            Close
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

export default ticketDetails;