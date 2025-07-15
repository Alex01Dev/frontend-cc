import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ProductForm.css";

function ProductForm({ onProductCreated, productToEdit, clearEdit }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    carbon_footprint: "",
    recyclable_packaging: false,
    local_origin: false,
  });

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (productToEdit) {
      setForm(productToEdit);
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (productToEdit) {
        // Modo edición
        await axios.put(`http://localhost:8000/products/${productToEdit.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMensaje("Producto actualizado.");
      } else {
        // Modo creación
        await axios.post("http://localhost:8000/products/create", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMensaje("Producto creado exitosamente.");
      }

      setForm({
        name: "",
        category: "",
        carbon_footprint: "",
        recyclable_packaging: false,
        local_origin: false,
      });

      if (onProductCreated) onProductCreated();
      if (clearEdit) clearEdit();
    } catch (error) {
      setMensaje("Error al guardar el producto.");
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{productToEdit ? "Editar Producto" : "Agregar Producto Sustentable"}</h2>

      <label>Nombre:</label>
      <input type="text" name="name" value={form.name} onChange={handleChange} required />

      <label>Categoría:</label>
      <input type="text" name="category" value={form.category} onChange={handleChange} required />

      <label>Huella de carbono:</label>
      <input
        type="number"
        name="carbon_footprint"
        value={form.carbon_footprint}
        onChange={handleChange}
        required
      />

      <label>
        <input type="checkbox" name="recyclable_packaging" checked={form.recyclable_packaging} onChange={handleChange} />
        Empaque reciclable
      </label>

      <label>
        <input type="checkbox" name="local_origin" checked={form.local_origin} onChange={handleChange} />
        Origen local
      </label>

      <button type="submit">{productToEdit ? "Actualizar" : "Crear"}</button>
      {productToEdit && <button type="button" onClick={clearEdit} className="cancel-edit">Cancelar</button>}

      {mensaje && <p className="message">{mensaje}</p>}
    </form>
  );
}

export default ProductForm;
