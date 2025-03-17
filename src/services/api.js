import axios from "axios";

const api = axios.create({
    baseURL: "https://skillify-lms.xyz"
})

export default api