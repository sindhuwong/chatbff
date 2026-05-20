import { analyze } from "../server/analyze.js";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const message = req.body?.message?.trim();
  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  res.status(200).json(analyze(message));
}
