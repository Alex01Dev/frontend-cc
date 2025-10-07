import React, { useState, useEffect } from "react";
import "../styles/Users.css";

function EditProfileModal({ isOpen, onClose, userData, onSave }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    status: "",
    profile_picture: null,
  });

  useEffect(() => {
    if (userData) {
      setForm({
        username: userData.username || "",
        email: userData.email || "",
        status: userData.status || "",
        profile_picture: null, // inicializamos como null para nueva subida
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("status", form.status);
    if (form.profile_picture) formData.append("profile_picture", form.profile_picture);

    onSave(formData); // enviar FormData al backend
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✖</button>
        <form className="edit-user-form" onSubmit={handleSubmit}>
          <h3 className="edit-title">Editar Usuario</h3>
          <label>Nombre de usuario:</label>
          <input name="username" value={form.username} onChange={handleChange} required />

          <label>Correo electrónico:</label>
          <input name="email" value={form.email} onChange={handleChange} required />

          <label>Estatus:</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Active">Activo</option>
            <option value="Inactive">Inactivo</option>
          </select>

          <label>Foto de perfil:</label>
          <input type="file" name="profile_picture" onChange={handleChange} />

          <button className="save-btn" type="submit">Guardar cambios</button>
        </form>
      </div>
    </div>
  );
}


export default EditProfileModal;
