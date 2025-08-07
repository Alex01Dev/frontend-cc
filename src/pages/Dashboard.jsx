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
  const [recommendations, setRecommendations] = useState([]);
  const [consumoData, setConsumoData] = useState([]);

  // Token check + llamadas a la API
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Obtener productos más vistos
    axios
      .get("http://localhost:8000/stats/productos-mas-vistos", config)
      .then((res) => setTopProducts(res.data))
      .catch(() => setTopProducts([]));

    // Obtener recomendaciones
    axios
      .get("http://localhost:8000/modelo/entrenar", config)
      .then((res) => setRecommendations(res.data.recomendaciones))
      .catch(() => setRecommendations([]));

    // Obtener evolución del consumo (simulado)
    axios
      .get("http://localhost:8000/stats/consumo-responsable-usuario", config)
      .then((res) => setConsumoData(res.data))
      .catch(() => setConsumoData([]));
  }, [navigate]);

  const chartData = [
    { name: "Ene", productos: 12 },
    { name: "Feb", productos: 18 },
    { name: "Mar", productos: 8 },
    { name: "Abr", productos: 22 },
    { name: "May", productos: 16 },
    { name: "Jun", productos: 25 },
  ];

  return (
    <main className="dashboard-main">

      <div className="dashboard-hero">
      <div className="hero-overlay">
        <h1>Bienvenidos a Consumo Consciente</h1>
        <p>
          Esta plataforma permite analizar y mejorar tus hábitos de consumo con productos sustentables,
          recomendaciones inteligentes y visualizaciones que te ayudan a tomar decisiones más responsables.
        </p>
      </div>
     </div>

      <p className="dashboard-subtitle">Panel principal del Sistema</p>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <img
            src="https://images.pexels.com/photos/7957740/pexels-photo-7957740.jpeg"
            alt="Productos"
          />
          <div className="dashboard-card-content">
            <h3>Productos sustentables</h3>
            <p>Visualiza los productos con menor huella ambiental.</p>
            <button onClick={() => navigate("/products")}>Ver más</button>
          </div>
        </div>

        <div className="dashboard-card">
          <img
            src="https://images.pexels.com/photos/12882853/pexels-photo-12882853.png"
            alt="Usuarios"
          />
          <div className="dashboard-card-content">
            <h3>Gestión de usuarios</h3>
            <p>Administra los perfiles y actividad de los usuarios.</p>
            <button onClick={() => navigate("/users")}>Ver más</button>
          </div>
        </div>

        <div className="dashboard-card">
          <img
            src="https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg"
            alt="Recomendaciones"
          />
          <div className="dashboard-card-content">
            <h3>Recomendaciones inteligentes</h3>
            <p>Basadas en hábitos sustentables y preferencias del usuario.</p>
            <button onClick={() => navigate("/recommendations")}>
              Ver más
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-graph-section">
        <h2>Resumen de productos por mes</h2>
        <div className="dashboard-chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="productos" fill="#3b7d3b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Panel de productos más vistos */}
      <div className="dashboard-graph-section">
        <h2>Productos más vistos</h2>
        {topProducts.length === 0 ? (
          <p>No hay datos disponibles.</p>
        ) : (
          <ul className="dashboard-list">
            {topProducts.map((p, idx) => (
              <li key={idx}>
                Producto ID: {p.product_id} – Visitas: {p.visitas}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Panel de recomendaciones */}
      <div className="dashboard-graph-section">
        <h2>Recomendaciones para ti</h2>
        {recommendations.length === 0 ? (
          <p>No hay recomendaciones disponibles.</p>
        ) : (
          <ul className="dashboard-list">
            {recommendations.map((r, idx) => (
              <li key={idx}>
                {r.name} ({r.category}) – Score: {r.score.toFixed(2)}
              </li>
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
    </main>
  );
}

export default Dashboard;
