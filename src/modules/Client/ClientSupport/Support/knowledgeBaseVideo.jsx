
import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Offcanvas from '../../../../Entryfile/offcanvance';
import useHttp from '../../../../hooks/useHttp';


const KnowledgeBaseVideo = () => {
    const { uid } = useParams()
    const [details, setDetails] = useState('')
    const { get } = useHttp();
    const [loading, setLoading] = useState(false);

    const FetchSchedule = async () => {
        setLoading(true); // Set loading to true before making the API request
        try {
            const { data } = await get(`/Tickets/get_knowledgebase_details/${uid}`, { cacheTimeout: 300000 });
            setDetails(data.knowledgeBase);
        } catch (error) {
            toast.error(error.response.data.message);
            toast.error(error.response.data.title);
            setLoading(false);
        } finally {
            setLoading(false); // Set loading to false in both success and error cases
        }
    };
    
    useEffect(() => {
        FetchSchedule();
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
            width: '100%',
            // height: '50%',
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
                                    <li className="breadcrumb-item"><Link to="/client/app/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item active">KnowledgeBase Details</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                   
                   {loading ? (
                        <div className="spinner-grow text-light" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) : (
                        <div style={customStyles.videoContainer}>
                            <div dangerouslySetInnerHTML={{ __html: details.description }} style={customStyles.iframe} />
                        </div>
                    )}
                    
                </div>
               
            </div>
            <Offcanvas />
        </>

    );

}


export default KnowledgeBaseVideo;
