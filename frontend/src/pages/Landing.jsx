import { Link } from "react-router-dom";
import { Header } from "../components/Header";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-[#1e293b]">
      <Header />
      <main className="px-6 py-10 max-w-5xl mx-auto">
        <section className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Plataforma de Gestión de Encuestas</h1>
          <p className="text-lg text-[#334155]">
            Herramienta web para recopilar, organizar y analizar encuestas sobre la cadena de suministro.
            Facilita la toma de decisiones estratégicas mediante reportes automáticos y dashboards interactivos.
          </p>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">¿En qué consiste el proyecto?</h2>
          <p className="text-[#475569] leading-relaxed text-justify">
            Esta plataforma web fue desarrollada para mejorar la gestión de encuestas relacionadas con la
            administración de la cadena de suministro. Su principal objetivo es permitir a las empresas
            almacenar, consultar y analizar datos de forma estructurada y segura.
            <br /><br />
            Cuenta con funcionalidades clave como un sistema de autenticación con credenciales y roles,
            carga manual o masiva de encuestas, categorización de información por sector, generación automática
            de reportes gráficos, y visualización interactiva a través de un dashboard.
            <br /><br />
            El desarrollo se realizó bajo la metodología Scrum, con sprints iterativos, revisiones frecuentes
            y herramientas colaborativas como GitHub y Google Drive. Esta herramienta digital está diseñada
            para escalar y adaptarse a diferentes contextos empresariales, facilitando decisiones basadas en datos reales.
          </p>
        </section>

        <div className="mt-12 text-center">
          <Link to="/descripcionEncuestas">
            <button className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-3 rounded-xl text-lg transition">
              Ver Encuestas
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Landing;
