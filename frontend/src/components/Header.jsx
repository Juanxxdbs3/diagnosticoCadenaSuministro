import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser, logout } from '../services/auth';

export function Header({ title, subtitle, showDashboard = true, customTitle = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: contextUser } = useAuth() || {};
  
  // Fallback para obtener usuario si el contexto no está disponible
  const user = contextUser || getCurrentUser();

  // Función inteligente para obtener el título
  const getPageTitle = () => {
    if (customTitle) return customTitle;
    if (title) return title;
    
    // Títulos automáticos basados en la ruta
    const path = location.pathname;
    if (path === "/") return "Inicio";
    if (path.includes("descripcionEncuestas")) return "Encuestas Disponibles";
    if (path.includes("responder")) return "Responder Encuesta";
    if (path.includes("login")) return "Iniciar Sesión";
    if (path.includes("registro")) return "Registro";
    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("estadisticas-globales")) return "Estadísticas Globales";
    if (path.includes("estadisticas-encuesta")) return "Estadísticas de Encuesta";
    if (path.includes("reporte-empresa")) return "Mi Reporte Empresarial";
    if (path.includes("encuestas")) return "Gestión de Encuestas";
    return "Plataforma de Encuestas";
  };

  // Función inteligente para obtener el subtítulo
  const getSubtitle = () => {
    if (subtitle) return subtitle;
    if (user) return `Usuario: ${user.nombre} (${user.rol})`;
    return null;
  };

  // Manejar logout
  const handleLogout = () => {
    logout();
  };

  // Navegación inteligente al "inicio"
  const handleGoHome = () => {
    if (user) {
      // Si está autenticado, ir al dashboard
      navigate("/dashboard");
    } else {
      // Si no está autenticado, ir al landing
      navigate("/");
    }
  };

  // Verificar si estamos en ciertas páginas
  const isInDashboard = location.pathname === "/dashboard";
  const isInLanding = location.pathname === "/";

  return (
    <header className="w-full border-b border-[#cbd5e1] bg-white flex items-center justify-between px-6 py-4 shadow-sm">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#1e293b]">{getPageTitle()}</h1>
        {getSubtitle() && (
          <p className="text-sm text-gray-600">{getSubtitle()}</p>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {/* BOTONES PARA USUARIOS NO AUTENTICADOS */}
        {!user && (
          <>
            {!isInLanding && (
              <button 
                onClick={handleGoHome}
                className="text-sm text-[#1e293b] border border-[#cbd5e1] px-3 py-1 md:py-2 rounded hover:bg-[#f1f5f9] transition"
              >
                🏠 Inicio
              </button>
            )}
            <button 
              onClick={() => navigate("/login")}
              className="text-sm text-[#1e293b] border border-[#cbd5e1] px-3 py-1 md:py-2 rounded hover:bg-[#f1f5f9] transition"
            >
              🔑 Login
            </button>
            <button 
              onClick={() => navigate("/registro")}
              className="text-sm text-[#1e293b] border border-[#cbd5e1] px-3 py-1 md:py-2 rounded hover:bg-[#f1f5f9] transition"
            >
              📝 Registro
            </button>
          </>
        )}

        {/* BOTONES PARA USUARIOS AUTENTICADOS */}
        {user && (
          <>
            {/* ⚡ CORRECCIÓN: Mostrar Dashboard solo si NO estamos en dashboard */}
            {!isInDashboard && showDashboard && (
              <button 
                onClick={() => navigate("/dashboard")}
                className="text-sm text-[#1e293b] border border-[#cbd5e1] px-3 py-1 md:py-2 rounded hover:bg-[#f1f5f9] transition"
              >
                📊 Dashboard
              </button>
            )}
            
            <button 
              onClick={handleLogout}
              className="text-sm text-white bg-red-600 px-3 py-1 md:py-2 rounded hover:bg-red-700 transition"
            >
              🚪 Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

// Mantener compatibilidad con PageHeader
export default Header;