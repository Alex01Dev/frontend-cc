import React from "react";
import "../styles/Navbar.css";

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="logo">Consumo Consciente</div>
      <div className="userSection">
        <span>
          Hola, {localStorage.getItem("usuarioLogueado") || "Invitado"}
        </span>
        <button className="logoutButton" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
