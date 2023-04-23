import { AxiosError } from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { privateHttp } from "../api/http";

const useHttp = () => {
    const navigate = useHistory();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const reqInterceptor = privateHttp.interceptors.request.use(
            (config) => {
                config.headers["Authorization"] = `Bearer ${user.token}`;
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        const resInterceptor = privateHttp.interceptors.response.use(
            (res) => {
                return Promise.resolve(res);
            },
            (err) => {
                if (err instanceof AxiosError) {
                    if (err.response.status === 401) {
                        localStorage.removeItem("user"); // remove expired token from local storage
                        navigate.push("/"); // redirect to login page
                    } else {
                        return Promise.reject(err);
                    }
                }

                return Promise.reject(err);
            }
        );

        return () => {
            privateHttp.interceptors.response.eject(resInterceptor);
            privateHttp.interceptors.request.eject(reqInterceptor);
        };
    }, [navigate]);

    // cache implementation
    const cache = {};
    const cacheTimeouts = {};

    const getFromCacheOrFetch = async (url, config, cacheTimeout) => {
        if (cache[url]) {
            return cache[url];
        }

        const response = await privateHttp.get(url, config);
        cache[url] = response;
        cacheTimeouts[url] = setTimeout(() => {
            delete cache[url];
            delete cacheTimeouts[url];
        }, cacheTimeout);

        return response;
    };

    const get = (url, config) => {
        const cacheTimeout = config && config.cacheTimeout ? config.cacheTimeout : 0;
        if (cacheTimeout > 0) {
            return getFromCacheOrFetch(url, config, cacheTimeout);
        } else {
            return privateHttp.get(url, config);
        }
    };

    const post = (url, data, config) => privateHttp.post(url, data, config);

    const put = (url, data, config) => privateHttp.put(url, data, config);

    const del = (url, config) => privateHttp.delete(url, config);

    const patch = (url, data, config) => privateHttp.patch(url, data, config);

    return {
        get,
        post,
        put,
        delete: del,
        patch,
    };
};

export default useHttp;


// import { AxiosError } from "axios";
// import { useEffect } from "react";
// import { useHistory } from "react-router-dom";
// import { privateHttp } from "../api/http";


// const useHttp = () => {

//     const navigate = useHistory()

//     useEffect(() => {
//         const user = JSON.parse(localStorage.getItem('user'))
//         const reqInterceptor = privateHttp.interceptors.request.use(
//             (config) => {
//                 config.headers['Authorization'] = `Bearer ${user.token}`
//                 return config;
//             },
//             (error) => {
//                 return Promise.reject(error);
//             }
//         )

//         const resInterceptor = privateHttp.interceptors.response.use(
//             (res) => {
//                 return Promise.resolve(res)
//             },
//             (err) => {
//                 if (err instanceof AxiosError) {
//                     if (err.response.status == 401) {
//                         localStorage.removeItem('user');
//                         navigate.push('/')

//                     } else {
//                         return Promise.reject(err);
//                     }
//                 }

//                 return Promise.reject(err);

//             }
//         )

//         return () => {
//             privateHttp.interceptors.response.eject(resInterceptor)
//             privateHttp.interceptors.request.eject(reqInterceptor)
//         }

//     }, [])

//     return privateHttp
// }


// export default useHttp;