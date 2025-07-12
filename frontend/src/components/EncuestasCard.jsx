import React from "react";

const EncuestasCard = ({ encuesta }) => {
  const { id, titulo, descripcion } = encuesta;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{titulo}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {descripcion || "Sin descripción disponible"}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">ID: {id}</span>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Disponible
          </span>
        </div>
      </div>
    </div>
  );
};

export default EncuestasCard;