import axios from "axios";

const HttpInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

HttpInstance.interceptors.response.use(undefined, async (error) => {
  error.message =
    error.response?.data?.message || error.message || "Unknown error";
  return Promise.reject(error);
});

export default HttpInstance;
