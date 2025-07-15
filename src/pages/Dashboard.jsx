import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis,CartesianGrid,Tooltip,ResponsiveContainer,} from "recharts";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
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
      <div className="dashboard-header">
        <h1>Bienvenidos a Consumo Consciente</h1>
        <p>Panel principal del Sistema.</p>
      </div>

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
    </main>
  );
}

export default Dashboard;
