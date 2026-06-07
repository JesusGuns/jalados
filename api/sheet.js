const cache = new Map();
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 horas en ms
export default async function handler(req, res) {
  // CORS (mejor ponerlo arriba para todos los casos)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Manejar preflight (IMPORTANTE para POST)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const token = req.method === "GET" ? req.query.token : req.body.token;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  const baseUrl = "https://script.google.com/macros/s/AKfycbzHxyhpVJbnluZkPquzdGdREuSwYc5yXAejV287Rt_6oHjBVPQkAW0yUHLnCRhjP6nS/exec";

  try {
    // GET
    if (req.method === "GET") {
      const cached = cache.get(token);
      if (cached && Date.now() - cached.time < CACHE_TTL) {
        res.setHeader("X-Cache", "HIT");
        return res.status(200).json(cached.data);
      }

      const response = await fetch(`${baseUrl}?token=${token}`);
      if (!response.ok) throw new Error(`Apps Script respondió con ${response.status}`);

      const data = await response.json();

      // Guardar en caché solo si fue exitoso
      if (data.success) {
        cache.set(token, { data, time: Date.now() });
      }

      res.setHeader("X-Cache", "MISS");
      return res.status(200).json(data);
    }

    // POST
    if (req.method === "POST") {
      const { token, confirmed, guests, wishes } = req.body;
      console.error("Info", JSON.stringify({ token, confirmed, guests, wishes }));

      // Invalidar caché al confirmar
      cache.delete(token);

       const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, confirmed, guests, wishes }),
      });

      const text = await response.text();
      console.log("Raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("Respuesta no es JSON válido");
      }

      return res.status(200).json(data);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
