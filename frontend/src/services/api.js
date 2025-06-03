import axios from "axios";

const api = axios.create({
    baseURL: "https://skillify-backend-7pex.onrender.com"
})

export default api
