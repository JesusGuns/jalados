// api/sheet.js
const cache = new Map();
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 horas
const MAX_CACHE = 500; // tope de entradas para que el Map no crezca sin límite
const UPSTREAM_TIMEOUT = 10000; // 10 s hacia Apps Script

// URL del Apps Script. En Vercel: Settings → Environment Variables → SHEET_URL
// (queda el valor actual como respaldo para que no se rompa al desplegar)
const SHEET_URL =
  process.env.SHEET_URL ||
  "https://script.google.com/macros/s/AKfycbyCUTnb4Uh1FUEni-k3y3NuFYI5WPnv9foN39Ay_u8XAHRvL_Y6YKwDRXE3D8z9uOWM/exec";

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "https://www.moomentos.com,https://moomentos.com")
  .split(",")
  .map((s) => s.trim());

// ─── Helpers ─────────────────────────────────────────
const cacheKey = (eventID, token) => `${eventID}:${token}`;

// Limita longitud y neutraliza fórmulas de Google Sheets (=, +, -, @)
const safe = (value, max) =>
  String(value ?? "")
    .slice(0, max)
    .replace(/^[=+\-@\t\r]/, "'$&");

const isValidId = (v) => typeof v === "string" && v.length > 0 && v.length <= 100;

function cacheSet(key, data) {
  if (cache.size >= MAX_CACHE) {
    cache.delete(cache.keys().next().value); // elimina la entrada más antigua
  }
  cache.set(key, { data, time: Date.now() });
}

async function fetchWithTimeout(url, options = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), UPSTREAM_TIMEOUT);
  try {
    return await fetch(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ─── Handler ─────────────────────────────────────────
export default async function handler(req, res) {
  // CORS: solo orígenes propios (las llamadas del mismo dominio no lo necesitan)
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const source = req.method === "GET" ? req.query : (req.body ?? {});
  const { token, eventID } = source;

  if (!isValidId(token)) {
    return res.status(400).json({ error: "Token is required" });
  }
  if (!isValidId(eventID)) {
    return res.status(400).json({ error: "eventID is required" });
  }

  const key = cacheKey(eventID, token);

  try {
    // ── GET ──────────────────────────────────────────
    if (req.method === "GET") {
      const cached = cache.get(key);
      if (cached && Date.now() - cached.time < CACHE_TTL) {
        res.setHeader("X-Cache", "HIT");
        return res.status(200).json(cached.data);
      }
      if (cached) cache.delete(key); // expirada

      const qs = new URLSearchParams({ token, eventID }).toString();
      const response = await fetchWithTimeout(`${SHEET_URL}?${qs}`);
      if (!response.ok) throw new Error(`Apps Script respondió con ${response.status}`);

      const data = await response.json();

      // Solo se cachean respuestas exitosas
      if (data.success) cacheSet(key, data);

      res.setHeader("X-Cache", "MISS");
      return res.status(200).json(data);
    }

    // ── POST ─────────────────────────────────────────
    const { confirmed, guests, wishes } = req.body ?? {};

    const response = await fetchWithTimeout(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        eventID,
        confirmed: confirmed === true || confirmed === "true",
        guests: safe(guests, 500),
        wishes: safe(wishes, 1000),
      }),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Respuesta de Apps Script no es JSON válido");
    }

    // Se invalida DESPUÉS de guardar, para que un GET intermedio
    // no vuelva a cachear datos viejos
    if (data.success) cache.delete(key);

    return res.status(200).json(data);
  } catch (error) {
    // Solo el mensaje técnico, nunca el body (tiene datos personales de invitados)
    console.error("sheet API error:", error.name === "AbortError" ? "timeout hacia Apps Script" : error.message);
    return res.status(502).json({ success: false, error: "Service unavailable" });
  }
}