import axios from "axios";

const API = await axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

export default API;