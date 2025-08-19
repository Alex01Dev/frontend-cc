import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "../api/axiosConfig"; 
import "../styles/Recommendations.css";

function Recommendations() {
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [cantidades, setCantidades] = useState({});
  const [alertModal, setAlertModal] = useState({ open: false, message: "" });

  const role = localStorage.getItem("role"); 
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); 

  const handleCantidadChange = (id, value) => {
    setCantidades((prev) => ({ ...prev, [id]: value }));
  };

  const obtenerRecomendaciones = useCallback(async () => {
    setMensaje("");
    setRecomendaciones([]);

    if (!token) {
      setMensaje("Debes iniciar sesión para ver recomendaciones.");
      return;
    }

    try {
      const res = await axios.get("/modelo/entrenar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecomendaciones(res.data.recomendaciones.recomendaciones);
    } catch (error) {
      setMensaje(
        error.response?.data?.detail || "No se pudieron obtener recomendaciones."
      );
    }
  }, [token]);

  useEffect(() => {
    obtenerRecomendaciones();
  }, [obtenerRecomendaciones]);

  // Comprar directo
  const comprarAhora = async (prod) => {
    try {
      const res = await axios.post(
        "/transactions/buy",
        { product_id: prod.id, quantity: cantidades[prod.id] || 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlertModal({
        open: true,
        message: res.data.message || "✅ Has comprado este producto.",
      });
      obtenerRecomendaciones(); 
    } catch (err) {
      setAlertModal({
        open: true,
        message: err.response?.data?.detail || "❌ Error al comprar producto",
      });
    }
  };

  // Agregar al carrito
  const agregarAlCarrito = async (prod) => {
    try {
      const res = await axios.post(
        "/cart/add",
        { product_id: prod.id, quantity: cantidades[prod.id] || 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlertModal({
        open: true,
        message: `✅ ${prod.name} agregado al carrito (x${cantidades[prod.id] || 1})`,
      });
    } catch (err) {
      setAlertModal({
        open: true,
        message:
          err.response?.data?.detail ||
          "❌ Error al agregar al carrito",
      });
    }
  };

  // NUEVO: registrar interacción y navegar a comentarios
  const handleProductClick = async (prod) => {
    try {
      await axios.post(
        "/interacciones",
        { product_id: prod.id, action: "click" }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error registrando interacción:", err);
    } finally {
      navigate(`/comments?product=${prod.id}`);
    }
  };

  return (
    <main className="recommendations-main">
      <h2>Recomendaciones Personalizadas</h2>
      {mensaje && <p className="message">{mensaje}</p>}

      <div className="product-grid">
        {recomendaciones.map((prod) => (
          <div key={prod.id} className="product-card">

            {/* Clickable card */}
            <div
              className="product-clickable"
              onClick={() => handleProductClick(prod)}
              style={{ cursor: "pointer" }}
            >
              {prod.image_url && <img src={prod.image_url} alt={prod.name} />}
              <div className="product-info">
                <h3>{prod.name}</h3>
                <p>Categoría: <strong>{prod.category}</strong></p>
                <p>Precio: <strong>${prod.price.toFixed(2)}</strong></p>
                {prod.quantity !== undefined && <p>Stock: <strong>{prod.quantity}</strong></p>}
                {prod.status && <p>Estado: <strong>{prod.status}</strong></p>}
                {prod.carbon_footprint !== undefined && <p>Huella CO₂: <strong>{prod.carbon_footprint} kg</strong></p>}
                {prod.recyclable_packaging !== undefined && <p>Reciclable: {prod.recyclable_packaging ? "Sí ♻️" : "No"}</p>}
                {prod.local_origin !== undefined && <p>Origen local: {prod.local_origin ? "Sí 🏡" : "No"}</p>}
                {prod.score !== undefined && <p>Score: <strong>{prod.score.toFixed(2)}</strong></p>}
              </div>
            </div>

            {/* Botones bien separados del click */}
            <div className="product-actions">
              <label>
                Cantidad:
                <input
                  type="number"
                  min="1"
                  max={prod.quantity || 999}
                  value={cantidades[prod.id] || 1}
                  onChange={(e) => handleCantidadChange(prod.id, Number(e.target.value))}
                />
              </label>
              <button className="btn-comprar" onClick={(e) => { e.stopPropagation(); comprarAhora(prod); }}>
                Comprar ahora
              </button>
              <button className="btn-carrito" onClick={(e) => { e.stopPropagation(); agregarAlCarrito(prod); }}>
                Agregar al carrito 🛒
              </button>
            </div>
          </div>
        ))}
      </div>

      {alertModal.open && (
        <div className="modal-overlay" onClick={() => setAlertModal({ open: false, message: "" })}>
          <div className="modal-content">
            <p>{alertModal.message}</p>
            <button onClick={() => setAlertModal({ open: false, message: "" })}>Cerrar</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Recommendations;
