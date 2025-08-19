import React, { useEffect, useState, useCallback } from "react";
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

  // Modal genérico para mensajes
  const [alertModal, setAlertModal] = useState({ open: false, message: "" });

  //  Cantidad seleccionada (para carrito/compra)
  const [cantidades, setCantidades] = useState({});

  // actualizar cantidad de un producto
  const handleCantidadChange = (id, value) => {
    setCantidades((prev) => ({ ...prev, [id]: value }));
};

  const role = localStorage.getItem("role"); // "admin" | "user"
  const token = localStorage.getItem("token");

  // ✅ useCallback para evitar warnings
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

  const handleEdit = (producto) => {
    setProductToEdit(producto);
    setShowModal(true);
  };

  // Comprar directo
const comprarAhora = async (prod) => {
  try {
    const res = await axios.post(
      "/transactions/buy",
      { product_id: prod.id, quantity: cantidades[prod.id] || 1 },  // ✅ ahora usa el valor correcto
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setAlertModal({
      open: true,
      message: res.data.message || "✅ Has comprado este producto.",
    });
    fetchProducts(); // refrescar stock
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
    console.log("Carrito ->", res.data);
    setAlertModal({
      open: true,
      message: `✅ ${prod.name} agregado al carrito (x${cantidades[prod.id] || 1})`,
    });
  } catch (err) {
    console.error("❌ Error al agregar al carrito:", err.response?.data);
    setAlertModal({
      open: true,
      message:
        err.response?.data?.detail ||
        "❌ Error al agregar al carrito",
    });
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
          <div key={prod.id} className="product-card">
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
                  <button onClick={() => handleEdit(prod)}>Editar</button>
                  <button
                    className="delete"
                    onClick={() => eliminarProducto(prod.id)}
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
                    value={cantidades[prod.id] || 1}
                    onChange={(e) => handleCantidadChange(prod.id, Number(e.target.value))}
                  />
                  </label>
                  <button className="btn-comprar" onClick={() => comprarAhora(prod)}>
                    Comprar ahora
                  </button>
                  <button className="btn-carrito" onClick={() => agregarAlCarrito(prod)}>
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

      {/* Modal genérico */}
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
