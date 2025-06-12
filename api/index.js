const createServer = require('../src/server-vercel');

let serverInstance;

module.exports = async (req, res) => {
  try {
    // Inisialisasi server hanya sekali
    if (!serverInstance) {
      serverInstance = await createServer();
    }

    const response = await serverInstance.inject({
      method: req.method,
      url: req.url,
      payload: req.body,
      headers: req.headers,
    });

    // Kirim header dan status
    res.statusCode = response.statusCode;
    for (const [key, value] of Object.entries(response.headers)) {
      res.setHeader(key, value);
    }

    // Kirim response body
    res.end(response.rawPayload);
  } catch (err) {
    console.error('Internal Server Error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};
