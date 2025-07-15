import { useState } from "react";
import "../styles/Login.css";

// Usuario mock para login de prueba
const mockUser = {
  nombre_usuario: "bere",
  contrasena: "123456",
};

function Login() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación mock
    if (
      nombreUsuario === mockUser.nombre_usuario &&
      contrasena === mockUser.contrasena
    ) {
      alert("Login exitoso! Redirigiendo al dashboard...");
      localStorage.setItem("token", "mock-token-123");
      localStorage.setItem("usuarioLogueado", nombreUsuario);


      window.location.href = "/dashboard";
    } else {
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
            alt="Imagen de login"
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
        </div>
      </div>
    </div>
  );
}

export default Login;
