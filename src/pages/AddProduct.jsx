import React, { useState } from "react";
import axios from "../api/axiosConfig";
import "../styles/AddProduct.css";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    carbon_footprint: "",
    recyclable_packaging: false,
    local_origin: false,
    image: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const categorias = [
    "Alimentos",
    "Ropa",
    "Tecnologia",
    "Limpieza",
    "Hogar",
    "Salud",
    "Papeleria",
    "Otros"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "file") {
      const file = files[0];
      setForm({ ...form, image: file });
      setPreviewUrl(file ? URL.createObjectURL(file) : null);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("quantity", form.quantity);
    formData.append("carbon_footprint", form.carbon_footprint);
    formData.append("recyclable_packaging", form.recyclable_packaging);
    formData.append("local_origin", form.local_origin);
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post("/products/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMensaje("✅ Producto añadido correctamente.");
      setForm({
        name: "",
        category: "",
        price: "",
        quantity: "",
        carbon_footprint: "",
        recyclable_packaging: false,
        local_origin: false,
        image: null,
      });
      setPreviewUrl(null);
    } catch (error) {
      console.error("❌ Error al añadir producto:", error.response?.data || error);
      setMensaje("❌ Error al añadir producto.");
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        <h2>Añadir Nuevo Producto</h2>
        <form className="product-form" onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Categoría:</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecciona una categoría --</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label>Precio:</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            step="0.01"
            required
          />

          <label>Cantidad:</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            min="1"
            required
          />

          <label>Huella CO₂ (kg):</label>
          <input
            type="number"
            name="carbon_footprint"
            value={form.carbon_footprint}
            onChange={handleChange}
            step="0.01"
            required
          />

          <div className="checkbox-group">
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

          <label>Imagen:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />

          {previewUrl && (
            <div className="image-preview">
              <p>Vista previa:</p>
              <img src={previewUrl} alt="Vista previa" />
            </div>
          )}

          <button type="submit">Guardar Producto</button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
}

export default AddProduct;
