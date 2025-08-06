import React, { useState, useEffect } from "react";
import axios from "../api/axiosConfig";
import "../styles/Comments.css";

function Comments() {
  const [comments, setComments] = useState([]);
  const [productId] = useState(1); // Puedes cambiarlo por props si quieres dinamismo
  const [mensaje, setMensaje] = useState("");

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/comments/product/${productId}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
      setMensaje("Error al obtener comentarios.");
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [productId]);

  return (
    <main className="comments-main">
      <h2>Comentarios del Producto #{productId}</h2>
      {mensaje && <p className="error">{mensaje}</p>}

      {comments.length === 0 ? (
        <p className="no-comments">Este producto aún no tiene comentarios.</p>
      ) : (
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c.id} className="comment-card">
              <div className="comment-header">
                <strong>Usuario #{c.user_id}</strong> {/* Antes: c.user.username */}
                <span className="comment-date">
                  {new Date(c.created_at).toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="comment-content">"{c.content}"</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Comments;
