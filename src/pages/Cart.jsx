import React, { useEffect, useState, useCallback } from "react";
import axios from "../api/axiosConfig";
import {
  getLocalCart,
  saveLocalCart,
  removeFromLocalCart,
  updateLocalCartQuantity,
  clearLocalCart,
} from "../utils/localCart";
import "../styles/Cart.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [infoModal, setInfoModal] = useState({ open: false, message: "" });

  const token = localStorage.getItem("token");

  // Traer carrito desde backend (si online)
  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get("/cart/mycart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      setMensaje("❌ Error al obtener el carrito.");
      console.error(err);
    }
  }, [token]);

  // Al montar: si hay local_cart y estamos online -> sincronizar; si offline -> mostrar local
  useEffect(() => {
    const init = async () => {
      const local = getLocalCart();
      if (navigator.onLine) {
        if (local.length > 0) {
          try {
            await axios.post("/cart/sync", local, {
              headers: { Authorization: `Bearer ${token}` },
            });
            clearLocalCart();
          } catch (err) {
            console.log("Error al sincronizar local_cart on mount", err);
          }
        }
        await fetchCart();
      } else {
        setCart(local);
        setMensaje("⚠ Estás sin internet. Mostrando carrito guardado localmente.");
      }
    };

    init();
  }, [fetchCart, token]);

  // Comprar todo el carrito (intenta comprar backend)
  const handlePurchase = async () => {
    if (!navigator.onLine) {
      setInfoModal({ open: true, message: "🔴 No hay conexión. Primero sincroniza para comprar." });
      return;
    }

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
      setCart([]);
      clearLocalCart();
    } catch (err) {
      const msg = err.response?.data?.detail || "❌ Error al realizar la compra.";
      setInfoModal({ open: true, message: msg });
      console.error(err);
    }
  };

  // Vaciar carrito
  const handleClearCart = async () => {
    if (!navigator.onLine) {
      // limpiar local si offline
      clearLocalCart();
      setCart([]);
      setInfoModal({ open: true, message: "🟡 Carrito local vaciado." });
      return;
    }

    try {
      await axios.delete("/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart([]);
      clearLocalCart();
      setInfoModal({ open: true, message: "🛒 Carrito vaciado." });
    } catch (err) {
      const msg = err.response?.data?.detail || "❌ Error al vaciar carrito.";
      setInfoModal({ open: true, message: msg });
      console.error(err);
    }
  };

  // Eliminar un producto
  const handleRemove = async (productId) => {
    if (!navigator.onLine) {
      const updated = removeFromLocalCart(productId);
      setCart(updated);
      setInfoModal({ open: true, message: "🗑️ Producto eliminado del carrito local." });
      return;
    }

    try {
      await axios.delete(`/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // actualizar vista
      setCart((prev) => prev.filter((i) => i.product_id !== productId));
      // intentar también limpiar del local si existiera
      removeFromLocalCart(productId);
      setInfoModal({ open: true, message: "🗑️ Producto eliminado del carrito." });
    } catch (err) {
      const msg = err.response?.data?.detail || "❌ Error al eliminar producto.";
      setInfoModal({ open: true, message: msg });
      console.error(err);
    }
  };

  // Actualizar cantidad local o UI
  const handleUpdateQuantity = (productId, qty) => {
    if (qty < 1) return;
    if (!navigator.onLine) {
      const updated = updateLocalCartQuantity(productId, qty);
      setCart(updated);
      return;
    }
    // si está online: actualizamos UI y luego podrías llamar al endpoint para actualizar
    setCart((prev) => prev.map((p) => (p.product_id === productId ? { ...p, quantity: qty } : p)));
    // opcional: llamar endpoint para actualizar cantidad en backend si tienes uno
  };

  // total
  const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  // sincronizar cuando vuelva la conexión
  useEffect(() => {
    const syncLocalCart = async () => {
      if (!navigator.onLine) return;
      const local = getLocalCart();
      if (local.length === 0) return;

      try {
        await axios.post("/cart/sync", local, {
          headers: { Authorization: `Bearer ${token}` },
        });
        clearLocalCart();
        fetchCart();
      } catch (error) {
        console.log("Error al sincronizar local_cart on online event", error);
      }
    };

    window.addEventListener("online", syncLocalCart);
    return () => window.removeEventListener("online", syncLocalCart);
  }, [fetchCart, token]);

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
                {item.image_url && <img src={item.image_url} alt={item.name} />}
                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>Precio: ${item.price ?? "0"}</p>
                  <p>
                    Cantidad:{" "}
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.product_id, Number(e.target.value))}
                    />
                  </p>
                  <p>
                    Subtotal: <strong>${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</strong>
                  </p>
                </div>
                <div className="cart-actions">
                  <button className="remove-btn" onClick={() => handleRemove(item.product_id)}>
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

      {/* Modal de información */}
      {infoModal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <pre style={{ whiteSpace: "pre-wrap" }}>{infoModal.message}</pre>
            <button onClick={() => setInfoModal({ open: false, message: "" })}>Cerrar</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Cart;
