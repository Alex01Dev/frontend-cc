import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import "../styles/Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    status: true,
    profile_image: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users");
      setUsers(res.data);
    } catch (error) {
      setMensaje("Error al cargar usuarios.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      username: user.username || "",
      email: user.email || "",
      status: user.status,
      profile_image: user.profile_image || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === "status") {
      val = value === "true";
    }
    setForm({ ...form, [name]: val });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/users/${editingUser.id}`, form);
      setMensaje("Usuario actualizado correctamente.");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setMensaje("Error al actualizar usuario.");
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setForm({
      username: "",
      email: "",
      status: true,
      profile_image: "",
    });
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Deseas eliminar este usuario?")) return;
    try {
      await axios.delete(`/users/${id}`);
      setMensaje("Usuario eliminado.");
      fetchUsers();
    } catch {
      setMensaje("Error al eliminar usuario.");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <main className="users-main">
      <h2>Lista de Usuarios</h2>

      <div className="user-search">
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {mensaje && <p className="message">{mensaje}</p>}

      <table>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre de usuario</th>
            <th>Correo</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>
                {u.profile_image ? (
                  <img
                    src={u.profile_image}
                    alt="Foto"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "Sin foto"
                )}
              </td>
              <td>{u.username}</td>
              <td>{u.email || "No disponible"}</td>
              <td>{u.status ? "Activo" : "Inactivo"}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Editar</button>
                <button onClick={() => eliminarUsuario(u.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={cancelEdit}>✖</button>
            <h3>Editar Usuario</h3>
            <form className="edit-user-form" onSubmit={handleUpdate}>
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

              <label>Estatus:</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value={true}>Activo</option>
                <option value={false}>Inactivo</option>
              </select>

              <label>Foto de perfil (URL):</label>
              <input
                type="text"
                name="profile_image"
                value={form.profile_image}
                onChange={handleChange}
              />

              <button type="submit" className="save-btn">Guardar cambios</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Users;
