/*Propósito: Un componente reutilizable para mostrar la información de cada
 encuesta en el Dashboard. Contiene el botón funcional.
--------------------------------------------------------------------------------
*/
import React from 'react';
import { Link } from 'react-router-dom';

const EncuestaDashboardCard = ({ encuesta }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-800">{encuesta.titulo}</h3>
        <p className="text-sm text-gray-500 mt-1">Instrumento de Evaluación</p>
      </div>
      <div className="mt-4">
        <Link
          to={`/estadisticas-encuesta/${encuesta.id}`}
          className="w-full text-center block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm font-semibold"
        >
          Ver Resultados
        </Link>
      </div>
    </div>
  );
};

export default EncuestaDashboardCard;