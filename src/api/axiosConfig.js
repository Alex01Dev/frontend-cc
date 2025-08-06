import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000", // Tu backend FastAPI
});

// Interceptor para agregar el token dinámicamente en cada petición
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
