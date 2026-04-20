require("dotenv").config();
const app = require("./app");
const pool = require("./db");

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    // Cek koneksi database dulu sebelum server menerima request.
    await pool.query("SELECT 1");

    app.listen(port, () => {
      console.log(`Server berjalan di http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Gagal terhubung ke database PostgreSQL.");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
