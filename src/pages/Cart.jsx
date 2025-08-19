import React, { useEffect, useState, useCallback } from "react";
import axios from "../api/axiosConfig";
import "../styles/Cart.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [infoModal, setInfoModal] = useState({ open: false, message: "" });

  const token = localStorage.getItem("token");

  // ✅ Traer carrito
  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get("/cart/mycart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      setMensaje("❌ Error al obtener el carrito.");
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ✅ Comprar todo el carrito
  const handlePurchase = async () => {
    try {
      const res = await axios.post(
        "/cart/purchase",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { message, products } = res.data;
      let summary = `${message}\n`;

      if (products.purchased.length > 0) {
        summary += `✅ Comprados: ${products.purchased
          .map((p) => `Producto ${p.product_id} (x${p.quantity})`)
          .join(", ")}\n`;
      }

      if (products.skipped.length > 0) {
        summary += `⚠️ No comprados: ${products.skipped
          .map((s) => `Producto ${s.product_id} (${s.reason})`)
          .join(", ")}`;
      }

      setInfoModal({ open: true, message: summary });
      setCart([]); // limpiar el carrito en frontend
    } catch (err) {
      const msg =
        err.response?.data?.detail || "❌ Error al realizar la compra.";
      setInfoModal({ open: true, message: msg });
    }
  };

  // ✅ Vaciar carrito
  const handleClearCart = async () => {
    try {
      await axios.delete("/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart([]);
      setInfoModal({ open: true, message: "🛒 Carrito vaciado." });
    } catch (err) {
      const msg =
        err.response?.data?.detail || "❌ Error al vaciar carrito.";
      setInfoModal({ open: true, message: msg });
    }
  };

  // ✅ Eliminar un producto del carrito
  const handleRemove = async (productId) => {
    try {
      await axios.delete(`/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(cart.filter((i) => i.product_id !== productId));
      setInfoModal({ open: true, message: "🗑️ Producto eliminado del carrito." });
    } catch (err) {
      const msg =
        err.response?.data?.detail || "❌ Error al eliminar producto.";
      setInfoModal({ open: true, message: msg });
    }
  };

  // ✅ Calcular total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="cart-main">
      <h2> Mi Carrito 🛒</h2>
      {mensaje && <p className="message">{mensaje}</p>}

      {cart.length === 0 ? (
        <p className="empty-cart">Tu carrito está vacío.</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.product_id} className="cart-item">
                <img src={item.image_url} alt={item.name} />
                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>Precio: ${item.price}</p>
                  <p>Cantidad: {item.quantity}</p>
                  <p>
                    Subtotal:{" "}
                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  </p>
                </div>
                <div className="cart-actions">
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item.product_id)}
                  >
                    ❌ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Total: ${total.toFixed(2)}</h3>
            <button className="purchase-btn" onClick={handlePurchase}>
              Comprar todo
            </button>
            <button className="clear-btn" onClick={handleClearCart}>
              Vaciar carrito
            </button>
          </div>
        </>
      )}

      {/* ✅ Modal de información */}
      {infoModal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <pre style={{ whiteSpace: "pre-wrap" }}>{infoModal.message}</pre>
            <button
              onClick={() => setInfoModal({ open: false, message: "" })}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Cart;
