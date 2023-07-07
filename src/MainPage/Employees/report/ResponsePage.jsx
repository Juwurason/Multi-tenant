import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

const ResponsePage = () => {
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        // Handle the code and state as needed
        console.log('Code:', code);
        console.log('State:', state);

        // Redirect to another page after handling the response URL
        // history.push('/dashboard');
    }, [history]);

    return (
        <div>
            <h1>Response Handler</h1>
            {/* Add your response handling logic and UI here */}
        </div>
    );
};

export default ResponsePage;