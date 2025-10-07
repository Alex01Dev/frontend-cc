import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import ProductForm from "../components/ProductForm";
import "../styles/Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [productToEdit, setProductToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [alertModal, setAlertModal] = useState({ open: false, message: "" });
  const [cantidades, setCantidades] = useState({});

  const role = localStorage.getItem("role"); // "admin" | "user"
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleCantidadChange = (id, value) => {
    if (!Number.isInteger(value)) {
      setAlertModal({
        open: true,
        message: "❌ La cantidad debe ser un número entero. No se permiten decimales.",
      });
      return;
    }
    setCantidades((prev) => ({ ...prev, [id]: value }));
  };

  // Obtener productos
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get("/products/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      setMensaje("Error al obtener productos.");
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Eliminar producto (admin)
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("Producto eliminado.");
      fetchProducts();
    } catch {
      setMensaje("Error al eliminar.");
    }
  };

  // Editar producto (admin)
  const handleEdit = (producto) => {
    setProductToEdit(producto);
    setShowModal(true);
  };

  // Comprar ahora
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
      fetchProducts();
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
      await axios.post(
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

  // Registrar interacción y navegar a comentarios
  const handleProductClick = async (prod) => {
    try {
      await axios.post(
        "/interacciones",
        { product_id: prod.id, action: "click" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error al registrar interacción:", err);
      setAlertModal({
        open: true,
        message: "❌ Error al registrar la interacción",
      });
    } finally {
      navigate(`/comments?product=${prod.id}`);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
    return matchesName && matchesCategory;
  });

  return (
    <main className="products-main">
      <h2>Lista de Productos</h2>
      {mensaje && <p className="message">{mensaje}</p>}

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          <option value="Alimentos">Alimentos</option>
          <option value="Ropa">Ropa</option>
          <option value="Tecnologia">Tecnología</option>
          <option value="Limpieza">Limpieza</option>
          <option value="Hogar">Hogar</option>
          <option value="Salud">Salud</option>
          <option value="Papeleria">Papelería</option>
          <option value="Otros">Otros</option>
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="product-card"
            onClick={() => handleProductClick(prod)}
            style={{ cursor: "pointer" }}
          >
            <img src={prod.image_url} alt={prod.name} />
            <div className="product-info">
              <h3>{prod.name}</h3>
              <p>Categoría: <strong>{prod.category}</strong></p>
              <p>Precio: <strong>${prod.price}</strong></p>
              <p>Estado: <strong>{prod.status}</strong></p>
              <p>Stock: <strong>{prod.quantity}</strong></p>
              <p>Huella CO₂: <strong>{prod.carbon_footprint} kg</strong></p>
              <p>Reciclable: {prod.recyclable_packaging ? "Sí ♻️" : "No"}</p>
              <p>Origen local: {prod.local_origin ? "Sí 🏡" : "No"}</p>

              {role === "admin" ? (
                <div className="product-actions">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEdit(prod); }}
                  >
                    Editar
                  </button>
                  <button
                    className="delete"
                    onClick={(e) => { e.stopPropagation(); eliminarProducto(prod.id); }}
                  >
                    Eliminar
                  </button>
                </div>
              ) : (
                <div className="product-actions">
                  <label>
                    Cantidad:
                    <input
  type="number"
  min="1"
  max={prod.quantity}
  step="1"
  value={cantidades[prod.id] || 1}
  onChange={(e) => {
    e.stopPropagation();
    const val = Number(e.target.value);
    handleCantidadChange(prod.id, val);
  }}
  onKeyDown={(e) => e.preventDefault()} // ⛔️ bloquea escribir manual
/>

                  </label>
                  <button
                    className="btn-comprar"
                    onClick={(e) => { e.stopPropagation(); comprarAhora(prod); }}
                  >
                    Comprar ahora
                  </button>
                  <button
                    className="btn-carrito"
                    onClick={(e) => { e.stopPropagation(); agregarAlCarrito(prod); }}
                  >
                    Agregar al carrito 🛒
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && role === "admin" && (
        <ProductForm
          product={productToEdit}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchProducts();
            setProductToEdit(null);
          }}
        />
      )}

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

export default Products;
