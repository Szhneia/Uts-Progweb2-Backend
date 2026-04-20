# Task Manager API

Backend sederhana untuk UTS Pemrograman Web 2 menggunakan `Express`, `PostgreSQL`, `pg`, `dotenv`, dan `nodemon`.

## Fitur

- CRUD lengkap untuk resource `tasks`.
- Middleware logging yang mencetak timestamp, method, dan URL request.
- Validasi `title` agar tidak kosong atau hanya berisi spasi.
- Validasi `is_completed` agar selalu bertipe boolean saat update.
- Error handling `404` untuk task yang tidak ditemukan dan endpoint yang tidak tersedia.
- Verifikasi koneksi database saat server dijalankan.

## Struktur Tabel

Schema database tersedia di [`database/schema.sql`](database/schema.sql) dengan struktur berikut:

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Prasyarat

- Node.js
- PostgreSQL
- npm

## Setup

1. Install dependency project:

```bash
npm install
```

2. Copy file environment:

```bash
Copy-Item .env.example .env
```

Atau di Bash/Linux/macOS:

```bash
cp .env.example .env
```

3. Isi konfigurasi database di file `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager
DB_USER=postgres
DB_PASSWORD=postgres
```

4. Buat database PostgreSQL, misalnya `task_manager`.

5. Jalankan schema dari file `database/schema.sql`.

6. Jalankan server:

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000` secara default.

## Script

- `npm run dev` untuk menjalankan server dengan `nodemon`.
- `npm start` untuk menjalankan server biasa.
- `npm run check` untuk mengecek syntax entry point server.

## Endpoint

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| `GET` | `/tasks` | Mengambil semua task |
| `GET` | `/tasks/:id` | Mengambil satu task berdasarkan ID |
| `POST` | `/tasks` | Menambahkan task baru |
| `PUT` | `/tasks/:id` | Mengupdate task berdasarkan ID |
| `DELETE` | `/tasks/:id` | Menghapus task berdasarkan ID |

## Contoh Request Body

### POST `/tasks`

```json
{
  "title": "Mengerjakan UTS",
  "description": "Menyelesaikan backend task manager"
}
```

### PUT `/tasks/:id`

```json
{
  "title": "Mengerjakan UTS revisi",
  "description": "Tambahkan logging dan validasi",
  "is_completed": true
}
```

## Catatan Validasi

- `title` wajib diisi pada `POST /tasks`.
- `title` tidak boleh kosong atau hanya spasi pada `POST` dan `PUT`.
- `is_completed` pada `PUT /tasks/:id` harus bernilai `true` atau `false`.
