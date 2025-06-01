import axios from "axios";

const api = axios.create({
    baseURL: "https://skillify-lms-backend.onrender.com"
})

export default api
