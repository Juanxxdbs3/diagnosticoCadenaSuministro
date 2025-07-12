import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Encuestas from "./pages/Encuestas";
import Registro from "./pages/Registro";
import Landing from "./pages/Landing";
import DescripcionEncuestas from "./pages/DescripcionEncuestas";
import ResponderEncuesta from "./pages/ResponderEncuesta";
import ResultadosPage from './pages/ResultadosPage';
import EstadisticasGlobales from './pages/EstadisticasGlobales';
import EstadisticasPorEncuesta from './pages/EstadisticasPorEncuesta';
import ReporteEmpresa from './pages/ReporteEmpresa'; // ⚡ NUEVO
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />}/>
      <Route path="/descripcionEncuestas" element={<DescripcionEncuestas />} />
      <Route path="/responder/:id" element={<ResponderEncuesta />} />

      {/* Rutas Protegidas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/encuestas"
        element={
          <ProtectedRoute allowedRoles={['admin', 'evaluador']}>
            <Encuestas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resultados"
        element={
          <ProtectedRoute allowedRoles={['empresa']}>
            <ResultadosPage />
          </ProtectedRoute>
        }
      />
      {/* ⚡ NUEVO: Reporte para empresas */}
      <Route
        path="/reporte-empresa"
        element={
          <ProtectedRoute allowedRoles={['empresa']}>
            <ReporteEmpresa />
          </ProtectedRoute>
        }
      />
      <Route
        path="/estadisticas-globales"
        element={
          <ProtectedRoute allowedRoles={['admin', 'evaluador']}>
            <EstadisticasGlobales />
          </ProtectedRoute>
        }
      />
      {/* ⚡ CAMBIO: Permitir a empresas ver estadísticas por encuesta */}
      <Route
        path="/estadisticas-encuesta/:encuestaId"
        element={
          <ProtectedRoute allowedRoles={['admin', 'evaluador', 'empresa']}>
            <EstadisticasPorEncuesta />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
