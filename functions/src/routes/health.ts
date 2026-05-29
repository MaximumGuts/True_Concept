import { onRequest } from "firebase-functions/v2/https";
import { handleCors } from "../utils/cors.js";

export const health = onRequest({ region: "asia-south1", invoker: "public" }, async (req, res) => {
  if (handleCors(req, res)) return;

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  res.json({ status: "ok" });
});
