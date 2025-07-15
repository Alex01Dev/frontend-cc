import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../components/ProductForm";
import "../styles/Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [productToEdit, setProductToEdit] = useState(null);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/products/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("Producto eliminado.");
      fetchProducts();
    } catch (err) {
      setMensaje("Error al eliminar producto.");
    }
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
  };

  const clearEdit = () => {
    setProductToEdit(null);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="products-main">
      <h2>Listado de Productos Sustentables</h2>

      {mensaje && <p className="message">{mensaje}</p>}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Huella CO₂</th>
            <th>Reciclable</th>
            <th>Local</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.name}</td>
              <td>{prod.category}</td>
              <td>{prod.carbon_footprint} kg</td>
              <td>{prod.recyclable_packaging ? "Sí" : "No"}</td>
              <td>{prod.local_origin ? "Sí" : "No"}</td>
              <td>
                <button onClick={() => handleEdit(prod)}>Editar</button>
                <button onClick={() => eliminarProducto(prod.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProductForm
        onProductCreated={fetchProducts}
        productToEdit={productToEdit}
        clearEdit={clearEdit}
      />
    </main>
  );
}

export default Products;
