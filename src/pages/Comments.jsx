import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/Comments.css";

function Comments() {
  const location = useLocation();
  const qs = new URLSearchParams(location.search);
  const productId = Number(qs.get("product"));

  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [alertModal, setAlertModal] = useState({ open: false, message: "" });
  const [newComment, setNewComment] = useState("");
  const [cantidades, setCantidades] = useState({});

  const token = localStorage.getItem("token");
  const currentUserId = Number(localStorage.getItem("user_id"));

  // Obtener producto y sus comentarios
  const fetchProductAndComments = useCallback(async () => {
    setLoading(true);
    setMensaje("");
    try {
      const [prodRes, commRes] = await Promise.all([
        api.get(`/products/${productId}`, { headers: { Authorization: `Bearer ${token}` } }),
        api.get(`/comments/product/${productId}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setProduct(prodRes.data);

      // Mapear comentarios para asegurarnos de que username exista
      const mappedComments = (Array.isArray(commRes.data) ? commRes.data : []).map(c => ({
  ...c,
  // agregamos username pero mantenemos user intacto
  username: c.user?.username || `Usuario #${c.user_id}`,
  user: c.user // aseguramos que user siga existiendo
}));


      setComments(mappedComments);
    } catch (err) {
      console.error(err);
      setMensaje("Error al obtener producto o comentarios.");
    } finally {
      setLoading(false);
    }
  }, [productId, token]);

  useEffect(() => {
    if (productId) fetchProductAndComments();
  }, [productId, fetchProductAndComments]);

  // Agregar comentario
  const agregarComentario = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post(
        "/comments/create",
        { product_id: productId, content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      setAlertModal({ open: true, message: "✅ Comentario agregado" });
      fetchProductAndComments();
    } catch (err) {
      setAlertModal({
        open: true,
        message: err.response?.data?.detail || "❌ Error al agregar comentario",
      });
    }
  };

  // Comprar directo
  const comprarAhora = async (prod) => {
    try {
      const res = await api.post(
        "/transactions/buy",
        { product_id: prod.id, quantity: cantidades[prod.id] || 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlertModal({ open: true, message: res.data.message || "✅ Has comprado este producto." });
      fetchProductAndComments(); // refrescar stock si es necesario
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
      await api.post(
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
        message: err.response?.data?.detail || "❌ Error al agregar al carrito",
      });
    }
  };

  // Eliminar comentario
  const eliminarComentario = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });
      setAlertModal({ open: true, message: "✅ Comentario eliminado" });
      fetchProductAndComments();
    } catch (err) {
      setAlertModal({
        open: true,
        message: err.response?.data?.detail || "❌ Error al eliminar comentario",
      });
    }
  };

  // Editar comentario
  const editarComentario = async (commentId, currentContent) => {
    const nuevoContenido = prompt("Editar comentario:", currentContent);
    if (!nuevoContenido) return;

    try {
      await api.put(
        `/comments/${commentId}`,
        { content: nuevoContenido },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlertModal({ open: true, message: "✅ Comentario actualizado" });
      fetchProductAndComments();
    } catch (err) {
      setAlertModal({
        open: true,
        message: err.response?.data?.detail || "❌ Error al actualizar comentario",
      });
    }
  };

  if (!productId) return <p className="error">Producto no especificado.</p>;

  return (
    <main className="comments-main">
      {mensaje && <p className="error">{mensaje}</p>}
      {loading ? (
        <p>Cargando producto y comentarios...</p>
      ) : (
        <>
          {product && (
            <>
              <div className="product-header">
                <img
                  src={product.image_url || "https://via.placeholder.com/80"}
                  alt={product.name}
                  className="product-header-img"
                />
                <div>
                  <h2>{product.name}</h2>
                  <p className="product-category">{product.category}</p>
                </div>
              </div>

              {/* Acciones de compra */}
              <div className="product-actions-comments">
                <label>
                  Cantidad:
                  <input
                    type="number"
                    min="1"
                    max={product.quantity || 999}
                    value={cantidades[product.id] || 1}
                    onChange={(e) =>
                      setCantidades((prev) => ({ ...prev, [product.id]: Number(e.target.value) }))
                    }
                  />
                </label>
                <button className="btn-comprar" onClick={() => comprarAhora(product)}>
                  Comprar ahora
                </button>
                <button className="btn-carrito" onClick={() => agregarAlCarrito(product)}>
                  Agregar al carrito 🛒
                </button>
              </div>

              {/* Formulario para agregar comentario */}
              <div className="add-comment">
                <textarea
                  placeholder="Escribe tu comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={agregarComentario}>Comentar</button>
              </div>
            </>
          )}

          {comments.length === 0 ? (
            <p className="no-comments">Este producto aún no tiene comentarios.</p>
          ) : (
            <ul className="comment-list">
{comments.map((c) => (
  <li key={c.id} className="comment-card">
    <div className="comment-header">
      <strong>{c.user.username}</strong>
      <span className="comment-date">
        {new Date(c.created_at).toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </span>
    </div>
    <p className="comment-content">“{c.content}”</p>
    {c.user.id === currentUserId && (
      <div className="comment-actions">
        <button onClick={() => editarComentario(c.id, c.content)}>✏️ Editar</button>
        <button onClick={() => eliminarComentario(c.id)}>🗑️ Eliminar</button>
      </div>
    )}
  </li>
))}




            </ul>
          )}
        </>
      )}

      {alertModal.open && (
        <div
          className="modal-overlay"
          onClick={() => setAlertModal({ open: false, message: "" })}
        >
          <div className="modal-content">
            <p>{alertModal.message}</p>
            <button onClick={() => setAlertModal({ open: false, message: "" })}>Cerrar</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Comments;
