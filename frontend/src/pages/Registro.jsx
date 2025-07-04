import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // Usamos la instancia de api
import { Header } from "../components/Header";

const Registro = () => {
  // Se elimina el estado 'id'
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("empresa"); // Valor por defecto
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos
    try {
      // Ya no se envía 'id'
      const res = await api.post("/registro", {
        nombre,
        email,
        password,
        rol
      });

      if (res.status === 201) {
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      // Mostrar mensaje de error del backend si existe
      const message = err.response?.data?.message || "Error al registrarse. Inténtalo de nuevo.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
      <Header />
      <div className="flex items-center justify-center px-4 pt-10">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#1e293b]">Registro</h2>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          
          <input
            type="text"
            placeholder="Nombre o Razón Social"
            className="w-full p-3 border border-[#cbd5e1] rounded-lg mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
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
          
          {/* Campo de Rol como menú desplegable */}
          <div className="mb-4">
            <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuario</label>
            <select
              id="rol"
              className="w-full p-3 border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              required
            >
              <option value="empresa">Empresa</option>
              <option value="evaluador">Evaluador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Registrarse</button>
          <button onClick={() => navigate("/login")} type="button" className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 mt-4 transition">Ya tengo una cuenta</button>
        </form>
      </div>
    </div>
  );
};

export default Registro;
