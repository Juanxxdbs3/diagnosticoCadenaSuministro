import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { id, password });
      const { token, user } = response.data;
      login(user, token);
      navigate("/encuestas");
    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión");
    }
  };

  const registro = () => {
    // Aquí podrías eliminar token si usas JWT
    navigate("/registro");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] px-4">
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
        <input
          type="text"
          placeholder="Identificación (C.C o NIT)"
          className="w-full p-3 border border-[#cbd5e1] rounded-lg mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={id}
          onChange={(e) => setId(e.target.value)}
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
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Iniciar Sesión
        </button>
        <button
          onClick={registro}
          type="button"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mt-4 transition"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Login;
