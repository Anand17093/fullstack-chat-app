import axios from "axios";
export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development"?"http://localhost:8080/api":"/api",
    withCredentials: true, //To send cookies in every single request
});
// axios.defaults.withCredentials = true;
