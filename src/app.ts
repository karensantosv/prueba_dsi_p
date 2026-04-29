import express from "express";
import "./db/mongoose.js"; // Tu conexión a DB
import { bookRouter } from "./routers/notes.js"; // Ajusta la ruta a tu archivo

export const app = express();
app.use(express.json());
app.use(bookRouter);