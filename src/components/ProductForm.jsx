import React, { useState, useEffect } from "react";
import axios from "../api/axiosConfig";
import "../styles/ProductForm.css";

function ProductForm({ product, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    carbon_footprint: "",
    recyclable_packaging: false,
    local_origin: false,
    image: null,
    price: "",
    quantity: "",
    status: "disponible",
  });

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        category: product.category || "",
        carbon_footprint: product.carbon_footprint || "",
        recyclable_packaging: product.recyclable_packaging || false,
        local_origin: product.local_origin || false,
        image: null, // iniciar siempre en null
        price: product.price || "",
        quantity: product.quantity || "",
        status: product.status || "disponible",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("carbon_footprint", form.carbon_footprint);
      formData.append("recyclable_packaging", form.recyclable_packaging);
      formData.append("local_origin", form.local_origin);
      formData.append("price", form.price);
      formData.append("quantity", form.quantity);
      formData.append("status", form.status);
      if (form.image) formData.append("image", form.image);

      await axios.put(`/products/${product.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMensaje("Producto actualizado exitosamente.");
      if (onSaved) onSaved();
    } catch (err) {
      console.error(err);
      setMensaje("Error al actualizar el producto.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content wide">
        <button className="modal-close" onClick={onClose}>×</button>

        <h2>Editar Producto</h2>
        <form
          id="product-form"
          className="product-form grid"
          onSubmit={handleSubmit}
        >
          {mensaje && <p className="message">{mensaje}</p>}

          <div className="form-group full-width">
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoría:</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
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

          <div className="form-group">
            <label>Huella de carbono (kg CO₂):</label>
            <input
              type="number"
              name="carbon_footprint"
              value={form.carbon_footprint}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Stock:</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="checkbox-group full-width">
            <label>
              <input
                type="checkbox"
                name="recyclable_packaging"
                checked={form.recyclable_packaging}
                onChange={handleChange}
              />
              Empaque reciclable
            </label>

            <label>
              <input
                type="checkbox"
                name="local_origin"
                checked={form.local_origin}
                onChange={handleChange}
              />
              Origen local
            </label>
          </div>

          <div className="form-group full-width">
            <label>Imagen del producto:</label>
            <input type="file" name="image" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Precio:</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Estado:</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="disponible">Disponible</option>
              <option value="agotado">Agotado</option>
            </select>
          </div>
        </form>

        <div className="modal-footer">
          <button type="submit" form="product-form">Guardar cambios</button>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
