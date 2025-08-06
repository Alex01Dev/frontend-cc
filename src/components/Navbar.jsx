import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import "../styles/Navbar.css";
import { FaChevronDown } from "react-icons/fa";

function Navbar() {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showUserMenuDropdown, setShowUserMenuDropdown] = useState(false);
  const [user, setUser] = useState(null);

  const userDropdownRef = useRef(null);
  const productDropdownRef = useRef(null);
  const userMenuDropdownRef = useRef(null);

  const navigate = useNavigate(); 

  const toggleUserDropdown = () => setShowUserDropdown(!showUserDropdown);
  const toggleProductDropdown = () => setShowProductDropdown(!showProductDropdown);
  const toggleUserMenuDropdown = () => setShowUserMenuDropdown(!showUserMenuDropdown);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioLogueado");
    navigate("/login"); // ✅ navegación sin recargar la página
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
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">Consumo Consciente</span>
        <ul className="navbar-menu">
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>

          {/* Submenú Productos */}
          <li
            className="dropdown-toggle"
            onClick={toggleProductDropdown}
            ref={productDropdownRef}
          >
            <span>Productos <FaChevronDown className="dropdown-icon" /></span>
            {showProductDropdown && (
              <ul className="dropdown-menu">
                <li><NavLink to="/products">Lista de productos</NavLink></li>
                <li><NavLink to="/add-product">Añadir producto</NavLink></li>
              </ul>
            )}
          </li>

          {/* Submenú Usuarios */}
          <li
            className="dropdown-toggle"
            onClick={toggleUserMenuDropdown}
            ref={userMenuDropdownRef}
          >
            <span>Usuarios <FaChevronDown className="dropdown-icon" /></span>
            {showUserMenuDropdown && (
              <ul className="dropdown-menu">
                <li><NavLink to="/users">Lista de usuarios</NavLink></li>
                <li><NavLink to="/add-user">Añadir usuario</NavLink></li>
              </ul>
            )}
          </li>

          <li><NavLink to="/recommendations">Recomendaciones</NavLink></li>
          <li><NavLink to="/comments">Comentarios</NavLink></li>
        </ul>
      </div>

      <div className="userSection" onClick={toggleUserDropdown} ref={userDropdownRef}>
        <img
          src={user?.profile_picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          alt="avatar"
          className="avatar"
        />
        <FaChevronDown className="dropdown-icon" />

        {showUserDropdown && (
          <div className="dropdownMenu">
            <div className="userInfo">
              <img
                src={user?.profile_picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="Foto perfil"
                className="dropdownAvatar"
              />
              <div>
                <p className="username">{user?.username}</p>
                <p className="email">{user?.email}</p>
              </div>
            </div>

            <div className="dropdownActions">
              <button className="dropdownItem" onClick={() => alert("Editar perfil próximamente")}>
                Editar perfil
              </button>
              <button className="dropdownItem" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
