import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // Tu backend FastAPI
  timeout: 15000, // 15s para evitar cuelgues
  // withCredentials: true, // ← solo si usas cookies/sesiones
});

// Interceptor para agregar el token dinámicamente en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta: manejo global de 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // Token inválido/expirado → limpiar y mandar a login
      localStorage.removeItem("token");
      localStorage.removeItem("usuarioLogueado");
      localStorage.removeItem("role");
      // Evita bucles si ya estás en /login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
