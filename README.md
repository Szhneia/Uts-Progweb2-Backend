# Task Manager API

Project ini dibuat untuk UTS Pemrograman Web 2. Aplikasi ini adalah backend sederhana untuk mengelola data task menggunakan `Express` dan `PostgreSQL`.
Endpoint yang tersedia sudah mencakup operasi CRUD dasar untuk data task.
Project ini juga sudah dilengkapi pengecekan cepat lewat smoke test.

## Fitur

- Menampilkan semua task
- Menampilkan task berdasarkan ID
- Menambahkan task baru
- Mengubah task
- Menghapus task
- Logging request
- Validasi input
- Response `404` kalau data tidak ditemukan

## Struktur Tabel

File schema ada di [`database/schema.sql`](database/schema.sql).

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Cara Menjalankan

1. Install dependency:

```bash
npm install
```

2. Copy `.env.example` jadi `.env`.

PowerShell:

```bash
Copy-Item .env.example .env
```

Bash/Linux/macOS:

```bash
cp .env.example .env
```

3. Isi file `.env`.

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager
DB_USER=postgres
DB_PASSWORD=your_password
```

4. Buat database, misalnya `task_manager`.

5. Jalankan file `database/schema.sql`.

6. Jalankan server:

```bash
npm run dev
```

Kalau berhasil, server akan jalan di `http://localhost:<PORT>`.
Kalau tidak ada perubahan di `.env`, port default yang dipakai adalah `3000`.

## Script

- `npm run dev` untuk menjalankan server dengan `nodemon`
- `npm start` untuk menjalankan server biasa
- `npm run check` untuk cek syntax file utama
- `npm run smoke` untuk tes endpoint utama secara otomatis

## Cek Cepat

Kalau mau cek project ini jalan atau tidak, paling gampang pakai:

```bash
npm run smoke
```

Command ini akan mengecek:

- `GET /`
- `GET /tasks`
- `POST /tasks`
- `GET /tasks/:id`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`
- validasi `400` untuk `title` kosong
- response `404` kalau data sudah tidak ada

## Endpoint

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| `GET` | `/tasks` | Menampilkan semua task |
| `GET` | `/tasks/:id` | Menampilkan task berdasarkan ID |
| `POST` | `/tasks` | Menambahkan task baru |
| `PUT` | `/tasks/:id` | Mengubah task |
| `DELETE` | `/tasks/:id` | Menghapus task |

## Contoh Body Request

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

## Validasi

- `title` wajib diisi saat `POST /tasks`
- `title` tidak boleh kosong atau hanya spasi
- `is_completed` pada `PUT /tasks/:id` harus bernilai `true` atau `false`
