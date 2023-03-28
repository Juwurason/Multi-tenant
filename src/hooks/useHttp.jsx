import { AxiosError } from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { privateHttp } from "../api/http";

const useHttp = () => {

    const navigate = useHistory()

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        const reqInterceptor = privateHttp.interceptors.request.use(
            (config) => {
                config.headers['Authorization'] = `Bearer ${user.token}`
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        )

        const resInterceptor = privateHttp.interceptors.response.use(
            (res) => {
                return Promise.resolve(res)
            },
            (err) => {
                if (err instanceof AxiosError) {
                    if (err.response.status == 401) {
                        navigate.push('/')

                    } else {
                        return Promise.reject(err);
                    }
                }

                return Promise.reject(err);

            }
        )

        return () => {
            privateHttp.interceptors.response.eject(resInterceptor)
            privateHttp.interceptors.request.eject(reqInterceptor)
        }

    }, [])

    return privateHttp
}


export default useHttp;