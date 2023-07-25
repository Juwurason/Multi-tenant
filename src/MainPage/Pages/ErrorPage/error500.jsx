/**
 * Signin Firebase
 */

import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import './error505.css'

const Error500 = () => {
  return (
    <>
      <Helmet>
        <title>Error 500 - Promax-Care </title>
        <meta name="description" content="Error" />
      </Helmet>
      <div className="page-404">
        <div className="outer">
          <div className="middle">
            <div className="inner">
              {/*BEGIN CONTENT*/}
              <div className="inner-circle"><i className="fa fa-cogs" /><span>500</span></div>
              <span className="inner-status">Opps! Internal Server Error!</span>
              <span className="inner-detail">Unfortunately we're having trouble loading the page you are looking for. Please come back in a while.</span>
              {/*END CONTENT*/}
            </div>
          </div>
        </div>


      </div>
    </>


  );
}


export default Error500;
