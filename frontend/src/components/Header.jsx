import { useNavigate, useLocation } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname === "/") return "Inicio";
    if (location.pathname.includes("descripcionEncuestas")) return "Encuestas Disponibles";
    if (location.pathname.includes("responder")) return "Responder Encuesta";
    if (location.pathname.includes("login")) return "Iniciar Sesión";
    if (location.pathname.includes("registro")) return "Registro";
    return "Encuestas";
  };

  return (
    <header className="w-full border-b border-[#cbd5e1] bg-white flex items-center justify-between px-6 py-4 shadow-sm">
      <h1 className="text-xl font-bold text-[#1e293b]">{getTitle()}</h1>
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-sm text-[#1e293b] border border-[#cbd5e1] px-3 py-1 rounded hover:bg-[#f1f5f9] transition">Inicio</button>
        <button onClick={() => navigate("/login")} className="text-sm text-[#1e293b] border border-[#cbd5e1] px-3 py-1 rounded hover:bg-[#f1f5f9] transition">Login</button>
        <button onClick={() => navigate("/registro")} className="text-sm text-[#1e293b] border border-[#cbd5e1] px-3 py-1 rounded hover:bg-[#f1f5f9] transition">Registro</button>
      </div>
    </header>
  );
}