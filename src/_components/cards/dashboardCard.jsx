import React from "react";
import { Link } from "react-router-dom";

const DashboardCard = ({ title, content, icon, linkTitle, link }) => {
    return (

        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div className="card dash-widget">
                <div className="card-body align-items-center">
                    <span className="dash-widget-icon">{icon}</span>
                    <div className="dash-widget-info">
                        <span>{title}</span>
                        <h3>{content}</h3>
                        <Link to={link} className='pointer fw-bold'>{linkTitle}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardCard;