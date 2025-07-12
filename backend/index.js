import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

// Configurar __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env ANTES de cualquier otra importación
dotenv.config({ path: path.join(__dirname, '../.env') });

// Verificar que JWT_SECRET se cargó
console.log("🔑 JWT_SECRET cargado:", process.env.JWT_SECRET ? "✅ SÍ" : "❌ NO");

import authRoutes from "./routes/auth.js";
import encuestasRoutes from "./routes/encuestas.js";
import registroRoutes from "./routes/registro.js";
import preguntasRoutes from "./routes/preguntas.js";
import respuestasRoutes from "./routes/respuestas.js";
import resultadosRoutes from './routes/resultados.js';
import encuestadosRoutes from './routes/encuestados.js';
import statsRoutes from "./routes/stats.js";
import sectoresRoutes from "./routes/sectores.js";

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// ⚡ RUTAS PÚBLICAS (sin protección)
app.use("/api/login", authRoutes);
app.use("/api/registro", registroRoutes);
app.use("/api/encuestas", encuestasRoutes);        
app.use("/api/preguntas", preguntasRoutes);        // ⚡ CORREGIDO
app.use("/api/respuestas", respuestasRoutes);      
app.use("/api/encuestados", encuestadosRoutes);    // ⚡ CORREGIDO
app.use("/api/sectores", sectoresRoutes);          

// ⚡ RUTAS PROTEGIDAS (requieren autenticación)
app.use("/api/stats", statsRoutes);                
app.use('/api/resultados', resultadosRoutes);      

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 Rutas protegidas: /api/stats, /api/resultados`);
  console.log(`🌐 Rutas públicas: /api/encuestas, /api/login, /api/registro, /api/preguntas, /api/respuestas, /api/encuestados`);
});

export default app;