import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    nombre_usuario: "",
    correo_electronico: "",
    estatus: "Activo",
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      setMensaje("Error al cargar usuarios.");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      nombre_usuario: user.nombre_usuario,
      correo_electronico: user.correo_electronico,
      estatus: user.estatus,
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/users/${editingUser.id}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMensaje("Usuario actualizado correctamente.");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setMensaje("Error al actualizar usuario.");
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setForm({
      nombre_usuario: "",
      correo_electronico: "",
      estatus: "Activo",
    });
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Deseas eliminar este usuario?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("Usuario eliminado.");
      fetchUsers();
    } catch {
      setMensaje("Error al eliminar usuario.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="users-main">
      <h2>Gestión de Usuarios</h2>
      {mensaje && <p className="message">{mensaje}</p>}

      <table>
        <thead>
          <tr>
            <th>Nombre de usuario</th>
            <th>Correo</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre_usuario}</td>
              <td>{u.correo_electronico || "No disponible"}</td>
              <td>{u.estatus}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Editar</button>
                <button onClick={() => eliminarUsuario(u.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <form className="user-form" onSubmit={handleUpdate}>
          <h3>Editar Usuario</h3>
          <input
            type="text"
            name="nombre_usuario"
            placeholder="Nombre de usuario"
            value={form.nombre_usuario}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="correo_electronico"
            placeholder="Correo electrónico"
            value={form.correo_electronico}
            onChange={handleChange}
            required
          />
          <select name="estatus" value={form.estatus} onChange={handleChange}>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>

          <div className="form-buttons">
            <button type="submit">Actualizar</button>
            <button type="button" className="cancel" onClick={cancelEdit}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </main>
  );
}

export default Users;
