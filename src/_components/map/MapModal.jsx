import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

const LocationMapModal = ({ latitude, longitude }) => {
    const [showModal, setShowModal] = useState(false);

    // const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
    const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en;&z=14&output=embed`;

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <small
                onClick={openModal}
                className="pointer p-1 bg-success text-white rounded d-flex justify-content-center align-items-center"
                style={{ fontSize: "10px" }}
            >
                Show Location on map
            </small>

            <Modal show={showModal} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontSize: "10px" }}>Location of time clocked in</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-center align-items-center">
                        <iframe
                            width="400"
                            height="270"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={embedUrl}
                            title="Location Map"
                        ></iframe>
                    </div>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>
        </div>
    );
};

export default LocationMapModal;
