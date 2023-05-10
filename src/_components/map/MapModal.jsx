import React from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

const MapModal = ({ google, latitude, longitude, onClose }) => {
    const mapStyles = {
        width: '400px',
        height: '300px',
    };

    const center = {
        lat: latitude,
        lng: longitude,
    };

    return (
        <div>
            <Map google={google} zoom={14} style={mapStyles} initialCenter={center}>
                <Marker position={center} />
            </Map>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default GoogleApiWrapper({
    apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
})(MapModal);
