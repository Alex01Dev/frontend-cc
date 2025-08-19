import React, { useEffect, useState } from "react";
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
import UserHome from "./pages/UserHome";
import Cart from "./pages/Cart";  

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role")); // "admin" | "user"

  useEffect(() => {
    const onAuthChanged = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };
    // evento personalizado (mismo tab) + storage (otros tabs)
    window.addEventListener("auth-changed", onAuthChanged);
    window.addEventListener("storage", onAuthChanged);
    return () => {
      window.removeEventListener("auth-changed", onAuthChanged);
      window.removeEventListener("storage", onAuthChanged);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/add-user" element={<Layout><AddUser /></Layout>} />

        {/* protegidas */}
        {isAuthenticated ? (
          role === "admin" ? (
            <>
              <Route path="/" element={<Layout><Dashboard /></Layout>} />
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/products" element={<Layout><Products /></Layout>} />
              <Route path="/users" element={<Layout><Users /></Layout>} />
              <Route path="/recommendations" element={<Layout><Recommendations /></Layout>} />
              <Route path="/add-product" element={<Layout><AddProduct /></Layout>} />
              <Route path="/add-user" element={<Layout><AddUser /></Layout>} />
              <Route path="/comments" element={<Layout><Comments /></Layout>} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Layout><UserHome /></Layout>} />
              <Route path="/user-home" element={<Layout><UserHome /></Layout>} />
              <Route path="/products" element={<Layout><Products /></Layout>} />
              <Route path="/recommendations" element={<Layout><Recommendations /></Layout>} />
              <Route path="/comments" element={<Layout><Comments /></Layout>} />
              <Route path="/cart" element={<Layout><Cart /></Layout>} />  
              <Route path="*" element={<Navigate to="/user-home" replace />} />
            </>
          )
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
