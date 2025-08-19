import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import { ADMIN_USERNAME, ADMIN_PASSWORD } from "../config/authRoles";
import "../styles/Login.css";

function Login() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/login", {
        username: nombreUsuario,
        password: contrasena,
      });

      const { access_token, logged_user } = response.data;

      // Guardar token y usuario 
      localStorage.setItem("token", access_token);
      localStorage.setItem("usuarioLogueado", logged_user);

      // LÓGICA DE ROL SOLO EN FRONT (DEMO)
      const isAdmin =
        nombreUsuario === ADMIN_USERNAME && contrasena === ADMIN_PASSWORD;

      localStorage.setItem("role", isAdmin ? "admin" : "user");

      // Redirigir según rol
      navigate(isAdmin ? "/dashboard" : "/user-home", { replace: true });
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="background-image" />

      <div className="login-card">
        <div className="login-image">
          <img
            src="https://i.postimg.cc/3wpJ8f4f/Logo-Consumo-Consciente.png"
            alt="Logo del sistema"
          />
        </div>

        <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Iniciar Sesión</h2>

            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
              autoComplete="username"
            />

            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              autoComplete="current-password"
            />

            <button type="submit">Entrar</button>

            {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
          </form>

          <div className="register-link">
            <p>¿No tienes una cuenta?</p>
            <Link to="/add-user" className="register-btn">
              Crear cuenta nueva
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
