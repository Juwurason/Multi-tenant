
import axios from "axios";

const baseURL = "https://profitmax-001-site10.ctempurl.com/api";


const privateHttp = axios.create({
    baseURL: baseURL,

})

const publicHttp = axios.create({
    baseURL: baseURL,
})

export {
    privateHttp,
    publicHttp
};