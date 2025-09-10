# StatViz: Analisis & Visualisasi Statistik Bertenaga AI

StatViz adalah aplikasi web modern dan interaktif yang dirancang untuk menyederhanakan analisis statistik. Dengan antarmuka yang intuitif dan dukungan kecerdasan buatan (AI) yang kuat, StatViz memungkinkan pengguna, mulai dari pelajar hingga profesional, untuk dengan mudah memasukkan data, menghasilkan statistik terperinci, membuat visualisasi yang informatif, dan bahkan menyelesaikan soal cerita statistik.

![Screenshot StatViz](https://raw.githubusercontent.com/suzuy1/analisis-statistik/main/docs/blueprint.md)

## Fitur Utama

- **Input Data Serbaguna**: Masukkan data secara manual, unggah file CSV, atau berikan soal cerita statistik dalam format teks atau gambar.
- **Analisis Statistik Komprehensif**: Dapatkan metrik statistik penting secara instan, termasuk:
  - Rata-rata (Mean)
  - Median
  - Modus
  - Varians & Deviasi Standar
  - Rentang, Kuartil (Q1, Q3), dan Rentang Interkuartil (IQR)
- **Visualisasi Data Dinamis**: Pilih dari berbagai jenis bagan untuk memvisualisasikan data Anda, seperti:
  - Histogram
  - Diagram Lingkaran (Pie Chart)
  - Plot Pencar (Scatter Plot)
  - Box Plot
- **Kecerdasan Buatan (AI) Terintegrasi**:
  - **Saran Bagan Cerdas**: Dapatkan rekomendasi otomatis untuk jenis bagan yang paling sesuai dengan data Anda.
  - **Wawasan Data Otomatis**: Hasilkan interpretasi dan wawasan dari data Anda secara otomatis.
  - **Pemecah Soal Cerita**: Unggah gambar atau ketik soal cerita statistik dan biarkan AI menyelesaikannya untuk Anda.
- **Ekspor Laporan PDF**: Buat dan unduh laporan analisis lengkap dalam format PDF, yang mencakup ringkasan statistik, wawasan AI, dan visualisasi data.

## Teknologi yang Digunakan

- **Framework**: [Next.js](https://nextjs.org/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **AI**: [Google's Genkit](https://firebase.google.com/docs/genkit)
- **Visualisasi**: [Recharts](https://recharts.org/)
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/hosting)

## Memulai

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

1.  **Clone repositori:**
    ```bash
    git clone https://github.com/suzuy1/analisis-statistik.git
    cd analisis-statistik
    ```

2.  **Instal dependensi:**
    ```bash
    npm install
    ```

3.  **Siapkan variabel lingkungan:**
    Buat file `.env.local` di root proyek dan tambahkan variabel yang diperlukan, seperti kunci API untuk layanan AI.

4.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    ```
    Buka [http://localhost:9002](http://localhost:9002) di browser Anda.

## Cara Menggunakan

1.  **Pilih Mode Input**: Pilih antara mode "Data" untuk analisis numerik atau "Soal" untuk menyelesaikan soal cerita.
2.  **Masukkan Data Anda**:
    - **Mode Data**: Ketik atau tempel data yang dipisahkan koma, atau unggah file CSV.
    - **Mode Soal**: Ketik soal cerita atau unggah gambarnya.
3.  **Proses**: Klik tombol "Proses" untuk memulai analisis.
4.  **Jelajahi Hasil**: Lihat ringkasan statistik, visualisasi data, dan wawasan yang dihasilkan AI.
5.  **Ekspor**: Klik "Ekspor sebagai PDF" untuk mengunduh laporan lengkap Anda.
