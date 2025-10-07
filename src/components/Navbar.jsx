import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import "../styles/Navbar.css";
import { FaChevronDown, FaShoppingCart } from "react-icons/fa";
import EditProfileModal from "./EditProfileModal";

function Navbar() {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showUserMenuDropdown, setShowUserMenuDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const userDropdownRef = useRef(null);
  const productDropdownRef = useRef(null);
  const userMenuDropdownRef = useRef(null);

  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "admin" | "user"
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const toggleUserDropdown = () => setShowUserDropdown(!showUserDropdown);
  const toggleProductDropdown = () => setShowProductDropdown(!showProductDropdown);
  const toggleUserMenuDropdown = () => setShowUserMenuDropdown(!showUserMenuDropdown);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioLogueado");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      const res = await axios.put(`/users/${user.id}`, updatedData);
      setUser(res.data); // Actualiza toda la info, incluyendo la foto
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
  };

  useEffect(() => {
    const username = localStorage.getItem("usuarioLogueado");
    if (!username) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`/user/${username}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error al obtener usuario");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target)) {
        setShowProductDropdown(false);
      }
      if (userMenuDropdownRef.current && !userMenuDropdownRef.current.contains(event.target)) {
        setShowUserMenuDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <span className="logo">EcoShop</span>

          {isAuthenticated && (
            <ul className="navbar-menu">
              <li>
                <NavLink to={role === "admin" ? "/dashboard" : "/user-home"}>
                  {role === "admin" ? "Dashboard" : "Inicio"}
                </NavLink>
              </li>

              <li className="dropdown-toggle" onClick={toggleProductDropdown} ref={productDropdownRef}>
                <span>
                  Productos <FaChevronDown className="dropdown-icon" />
                </span>
                {showProductDropdown && (
                  <ul className="dropdown-menu">
                    <li>
                      <NavLink to="/products">Lista de productos</NavLink>
                    </li>
                    {role === "admin" && (
                      <li>
                        <NavLink to="/add-product">Añadir producto</NavLink>
                      </li>
                    )}
                  </ul>
                )}
              </li>

              {role === "admin" && (
                <li className="dropdown-toggle" onClick={toggleUserMenuDropdown} ref={userMenuDropdownRef}>
                  <span>
                    Usuarios <FaChevronDown className="dropdown-icon" />
                  </span>
                  {showUserMenuDropdown && (
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink to="/users">Lista de usuarios</NavLink>
                      </li>
                      <li>
                        <NavLink to="/add-user">Añadir usuario</NavLink>
                      </li>
                    </ul>
                  )}
                </li>
              )}

              <li>
                <NavLink to="/recommendations">Recomendaciones</NavLink>
              </li>
              <li>
                <NavLink to="/comments">Comentarios</NavLink>
              </li>
              <li>
                <NavLink to="/centros-acopio">Centros de Reciclaje</NavLink>
              </li>

              {role === "user" && (
                <li>
                  <NavLink to="/cart" className="cart-link">
                    <FaShoppingCart className="cart-icon" /> Carrito
                  </NavLink>
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="userSection" ref={userDropdownRef}>
          {isAuthenticated ? (
            <>
              <div className="avatar-container" onClick={toggleUserDropdown}>
                <img
                  src={user?.profile_picture || defaultAvatar}
                  alt="avatar"
                  className="avatar"
                />
                <FaChevronDown className="dropdown-icon" />
              </div>

              {showUserDropdown && (
                <div className="dropdownMenu">
                  <div className="userInfo">
                    <img
                      src={user?.profile_picture || defaultAvatar}
                      alt="Foto perfil"
                      className="dropdownAvatar"
                    />
                    <div>
                      <p className="username">{user?.username}</p>
                      <p className="email">{user?.email}</p>
                    </div>
                  </div>

                  <div className="dropdownActions">
                    <button className="dropdownItem" onClick={() => setIsEditing(true)}>
                      Editar perfil
                    </button>
                    <button className="dropdownItem" onClick={handleLogout}>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="guestLinks">
              <NavLink to="/login" className="nav-button">
                Iniciar sesión
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* Modal de edición */}
      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        userData={user}
        onSave={handleSaveProfile}
      />
    </>
  );
}

export default Navbar;
