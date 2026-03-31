// /api/sheet.js
export default async function handler(req, res) {
  const token = req.query.token;

  // URL de tu Web App de Google Apps Script
  const url = `https://script.google.com/macros/s/AKfycby3MZPuiZ8I9P2X8ixE4pN_3-VYJexntueGhhOTGc3UUL317G4128SIUWBzw-kFaZXg/exec?token=${token}`;

  try {
    const response = await fetch(url);

    // Validar que la respuesta sea OK
    if (!response.ok) {
      throw new Error(`Apps Script respondió con ${response.status}`);
    }

    const data = await response.json(); // JSON de doGet

    // Header CORS para que frontend lo pueda leer
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}