import React, { useState, useEffect } from "react";
import "../styles/Users.css";

function EditProfileModal({ isOpen, onClose, userData, onSave }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    status: "",
    profile_picture: "",
  });

  useEffect(() => {
    if (userData) {
      setForm({
        username: userData.username || "",
        email: userData.email || "",
        status: userData.status || "",
        profile_picture: userData.profile_picture || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form); // Llama a la función enviada por el navbar
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

          <label>Foto de perfil (URL):</label>
          <input name="profile_picture" value={form.profile_picture} onChange={handleChange} />

          <button className="save-btn" type="submit">Guardar cambios</button>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
