// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Simpan data sementara (ganti dengan database nanti)
let tripRequests = [];

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Sajikan file HTML/CSS/gambar
app.use(express.json()); // Parse JSON dari body request

// === API ENDPOINTS ===

// POST: Terima permintaan perjalanan
app.post('/api/plan-trip', (req, res) => {
  const { name, email, destination, date } = req.body;

  // Validasi dasar
  if (!name || !email || !destination || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Simpan ke memori
  const newRequest = {
    id: Date.now(),
    name,
    email,
    destination,
    date,
    timestamp: new Date().toISOString()
  };

  tripRequests.push(newRequest);

  console.log('✅ New trip request:', newRequest);

  // Respons sukses
  res.status(201).json({
    message: 'Your trip request has been received! We will contact you soon.',
    data: newRequest
  });
});

// (Opsional) GET: Lihat semua permintaan (untuk admin/demo)
app.get('/api/trip-requests', (req, res) => {
  res.json(tripRequests);
});

// Semua route lain → kembalikan index.html (untuk SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`📄 Website: http://localhost:${PORT}`);
  console.log(`📨 API: POST http://localhost:${PORT}/api/plan-trip`);
});