import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

import { getGeminiClient } from "./geminiClient";
import geospatialRouter from "./routes/geospatial";
import scamRouter from "./routes/scam";
import currencyRouter from "./routes/currency";
import networkRouter from "./routes/network";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    api: "ok",
    geminiInitialized: !!getGeminiClient()
  });
});

// Mount modular Backend API Routes
app.use("/api", geospatialRouter);
app.use("/api", scamRouter);
app.use("/api", currencyRouter);
app.use("/api", networkRouter);

// Setup Vite Dev server or Serve Static build
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Digital Public Safety Platform backend running on port ${PORT}`);
  });
}

startServer();
