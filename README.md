# 🌿 HerbPlants Back-End API

Back-end dari aplikasi klasifikasi tumbuhan yang mendukung autentikasi pengguna, pengelolaan hasil prediksi, koleksi tanaman favorit, serta sistem misi harian berbasis aktivitas pengguna. API ini dibangun menggunakan **Hapi.js**, **Prisma ORM**, dan terintegrasi dengan layanan penyimpanan **Supabase**.

---

## 📌 Deskripsi Singkat

Proyek ini merupakan bagian dari sistem klasifikasi tumbuhan yang terbagi dalam dua jalur pengembangan utama:

- **Machine Learning**: Pengembangan model CNN berbasis TensorFlow yang di-deploy menggunakan Docker + Flask di AWS.
- **Aplikasi Web (Front-End & Back-End)**: Dibangun dengan Next.js (frontend) dan Hapi.js (backend) dengan arsitektur terpisah dan saling terintegrasi melalui REST API.

---

## 🚀 Fitur Utama

- 🔐 **Autentikasi JWT**: Registrasi, login, dan proteksi endpoint.
- 🌱 **Prediksi Tanaman**: Menyimpan hasil klasifikasi beserta gambar ke Supabase.
- 💚 **Favorit & Koleksi**: Menandai dan mengelola tanaman favorit pengguna.
- 🎯 **Misi Harian & Eksklusif**: Sistem challenge dengan poin & progress harian.
- 📅 **Reset Otomatis**: Gunakan `node-cron` untuk reset progress misi setiap hari.
- ☁️ **Upload Multipart**: Dukungan upload gambar via `multipart/form-data`.

---

## 🛠️ Teknologi & Tools

- **Node.js** + **Hapi.js** (REST API)
- **Prisma ORM** + **PostgreSQL**
- **JWT Authentication** (`@hapi/jwt`)
- **Supabase Storage** (upload gambar)
- **Joi** (validasi skema request)
- **Nodemon** (dev server)
- **Docker** (untuk model ML, bukan back-end ini)
- **Render** (hosting back-end API)
- **Cloud Integration**: Berfungsi optimal dalam arsitektur cloud bersama Vercel (front-end) dan AWS (ML model)

---
