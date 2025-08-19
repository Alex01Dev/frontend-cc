import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/Comments.css";

function Comments() {
  const location = useLocation();
  const qs = new URLSearchParams(location.search);
  const productId = Number(qs.get("product")) || 10;

  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Obtener comentarios
  const fetchComments = async () => {
    setLoading(true);
    setMensaje("");
    try {
      const [prodRes, commRes] = await Promise.all([
        api.get(`/products/${productId}`), // obtener datos del producto
        api.get(`/comments/product/${productId}`) // obtener comentarios
      ]);

      setProduct(prodRes.data);
      setComments(Array.isArray(commRes.data) ? commRes.data : []);
    } catch (err) {
      console.error(err);
      setMensaje("Error al obtener comentarios o producto.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Ordenar comentarios
  const ordered = useMemo(() => {
    const arr = [...comments];
    arr.sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return order === "desc" ? db - da : da - db;
    });
    return arr;
  }, [comments, order]);

  // Paginación
  const paginated = useMemo(() => {
    const end = page * pageSize;
    return ordered.slice(0, end);
  }, [ordered, page]);

  const hasMore = paginated.length < ordered.length;

  return (
    <main className="comments-main">
      {/* Encabezado con datos del producto */}
      {product && (
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
      )}

      {/* Controles */}
      <div className="comments-header">
        <h3>Comentarios</h3>
        <div className="comments-actions">
          <select
            className="comments-select"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="desc">Más recientes</option>
            <option value="asc">Más antiguos</option>
          </select>
          <button className="comments-btn" onClick={fetchComments}>
            Actualizar
          </button>
        </div>
      </div>

      {/* Errores */}
      {mensaje && <p className="error">{mensaje}</p>}

      {/* Lista de comentarios */}
      {loading ? (
        <p>Cargando comentarios...</p>
      ) : paginated.length === 0 ? (
        <p className="no-comments">Este producto aún no tiene comentarios.</p>
      ) : (
        <>
          <ul className="comment-list">
            {paginated.map((c) => (
              <li key={c.id} className="comment-card">
                <div className="comment-header">
                  <strong>Usuario #{c.user_id}</strong>
                  <span className="comment-date">
                    {new Date(c.created_at).toLocaleDateString("es-MX", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="comment-content">“{c.content}”</p>
              </li>
            ))}
          </ul>
          {hasMore && (
            <div className="comments-footer">
              <button
                className="comments-btn"
                onClick={() => setPage((p) => p + 1)}
              >
                Cargar más
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default Comments;
