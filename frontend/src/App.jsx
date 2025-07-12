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
import ReporteEmpresa from './pages/ReporteEmpresa';
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
      
      {/* ⚡ ELIMINAR esta ruta conflictiva */}
      {/* <Route
        path="/resultados"
        element={
          <ProtectedRoute allowedRoles={['empresa']}>
            <ResultadosPage />
          </ProtectedRoute>
        }
      /> */}

      {/* ✅ MANTENER: Reporte para empresas */}
      <Route
        path="/reporte-empresa"
        element={
          <ProtectedRoute allowedRoles={['empresa']}>
            <ReporteEmpresa />
          </ProtectedRoute>
        }
      />
      
      {/* ✅ MANTENER: Estadísticas globales */}
      <Route
        path="/estadisticas-globales"
        element={
          <ProtectedRoute allowedRoles={['admin', 'evaluador']}>
            <EstadisticasGlobales />
          </ProtectedRoute>
        }
      />
      
      {/* ✅ MANTENER: Estadísticas por encuesta */}
      <Route
        path="/estadisticas-encuesta/:encuestaId"
        element={
          <ProtectedRoute allowedRoles={['admin', 'evaluador', 'empresa']}>
            <EstadisticasPorEncuesta />
          </ProtectedRoute>
        }
      />
      
      {/* ✅ MANTENER: Resultados individuales (solo admin/evaluador) */}
      <Route
        path="/resultados/encuestado/:encuestadoId"
        element={
          <ProtectedRoute allowedRoles={['admin', 'evaluador']}>
            <ResultadosPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
