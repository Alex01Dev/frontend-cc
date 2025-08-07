import React, { useState } from "react";
import axios from "../api/axiosConfig";
import "../styles/AddProduct.css";

function AddProduct() {
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    huella_co2: "",
    reciclable: false,
    origen_local: false,
    imagen: null,
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
      setForm({ ...form, imagen: file });

      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.nombre);
    formData.append("category", form.categoria);
    formData.append("carbon_footprint", form.huella_co2);
    formData.append("recyclable_packaging", form.reciclable);
    formData.append("local_origin", form.origen_local);
    if (form.imagen) {
      formData.append("image", form.imagen);
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
        nombre: "",
        categoria: "",
        huella_co2: "",
        reciclable: false,
        origen_local: false,
        imagen: null,
      });
      setPreviewUrl(null);
    } catch (error) {
      console.error("❌ Error al añadir producto:", error);
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
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />

          <label>Categoría:</label>
          <select
            name="categoria"
            value={form.categoria}
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

          <label>Huella CO₂ (kg):</label>
          <input
            type="number"
            name="huella_co2"
            value={form.huella_co2}
            onChange={handleChange}
            step="0.01"
            required
          />

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="reciclable"
                checked={form.reciclable}
                onChange={handleChange}
              />
              Reciclable
            </label>

            <label>
              <input
                type="checkbox"
                name="origen_local"
                checked={form.origen_local}
                onChange={handleChange}
              />
              Origen local
            </label>
          </div>

          <label>Imagen:</label>
          <input
            type="file"
            name="imagen"
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
