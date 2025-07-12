import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

// Configurar __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ⚡ CAMBIO: Cargar .env desde la raíz del proyecto
dotenv.config({ path: path.join(__dirname, '../.env') });

import authRoutes from "./routes/auth.js";
import encuestasRoutes from "./routes/encuestas.js";
import registroRoutes from "./routes/registro.js";
import preguntasRoutes from "./routes/preguntas.js";
import respuestasRoutes from "./routes/respuestas.js";
import resultadosRoutes from './routes/resultados.js';
import encuestadosRoutes from './routes/encuestados.js';
import statsRoutes from "./routes/stats.js";

const app = express();

// ⚡ CAMBIO: CORS específico para evitar problemas
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

app.use("/api/login", authRoutes);
app.use("/api/encuestas", encuestasRoutes);
app.use("/api/registro", registroRoutes);
app.use("/api", preguntasRoutes);
app.use("/api/respuestas", respuestasRoutes);
app.use('/api/resultados', resultadosRoutes);
app.use('/api', encuestadosRoutes);
app.use("/api/stats", statsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 CORS habilitado para: localhost:5173, localhost:5174`);
});