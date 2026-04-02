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
    if (req.method === "GET") {
      const urlGet = `${baseUrl}?token=${token}`;

      const response = await fetch(urlGet);

      if (!response.ok) {
        throw new Error(`Apps Script respondió con ${response.status}`);
      }

      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { confirmed } = req.body;

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, confirmed }),
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