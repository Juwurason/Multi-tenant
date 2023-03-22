import axios from "axios";

const baseURL = "http://profitmax-001-site8.ctempurl.com/api"

const http = axios.create({
    baseURL: baseURL,
    // headers:{
    // 'Authorization': `Bearer ${localstorage.getItem("access_token")}`
    // }
})

export default http;