import React from "react";
import { Link } from "react-router-dom";

const DashboardCard = ({ title, content, sty, icon, linkTitle, link, loading, bod }) => {
    return (
        <div className="col-md-6">
            <div className={`card shadow-none border border-${sty}`}>
                <div className="card-content shadow-none">
                    <div className="card-body shadow-none">
                        <div className="media d-flex justify-content-between">
                            <div className="media-body text-left">
                                <span>{title}</span>

                                {
                                    loading ? (<div className=" d-flex py-2 justify-content-start fs-6">
                                        <div className="spinner-grow text-light" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                    )

                                        :
                                        <h3 className={`text-${sty}`}>{content}</h3>
                                }

                                <Link style={{ fontSize: "12px" }}

                                    to={link} className='pointer text-dark'>View all</Link>
                            </div>
                            <div className="align-self-center">
                                {icon}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        // <div className="col-md-6">
        //     <div className="card dash-widget">
        //         <div className="card-body align-items-center">
        //             <span className="dash-widget-icon">{icon}</span>
        //             <div className="dash-widget-info">
        //                 <span className="fw-normal fs-6">{title}</span>
        //                 {
        //                     loading ? (<div className=" d-flex py-2 justify-content-end fs-6">
        //                         <div class="spinner-border text-secondary" role="status">
        //                             <span class="visually-hidden">Loading...</span>
        //                         </div>
        //                     </div>
        //                     )

        //                         :
        //                         <h3 className={sty}>{content}</h3>
        //                 }
        //                 <Link

        //                     to={link} className='pointer'>{linkTitle}</Link>
        //             </div>
        //         </div>
        //     </div>
        // </div>

    );
}

export default DashboardCard;