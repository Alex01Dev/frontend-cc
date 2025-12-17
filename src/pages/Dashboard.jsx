import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [topProducts, setTopProducts] = useState([]);
  const [consumoData, setConsumoData] = useState([]);
  const [mlData, setMlData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    // Cargar todos los datos del ML supervisado y estadísticas
    axios.get("https://backend-cc-ui7i.onrender.com/ml/dashboard", config)
      .then(res => {
        setTopProducts(res.data.top_products || []);
        setConsumoData(res.data.consumo_data || []);
        setMlData({
          product_summary: res.data.product_summary || [],
          user_summary: res.data.user_summary || []
        });
      })
      .catch(() => {
        setTopProducts([]);
        setConsumoData([]);
        setMlData(null);
      });
  }, [navigate]);

  return (
    <main className="dashboard-main">

      <div className="dashboard-hero">
        <div className="hero-overlay">
          <h1>Bienvenidos a Consumo Consciente</h1>
          <p>
            Analiza tus hábitos de consumo con productos sustentables y visualizaciones
            basadas en datos reales para tomar decisiones más responsables.
          </p>
        </div>
      </div>

      <p className="dashboard-subtitle">Panel principal del Sistema</p>

      <div className="dashboard-grid">
        {/* Tarjetas principales */}
        <div className="dashboard-card">
          <img src="https://images.pexels.com/photos/7957740/pexels-photo-7957740.jpeg" alt="Productos" />
          <div className="dashboard-card-content">
            <h3>Productos sustentables</h3>
            <p>Visualiza los productos con menor huella ambiental.</p>
            <button onClick={() => navigate("/products")}>Ver más</button>
          </div>
        </div>
        <div className="dashboard-card">
          <img src="https://images.pexels.com/photos/12882853/pexels-photo-12882853.png" alt="Usuarios" />
          <div className="dashboard-card-content">
            <h3>Gestión de usuarios</h3>
            <p>Administra los perfiles y actividad de los usuarios.</p>
            <button onClick={() => navigate("/users")}>Ver más</button>
          </div>
        </div>
      </div>

      {/* Productos más vistos */}
      <div className="dashboard-graph-section">
        <h2>Productos más vistos</h2>
        {topProducts.length === 0 ? (
          <p>No hay datos disponibles.</p>
        ) : (
          <ul className="dashboard-list">
            {topProducts.map((p, idx) => (
              <li key={idx}>Producto ID: {p.product_id} – Visitas: {p.visitas}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Evolución del consumo responsable */}
      <div className="dashboard-graph-section">
        <h2>Evolución del consumo responsable</h2>
        {consumoData.length === 0 ? (
          <p>No hay datos aún.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={consumoData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#4caf50" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ML supervisado: Probabilidad de compra por producto */}
      <div className="dashboard-graph-section">
        <h2>Probabilidad de compra por producto (ML supervisado)</h2>
        {mlData && mlData.product_summary.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mlData.product_summary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product_id" />
              <YAxis />
              <Tooltip formatter={(value) => (value*100).toFixed(2) + "%"} />
              <Bar dataKey="probabilidad_compra" fill="#3b7d3b" />
            </BarChart>
          </ResponsiveContainer>
        ) : <p>No hay datos de ML disponibles.</p>}
      </div>

      {/* ML supervisado: Compras probables por usuario */}
      <div className="dashboard-graph-section">
        <h2>Compras probables por usuario (ML supervisado)</h2>
        {mlData && mlData.user_summary.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mlData.user_summary}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="user_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="compras_probables" stroke="#4caf50" />
            </LineChart>
          </ResponsiveContainer>
        ) : <p>No hay datos de ML disponibles.</p>}
      </div>

    </main>
  );
}

export default Dashboard;
