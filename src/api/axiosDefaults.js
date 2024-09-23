import axios from "axios";
import { getCookie } from "../utils/utils";

axios.defaults.baseURL = "https://acropolis-estates-api-2e18d7daaa60.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = undefined;
axios.defaults.withCredentials = true;

const axiosReq = axios.create();
const axiosRes = axios.create();

// Add CSRF token to request headers
axiosReq.interceptors.request.use(
    (config) => {
        const csrfToken = getCookie('csrftoken');
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export { axiosReq, axiosRes };
