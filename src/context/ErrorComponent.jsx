import React from 'react';
import './error.css';
import {
    headerlogo,
} from '../Entryfile/imagepath';
import sad from '../assets/img/sad-bird.png'

const ErrorComponent = ({ message }) => {

    const handleReload = () => {
        const user = localStorage.getItem('user'); // Replace 'user' with the key you used to store the user object

        if (!user) {
            // User object not found in local storage, navigate to the login page
            window.location.replace('/login');
        } else {
            // User object found, reload the browser
            window.location.reload();
        }
    };

    return (
        <>
            <div className="header-left p-4">
                <span className="logo p-4">
                    <img src={headerlogo} width={40} height={40} alt="" /> &nbsp; <span className='fw-bold'>Promax Care</span>
                </span>
            </div>
            <div className="containerr">
                <div className="gif " >
                    <img src={sad} alt="sad bird" width={350} height={350} className="bounce2" />
                </div>
                <div className="contentt">
                    <h1 className="main-heading text-primary fw-bold">Ooops!.. Seems your Session has Ended</h1>
                    <p className='p'>
                        ...Kindly retry using the button below.
                    </p>

                    <button className='btn btn-primary btn-lg' onClick={handleReload}>Back to home
                        <i className="la la-hand-pointer-o" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default ErrorComponent;
