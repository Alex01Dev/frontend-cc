import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Menú</h2>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link">Dashboard</NavLink>
        <NavLink to="/products" className="sidebar-link">Productos</NavLink>
        <NavLink to="/users" className="sidebar-link">Usuarios</NavLink>
        <NavLink to="/recommendations" className="sidebar-link">Recomendaciones</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
