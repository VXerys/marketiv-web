# FEATURES.md — Spesifikasi Modul Fitur Marketiv

> Kembali ke: [README.md](../README.md) | [DATABASE.md](DATABASE.md) | [TECHNICAL_GUIDELINES.md](TECHNICAL_GUIDELINES.md)

---

## Daftar Isi

1. [Sistem Autentikasi & Role](#1-sistem-autentikasi--role)
2. [Modul Campaign Mode](#2-modul-campaign-mode)
3. [Modul Rate Card Mode](#3-modul-rate-card-mode)
4. [Modul Keuangan & Escrow](#4-modul-keuangan--escrow)
5. [Modul AI Features](#5-modul-ai-features)
6. [Modul Admin & Pelaporan](#6-modul-admin--pelaporan)

---

## 1. Sistem Autentikasi & Role

### 1.1 Alur Registrasi

```
1. User mengisi form: nama_lengkap, email, password, nomor_whatsapp
2. User WAJIB memilih role saat registrasi: "Saya Pemilik UMKM" atau "Saya Konten Kreator"
3. Sistem membuat record di tabel USERS dengan role yang dipilih
4. Sistem kirim email verifikasi (via Supabase Auth)
5. Setelah verifikasi email → is_verified = TRUE → user bisa login
```

### 1.2 Alur Login & JWT

```
1. User input email + password
2. Backend validasi credentials
3. Password dicek dengan Bcrypt compare (TIDAK PERNAH compare plaintext)
4. Jika valid → generate JWT token (via Supabase Auth)
5. JWT disimpan di httpOnly cookie atau localStorage
6. Setiap request API wajib membawa JWT di header: Authorization: Bearer <token>
7. Backend middleware decode JWT → ambil id_user dan role → tentukan akses
```

### 1.3 Role-Based Access Control (RBAC)

| Endpoint / Fitur | UMKM | KREATOR | ADMIN |
|---|:---:|:---:|:---:|
| Buat Campaign | ✅ | ❌ | ❌ |
| Lihat Job Pool | ❌ | ✅ | ✅ |
| Klaim Job | ❌ | ✅ | ❌ |
| Submit URL Bukti Tayang | ❌ | ✅ | ❌ |
| Direktori Kreator (Rate Card) | ✅ | ❌ | ✅ |
| Live Chat (Rate Card) | ✅ | ✅ | ❌ |
| Kirim Custom Offer | ✅ | ❌ | ❌ |
| Buat/Edit Rate Card | ❌ | ✅ | ❌ |
| Top-up Saldo / Deposit | ✅ | ❌ | ❌ |
| Withdraw Saldo | ❌ | ✅ | ❌ |
| Dashboard Admin | ❌ | ❌ | ✅ |
| Export Laporan GMV | ❌ | ❌ | ✅ |
| Batalkan/Tahan Escrow | ❌ | ❌ | ✅ |

### 1.4 Routing Berdasarkan Role Setelah Login

```javascript
// Setelah login, redirect berdasarkan role:
if (user.role === 'UMKM')    redirect('/dashboard/umkm')
if (user.role === 'KREATOR') redirect('/dashboard/kreator')
if (user.role === 'ADMIN')   redirect('/admin')
```

---

## 2. Modul Campaign Mode

> Campaign Mode adalah sistem **performance-based marketing** di mana UMKM membayar berdasarkan jumlah views yang tervalidasi. **TIDAK ADA komunikasi (chat) sama sekali** di mode ini.

### 2.1 Alur Lengkap End-to-End

```
FASE 1: INISIASI & DEPOSIT (Sisi UMKM)
  1. UMKM isi form Campaign (Brief Builder / Wizard Form)
  2. UMKM upload aset → validasi ukuran file (maks 100MB) atau input URL Drive
  3. Sistem tampilkan total estimasi biaya
  4. UMKM klik "Lanjut ke Pembayaran Escrow"
  5. UMKM bayar via Midtrans (VA / e-Wallet)
  6. Midtrans kirim webhook konfirmasi ke backend
  7. Backend update status Campaign → "Aktif"
  8. Campaign muncul di Job Pool untuk kreator
      ↓
FASE 2: KLAIM & EKSEKUSI (Sisi Kreator)
  9. Kreator browse Job Pool → lihat daftar campaign aktif
  10. Kreator buka detail campaign → lihat brief + URL aset mentah
  11. Kreator klik "Klaim Job Ini"
  12. Sistem cek: apakah kuota_kreator masih tersedia?
      - Jika ya → kuota_terpakai + 1 → record submission dibuat (status: Pending)
      - Jika tidak → tombol disabled, tampilkan "Kuota Penuh"
  13. Kreator download/akses aset mentah via URL Drive yang disediakan UMKM
  14. Kreator edit video di luar platform (CapCut, dll) — Marketiv TIDAK menyediakan editor
  15. Kreator posting video di akun TikTok/Instagram PRIBADI kreator
      ↓
FASE 3: VALIDASI & PENCAIRAN (Sistem + Kreator)
  16. Kreator masuk ke halaman "Pekerjaan Aktif" di dashboard
  17. Kreator paste URL publik TikTok/IG ke kolom input
  18. Kreator klik "Submit Bukti Tayang"
  19. Sistem verifikasi URL (format valid? URL publik?)
  20. Sistem cek anomali views (AI Fraud Detection) selama periode validasi
  21. Jika VALID → sistem instruksikan Midtrans untuk rilis dana ke dompet kreator
  22. Pencairan dilakukan secara tiered (bertingkat) sesuai views tercapai
  23. UMKM mendapat laporan: total views, ROI estimasi, status campaign
```

### 2.2 Form Pembuatan Campaign (Brief Builder — Wizard Multi-Step)

Form ini menggunakan **Wizard (multi-step form)** — BUKAN satu halaman panjang.

**Step 1: Informasi Produk**
```
Fields:
- judul_campaign       : VARCHAR(200), required
  → Label: "Nama Produk / Judul Campaign"
  → Placeholder: "contoh: Dapur Sehat — Sambal Matah Khas Sukabumi"

- deskripsi_brief      : TEXT, required
  → Label: "Ceritakan Produk & Instruksi untuk Kreator"
  → Placeholder: "Produk saya adalah... Saya ingin kreator membuat video..."
  → Terdapat tombol "✨ Bantu Saya dengan AI" → trigger AI Brief Assistant
  → Minimum 50 karakter

- niche                : SELECT, required
  → Options: Kuliner, Fesyen, Pariwisata, Edukasi, Kecantikan, Lainnya
```

**Step 2: Upload Aset Mentah**
```
Fields:
- Opsi A: Area Drag & Drop upload file langsung
  → Hanya untuk: logo, foto produk, gambar referensi
  → Validasi WAJIB di frontend DAN backend:
      if (file.size > 100 * 1024 * 1024) {
        throw new Error("Batas maksimal unggahan file adalah 100 MB. Silakan gunakan URL Link Eksternal.")
      }
  → Pesan error ditampilkan dengan warna MERAH di bawah input

- Opsi B: Input URL Eksternal (untuk video mentah berukuran besar)
  → Label: "Link Google Drive / Dropbox aset video mentah Anda"
  → Placeholder: "https://drive.google.com/..."
  → Validasi format URL (harus dimulai dengan https://)
  → Wajib: salah satu dari Opsi A atau Opsi B harus diisi

- Warning text yang selalu tampil (warna oranye):
  "📌 Untuk video bahan mentah berukuran besar, WAJIB gunakan link Google Drive/Dropbox.
   Marketiv tidak menyimpan file video secara internal."
```

**Step 3: Pengaturan Budget & Kuota**
```
Fields:
- harga_per_1000_views : DECIMAL, required
  → Label: "Bayaran per 1.000 Views"
  → Input: angka (rupiah)
  → Range yang disarankan: Rp 2.000 — Rp 10.000
  → Hint: "Harga lebih tinggi = lebih banyak kreator tertarik"

- kuota_kreator        : INT, required
  → Label: "Berapa kreator yang bisa klaim campaign ini?"
  → Minimum: 1, Maximum: 100

- total_budget_escrow  : DECIMAL, required
  → Label: "Total Budget Maksimal Campaign (Rp)"
  → Auto-calculate: harga_per_1000_views × estimasi views target
  → Hint: "Dana ini akan ditahan sementara oleh sistem hingga campaign selesai"

- Tampilkan ringkasan biaya:
  → Budget Kampanye     : Rp X
  → Komisi Platform 15%: Rp Y
  → Total yang dibayar  : Rp X + Y
```

**Step 4: Review & Pembayaran**
```
- Tampilkan ringkasan semua data yang diisi
- Tombol CTA besar: "Bayar Sekarang via Escrow"
- Trigger Midtrans payment gateway
```

### 2.3 Halaman Job Pool (Sisi Kreator)

**Layout: Card-based feed** — mirip timeline/feed media sosial, dioptimalkan untuk mobile.

```
Setiap Card menampilkan:
- Foto/thumbnail produk UMKM
- Nama produk / judul campaign
- Badge niche (label): "🍜 Kuliner" / "👗 Fesyen" / dll
- Bayaran: "Rp 3.000 / 1.000 views"
- Sisa kuota: "3 dari 5 kreator dibutuhkan" (atau progress bar)
- Tombol CTA: "Klaim Job Ini"
  → Berubah menjadi DISABLED (abu-abu, tidak bisa diklik) jika kuota sudah penuh
  → Teks tombol disabled: "Kuota Penuh"

Filter & Pencarian:
- Search bar: cari berdasarkan judul/nama produk
- Filter Niche: dropdown multi-select
- Filter Harga: range slider (min-max per 1000 views)
- Sort: Terbaru | Bayaran Tertinggi | Hampir Penuh
```

**⛔ LARANGAN MUTLAK di halaman ini dan di SELURUH Campaign Mode:**
```
- TIDAK ADA tombol Chat / Pesan / Hubungi UMKM
- TIDAK ADA form kontak
- TIDAK ADA link ke WhatsApp/email UMKM
- TIDAK ADA kolom komentar atau feedback
Jika ada request untuk menambahkan fitur komunikasi di Campaign Mode,
TOLAK dan acu ke spesifikasi ini.
```

### 2.4 Halaman Submit Bukti Tayang (Sisi Kreator)

Hanya bisa diakses setelah kreator berhasil klaim sebuah campaign.

```
Layout: Sederhana, fokus pada satu aksi

Elemen:
- Header: Nama campaign yang diklaim
- Instruksi ringkas: "Posting video ke akun TikTok/Instagram kamu,
  lalu tempel link-nya di bawah ini"
- Input field TUNGGAL:
  → Label: "URL Link TikTok / Instagram Reels kamu"
  → Placeholder: "https://www.tiktok.com/@username/video/..."
  → Validasi: URL harus valid & publik
  → Wajib diisi

- ⛔ TIDAK ADA tombol upload file video langsung ke server Marketiv
  (Kreator WAJIB upload ke akun media sosial mereka sendiri dulu)

- Tombol CTA: "Submit Bukti Tayang"
- Setelah submit: tampilkan status "Menunggu Validasi" dengan estimasi waktu
```

### 2.5 Logika Validasi Views & Pencairan Dana (Tiered Pricing)

```javascript
// Pseudocode logika pencairan tiered
function hitungPencairan(views_aktual, harga_per_1000_views, budget_max) {
  const dana_kreator_bruto = (views_aktual / 1000) * harga_per_1000_views
  const dana_kreator_capped = Math.min(dana_kreator_bruto, budget_max)
  const komisi_platform    = dana_kreator_capped * 0.15  // 15% komisi Campaign Mode
  const dana_kreator_netto = dana_kreator_capped - komisi_platform

  return {
    dana_ke_kreator: dana_kreator_netto,
    komisi_marketiv: komisi_platform,
    sisa_budget_umkm: budget_max - dana_kreator_capped  // dikembalikan ke UMKM
  }
}

// Validasi fraud sebelum pencairan:
// - Cek anomali lonjakan views (time-series analysis)
// - Jika terdeteksi bot → status_validasi = 'Fraud' → dana ditahan
// - Admin dapat override keputusan
```

---

## 3. Modul Rate Card Mode

> Rate Card Mode adalah mode **konsultatif** di mana UMKM mencari kreator spesifik, bernegosiasi via chat, dan membayar harga tetap. **Live Chat AKTIF** di mode ini.

### 3.1 Alur Lengkap End-to-End

```
1. UMKM browse direktori kreator → cari via filter
2. UMKM klik profil kreator → lihat Rate Card (paket harga)
3. UMKM klik "Hubungi / Mulai Chat"
4. Sistem buat room chat baru (rate_card_orders dengan status 'Negosiasi')
5. UMKM & Kreator negosiasi detail: scope kerja, deadline, revisi, dll
6. Saat kesepakatan tercapai, UMKM klik tombol "Kirim Penawaran (Custom Offer)"
7. Form Custom Offer muncul di dalam chat room (seperti widget)
8. UMKM isi: harga_final, scope_pekerjaan, deadline
9. Custom Offer tampil di chat sebagai "bubble" khusus (beda dari pesan biasa)
10. Kreator menerima notifikasi → masuk chat room → klik "Terima Penawaran"
11. Status order → 'Menunggu Pembayaran'
12. UMKM melakukan deposit via Midtrans (harga_final + 10% platform fee)
13. Dana masuk ke Escrow → status order → 'Escrow'
14. Kreator eksekusi pekerjaan (produksi konten)
15. Kreator bisa submit draft untuk direview UMKM (opsional, sesuai kesepakatan)
16. UMKM setuju → Kreator posting via "Collab Post" di Instagram/TikTok
17. Kreator submit URL Collab Post ke sistem
18. Sistem verifikasi: URL valid? Kedua akun tercantum sebagai co-author?
19. Dana di Escrow cair ke dompet kreator (dikurangi 10% platform fee)
20. Status order → 'Selesai'
```

### 3.2 Direktori Kreator (Halaman Pencarian)

```
Layout: Grid kartu kreator (2-3 kolom di mobile, 4 kolom di desktop)

Setiap Kartu Kreator menampilkan:
- Foto profil kreator
- Nama kreator
- Badge niche utama: "🍜 Kuliner"
- Harga mulai: "Mulai dari Rp 150.000"
- Engagement rate (jika tersedia)
- Tombol: "Lihat Profil"

Filter & Pencarian:
- Search bar: cari nama kreator atau niche
- Filter Niche: Kuliner | Fesyen | Edukasi | Pariwisata | Kecantikan | Lainnya
- Filter Rentang Harga: Rp 0 — Rp 1.000.000+ (slider)
- Filter Engagement Rate: dropdown
- Sort: Relevan | Harga Terendah | Harga Tertinggi | Terbaru
```

### 3.3 Halaman Profil Kreator (Publik)

```
Elemen yang ditampilkan:
- Foto profil + nama
- Bio singkat
- Niche / spesialisasi
- Link media sosial (TikTok, Instagram) — link ke profil publik mereka
- Portofolio: daftar URL konten terbaik kreator (dari submission sebelumnya)
- Daftar Rate Card Package (maks 3 paket):
    ┌─────────────────────────────────┐
    │ Paket Basic     Rp 150.000      │
    │ 1 video Reels, 3 hari           │
    │ [Hubungi Kreator]               │
    └─────────────────────────────────┘
```

### 3.4 Fitur Live Chat & Custom Offer

**Live Chat diimplementasikan menggunakan Supabase Realtime.**

```javascript
// Subscribe ke room chat realtime
const channel = supabase
  .channel(`order-${id_order}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `id_order=eq.${id_order}`
  }, (payload) => {
    // Append pesan baru ke UI tanpa reload
    appendMessage(payload.new)
  })
  .subscribe()
```

**Custom Offer Widget — tampilan di dalam chat:**
```
┌────────────────────────────────────────────────┐
│  📋 PENAWARAN RESMI                            │
│  ─────────────────────────────────────────── │
│  Harga Final      : Rp 350.000                 │
│  Scope Pekerjaan  : 1 video Reels 30 detik,   │
│                     3x revisi, collab post     │
│  Deadline         : 7 hari kerja               │
│  ─────────────────────────────────────────── │
│  [✅ Terima Penawaran]  [❌ Tolak]             │
└────────────────────────────────────────────────┘

Aturan:
- Hanya UMKM yang bisa KIRIM Custom Offer
- Hanya Kreator yang bisa TERIMA atau TOLAK Custom Offer
- Setelah Custom Offer diterima → form terkunci, tidak bisa diedit
- Jika Kreator tolak → kembali ke status 'Negosiasi', chat tetap bisa berjalan
```

**Warning Banner Wajib (Sticky Notice) di Atas Chat Room:**
```
⚠️ PENTING: Kreator WAJIB menggunakan fitur Collab Post Instagram/TikTok
saat memposting hasil video agar tayangan dan engagement masuk ke akun UMKM.
Postingan tanpa Collab Post tidak akan diverifikasi oleh sistem.
```

### 3.5 Manajemen Rate Card (Sisi Kreator)

```
Halaman: /dashboard/kreator/rate-card

Fitur:
- Tampilkan daftar paket yang sudah dibuat (maks 3)
- Tombol "Tambah Paket Baru"
  → DISABLED jika sudah ada 3 paket aktif
  → Pesan: "Anda sudah mencapai maksimal 3 paket. Hapus satu paket untuk menambah baru."
- Edit paket: ubah nama, deskripsi, harga, deliverable, estimasi hari
- Toggle aktif/nonaktif paket
- Hapus paket

Form Tambah/Edit Paket:
- nama_paket    : text, required, maks 100 karakter
- deskripsi     : textarea, opsional
- harga_paket   : number (Rupiah), required, min 10.000
- deliverable   : textarea, opsional (contoh: "1 video Reels 30-60 detik")
- estimasi_hari : number, opsional (contoh: 3)
```

### 3.6 Aturan Distribusi Konten Collab Post

```
Pada Rate Card Mode:
- Kreator WAJIB menggunakan fitur "Invite Collaborator" / "Collab Post" di Instagram atau TikTok
- Hasil: konten muncul di KEDUA akun (akun kreator + akun UMKM)
- Traffic dan engagement mengalir ke akun UMKM
- Sistem memverifikasi bahwa URL yang di-submit adalah Collab Post (bukan post biasa)

Jika Collab Post dihapus sebelum masa kontrak selesai:
- Admin berhak menahan/membatalkan pencairan dana
- Status order → 'Dispute'
```

---

## 4. Modul Keuangan & Escrow

### 4.1 Cara Kerja Escrow

```
Escrow adalah sistem penahanan dana oleh Marketiv sebagai pihak ketiga netral.

Alur dana:
UMKM → [deposit via Midtrans] → Escrow Marketiv → [setelah validasi] → Dompet Kreator

Prinsip:
- Dana UMKM TIDAK langsung ke kreator
- Dana ditahan sampai kondisi terpenuhi:
  Campaign Mode  : URL bukti tayang valid + views tervalidasi
  Rate Card Mode : URL Collab Post valid + tidak ada dispute aktif
- UMKM tidak bisa menarik dana yang sudah di-Escrow (kecuali campaign dibatalkan sebelum ada klaim)
- Kreator tidak bisa menerima dana sebelum kondisi terpenuhi
```

### 4.2 Top-Up Saldo & Deposit (Sisi UMKM)

```
Metode pembayaran (via Midtrans):
- Virtual Account (BCA, BNI, BRI, Mandiri, Permata)
- e-Wallet (GoPay, OVO, Dana, ShopeePay)
- QRIS

Alur:
1. UMKM pilih metode bayar
2. Backend request ke Midtrans API → dapat payment_token & redirect_url
3. UMKM diarahkan ke halaman pembayaran Midtrans (Snap)
4. Setelah bayar → Midtrans kirim webhook ke backend endpoint Marketiv
5. Backend validasi webhook (cek signature Midtrans)
6. Jika valid → update status transaksi → update status campaign/order
7. Dana masuk ke Escrow (dicatat di tabel TRANSACTIONS dengan status 'Escrow')

PENTING:
- Marketiv TIDAK PERNAH menyimpan data kartu kredit/debit secara langsung
- Semua pemrosesan kartu delegasikan ke Midtrans (bersertifikat PCI-DSS)
- Backend hanya menyimpan midtrans_order_id dan status transaksi
```

### 4.3 Penarikan Dana / Withdrawal (Sisi Kreator)

```
Syarat withdrawal:
- Saldo dompet_saldo kreator > 0
- Tidak ada submission aktif yang sedang dalam dispute

Alur:
1. Kreator masuk ke halaman "Saldo & Penarikan"
2. Kreator lihat saldo yang tersedia
3. Kreator isi form withdrawal:
   - Nominal yang ingin ditarik (min: Rp 10.000)
   - Nama bank
   - Nomor rekening
   - Nama pemilik rekening
4. Kreator klik "Tarik Dana"
5. Backend verifikasi saldo cukup
6. Backend request disbursement ke Midtrans Iris / Xendit
7. Status transaksi → 'Pending' → 'Success'
8. Kreator menerima notifikasi (email/in-app) saat dana berhasil ditransfer

Validasi:
- Nominal tidak boleh melebihi dompet_saldo
- Nomor rekening wajib diisi dengan benar
```

### 4.4 Struktur Komisi Platform

```
Campaign Mode:
- UMKM membayar: total_budget + 15% komisi Marketiv
- Kreator menerima: views_aktual/1000 × harga_per_1000_views
- Marketiv ambil: 15% dari total anggaran campaign

Rate Card Mode:
- UMKM membayar: harga_final + 10% platform & escrow fee
- Kreator menerima: harga_final (tanpa potongan tambahan dari kreator)
- Marketiv ambil: 10% dari nilai kontrak (dibebankan ke UMKM, bukan kreator)
```

---

## 5. Modul AI Features

### 5.1 AI Brief Assistant

**Tujuan:** Membantu UMKM menyusun brief kampanye hanya dengan input sederhana.

```
Trigger: Tombol "✨ Bantu Saya dengan AI" di Step 1 form Campaign

Input yang dikumpulkan dari UMKM sebelum memanggil AI:
- Nama produk
- Deskripsi singkat produk (opsional jika sudah ada)
- Niche yang dipilih
```

```javascript
// Contoh implementasi AI Brief Assistant
// Endpoint: POST /api/ai/generate-brief
// WAJIB dipanggil dari server-side (API Route) — JANGAN panggil dari browser
async function generateBrief(productName, description, niche) {
  const prompt = `
Kamu adalah konsultan pemasaran digital untuk UMKM di Indonesia.
Buat brief kampanye video marketing yang jelas dan mudah dipahami oleh kreator konten muda (Gen-Z).

Informasi produk:
- Nama Produk: ${productName}
- Deskripsi: ${description}
- Kategori: ${niche}
- Target pasar: konsumen lokal Indonesia, khususnya daerah Sukabumi dan Jawa Barat

Brief harus mencakup:
1. Pesan utama yang ingin disampaikan
2. Gaya/tone video yang diinginkan (energik, heartwarming, informatif, dll)
3. Poin-poin produk yang wajib ditampilkan
4. Anjuran hashtag lokal yang relevan
5. Call-to-action yang diharapkan dari penonton

Tulis dalam Bahasa Indonesia yang sederhana dan mudah dipahami.
Maksimal 200 kata.
  `

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",  // Gunakan model yang cost-efficient
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
    temperature: 0.7
  })

  return response.choices[0].message.content
}
```

```
Setelah AI generate:
- Hasil tampil di textarea deskripsi_brief (bisa diedit UMKM)
- Tampilkan label: "✨ Draf oleh AI — silakan edit sesuai kebutuhan Anda"
- UMKM bebas mengubah, menambah, atau menghapus hasil AI
```

### 5.2 AI Fraud Detection

**Tujuan:** Mendeteksi manipulasi views (bot) pada submission kreator.

```
Metode: Time-Series Anomaly Detection

Sinyal yang dicek:
1. Kecepatan pertumbuhan views: Lonjakan views terlalu cepat (ribuan views dalam hitungan menit)
2. Rasio views vs. likes vs. comments: Views sangat tinggi tapi engagement sangat rendah
3. Pola waktu: Views datang di jam-jam tidak wajar (misalnya semua pukul 03.00-04.00)

Keputusan otomatis:
- Score < threshold → status_validasi = 'Valid' → proses pencairan
- Score ≥ threshold → status_validasi = 'Fraud' → flag ke admin untuk review manual

Admin dapat:
- Override status dari 'Fraud' ke 'Valid' (jika tidak terbukti)
- Override status dari 'Valid' ke 'Fraud' (jika ada laporan manual dari UMKM)

Catatan MVP:
- Pada fase MVP, validasi views dilakukan secara manual oleh admin + heuristic sederhana
- Integrasi time-series AI model dikembangkan bertahap (post-MVP)
```

---

## 6. Modul Admin & Pelaporan

Hanya dapat diakses oleh user dengan `role = 'ADMIN'`. Route: `/admin`

### 6.1 Dashboard Admin

```
Halaman utama admin menampilkan:
- Total GMV (Gross Merchandise Value) hari ini / minggu ini / bulan ini
- Total pengguna aktif (UMKM aktif + Kreator aktif)
- Total campaign aktif saat ini
- Total submission yang menunggu validasi
- Total dispute yang perlu ditangani
- Grafik pertumbuhan pengguna (6 bulan terakhir)
```

### 6.2 Manajemen Sengketa / Dispute (FR-A02)

```
Halaman: /admin/disputes

Menampilkan daftar semua order/submission dengan status 'Dispute'

Setiap item dispute menampilkan:
- ID dispute
- Nama UMKM + Nama Kreator
- Mode (Campaign / Rate Card)
- Jumlah dana yang dalam dispute
- Alasan dispute
- Tanggal dibuat

Aksi yang bisa dilakukan admin:
1. Lihat detail lengkap (semua pesan chat, URL bukti tayang, data views)
2. "Validasi Manual" → ubah status ke 'Valid' → lepas dana ke kreator
3. "Tahan Dana" → pertahankan status Dispute + kirim notifikasi ke kedua pihak
4. "Refund ke UMKM" → kembalikan dana ke dompet UMKM
5. "Blacklist Kreator" → tandai akun kreator sebagai fraud

Catatan: Admin TIDAK BOLEH menerima pembayaran dari salah satu pihak untuk menyelesaikan dispute.
```

### 6.3 Export Laporan P2MW (FR-A01)

```
Halaman: /admin/reports

Fungsi: Generate & download file CSV/Excel dari data platform

Data yang bisa diekspor:
1. GMV Report
   - Total nilai transaksi per bulan
   - Breakdown: Campaign Mode vs Rate Card Mode
   - Komisi yang diterima Marketiv

2. User Activity Report
   - Total UMKM terdaftar vs aktif
   - Total Kreator terdaftar vs aktif
   - User Retention Rate per bulan
   - Target P2MW: 65% retention rate di bulan ke-6

3. Campaign Performance Report
   - Total campaign dibuat, aktif, selesai, dibatalkan
   - Average views per campaign
   - Fraud rate (% submission yang ditandai fraud)

4. Transaction Report
   - Semua transaksi dengan detail

Filter ekspor:
- Rentang tanggal (dari — sampai)
- Tipe laporan

Format output:
- CSV (default, ringan)
- Excel .xlsx (opsional)

Catatan: Fitur ini digunakan khusus untuk isi Laporan Kemajuan P2MW di SIMBELMAWA.
```

---

*Kembali ke: [README.md](../README.md) | [DATABASE.md](DATABASE.md) | [TECHNICAL_GUIDELINES.md](TECHNICAL_GUIDELINES.md)*
