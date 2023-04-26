import regeneratorRuntime from "@babel/runtime/regenerator";
import axios from "axios";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { LRUCache } from 'lru-cache';
import { privateHttp } from "../api/http";

const useUser = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    return user;
};

const useHttp = () => {
    const navigate = useHistory();
    const user = useUser();
    useEffect(() => {

        const reqInterceptor = privateHttp.interceptors.request.use(
            (config) => {
                if (user) {
                    config.headers["Authorization"] = `Bearer ${user.token}`;
                }
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
    }, [navigate, user]);

    // cache implementation
    const cache = new LRUCache({ max: 100, maxAge: 1000 * 60 * 5 }); // set max size to 100 and max age to 5 minutes



    const getFromCacheOrFetch = async (url, config) => {
        const cachedResponse = cache.get(url);

        if (cachedResponse) {
            return Promise.resolve(cachedResponse);
        }

        const response = await privateHttp.get(url, config);
        cache.set(url, response);

        return Promise.resolve(response);
    };


    const get = (url, config) => {
        const cacheTimeout = config && config.cacheTimeout ? config.cacheTimeout : 0;
        if (cacheTimeout > 0) {
            return getFromCacheOrFetch(url, config, cacheTimeout);
        } else {
            const source = axios.CancelToken.source();
            const responsePromise = privateHttp.get(url, { ...config, cancelToken: source.token });
            return { response: responsePromise, cancelToken: source.token };
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
