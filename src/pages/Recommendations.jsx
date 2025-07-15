import React, { useState } from "react";
import axios from "axios";
import "../styles/Recommendations.css";

function Recommendations() {
  const [userId, setUserId] = useState("");
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const obtenerRecomendaciones = async () => {
    setMensaje("");
    setRecomendaciones([]);

    if (!userId) {
      setMensaje("Ingresa un ID de usuario.");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8000/recomendaciones/${userId}`);
      setRecomendaciones(res.data.recomendaciones);
    } catch (error) {
      setMensaje(
        error.response?.data?.detail || "No se pudieron obtener recomendaciones."
      );
    }
  };

  return (
    <main className="recommendations-main">
      <h2>Recomendaciones Personalizadas</h2>

      <div className="recommendations-form">
        <input
          type="number"
          placeholder="ID de Usuario"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={obtenerRecomendaciones}>Obtener recomendaciones</button>
      </div>

      {mensaje && <p className="message">{mensaje}</p>}

      {recomendaciones.length > 0 && (
        <ul className="recommendations-list">
          {recomendaciones.map((id, index) => (
            <li key={index}>ID Producto recomendado: {id}</li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Recommendations;
