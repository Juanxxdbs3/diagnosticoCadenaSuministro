import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth';

const PageHeader = ({ title, subtitle, showDashboard = true, showInicio = true }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="w-full border-b border-[#cbd5e1] bg-white flex items-center justify-between px-6 py-4 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-[#1e293b]">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        {user && (
          <p className="text-xs text-gray-500">
            Usuario: {user.nombre} ({user.rol})
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {showInicio && (
          <button 
            onClick={() => {
              if (user) {
                navigate("/dashboard"); // ⚡ Si está logueado, ir a dashboard
              } else {
                navigate("/"); // Si no está logueado, ir a landing
              }
            }} 
            className="text-sm text-[#1e293b] border border-[#cbd5e1] px-3 py-2 rounded hover:bg-[#f1f5f9] transition"
          >
            🏠 {user ? 'Dashboard' : 'Inicio'}
          </button>
        )}
        {showDashboard && user && (
          <button 
            onClick={() => navigate("/dashboard")} 
            className="text-sm text-[#1e293b] border border-[#cbd5e1] px-3 py-2 rounded hover:bg-[#f1f5f9] transition"
          >
            📊 Dashboard
          </button>
        )}
        {user && (
          <button 
            onClick={handleLogout}
            className="text-sm text-white bg-red-600 px-3 py-2 rounded hover:bg-red-700 transition"
          >
            🚪 Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default PageHeader;