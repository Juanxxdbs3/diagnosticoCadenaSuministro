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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/descripcionEncuestas" element={<DescripcionEncuestas />} />
      <Route path="/responder/:id" element={<ResponderEncuesta />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/encuestas" element={<Encuestas />} />
      <Route path="/resultados" element={<ResultadosPage />} />
      <Route path="/estadisticas-globales" element={<EstadisticasGlobales />} />
    </Routes>
  );
}

export default App;
