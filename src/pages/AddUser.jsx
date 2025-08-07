import React, { useState } from "react";
import axios from "../api/axiosConfig";
import "../styles/AddUser.css";

function AddUser() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    status: "Active",
    image: null,
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm({
      ...form,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("status", form.status);
      if (form.image) {
        formData.append("image", form.image);
      }

      await axios.post("/register", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMensaje("Usuario registrado correctamente.");
      setForm({
        username: "",
        email: "",
        password: "",
        status: "Active",
        image: null,
      });
    } catch (error) {
      setMensaje("Error al registrar el usuario.");
      console.error(error);
    }
  };

  return (
    <div className="add-user-page">
      <div className="add-user-container">
        <h2>Registrar nuevo usuario</h2>

        <form onSubmit={handleSubmit} className="add-user-form">
          <label>Nombre de usuario:</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label>Correo electrónico:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Estado:</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="Active">Activo</option>
            <option value="Inactive">Inactivo</option>
          </select>

          <label>Foto de perfil:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />

          <button type="submit">Registrar</button>
        </form>

        {mensaje && <p className="user-message">{mensaje}</p>}
      </div>
    </div>
  );
}

export default AddUser;
