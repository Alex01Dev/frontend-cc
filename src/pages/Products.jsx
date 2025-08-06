import React, { useEffect, useState } from "react";
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

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products/get");
      setProducts(res.data);
    } catch (err) {
      setMensaje("Error al obtener productos.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await axios.delete(`/products/${id}`);
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
              <p>Huella CO₂: <strong>{prod.carbon_footprint} kg</strong></p>
              <p>Reciclable: {prod.recyclable_packaging ? "Sí ♻️" : "No"}</p>
              <p>Origen local: {prod.local_origin ? "Sí 🏡" : "No"}</p>
              <div className="product-actions">
                <button onClick={() => handleEdit(prod)}>Editar</button>
                <button className="delete" onClick={() => eliminarProducto(prod.id)}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
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
    </main>
  );
}

export default Products;
