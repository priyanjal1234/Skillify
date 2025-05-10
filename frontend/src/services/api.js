import axios from "axios";

const api = axios.create({
    baseURL: "https://skillify-backend.onrender.com"
})

export default api
