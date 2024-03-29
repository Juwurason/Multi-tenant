
import React, { Component, useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Helmet } from "react-helmet";
import { FaPlusCircle } from 'react-icons/fa';
import { GoTrashcan } from 'react-icons/go';
import { MdEditSquare, MdError, MdLabelImportant, MdMarkEmailUnread, MdMoveToInbox, MdOutlineRefresh, MdSend, MdStars } from 'react-icons/md';
import { Link } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import './message.css';
import Editor from './editor';
import useHttp from '../../../hooks/useHttp';
import { MultiSelect } from 'react-multi-select-component';
import { toast } from 'react-toastify';
import moment from 'moment';
import ReactHtmlParser from 'react-html-parser';
import Swal from 'sweetalert2';
import axiosInstance from '../../../store/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { formatUser } from '../../../store/slices/UserSlice';
import { fetchInbox } from '../../../store/slices/MessageInboxSlice';
import { fetchSent } from '../../../store/slices/MessageSent';

function truncateString(str, maxLength) {
    if (str.length > maxLength) {
        return str.slice(0, maxLength - 3) + "...";
    } else {
        return str;
    }
}

const MessageInbox = () => {
    const id = JSON.parse(localStorage.getItem('user'));

    const dispatch = useDispatch();
    const fetchData = async () => {
        dispatch(formatUser(id.companyId));
        dispatch(fetchInbox(id.userId));
        dispatch(fetchSent(id.userId));

    }
    useEffect(() => {
        fetchData()
    }, []);
    const options = useSelector((state) => state.user.data);
    const loading = useSelector((state) => state.inbox.isLoading);
    const inbox = useSelector((state) => state.inbox.data);
    const sentEmail = useSelector((state) => state.sent.data);

    const privateHttp = useHttp();
    const [activeTab, setActiveTab] = useState('inbox');
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [editorValue, setEditorValue] = useState('');
    const subject = useRef(null);
    const claims = JSON.parse(localStorage.getItem('claims'));
    const hasRequiredClaims = (claimType) => {
        return claims.some(claim => claim.value === claimType);
    };
    // const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [lgShow, setLgShow] = useState(false);
    const [sendAsSMS, setSendAsSMS] = useState(false);
    const [smsRecipient, setSmsRecipient] = useState('');
    const [email, setEmail] = useState('');
    const [smsContent, setSmsContent] = useState('');
    const [toAllAdmins, setToAllAdmins] = useState(false);
    const [toAllStaffs, setToAllStaffs] = useState(false);
    const [toAllClients, setToAllClients] = useState(false);
    const [replyModal, setReplyModal] = useState(false);
    const [loading1, setLoading1] = useState(false);
    // const [inbox, setInbox] = useState([]);
    // const [sentEmail, setSentEmail] = useState([]);
    const handleSendAsSMSChange = (event) => {
        setSendAsSMS(event.target.checked);
    };

    const handleSmsRecipientChange = (event) => {
        setSmsRecipient(event.target.value);
    };

    const handleSmsContentChange = (event) => {
        let content = event.target.value;
        if (content.length > 306) {
            content = content.slice(0, 306);
        }
        setSmsContent(content);
    };
    const handleToAllAdminsChange = (event) => {
        setToAllAdmins(event.target.checked);
    };

    const handleToAllStaffsChange = (event) => {
        setToAllStaffs(event.target.checked);
    };

    const handleToAllClientsChange = (event) => {
        setToAllClients(event.target.checked);
    };



    const openModal = () => {
        setLgShow(true);
    };

    const closeModal = () => {
        setLgShow(false);
    };

    const handleEditorChange = (value) => {
        setEditorValue(value);
    };

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        setSelectedEmail(null);
    };

    const handleEmailClick = async (email) => {
        const { data } = await axiosInstance.get(`/Messages/${email.messageId}`);
        setSelectedEmail(data);
        fetchData();


    };

    const handleReply = async (e) => {
        setEmail(e)
        setReplyModal(true);
    };

    // const handleReplyMessage = async() =>{
    //     const payload = {
    //         content: editorValue,
    //         subject: subject.current.value,
    //         emailTo: email,
    //         status: true,
    //         emailFrom: id.email, // Replace with the appropriate sender email
    //         // admin: toAllAdmins,
    //         // staff: toAllStaffs,
    //         // client: toAllClients,
    //         sms: false,
    //         companyId: id.companyId // Replace with the actual companyId
    //     };
    //     try {
    //         setLoading1(true)
    //         const { data } = await privateHttp.post(`/Messages/send_message?userId=${id.userId}`,
    //             payload
    //         )
    //         toast.success(data.message)
    //         // fetchData();
    //         setLoading1(false)

    //     } catch (error) {
    //         toast.error(error.response?.data?.message)

    //         setLoading1(false)

    //     } finally {
    //         setLoading1(false)
    //     }
    // }

    const [showCc, setShowCc] = useState(false);
    const [showBcc, setShowBcc] = useState(false);

    const toggleCc = () => {
        setShowCc(!showCc);
    };

    const toggleBcc = () => {
        setShowBcc(!showBcc);
    };

    const handleSelectionChange = (selected) => {
        setSelectedOptions(selected);
    };
    const selectedValues = selectedOptions.map(option => option.label).join(', ');
    const handleSendMessage = async () => {
        if (sendAsSMS) {
            // Logic for sending SMS
            const payload = {
                content: smsContent,
                subject: "",
                emailTo: "",
                status: true,
                emailFrom: id.email, // Replace with the appropriate sender email
                admin: toAllAdmins,
                staff: toAllStaffs,
                client: toAllClients,
                phoneNumber: smsRecipient,
                sms: true,
                companyId: id.companyId // Replace with the actual companyId
            };
            // 
            try {
                setLoading1(true)
                const { data } = await privateHttp.post(`/Messages/send_message?userId=${id.userId}`,
                    payload
                )
                toast.success(data.message)
                fetchData();
                setLoading1(false)

            } catch (error) {
                toast.error(error.response?.data?.message)

                setLoading1(false)

            } finally {
                setLoading1(false)
            }

        }
        // else Send as normal email
        else {
            const payload = {
                content: editorValue,
                subject: subject.current.value,
                emailTo: selectedValues,
                status: true,
                emailFrom: id.email, // Replace with the appropriate sender email
                admin: toAllAdmins,
                staff: toAllStaffs,
                client: toAllClients,
                sms: false,
                companyId: id.companyId // Replace with the actual companyId
            };
            try {
                setLoading1(true)
                const { data } = await privateHttp.post(`/Messages/send_message?userId=${id.userId}`,
                    payload
                )
                toast.success(data.message)
                setEditorValue("");
                subject.current.value = ''
                setSelectedOptions([]);
                fetchData();
                setLgShow(false);


                setLoading1(false)

            } catch (error) {
                toast.error(error.response?.data?.message)

                setLoading1(false)

            } finally {
                setLoading1(false)
            }
        }

    };

    const handleDelete = async (e) => {
        Swal.fire({
            html: `<h3>Are you sure? you want to delete this message</h3>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#405189',
            cancelButtonColor: '#777',
            confirmButtonText: 'Confirm Delete',
            showLoaderOnConfirm: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await post(`Messages/delete/${e}`,
                    )
                    if (data.status === 'Success') {
                        toast.success(data.message);
                        fetchData();
                    } else {
                        toast.error(data.message);
                    }


                } catch (error) {
                    // console.log(error);
                    toast.error(error.response.data.message)
                    toast.error(error.response.data.title)

                }


            }
        })


    }


    return (
        <div className="page-wrapper">
            <Helmet>
                <title>Inbox - Promax Care</title>
                <meta name="description" content="Inbox" />
            </Helmet>
            {/* Page Content */}
            <div className="content container-fluid">
                {/* Page Header */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Messages</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/staff/staff/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Messages</li>
                            </ul>
                        </div>

                    </div>
                </div>


                {/* /Page Header */}
                {loading ? <div className='mx-auto d-flex justify-content-center w-100'>
                    <div className="lds-spinner m-5"><div></div><div></div><div></div><div></div><div>
                    </div><div></div><div></div><div></div><div></div></div>
                </div> : <div className="email-component">
                    <div className="row">
                        <div className="col-md-3 col-lg-3 col-xl-3 border">
                            <div className="nav flex-column gap-2 nav-pills py-2" id="v-pills-tab"
                                role="tablist" aria-orientation="vertical">
                                <button className='btn  add-btn rounded btn-info text-white mb-4' onClick={() => setLgShow(true)}>
                                    Compose &nbsp; <FaPlusCircle />
                                </button>
                                <a
                                    className={`nav-link text-dark d-flex justify-content-between align-items-center ${activeTab === 'inbox' ? 'active' : ''}`}
                                    id="v-pills-inbox-tab"
                                    data-toggle="pill"
                                    href="#v-pills-inbox"
                                    role="tab"
                                    aria-controls="v-pills-inbox"
                                    aria-selected={activeTab === 'inbox'}
                                    onClick={() => handleTabChange('inbox')}
                                >
                                    <div className='d-flex gap-4 align-items-center'>
                                        <MdMoveToInbox className='fs-4' />
                                        <span className='fw-bold'>Inbox</span>
                                    </div>
                                    <span className='text-warning'>{inbox.length}</span>
                                </a>
                                {/* Other tabs */}
                                <a
                                    className={`nav-link text-dark d-flex justify-content-between align-items-center ${activeTab === 'sent' ? 'active' : ''}`}
                                    id="v-pills-sent-tab"
                                    data-toggle="pill"
                                    href="#v-pills-sent"
                                    role="tab"
                                    aria-controls="v-pills-sent"
                                    aria-selected={activeTab === 'sent'}
                                    onClick={() => handleTabChange('sent')}
                                >
                                    <div className='d-flex gap-4 align-items-center'>
                                        <MdSend className='fs-4' />
                                        <span className='fw-bold'>Sent</span>
                                    </div>
                                    <span className='text-danger'>{sentEmail.length}</span>

                                </a>
                                <a
                                    className={`nav-link text-dark d-flex gap-4 align-items-center ${activeTab === 'drafts' ? 'active' : ''}`}
                                    id="v-pills-drafts-tab"
                                    data-toggle="pill"
                                    href="#v-pills-drafts"
                                    role="tab"
                                    aria-controls="v-pills-drafts"
                                    aria-selected={activeTab === 'drafts'}
                                    onClick={() => handleTabChange('drafts')}
                                >
                                    <MdEditSquare className='fs-4' />
                                    <span className='fw-bold'>
                                        Drafts</span>

                                </a>
                                <a
                                    className={`nav-link text-dark d-flex gap-4 align-items-center ${activeTab === 'spam' ? 'active' : ''}`}
                                    id="v-pills-spam-tab"
                                    data-toggle="pill"
                                    href="#v-pills-spam"
                                    role="tab"
                                    aria-controls="v-pills-spam"
                                    aria-selected={activeTab === 'spam'}
                                    onClick={() => handleTabChange('spam')}
                                >
                                    <MdError className='fs-4' />
                                    <span className='fw-bold'>
                                        Spam</span>

                                </a>
                                <a
                                    className={`nav-link text-dark d-flex gap-4 align-items-center ${activeTab === 'trash' ? 'active' : ''}`}
                                    id="v-pills-trash-tab"
                                    data-toggle="pill"
                                    href="#v-pills-trash"
                                    role="tab"
                                    aria-controls="v-pills-trash"
                                    aria-selected={activeTab === 'trash'}
                                    onClick={() => handleTabChange('trash')}
                                >
                                    <GoTrashcan className='fs-4' />
                                    <span className='fw-bold'>
                                        Trash</span>

                                </a>
                                <a
                                    className={`nav-link text-dark d-flex gap-4 align-items-center ${activeTab === 'starred' ? 'active' : ''}`}
                                    id="v-pills-starred-tab"
                                    data-toggle="pill"
                                    href="#v-pills-starred"
                                    role="tab"
                                    aria-controls="v-pills-starred"
                                    aria-selected={activeTab === 'starred'}
                                    onClick={() => handleTabChange('starred')}
                                >
                                    <MdStars className='fs-4' />
                                    <span className='fw-bold'>
                                        Starred</span>

                                </a>
                                <a
                                    className={`nav-link text-dark d-flex gap-4 align-items-center ${activeTab === 'important' ? 'active' : ''}`}
                                    id="v-pills-important-tab"
                                    data-toggle="pill"
                                    href="#v-pills-important"
                                    role="tab"
                                    aria-controls="v-pills-important"
                                    aria-selected={activeTab === 'important'}
                                    onClick={() => handleTabChange('important')}
                                >
                                    <MdLabelImportant className='fs-4' />
                                    <span className='fw-bold'>
                                        Important</span>

                                </a>
                            </div>
                        </div>




                        <div className="col-md-9 col-lg-9 col-xl-9  border" style={{ height: "80vh" }}>
                            <div className="tab-content" id="v-pills-tabContent">
                                <div
                                    className={`tab-pane fade ${activeTab === 'inbox' ? 'show active' : ''}`}
                                    id="v-pills-inbox"
                                    role="tabpanel"
                                    aria-labelledby="v-pills-inbox-tab"
                                >
                                    <div className='bg-light p-2 d-flex justify-content-between align-items-center'>
                                        <span className='d-flex gap-4 align-items-center'>
                                            <input type="checkbox" className="custom-control-input" id="cst1" />
                                            <GoTrashcan />
                                        </span>
                                        <span>
                                            <MdOutlineRefresh className='fs-5' />
                                        </span>
                                    </div>
                                    <div className=' px-2 py-3 d-flex justify-content-between align-items-center'>
                                        <span className='ml-4 d-flex gap-2 align-items-center text-primary fw-bold border-bottom-danger'>
                                            <MdMoveToInbox /> Primary
                                        </span>
                                        <span>
                                            {inbox?.length} Message(s)
                                        </span>

                                    </div>

                                    {
                                        inbox <= 0 ?
                                            <>
                                                No Message Yet
                                            </>
                                            :
                                            <>

                                                {selectedEmail ? (
                                                    <div>
                                                        <h4>{selectedEmail.subject}</h4>
                                                        <p>From: {selectedEmail.emailFrom}</p>
                                                        <p>{ReactHtmlParser(selectedEmail.content)}</p>
                                                        <div>
                                                            <button className='btn btn-primary' onClick={() => handleReply(selectedEmail.emailFrom)}>Reply</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <ul className="list-group" style={{ height: "62vh", overflowY: 'auto' }}>

                                                        <div className="table-responsive">

                                                            <table


                                                                className="table email-table no-wrap table-hover v-middle mb-0 ">

                                                                <tbody>
                                                                    <tr>
                                                                        <th></th>
                                                                        <th>From</th>
                                                                        <th>Subject</th>
                                                                        <th></th>
                                                                        <th>Date</th>
                                                                    </tr>
                                                                    {inbox?.map((email, index) => (
                                                                        <tr key={index}


                                                                        >
                                                                            {/* label */}
                                                                            <td className="" style={{ width: "20px" }}>
                                                                                <input type="checkbox" className="custom-control-input" id="cst1" />
                                                                            </td>
                                                                            {/* star */}
                                                                            <td style={{ width: "100px", fontSize: "12px" }}>
                                                                                <span className="mb-0 text-muted text-truncate" >
                                                                                    {truncateString(email.emailFrom, 30)}
                                                                                </span>
                                                                            </td>
                                                                            {/* Message */}
                                                                            <td>
                                                                                <a className="link" href="javascript: void(0)" >
                                                                                    <span className="text-dark fw-bold text-truncate"
                                                                                        onClick={() => handleEmailClick(email)}
                                                                                    >{truncateString(email.subject, 30)}</span>
                                                                                </a>
                                                                            </td>
                                                                            <td className='text-warning'>{!email.status && <MdMarkEmailUnread />}</td>
                                                                            {/* Attachment */}
                                                                            {/* Time */}
                                                                            <td className="text-muted" style={{ fontSize: "12px" }}>{moment(email.dateCreated).format('LLL')}</td>
                                                                            <td className="text-end" style={{ width: "20px" }}
                                                                                onClick={() => handleDelete(email.messageId)}>
                                                                                <GoTrashcan className='pointer' /></td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>

                                                        </div>
                                                    </ul>
                                                )}

                                            </>
                                    }




                                </div>
                                {/* Other tab content */}
                                <div
                                    className={`tab-pane fade ${activeTab === 'sent' ? 'show active' : ''}`}
                                    id="v-pills-sent"
                                    role="tabpanel"
                                    aria-labelledby="v-pills-sent-tab"
                                >
                                    <div className='bg-light p-2 d-flex justify-content-between align-items-center'>
                                        <span className='d-flex gap-4 align-items-center'>
                                            <input type="checkbox" className="custom-control-input" id="cst1" />
                                            <GoTrashcan />
                                        </span>
                                        <span>
                                            <MdOutlineRefresh className='fs-5' />
                                        </span>
                                    </div>
                                    <div className=' px-2 py-3 d-flex justify-content-between align-items-center'>
                                        <span className='ml-4 d-flex gap-2 align-items-center text-warning fw-bold border-bottom-danger'>
                                            <MdMoveToInbox /> Sent
                                        </span>
                                        <span>
                                            {sentEmail?.length} Message(s)
                                        </span>
                                    </div>


                                    {
                                        sentEmail <= 0 ?
                                            <>
                                                No Message Yet
                                            </>
                                            :
                                            <>

                                                {selectedEmail ? (
                                                    <div>
                                                        <h4>{selectedEmail.subject}</h4>
                                                        <p>To: {selectedEmail.emailTo}</p>
                                                        <p>{ReactHtmlParser(selectedEmail.content)}</p>
                                                    </div>
                                                ) : (
                                                    <ul className="list-group" style={{ height: "62vh", overflowY: 'auto' }}>

                                                        <div className="table-responsive">

                                                            <table


                                                                className="table email-table no-wrap table-hover v-middle mb-0 ">

                                                                <tbody>
                                                                    <tr>
                                                                        <th></th>
                                                                        <th>Subject</th>
                                                                        <th>Date</th>
                                                                    </tr>
                                                                    {sentEmail?.map((email, index) => (
                                                                        <tr key={index}


                                                                        >
                                                                            {/* label */}
                                                                            <td className="" style={{ width: "20px" }}>
                                                                                <input type="checkbox" className="custom-control-input" id="cst1" />
                                                                            </td>
                                                                            {/* star */}
                                                                            {/* <td className=''><i className="fa fa-star text-warning" /></td> */}

                                                                            {/* Message */}
                                                                            <td style={{ cursor: 'pointer' }}>
                                                                                <a className="link" href="#" >
                                                                                    <span className="text-dark fw-bold text-truncate"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault()
                                                                                            handleEmailClick(email)
                                                                                        }}
                                                                                    > {truncateString(email.subject, 50)}</span>
                                                                                </a>
                                                                            </td>
                                                                            {/* Attachment */}
                                                                            {/* Time */}
                                                                            <td className="text-muted" style={{ fontSize: "12px" }}>{moment(email.dateCreated).format('LLL')}</td>
                                                                            <td className="text-end" style={{ width: "20px" }}
                                                                                onClick={() => handleDelete(email.messageId)}>
                                                                                <GoTrashcan className='pointer' /></td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </ul>
                                                )}

                                            </>
                                    }

                                </div>




                                <div
                                    className={`tab-pane fade ${activeTab === 'drafts' ? 'show active' : ''}`}
                                    id="v-pills-drafts"
                                    role="tabpanel"
                                    aria-labelledby="v-pills-drafts-tab"
                                >
                                    <div className='bg-light p-2 d-flex justify-content-between align-items-center'>
                                        <span className='d-flex gap-4 align-items-center'>
                                            <input type="checkbox" className="custom-control-input" id="cst1" />
                                            <GoTrashcan />
                                        </span>
                                        <span>
                                            <MdOutlineRefresh className='fs-5' />
                                        </span>
                                    </div>
                                    <div className=' px-2 py-3 d-flex justify-content-between align-items-center'>
                                        <span className='ml-4 d-flex gap-2 align-items-center text-secondary fw-bold border-bottom-danger'>
                                            <MdMoveToInbox /> Drafts
                                        </span>
                                        <span>
                                            0 Message(s)
                                        </span>
                                    </div>



                                </div>
                                <div
                                    className={`tab-pane fade ${activeTab === 'spam' ? 'show active' : ''}`}
                                    id="v-pills-spam"
                                    role="tabpanel"
                                    aria-labelledby="v-pills-spam-tab"
                                >
                                    <h3>Spam</h3>
                                    <p>Display Spam emails here.</p>
                                </div>
                                <div
                                    className={`tab-pane fade ${activeTab === 'trash' ? 'show active' : ''}`}
                                    id="v-pills-trash"
                                    role="tabpanel"
                                    aria-labelledby="v-pills-trash-tab"
                                >
                                    <h3>Trash</h3>
                                    <p>Display Trash emails here.</p>
                                </div>
                                <div
                                    className={`tab-pane fade ${activeTab === 'starred' ? 'show active' : ''}`}
                                    id="v-pills-starred"
                                    role="tabpanel"
                                    aria-labelledby="v-pills-starred-tab"
                                >
                                    <h3>Starred</h3>
                                    <p>Display Starred emails here.</p>
                                </div>
                                <div
                                    className={`tab-pane fade ${activeTab === 'important' ? 'show active' : ''}`}
                                    id="v-pills-important"
                                    role="tabpanel"
                                    aria-labelledby="v-pills-important-tab"
                                >
                                    <h3>Important</h3>
                                    <p>Display Important emails here.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                <Modal
                    size="lg"
                    show={lgShow}
                    onHide={closeModal}
                    backdrop="static"
                    keyboard={false}
                    aria-labelledby="example-modal-sizes-title-lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-md">
                            New Message
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            {id.role === "CompanyAdmin" || hasRequiredClaims("Send Messages to all") ? <div className="fw-bold">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="toAllAdmins"
                                        checked={toAllAdmins}
                                        onChange={handleToAllAdminsChange}
                                    />
                                    &nbsp;
                                    To All Admins
                                </label>
                                &nbsp; &nbsp;
                                <label>
                                    <input
                                        type="checkbox"
                                        name="toAllStaffs"
                                        checked={toAllStaffs}
                                        onChange={handleToAllStaffsChange}
                                    />
                                    &nbsp;
                                    To All Staffs
                                </label>
                                &nbsp; &nbsp;
                                <label>
                                    <input
                                        type="checkbox"
                                        name="toAllClients"
                                        checked={toAllClients}
                                        onChange={handleToAllClientsChange}
                                    />
                                    &nbsp;
                                    To All Clients
                                </label> &nbsp; &nbsp;
                                <label>
                                    <input
                                        type="checkbox"
                                        name="sendAsSMS"
                                        checked={sendAsSMS}
                                        onChange={handleSendAsSMSChange}
                                    />
                                    &nbsp;
                                    Send As SMS
                                </label>
                            </div> : ""}


                            <hr />
                            {!sendAsSMS ? (
                                <>
                                    <div className="form-group">
                                        <label className="col-form-label fw-semibold">To: </label>
                                        {/* ... Rest of the recipient selection code ... */}
                                        <div className=" d-flex justify-content-between align-items-center">

                                            <MultiSelect
                                                options={options}
                                                value={selectedOptions}
                                                onChange={handleSelectionChange}
                                                labelledBy="To..."
                                                className="custom-multiselect"
                                                disabled={toAllAdmins || toAllStaffs || toAllClients} // Disable when any of the "To All" checkboxes is checked

                                            />
                                            <span className="w-25 d-flex border justify-content-end">
                                                <button className="btn" onClick={toggleCc}>
                                                    Cc
                                                </button>
                                                <button className="btn" onClick={toggleBcc}>
                                                    Bcc
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                    {/* ... Rest of the modal content ... */}
                                    {showCc && (
                                        <div className="form-group">
                                            <input className="form-control" type="text" placeholder="Cc Recipient" />
                                        </div>
                                    )}
                                    {showBcc && (
                                        <div className="form-group">
                                            <input className="form-control" type="text" placeholder="Bcc Recipient" />
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Subject"
                                            ref={subject}
                                        />
                                    </div>
                                    <Editor
                                        placeholder="Write something..."
                                        onChange={handleEditorChange}
                                        value={editorValue}
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label className="col-form-label fw-semibold">
                                            SMS Recipient:
                                        </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Enter Phone Number without the '+' sign e.g 6143567890"
                                            value={smsRecipient}
                                            onChange={handleSmsRecipientChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="col-form-label fw-semibold">
                                            SMS Content: <span className='text-danger'>Note: A Page is 153 characters</span>
                                        </label>
                                        <textarea
                                            cols="30" rows="10"
                                            className="form-control"
                                            placeholder="Write Message Here..."
                                            value={smsContent}
                                            onChange={handleSmsContentChange}
                                        />
                                        <small>
                                            {smsContent.length}/306 characters remaining
                                        </small>
                                    </div>
                                </>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn add-btn rounded btn-outline-danger"
                            onClick={() => { setLgShow(false) }}
                        >
                            Close
                        </button>
                        <button
                            className="ml-2 btn add-btn rounded text-white btn-info"
                            onClick={handleSendMessage}
                        >
                            {loading1 ? <div className="spinner-grow text-light" role="status">
                                <span className="sr-only">Loading...</span>
                            </div> : "Send"}
                        </button>
                    </Modal.Footer>
                </Modal>

                <Modal show={replyModal} onHide={() => setReplyModal(false)} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Reply Message</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        <div className="form-group">
                            <label> email: </label>
                            <input type="email" className="form-control" value={email} readOnly />
                        </div>

                        <div>
                            <Editor
                                placeholder="Write something..."
                                onChange={handleEditorChange}
                                value={editorValue}
                                style={{ height: '100%' }}
                            />
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        {/* <button
                            // onClick={CancelShift}
                            className="btn btn-success">Submit</button> */}
                    </Modal.Footer>
                </Modal>
                {/* /Page Content */}
            </div>
        </div>
    );

}

export default MessageInbox;
