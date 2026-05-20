import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { analyze } from "./analyze.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === "production";

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/analyze", (req, res) => {
  const message = req.body?.message?.trim();
  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }
  res.json(analyze(message));
});

if (isProd) {
  const clientDist = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`ChatBFF server running on http://localhost:${PORT}`);
});
