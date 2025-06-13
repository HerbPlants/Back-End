
<h1>🌿 HerbPlants Back-End API</h1>

<p>Back-end dari aplikasi klasifikasi tumbuhan yang mendukung autentikasi pengguna, pengelolaan hasil prediksi, koleksi tanaman favorit, serta sistem misi harian berbasis aktivitas pengguna. API ini dibangun menggunakan <strong>Hapi.js</strong>, <strong>Prisma ORM</strong>, dan terintegrasi dengan layanan penyimpanan <strong>Supabase</strong>.</p>

<hr />

<h2>📌 Deskripsi Singkat</h2>
<p>
  Proyek ini merupakan bagian dari sistem klasifikasi tumbuhan yang terbagi dalam dua jalur pengembangan utama:
</p>
<ul>
  <li><strong>Machine Learning</strong>: Pengembangan model CNN berbasis TensorFlow yang di-deploy menggunakan Docker + Flask di AWS.</li>
  <li><strong>Aplikasi Web (Front-End & Back-End)</strong>: Dibangun dengan Next.js (frontend) dan Hapi.js (backend) dengan arsitektur terpisah dan saling terintegrasi melalui REST API.</li>
</ul>

<hr />

<h2>🚀 Fitur Utama</h2>
<ul>
  <li>🔐 <strong>Autentikasi JWT</strong>: Registrasi, login, dan proteksi endpoint.</li>
  <li>🌱 <strong>Prediksi Tanaman</strong>: Menyimpan hasil klasifikasi beserta gambar ke Supabase.</li>
  <li>💚 <strong>Favorit & Koleksi</strong>: Menandai dan mengelola tanaman favorit pengguna.</li>
  <li>🎯 <strong>Misi Harian & Eksklusif</strong>: Sistem challenge dengan poin & progress harian.</li>
  <li>📅 <strong>Reset Otomatis</strong>: Gunakan <code>node-cron</code> untuk reset progress misi setiap hari.</li>
  <li>☁️ <strong>Upload Multipart</strong>: Dukungan upload gambar via <code>multipart/form-data</code>.</li>
</ul>

<hr />

<h2>🛠️ Teknologi & Tools</h2>
<ul>
  <li><strong>Node.js</strong> + <strong>Hapi.js</strong> (REST API)</li>
  <li><strong>Prisma ORM</strong> + <strong>PostgreSQL</strong></li>
  <li><strong>JWT Authentication</strong> (<code>@hapi/jwt</code>)</li>
  <li><strong>Supabase Storage</strong> (upload gambar)</li>
  <li><strong>Joi</strong> (validasi skema request)</li>
  <li><strong>Nodemon</strong> (dev server)</li>
  <li><strong>Docker</strong> (untuk model ML, bukan back-end ini)</li>
  <li><strong>Render</strong> (hosting back-end API)</li>
  <li><strong>Cloud Integration</strong>: Berfungsi optimal dalam arsitektur cloud bersama Vercel (front-end) dan AWS (ML model)</li>
</ul>

<hr />

<h2>📦 Langkah Instalasi & Menjalankan</h2>
<ol>
  <li>Clone repositori: <code>git clone [url]</code></li>
  <li>Install dependencies: <code>npm install</code></li>
  <li>Salin dan konfigurasi file <code>.env</code> sesuai <code>.env.example</code></li>
  <li>Masukkan data dasar ke database: <code>npm run input-db</code></li>
  <li>Jalankan dalam mode development: <code>npm run dev</code></li>
  <li>Untuk production:<br />
    a. <code>npm run build</code> (jika diperlukan)<br />
    b. <code>npm run start</code>
  </li>
</ol>

<hr />

<h2>🧰 Teknologi yang Digunakan (Logo)</h2>
<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Hapi.js-FFC30B?logo=hapi&logoColor=black" alt="Hapi.js" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white" alt="Prisma ORM" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Joi-1DA1F2?logo=data&logoColor=white" alt="Joi Validation" />
  <img src="https://img.shields.io/badge/Nodemon-76D04B?logo=nodemon&logoColor=white" alt="Nodemon" />
  <img src="https://img.shields.io/badge/Dotenv-8DD6F9?logo=dotenv&logoColor=black" alt="Dotenv" />
  <img src="https://img.shields.io/badge/Node--Cron-FF6F00?logo=cron&logoColor=white" alt="Node-cron" />
</div>
