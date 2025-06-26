import axios from "axios";

export const cargarEncuestas = async () => {
  try {
    const res = await axios.get("http://localhost:3001/api/encuestas");
    return res.data;
  } catch (err) {
    console.error("Error al cargar encuestas", err);
  }
};

export const cargarPreguntas = async (id) => {
  try {
    const res = await axios.get('http://localhost:3001/api/preguntas', {
      params: {
        id: id
      }
    });
    console.log(id);
    return res.data;
  } catch (err) {
    console.error("Error al cargar preguntas", err);
  }
};