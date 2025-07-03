import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import encuestasRoutes from "./routes/encuestas.js";
import registroRoutes from "./routes/registro.js";
import preguntasRoutes from "./routes/preguntas.js";
import respuestasRoutes from "./routes/respuestas.js";
import resultadosRoutes from './routes/resultados.js';
import encuestadosRoutes from './routes/encuestados.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/login", authRoutes);
app.use("/api/encuestas", encuestasRoutes);
app.use("/api/registro", registroRoutes);
app.use("/api", preguntasRoutes);
app.use("/api/respuestas", respuestasRoutes);
app.use('/api/resultados', resultadosRoutes); //asume que tabla encuestas tiene una columna como empresa_id para saber a quién pertenece cada una
app.use('/api', encuestadosRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});