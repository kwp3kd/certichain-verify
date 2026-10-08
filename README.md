# CertiChain Verify

Buat sebuah aplikasi web Verifikasi Sertifikat Kegiatan Kampus Berbasis Blockchain sebagai prototype sistem keamanan dan verifikasi sertifikat.

1. Tujuan Project

Aplikasi ini dibuat untuk membantu kampus atau panitia kegiatan menerbitkan sertifikat yang dapat diverifikasi keasliannya oleh mahasiswa maupun pihak luar seperti perusahaan atau HRD.

Masalah yang ingin diselesaikan adalah sertifikat PDF atau gambar relatif mudah diedit, misalnya nama peserta, jenis kegiatan, tanggal kegiatan, atau isi sertifikat. Oleh karena itu, sistem menggunakan hash sebagai sidik jari digital sertifikat dan menyimpan hash tersebut pada blockchain sebagai bukti pencatatan keaslian.

Blockchain tidak digunakan untuk menyimpan seluruh file sertifikat maupun data pribadi mahasiswa. Blockchain hanya menyimpan bukti pencatatan seperti hash sertifikat, ID sertifikat, waktu penerbitan, jenis kegiatan, dan alamat/wallet penerbit.

2. Konsep Utama Sistem

Alur utama sistem:

Admin / panitia membuat sertifikat PDF.

Sistem menghasilkan hash dari file sertifikat.

Hash sertifikat dicatat ke blockchain.

Sistem menghasilkan QR Code untuk sertifikat.

Mahasiswa menerima sertifikat.

Mahasiswa atau pihak perusahaan dapat melakukan verifikasi melalui QR Code atau kode sertifikat.

Sistem membandingkan hash sertifikat dengan hash yang tercatat pada blockchain.

Jika hash sama, sertifikat dinyatakan VALID / TERVERIFIKASI.

Jika hash berbeda, sertifikat dinyatakan TIDAK SESUAI / PERLU DIPERIKSA.

3. Target Pengguna

Admin / Panitia

Admin dapat:

Login.

Menambahkan sertifikat.

Mengelola sertifikat.

Melihat daftar sertifikat.

Membuat hash sertifikat.

Melihat informasi pencatatan blockchain.

Melihat status sertifikat.

Melihat riwayat penerbitan.

Melakukan verifikasi sertifikat.

Mahasiswa

Mahasiswa dapat:

Login.

Melihat sertifikat miliknya.

Melihat detail sertifikat.

Melihat status verifikasi.

Melihat QR Code.

Melakukan verifikasi sertifikat.

Publik / HRD / Verifier

Pengguna publik tidak harus login.

Pengguna dapat:

Membuka halaman verifikasi.

Memasukkan kode sertifikat.

Membuka halaman verifikasi melalui QR Code.

Melihat hasil verifikasi.

Melihat informasi sertifikat yang aman untuk ditampilkan secara publik.

Melihat bukti pencatatan blockchain.

4. Halaman yang Harus Dibuat

A. Landing Page

Buat landing page yang menarik, modern, informatif, dan mudah dipahami oleh semua pengguna, termasuk pengguna yang tidak memahami blockchain.

Isi:

Navbar sederhana.

Logo dan nama aplikasi.

Hero section.

Judul:
"Verifikasi Sertifikat Kegiatan Kampus Berbasis Blockchain"

Deskripsi singkat dengan bahasa sederhana.

Tombol utama "Verifikasi Sertifikat".

Tombol sekunder "Login".

Visual/ilustrasi sederhana yang menggambarkan sertifikat, QR Code, dan blockchain.

Penjelasan masalah.

Penjelasan solusi blockchain.

Alur sistem:
Sertifikat → Hash → Blockchain → QR Code → Verifikasi

Statistik sederhana:

Total sertifikat.

Total sertifikat terverifikasi.

Total kegiatan.

Bagian manfaat sistem.

Footer.

Hero section harus langsung menjelaskan fungsi utama website tanpa membuat pengguna membaca terlalu banyak teks.

B. Login

Buat halaman login dengan tampilan sederhana dan bersih.

Role:

Admin.

Mahasiswa.

Gunakan akun dummy.

Jangan meminta:

Private key.

Seed phrase.

Password wallet.

Credential sensitif blockchain.

C. Dashboard Admin

Gunakan dashboard modern dengan sidebar.

Menu sidebar:

Dashboard

Sertifikat

Tambah Sertifikat

Verifikasi

Blockchain

Aktivitas

Logout

Dashboard menampilkan:

Total sertifikat.

Total sertifikat valid.

Total sertifikat tidak sesuai.

Total kegiatan.

Grafik jumlah sertifikat berdasarkan bulan.

Aktivitas terbaru.

Gunakan Stat Card yang mudah dibaca.

D. Daftar Sertifikat

Buat tabel yang modern dan responsive.

Kolom:

No

ID Sertifikat

Nama Penerima

Kegiatan

Jenis Kegiatan

Tanggal Penerbitan

Status

Blockchain

Action

Fitur:

Search.

Filter.

Pagination.

Detail sertifikat.

Verifikasi.

Pada perangkat mobile, jangan memaksakan tabel terlalu lebar. Gunakan card atau layout responsive.

E. Tambah Sertifikat

Buat form yang sederhana dan tidak membingungkan.

Field:

ID / kode sertifikat.

Nama penerima.

NIM.

Nama kegiatan.

Jenis kegiatan.

Penyelenggara.

Tanggal kegiatan.

Tanggal penerbitan.

File sertifikat PDF.

Setelah file dimasukkan:

Sistem membuat hash file.

Hash ditampilkan.

Sistem membuat data blockchain dummy.

Sistem membuat transaction ID dummy.

Sistem menghasilkan timestamp.

Sistem menghasilkan QR Code.

Sertifikat dapat disimpan.

Gunakan wizard atau step-by-step interface apabila memungkinkan:

1. Data Sertifikat → 2. Hash → 3. Blockchain → 4. QR Code → 5. Selesai

Hal ini membuat proses lebih mudah dipahami oleh admin.

F. Detail Sertifikat

Tampilkan informasi dalam bentuk card.

Informasi Sertifikat

ID Sertifikat.

Nama penerima.

NIM.

Nama kegiatan.

Jenis kegiatan.

Penyelenggara.

Tanggal kegiatan.

Tanggal penerbitan.

Informasi Verifikasi

Status sertifikat.

Certificate Hash.

Hash Blockchain.

Status Blockchain.

Transaction ID.

Block Number.

Timestamp.

Wallet / Address penerbit.

Tambahkan QR Code.

QR Code mengarah ke:

/verify/{certificateId}

Jangan menampilkan informasi blockchain secara berlebihan kepada pengguna awam. Informasi teknis dapat ditempatkan pada bagian "Detail Blockchain" yang dapat dibuka ketika dibutuhkan.

G. Halaman Verifikasi

Halaman ini merupakan halaman utama untuk publik dan HRD.

Buat desain yang sangat sederhana, jelas, dan terpercaya.

Tampilkan:

"Verifikasi Keaslian Sertifikat"

Tambahkan penjelasan:

"Masukkan kode sertifikat atau gunakan QR Code untuk memeriksa keaslian sertifikat."

Input:

Kode sertifikat.

Tombol:

Verifikasi

Berikan pilihan alternatif:

"Belum punya kode? Scan QR Code pada sertifikat."

Status Valid

Tampilkan card utama dengan:

✓ SERTIFIKAT TERVERIFIKASI

Tampilkan informasi:

ID sertifikat.

Nama penerima.

Kegiatan.

Jenis kegiatan.

Penyelenggara.

Tanggal penerbitan.

Keterangan utama:

"Sertifikat ini sesuai dengan data yang tercatat dan berhasil diverifikasi."

Tambahkan bagian:

Detail Verifikasi

Certificate Hash.

Blockchain Status.

Transaction ID.

Timestamp.

Gunakan istilah teknis secara sederhana.

Status Tidak Valid

Tampilkan card utama:

✕ SERTIFIKAT TIDAK SESUAI

Keterangan:

"Data sertifikat tidak sesuai dengan catatan yang tersedia. Sertifikat perlu diperiksa kembali kepada pihak penerbit."

Jangan menggunakan bahasa yang terlalu teknis atau menakutkan.

H. Dashboard Mahasiswa

Menu:

Dashboard

Sertifikat Saya

Verifikasi

Profil

Logout

Tampilkan:

Jumlah sertifikat.

Jumlah sertifikat valid.

Sertifikat terbaru.

Daftar sertifikat.

Tombol detail.

Tombol verifikasi.

Gunakan card sertifikat yang menarik agar mahasiswa dapat melihat sertifikat dengan mudah.

I. Blockchain / Riwayat Pencatatan

Buat halaman untuk menampilkan informasi blockchain secara sederhana.

Kolom:

Certificate ID.

Certificate Hash.

Transaction ID.

Block Number.

Wallet Address.

Timestamp.

Status.

Tambahkan penjelasan:

"Blockchain digunakan sebagai bukti pencatatan keaslian sertifikat, bukan sebagai tempat penyimpanan file sertifikat."

Berikan opsi "Lihat Detail" untuk pengguna yang ingin melihat informasi teknis.

5. Struktur Data

Gunakan data dummy.

type Certificate = {
  id: string;
  studentName: string;
  studentNim: string;
  activityName: string;
  activityType: string;
  organizer: string;
  eventDate: string;
  issuedAt: string;
  fileHash: string;
  blockchainHash: string;
  transactionId: string;
  blockNumber: number;
  issuerWallet: string;
  verificationStatus: "VALID" | "INVALID";
  blockchainStatus: "RECORDED" | "NOT_RECORDED";
};


Jangan menggunakan data pribadi nyata.

Gunakan nama, NIM, wallet address, transaction ID, hash, dan data lainnya yang sepenuhnya dummy.

6. Konsep Hash

Prototype harus memperlihatkan bahwa file sertifikat memiliki hash.

Visualisasi:

Sertifikat PDF
      ↓
   Hashing
      ↓
Certificate Hash
      ↓
 Blockchain


Saat melakukan verifikasi:

Hash Sertifikat
      ↓
   Bandingkan
      ↑
Hash Blockchain


Jika sama:

✓ VALID


Jika berbeda:

✕ TIDAK SESUAI


7. Data Blockchain Dummy

Gunakan data simulasi seperti:

Certificate Hash:
A8F91C72B4E91D...

Transaction ID:
0x7a91bc82d...

Block Number:
18294531

Wallet Address:
0x82A7...91F2

Timestamp:
2026-09-15 10:30:25


Data tersebut hanya contoh dan tidak boleh dianggap sebagai transaksi blockchain sungguhan.

8. QR Code

Setiap sertifikat memiliki QR Code.

QR Code mengarah ke halaman verifikasi:

https://domain.com/verify/SRT-2026-0001


Saat QR Code dibuka, sistem langsung menampilkan halaman hasil verifikasi untuk sertifikat tersebut.

9. Keamanan dan Privasi

Jangan menyimpan data pribadi mahasiswa secara terbuka di blockchain.

Jangan menyimpan:

Nama lengkap di blockchain.

NIM di blockchain.

IPK.

Nilai akademik.

Data pribadi sensitif.

Password.

Private key.

Seed phrase.

Blockchain hanya digunakan untuk menyimpan bukti keaslian dan pencatatan sertifikat.

10. Teknologi

Gunakan:

React.

TypeScript.

React Router.

Tailwind CSS.

Komponen reusable.

Mock data.

Responsive design.

Struktur:

src/
├── components/
├── layouts/
├── pages/
├── routes/
├── data/
├── types/
├── utils/
└── App.tsx


Gunakan reusable components:

Sidebar.

Navbar.

StatCard.

CertificateTable.

CertificateCard.

StatusBadge.

VerificationResult.

BlockchainInfo.

QRCode.

Modal.

Button.

Input.

Search.

Filter.

11. Desain UI / UX

Buat tampilan yang menarik, modern, profesional, ramah pengguna, dan mudah dipahami oleh semua kalangan.

Gaya Visual

Gunakan gaya:

Modern.

Minimalis.

Bersih.

Profesional.

Elegan.

Ramah.

Terpercaya.

Tidak terlalu banyak elemen dekoratif.

Gunakan warna yang memberikan kesan:

Aman.

Terpercaya.

Teknologi.

Institusi pendidikan.

Hindari penggunaan terlalu banyak warna.

User-Friendly

Prioritaskan kemudahan penggunaan dibandingkan tampilan yang terlalu kompleks.

Gunakan:

Bahasa Indonesia yang sederhana.

Label tombol yang jelas.

Icon dengan tooltip jika diperlukan.

Pesan error yang mudah dipahami.

Pesan sukses yang jelas.

Loading state.

Empty state.

Confirmation dialog untuk tindakan penting.

Form dengan label yang jelas.

Validasi input.

Feedback setelah setiap aksi.

Jangan membuat pengguna harus memahami istilah blockchain untuk menggunakan fitur verifikasi.

Contohnya:

Jangan hanya menampilkan:

Hash mismatch

Gunakan:

"Sertifikat tidak sesuai dengan catatan yang tersimpan."

Kemudian sediakan:

"Lihat detail teknis"

untuk pengguna yang ingin mengetahui informasi hash.

Accessibility

Pastikan UI ramah untuk sebanyak mungkin pengguna:

Kontras teks yang baik.

Ukuran font nyaman dibaca.

Tombol memiliki ukuran yang cukup besar.

Jangan bergantung hanya pada warna untuk menunjukkan status.

Gunakan icon + teks untuk status.

Navigasi jelas.

Fokus keyboard terlihat.

Form memiliki label.

Error message mudah ditemukan.

Responsive di berbagai ukuran layar.

Responsive Design

Tampilan harus optimal pada:

Desktop.

Laptop.

Tablet.

Mobile.

Pada mobile:

Sidebar berubah menjadi menu drawer.

Card tersusun satu kolom.

Tabel berubah menjadi card/list jika diperlukan.

Tombol utama tetap mudah dijangkau.

Input dan tombol memiliki ukuran yang nyaman disentuh.

Verification UX

Halaman verifikasi harus menjadi halaman paling sederhana.

Pengguna harus dapat:

Buka halaman → Masukkan kode / scan QR → Klik verifikasi → Langsung melihat hasil.

Jangan membuat pengguna melewati terlalu banyak halaman.

Status harus sangat jelas:

✓ TERVerifikasi

atau

✕ TIDAK SESUAI

Tambahkan informasi pendukung di bawah status.

12. Scope Prototype

Untuk tahap prototype, batasi sistem menjadi:

1 universitas → 1 jenis kegiatan → sertifikat PDF → QR Code → hash → blockchain testnet / simulasi blockchain

Jangan membuat sistem terlalu kompleks.

Blockchain asli dapat diintegrasikan pada tahap berikutnya.

Untuk versi prototype, gunakan mock blockchain tetapi struktur aplikasi harus dibuat agar mudah dihubungkan dengan backend dan blockchain sebenarnya.

13. Output yang Diharapkan

Hasil akhir harus berupa prototype website yang dapat mendemonstrasikan:

Admin membuat sertifikat.

Sistem menghasilkan hash.

Sertifikat memiliki QR Code.

Hash dicatat dalam simulasi blockchain.

Mahasiswa melihat sertifikatnya.

Publik / HRD membuka halaman verifikasi.

Sistem melakukan pencocokan hash.

Sistem menampilkan status VALID atau TIDAK SESUAI.

Pengguna dapat melihat informasi pencatatan blockchain.

Seluruh proses dapat digunakan dengan mudah bahkan oleh pengguna yang tidak memahami teknologi blockchain.

Tampilan terlihat seperti produk aplikasi universitas yang nyata, profesional, modern, dan siap dikembangkan ke tahap berikutnya.

Prioritaskan user experience, visual hierarchy, readability, accessibility, responsiveness, dan kesederhanaan alur daripada memasukkan terlalu banyak informasi teknis ke dalam satu halaman.

Jangan mengklaim blockchain sudah benar-benar terhubung apabila masih menggunakan mock data.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/476e8cc7-2c3d-4cac-941b-444d1bd35c6d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
