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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/descripcionEncuestas" element={<DescripcionEncuestas />} />

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
        path="/registro"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Registro />
          </ProtectedRoute>
        }
      />
      <Route
        path="/responder/:id"
        element={
          <ProtectedRoute allowedRoles={['empresa']}>
            <ResponderEncuesta />
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
      <Route
        path="/estadisticas-globales"
        element={
          <ProtectedRoute allowedRoles={['admin', 'evaluador']}>
            <EstadisticasGlobales />
          </ProtectedRoute>
        }
      />
      <Route
        path="/estadisticas-encuesta/:encuestaId"
        element={
          <ProtectedRoute allowedRoles={['admin', 'evaluador']}>
            <EstadisticasPorEncuesta />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
