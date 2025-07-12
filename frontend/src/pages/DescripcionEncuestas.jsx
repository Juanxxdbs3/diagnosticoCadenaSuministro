import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import { cargarEncuestas } from "../utils/utilsDb";

const DescripcionEncuestas = () => {
  const [encuestas, setEncuestas] = useState([]);

  useEffect(() => {
    const getEncuestas = async () => {
      const data = await cargarEncuestas();
      setEncuestas(data || []); // Previene errores si data es undefined
    };
  
    getEncuestas();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-[#1e293b]">
      {/* ⚡ MEJORA: Agregar props específicas para el header */}
      <Header 
        title="Encuestas Disponibles"
        subtitle="Selecciona una encuesta para responder"
      />
      
      <main className="px-6 py-10 max-w-6xl mx-auto">
        <section className="mb-10 bg-white p-6 rounded-2xl shadow-md text-center">
          <h2 className="text-3xl font-bold mb-4">Política de confidencialidad de datos</h2>
          <p className="text-[#475569] leading-relaxed text-justify">
            El Grupo de Investigación Gestión y Desarrollo Empresarial de la Facultad de Ciencias Económicas, Administrativas y Contables de la Fundación universitaria Tecnológico Comfenalco, extiende invitación para diligenciar la siguiente encuesta voluntaria y anónima.
            <br /><br />
            El presente estudio de investigación tiene como objetivo: Realizar un diagnóstico de la Administración de la Cadena de Suministro (SCM) en empresas Cartageneras a través de un trabajo de campo que permita la formulación de estrategias para el mejoramiento continuo de las organizaciones.
            <br /><br />
            Se garantiza total anonimato y confidencialidad y de antemano agradecemos el tiempo empleado en responder esta encuesta.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-6">Listado de Encuestas</h3>
          {encuestas.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <p className="text-gray-500">Cargando encuestas...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {encuestas.map((encuesta) => (
                <Link to={`/responder/${encuesta.id}`} key={encuesta.id}>
                  <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition cursor-pointer">
                    <h4 className="text-xl font-bold mb-1">{encuesta.titulo}</h4>
                    <p className="text-sm text-[#94a3b8]">ID: {encuesta.id}</p>
                    <p className="text-sm text-[#64748b] mt-2">{encuesta.descripcion || 'Sin descripción'}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DescripcionEncuestas;
