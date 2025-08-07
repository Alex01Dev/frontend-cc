import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Recommendations from "./pages/Recommendations";
import Layout from "./components/Layout";
import AddProduct from "./pages/AddProduct";
import AddUser from "./pages/AddUser";
import Comments from "./pages/Comments";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/add-user" element={<Layout><AddUser /></Layout>} />

        {/* Rutas protegidas con layout */}
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/products" element={<Layout><Products /></Layout>} />
            <Route path="/users" element={<Layout><Users /></Layout>} />
            <Route path="/recommendations" element={<Layout><Recommendations /></Layout>} />
            <Route path="/add-product" element={<Layout><AddProduct /></Layout>} />
            <Route path="/add-user" element={<Layout><AddUser /></Layout>} />
            <Route path="/comments" element={<Layout><Comments /></Layout>} />


          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
