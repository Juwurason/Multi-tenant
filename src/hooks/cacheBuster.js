import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CacheBuster = () => {
    const location = useLocation();
    const parseVersion = (str) => +str.replace(/\D/g, '');

    useEffect(() => {
        fetch(`/meta.json?v=${+new Date()}`, { cache: 'no cache' })
            .then((response) => response.json())
            .then((meta) => {
                if (meta?.version) {
                    const metaVersion = parseVersion(meta.version);
                    const packageVersion = parseVersion(process.env.REACT_APP_VERSION); // Read version from environment
                    if (packageVersion < metaVersion) {
                        if (window?.location?.reload) {
                            window.location.reload();
                        }
                    }
                }
            })
            .catch((error) => {
                console.error('something went wrong fetching meta.json', error);
            });
    }, [location]);

    return null;
};

export default CacheBuster;
