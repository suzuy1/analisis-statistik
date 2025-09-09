
# StatViz: Kalkulator & Visualisator Statistik Bertenaga AI

Ubah data mentah dan soal cerita statistik menjadi wawasan yang dapat ditindaklanjuti dengan mudah.

<p align="center">
  <a href="https://github.com/suzuy1/analisis-statistik/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <a href="https://github.com/suzuy1/analisis-statistik"><img src="https://img.shields.io/github/stars/suzuy1/analisis-statistik?style=social" alt="GitHub stars"></a>
</p>

---

## ✨ Fitur Utama

- **Input Data Fleksibel:**
  - **Manual:** Masukkan atau tempel data numerik secara langsung.
  - **Unggah CSV:** Impor dataset dengan mudah menggunakan file CSV.
  - **Soal Cerita (Teks):** Ketik atau tempel soal cerita statistik, dan biarkan AI menyelesaikannya secara rinci.
  - **Soal Cerita (Gambar):** Unggah gambar soal cerita, dan AI akan menganalisis serta memberikan solusi.

- **Analisis Statistik Komprehensif:**
  - Hitung metrik deskriptif seperti: Mean, Median, Modus, Varians, Standar Deviasi, Range, Kuartil (Q1, Q3), IQR, dll.

- **Kecerdasan Buatan (AI) Terintegrasi:**
  - **Penyelesai Soal Cerita:** Solusi langkah demi langkah untuk soal statistik berbasis teks/gambar.
  - **Saran Visualisasi Cerdas:** Rekomendasi otomatis jenis grafik terbaik (Histogram, Pie, Scatter, Box Plot, dsb).
  - **Wawasan Otomatis:** Ringkasan dan insight data/statistik secara otomatis.

- **Visualisasi Data Interaktif:**
  - Pilihan berbagai tipe grafik, lengkap dengan tooltip untuk eksplorasi data.

- **Ekspor ke PDF:**
  - Hasil analisis, insight AI, dan visualisasi dapat diekspor ke PDF profesional.

---

## 🚀 Tumpukan Teknologi

| Kategori         | Teknologi                      |
|------------------|-------------------------------|
| Framework        | Next.js, Genkit               |
| Bahasa           | JavaScript/TypeScript         |
| AI & GenAI       | Google Generative AI (Gemini) |
| Styling & UI     | Tailwind CSS, Headless UI     |
| Visualisasi Data | Chart.js, d3.js               |
| Utilitas         | dotenv, csv-parser, dsb       |

---

## 🏁 Memulai

### Prasyarat

- Node.js versi **18.18.0** atau lebih baru

### Instalasi

1. **Kloning repositori:**
    ```bash
    git clone https://github.com/suzuy1/analisis-statistik.git
    cd analisis-statistik
    ```

2. **Instal dependensi:**
    ```bash
    npm install
    ```

3. **Siapkan variabel lingkungan:**
    - Buat file `.env.local` di root project
    - Tambahkan API Key Google:
      ```
      GOOGLE_API_KEY="AIzaSy..."
      ```

4. **Jalankan server pengembangan:**
    ```bash
    npm run dev
    ```
    - Aplikasi web dan backend AI berjalan bersamaan.
    - Buka [http://localhost:9002](http://localhost:9002) di browser.

---

## 📜 Skrip yang Tersedia

- `npm run dev` – Memulai server pengembangan Next.js & Genkit
- `npm run build` – Build aplikasi untuk produksi
- `npm start` – Menjalankan aplikasi hasil build
- `npm run lint` – Menjalankan linter untuk cek masalah kode

---

## 🤝 Kontribusi

Kontribusi sangat terbuka!  
Jika punya ide fitur baru atau menemukan bug:
1. Fork repositori ini
2. Buat branch fitur baru  
   `git checkout -b fitur/fitur-keren`
3. Commit perubahan  
   `git commit -m 'Menambahkan fitur keren'`
4. Push ke branch  
   `git push origin fitur/fitur-keren`
5. Buka Pull Request

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](./LICENSE).

---

<sub>Logo statistik diambil dari [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Statistics_icon.svg) (public domain). Bisa diganti dengan logo buatan sendiri jika tersedia.</sub>
