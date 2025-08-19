import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/UserHome.css";

export default function UserHome() {
  const navigate = useNavigate();
  const username = localStorage.getItem("usuarioLogueado") || "usuario";

  const [products, setProducts] = useState([]);
  const [topViewed, setTopViewed] = useState([]);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  const refFeatured = useRef(null);
  const refRecs = useRef(null);

  // Carga inicial
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [prodRes, topRes] = await Promise.all([
          api.get("/products/get"),
          api.get("/stats/productos-mas-vistos").catch(() => ({ data: [] })),
        ]);

        if (!mounted) return;
        setProducts(prodRes.data || []);
        setTopViewed(topRes.data || []);

        try {
          const recRes = await api.get("/modelo/entrenar");
          const ids = recRes?.data?.recomendaciones || [];
          const mapped =
            ids.length && prodRes.data?.length
              ? prodRes.data.filter((p) => ids.includes(p.id))
              : [];
          setRecs(mapped);
        } catch {
          setRecs([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const scrollByAmount = (ref, dir = 1) => {
    if (!ref.current) return;
    const itemWidth = ref.current.firstChild?.getBoundingClientRect()?.width || 280;
    ref.current.scrollBy({ left: dir * (itemWidth + 16), behavior: "smooth" });
  };

  const featured = products.slice(0, 12);
  const recommended = recs.length ? recs : products.slice(12, 24);

  // Click en producto: registrar interacción y navegar a comentarios
  const handleProductClick = async (prod) => {
    try {
      await api.post(
        "/interacciones",
        { product_id: prod.id, action: "click" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (err) {
      console.error("Error registrando interacción:", err);
    } finally {
      navigate(`/comments?product=${prod.id}`);
    }
  };

  return (
    <main className="userhome">
      {/* HERO */}
      <section className="uh-hero">
        <div className="uh-hero__content">
          <div className="uh-pill">Bienvenido</div>
          <h1>Hola, {username} 👋</h1>
          <p>
            Explora <strong>productos sustentables</strong>, recibe{" "}
            <strong>recomendaciones</strong> y toma decisiones de consumo más
            responsables. ¡Cada elección cuenta! 🌱
          </p>
          <div className="uh-hero__actions">
            <button onClick={() => navigate("/products")} className="uh-btn">
              Ver productos
            </button>
            <button
              onClick={() => navigate("/recommendations")}
              className="uh-btn uh-btn--outline"
            >
              Ver recomendaciones
            </button>
          </div>
        </div>

        <div className="uh-hero__image">
          <img
            src="https://images.pexels.com/photos/7363199/pexels-photo-7363199.jpeg"
            alt="Consumo responsable"
            loading="lazy"
          />

          {/* Estadísticas */}
          <div className="uh-stats">
            <div className="uh-stat">
              <span className="uh-stat__num">{products.length}</span>
              <span className="uh-stat__label">Productos</span>
            </div>
            <div className="uh-stat">
              <span className="uh-stat__num">
                {topViewed?.length ? topViewed.length : "—"}
              </span>
              <span className="uh-stat__label">Más vistos</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="uh-section">
        <div className="uh-section__header">
          <h2>Productos destacados</h2>
          <div className="uh-arrows">
            <button
              className="uh-arrow"
              onClick={() => scrollByAmount(refFeatured, -1)}
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              className="uh-arrow"
              onClick={() => scrollByAmount(refFeatured, 1)}
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>
        </div>

        {loading ? (
          <div className="uh-carousel is-skeleton">
            {Array.from({ length: 5 }).map((_, i) => (
              <div className="uh-card sk" key={i}>
                <div className="uh-card__image sk" />
                <div className="uh-card__body">
                  <div className="sk sk-line" />
                  <div className="sk sk-line short" />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="uh-empty">Aún no hay productos.</p>
        ) : (
          <div className="uh-carousel" ref={refFeatured}>
            {featured.map((p) => (
              <div
                key={p.id}
                className="uh-card"
                title={p.name}
                onClick={() => handleProductClick(p)}
                style={{ cursor: "pointer" }}
              >
                <div className="uh-card__image">
                  <img
                    src={p.image_url || "https://via.placeholder.com/600x400?text=Producto"}
                    alt={p.name}
                    loading="lazy"
                  />
                  {p.recyclable_packaging && <span className="uh-badge">♻️</span>}
                </div>
                <div className="uh-card__body">
                  <h3 className="uh-card__title">{p.name}</h3>
                  <p className="uh-card__meta">
                    {p.category} · CO₂ {p.carbon_footprint} kg
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* RECOMENDADOS */}
      <section className="uh-section">
        <div className="uh-section__header">
          <h2>Recomendados para ti</h2>
          <div className="uh-arrows">
            <button
              className="uh-arrow"
              onClick={() => scrollByAmount(refRecs, -1)}
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              className="uh-arrow"
              onClick={() => scrollByAmount(refRecs, 1)}
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>
        </div>

        {loading ? (
          <div className="uh-carousel is-skeleton">
            {Array.from({ length: 5 }).map((_, i) => (
              <div className="uh-card sk" key={i}>
                <div className="uh-card__image sk" />
                <div className="uh-card__body">
                  <div className="sk sk-line" />
                  <div className="sk sk-line short" />
                </div>
              </div>
            ))}
          </div>
        ) : recommended.length === 0 ? (
          <p className="uh-empty">
            No hay recomendaciones aún. Explora productos para generarlas.
          </p>
        ) : (
          <div className="uh-carousel" ref={refRecs}>
            {recommended.map((p) => (
              <div
                key={`rec-${p.id}`}
                className="uh-card"
                title={p.name}
                onClick={() => handleProductClick(p)}
                style={{ cursor: "pointer" }}
              >
                <div className="uh-card__image">
                  <img
                    src={p.image_url || "https://via.placeholder.com/600x400?text=Producto"}
                    alt={p.name}
                    loading="lazy"
                  />
                  {p.local_origin && <span className="uh-badge uh-badge--alt">🏡</span>}
                </div>
                <div className="uh-card__body">
                  <h3 className="uh-card__title">{p.name}</h3>
                  <p className="uh-card__meta">
                    {p.category} · {p.recyclable_packaging ? "Reciclable" : "Convencional"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CONSEJOS RÁPIDOS */}
      <section className="uh-info">
        <h2>Consejos rápidos</h2>
        <ul>
          <li>♻️ Prefiere empaques reutilizables o reciclables.</li>
          <li>🚲 Compra local para reducir traslados y CO₂.</li>
          <li>🔌 Elige productos con eficiencia energética.</li>
        </ul>
      </section>
    </main>
  );
}
