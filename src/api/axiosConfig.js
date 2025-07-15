import axios from "axios";

const token = localStorage.getItem("token");

const instance = axios.create({
  baseURL: "http://localhost:8000", 
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default instance;
