
import React, { Component, useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import moment from 'moment';
import useHttp from '../../../hooks/useHttp';
import Offcanvas from '../../../Entryfile/offcanvance';

const KnowledgeBaseVideo = () => {
    const { uid, pro } = useParams()
    const [details, setDetails] = useState('')
    const [staffName, setStaffName] = useState('')
    const { get, post } = useHttp();
    const [loading, setLoading] = useState(false);

    const FetchSchedule = async () => {
        setLoading(true)
        try {
            const { data } = await get(`/Tickets/get_knowledgebase_details/${uid}`, { cacheTimeout: 300000 });
            // console.log(data);
            setDetails(data.knowledgeBase);
            setLoading(false);
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message)
            toast.error(error.response.data.title)
        }
        finally {
            setLoading(false)
        }


    };
    useEffect(() => {
        FetchSchedule()
    }, []);

    const customStyles = {
        videoContainer: {
            position: 'relative',
            paddingBottom: '56.25%', // 16:9 aspect ratio for widescreen video
            height: 0,
            overflow: 'hidden',
        },
        iframe: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50%',
            height: '50%',
        },
    };



    return (
        <>
            <div className="page-wrapper">
                <Helmet>
                    <title> Details</title>
                    <meta name="description" content=" Details" />
                </Helmet>
                {/* Page Content */}
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <h3 className="page-title"> Details</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item active">KnowledgeBase Details</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    {/* <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="border-bottom">
                                        <Link to="/app/support/knowledge-base" className="edit-icon bg-danger text-white" >
                                            <i className="la la-times-circle" />
                                        </Link>
                                        <h3>Knowledge Base Details</h3>
                                    </div> <br />

                                    <ul className="personal-info">
                                        <li>
                                            <div className="title">Subject</div>
                                            <div className="text">{details.subject}</div>
                                        </li>
                                        <li>
                                            <div className="title">Description</div>
                                            
                                        </li>
                                        <li>
                                            <div className="title">Vote</div>
                                            <div className="text">{details.vote}</div>
                                        </li>
                                        
                                        <li>
                                            <div className="title">Date Created</div>
                                            <div className="text">{moment(details.dateCreated).format('lll')}</div>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div style={customStyles.videoContainer}>
                        {/* Render the HTML code as dangerously set inner HTML */}
                        <div dangerouslySetInnerHTML={{ __html: details.description }} style={customStyles.iframe} />
                    </div>
                    {/* <div dangerouslySetInnerHTML={{ __html: details.description }} /> */}
                </div>
                {/* /Page Content */}
            </div>
            <Offcanvas />
        </>

    );

}


export default KnowledgeBaseVideo;
