// /api/sheet.js
export default async function handler(req, res) {
  // Captura el token desde la query string
  const token = req.query.token;
  const sheetWebAppURL = "https://script.google.com/macros/s/AKfycbxhzj9hQbOtUJXyeGJgylt8S2LK2bslKQ6iWVGRkGBgiIGw1LYRviBKnL8h648NC9wP/exec";
  // Tu URL de Apps Script
  const url = `${sheetWebAppURL}?token=${token}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Header CORS para que tu frontend pueda consumirlo
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}