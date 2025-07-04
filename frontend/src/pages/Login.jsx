import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { Header } from "../components/Header";

const Login = () => {
  // Cambiamos el estado de 'id' a 'email'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard"; // Redirigir al dashboard por defecto

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Enviamos 'email' en lugar de 'id'
      const response = await api.post("/login", { email, password });
      const { token, user } = response.data;
      login(user, token);
      navigate(from, { replace: true }); // Redirigir a la página anterior o al dashboard
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Error al iniciar sesión. Revisa tus credenciales.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
      <Header />
      <div className="flex items-center justify-center px-4 pt-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-[#1e293b]">
            Iniciar Sesión
          </h2>
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          {/* Cambiamos el input de 'id' a 'email' */}
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-3 border border-[#cbd5e1] rounded-lg mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 border border-[#cbd5e1] rounded-lg mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Iniciar Sesión
          </button>
          <button
            onClick={() => navigate("/registro")}
            type="button"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mt-4 transition"
          >
            Crear una cuenta
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;