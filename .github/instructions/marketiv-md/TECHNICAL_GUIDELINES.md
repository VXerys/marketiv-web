# TECHNICAL_GUIDELINES.md — Panduan Teknis, UI/UX, & Batasan Sistem Marketiv

> Kembali ke: [README.md](../README.md) | [FEATURES.md](FEATURES.md) | [DATABASE.md](DATABASE.md)

---

## Daftar Isi

1. [Kebutuhan Non-Fungsional](#1-kebutuhan-non-fungsional)
2. [Struktur Navigasi & Halaman](#2-struktur-navigasi--halaman)
3. [Panduan UI/UX](#3-panduan-uiux)
4. [Batasan Sistem (Hard Constraints)](#4-batasan-sistem-hard-constraints)
5. [Integrasi Eksternal](#5-integrasi-eksternal)
6. [Model Bisnis & Logika Komisi](#6-model-bisnis--logika-komisi)
7. [Catatan Akhir untuk AI Coding Assistant](#7-catatan-akhir-untuk-ai-coding-assistant)

---

## 1. Kebutuhan Non-Fungsional

### 1.1 Keandalan (Reliability)

```
- Uptime minimum: 99% selama jam aktif 08.00 — 22.00 WIB
- Gunakan layanan cloud dengan SLA tinggi (Vercel + Supabase)
- Implementasikan error boundary di React untuk cegah crash total
- Semua API endpoint harus memiliki try-catch dan mengembalikan pesan error yang informatif
```

### 1.2 Performa (Performance)

```
Target:
- First Contentful Paint (FCP): < 3 detik pada koneksi 3G/4G
- Time to Interactive (TTI): < 5 detik

Cara mencapai:
- Gunakan Next.js Image Optimization untuk semua gambar
- Lazy load komponen yang berat (chart, daftar panjang)
- Implementasikan infinite scroll / pagination (jangan load semua data sekaligus)
- Ukuran bundle JavaScript harus dipantau (Next.js bundle analyzer)
- Gunakan Supabase query yang efisien (pilih hanya field yang dibutuhkan, gunakan index)
- Kompres gambar sebelum upload (client-side compression sebelum kirim ke Supabase Storage)
```

### 1.3 Keamanan (Security)

```
Wajib diimplementasikan:
1. Autentikasi JWT via Supabase Auth
2. Password di-hash dengan Bcrypt (salt rounds minimal 10)
3. TIDAK menyimpan/memproses data kartu kredit — delegasikan 100% ke Midtrans
4. Validasi input di FRONTEND dan BACKEND (jangan hanya satu sisi)
5. Row Level Security (RLS) di Supabase — pastikan user hanya bisa akses data miliknya
6. Rate limiting pada endpoint sensitif (login, register, submit campaign)
7. CORS policy yang ketat — hanya allow origin dari domain Marketiv
8. Sanitasi semua user input sebelum disimpan ke database (cegah SQL injection & XSS)
9. Environment variables TIDAK BOLEH di-commit ke repository (gunakan .env.local)
10. Validasi webhook Midtrans menggunakan signature key sebelum memproses notifikasi
```

### 1.4 Skalabilitas & Biaya (P2MW Constraint)

```
WAJIB: Sistem harus berjalan dalam Free Tier atau biaya minimal

Pilihan layanan yang direkomendasikan:
- Vercel: Free tier untuk deployment Next.js
- Supabase: Free tier (500MB database, 1GB storage, 50.000 MAU)
- OpenAI API: Pay-as-you-go (gunakan gpt-4o-mini untuk efisiensi biaya)

Yang DILARANG pada fase MVP:
- Dedicated Physical Server (mahal, tidak perlu)
- Penyimpanan video internal skala besar (gunakan URL eksternal)
- Fitur video editor internal (gunakan CapCut eksternal)
- PCI-DSS processing kartu kredit sendiri (gunakan Midtrans)

Alokasi budget pengembangan produk: MAKSIMAL 30% dari total dana P2MW
```

---

## 2. Struktur Navigasi & Halaman

### 2.1 Halaman Publik (Tanpa Login)

```
/                    → Landing Page
├── /tentang-kami    → Halaman About
├── /panduan         → Cara kerja platform (untuk UMKM dan Kreator)
├── /login           → Halaman Login
└── /register        → Halaman Registrasi
                         → Pilihan role: "Saya Pemilik UMKM" | "Saya Konten Kreator"
```

### 2.2 Dashboard UMKM (Perlu Login, role=UMKM)

```
/dashboard/umkm
├── /dashboard/umkm                          → Ringkasan (ROI, campaign aktif, total spent)
├── /dashboard/umkm/campaign/buat            → Form Wizard Buat Campaign Baru
├── /dashboard/umkm/campaign                 → Daftar semua campaign milik UMKM
└── /dashboard/umkm/campaign/[id]            → Detail campaign (status, submissions, views)
├── /dashboard/umkm/kreator                  → Direktori Kreator (Rate Card Mode)
├── /dashboard/umkm/kreator/[id]             → Profil kreator + Rate Card
├── /dashboard/umkm/negosiasi               → Daftar semua obrolan/order Rate Card
└── /dashboard/umkm/negosiasi/[id_order]    → Room chat + Custom Offer
└── /dashboard/umkm/keuangan                → Riwayat transaksi, saldo pending
```

### 2.3 Dashboard Kreator (Perlu Login, role=KREATOR)

```
/dashboard/kreator
├── /dashboard/kreator                       → Ringkasan (total earnings, job aktif)
├── /dashboard/kreator/job-pool              → Daftar Campaign aktif (Job Pool/Bursa Kerja)
└── /dashboard/kreator/job-pool/[id]         → Detail campaign + tombol "Klaim Job Ini"
├── /dashboard/kreator/pekerjaan-aktif       → Daftar job yang sudah diklaim, submit URL
└── /dashboard/kreator/pekerjaan-aktif/[id]  → Detail job + form submit URL bukti tayang
├── /dashboard/kreator/negosiasi            → Daftar obrolan Rate Card
└── /dashboard/kreator/negosiasi/[id]       → Room chat Rate Card
├── /dashboard/kreator/profil               → Edit profil publik kreator
├── /dashboard/kreator/rate-card            → Manajemen paket Rate Card (maks 3)
└── /dashboard/kreator/keuangan             → Saldo, riwayat pendapatan, penarikan dana
```

### 2.4 Panel Admin (Perlu Login, role=ADMIN)

```
/admin
├── /admin                   → Dashboard utama (GMV, user stats, grafik)
├── /admin/disputes          → Manajemen sengketa
├── /admin/submissions       → Semua submission (filter: Pending, Valid, Fraud)
├── /admin/users             → Manajemen pengguna (ban, verifikasi)
└── /admin/reports           → Export laporan P2MW (CSV/Excel)
```

---

## 3. Panduan UI/UX

### 3.1 Prinsip Desain

```
1. User-Centered Design
   - UMKM target memiliki literasi digital menengah ke bawah, usia 30-55 tahun
   - Instruksi harus sangat jelas, gunakan bahasa sederhana (hindari jargon teknis)
   - Gunakan wizard/multi-step form, JANGAN form panjang satu halaman
   - Icon harus dilabeli dengan teks (jangan icon-only untuk aksi penting)

2. Mobile-First
   - Design untuk layar 375px (iPhone SE) terlebih dahulu
   - Touch target minimum: 44×44px untuk semua tombol/link
   - Jarak antar elemen interaktif minimal 8px
   - Font size minimum: 14px untuk body text, 16px untuk input field

3. Frictionless Experience
   - Setiap halaman harus punya satu CTA utama yang jelas
   - Loading state harus selalu ditampilkan (spinner/skeleton)
   - Error message harus spesifik dan actionable (bukan hanya "Error occurred")
   - Confirmasi dialog untuk aksi destruktif (batalkan campaign, tolak penawaran, dll)
```

### 3.2 Design Tokens (Tailwind CSS)

```javascript
// tailwind.config.ts — Design Tokens Marketiv
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary — Orange (warna utama brand Marketiv)
        primary: {
          50:  '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',  // Main orange
          600: '#ea580c',  // Hover state
          700: '#c2410c',  // Active/pressed
        },
        // Secondary — Navy/Dark Blue
        secondary: {
          500: '#1e3a5f',
          600: '#162d4a',
          700: '#0f2039',
        },
        // Semantic colors
        success:  '#16a34a',
        warning:  '#d97706',
        danger:   '#dc2626',
        info:     '#2563eb',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    }
  }
}
```

### 3.3 Komponen UI Kritis

**Tombol CTA Utama:**
```jsx
// Ukuran tombol harus BESAR di mobile
<button className="
  w-full
  py-4
  px-6
  text-base
  font-semibold
  bg-primary-500
  text-white
  rounded-xl
  hover:bg-primary-600
  active:bg-primary-700
  disabled:opacity-50
  disabled:cursor-not-allowed
  transition-colors
">
  Klaim Job Ini
</button>
```

**Warning Banner (untuk pesan penting):**
```jsx
<div className="
  bg-amber-50
  border border-amber-300
  rounded-lg
  p-4
  flex items-start gap-3
">
  <span className="text-amber-500 text-xl">⚠️</span>
  <p className="text-amber-800 text-sm">
    [Pesan peringatan penting di sini]
  </p>
</div>
```

**Error State untuk Input File:**
```jsx
<p className="text-red-600 text-sm mt-1">
  ❌ Batas maksimal unggahan file adalah 100 MB.
  Silakan gunakan URL Link Eksternal (Google Drive/Dropbox).
</p>
```

### 3.4 Validasi Input di Frontend

```javascript
// Wajib: validasi ukuran file sebelum upload
function validateFileSize(file: File): boolean {
  const MAX_SIZE = 100 * 1024 * 1024  // 100MB dalam bytes
  if (file.size > MAX_SIZE) {
    setError("Batas maksimal unggahan file adalah 100 MB. Silakan gunakan URL Link Eksternal.")
    return false
  }
  return true
}

// Validasi URL
function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:'
  } catch {
    return false
  }
}
```

---

## 4. Batasan Sistem (Hard Constraints)

> **Ini adalah ATURAN KERAS yang tidak boleh dilanggar dalam keadaan apapun.**

### 4.1 Batasan Keuangan (Budget P2MW)

```
❌ DILARANG: Menyewa dedicated physical server
❌ DILARANG: Menggunakan layanan cloud berbayar tier tinggi sebelum validasi
✅ WAJIB: Maksimalkan Free Tier (Supabase, Vercel, dll)
✅ WAJIB: Anggaran pengembangan produk MAKSIMAL 30% dari total dana P2MW
```

### 4.2 Batasan Penyimpanan File

```
❌ DILARANG: Menyimpan file video di server Marketiv
❌ DILARANG: Membangun video hosting internal
✅ WAJIB: Semua video mentah UMKM disimpan di Google Drive/Dropbox (URL external)
✅ WAJIB: Upload file langsung (foto, logo) MAKSIMAL 100 MB per file
✅ WAJIB: Tampilkan error jika file > 100MB dengan instruksi pakai URL eksternal
```

### 4.3 Batasan Logika Ekosistem Campaign Mode

```
❌ DILARANG: Ada fitur Chat/Pesan apapun di Campaign Mode
❌ DILARANG: Render komponen Chat di halaman Campaign Mode manapun
❌ DILARANG: Kreator upload file video final langsung ke server Marketiv
✅ WAJIB: Kreator hanya bisa submit URL publik TikTok/Instagram sebagai bukti kerja
✅ WAJIB: Video hasil kreator diposting di AKUN KREATOR (bukan akun UMKM)
```

### 4.4 Batasan Logika Ekosistem Rate Card Mode

```
✅ WAJIB: Live Chat hanya tersedia di Rate Card Mode
✅ WAJIB: Collab Post WAJIB digunakan saat publikasi konten Rate Card Mode
✅ WAJIB: Warning banner tentang kewajiban Collab Post selalu tampil di atas chat room
✅ WAJIB: Maks 3 Rate Card Package per kreator (enforce di level aplikasi dan database)
```

### 4.5 Fitur Keluar Scope MVP (TIDAK Dibuat)

```
❌ Video editor internal (seperti CapCut built-in)
❌ Pemrosesan enkripsi kartu kredit/debit secara mandiri (delegasikan ke Midtrans)
❌ Mobile native app (Android/iOS) — MVP hanya web app
❌ Notifikasi push mobile
❌ Sistem referral/affiliate
❌ Multi-language support (selain Bahasa Indonesia)
```

---

## 5. Integrasi Eksternal

### 5.1 Midtrans (Payment Gateway)

```javascript
// Konfigurasi Midtrans (Server-side)
import midtransClient from 'midtrans-client'

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
})

// Buat transaksi (contoh untuk deposit Campaign)
async function createPaymentToken(orderId: string, amount: number, user: User) {
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    customer_details: {
      first_name: user.nama_lengkap,
      email: user.email,
      phone: user.nomor_whatsapp,
    },
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/umkm/keuangan?status=finish`,
      error:  `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/umkm/keuangan?status=error`,
    }
  }

  const transaction = await snap.createTransaction(parameter)
  return transaction.token
}

// Handler webhook dari Midtrans (WAJIB validasi signature)
async function handleMidtransWebhook(req: Request) {
  const notification = await snap.transaction.notification(req.body)

  if (notification.transaction_status === 'settlement' ||
      notification.transaction_status === 'capture') {
    await updateTransactionStatus(notification.order_id, 'Escrow')
  }
}
```

### 5.2 Supabase

```javascript
// Setup client Supabase
import { createClient } from '@supabase/supabase-js'

// Untuk penggunaan di client-side (browser)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Untuk penggunaan di server-side (API routes) — gunakan service role key
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // JANGAN expose ke client!
)
```

### 5.3 OpenAI API (Brief Assistant)

```javascript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY  // JANGAN expose ke client-side
})

// Endpoint: POST /api/ai/generate-brief
// Hanya bisa dipanggil dari server-side Next.js (API Route)
// Jangan panggil OpenAI API langsung dari browser (API key ter-expose)
```

### 5.4 Google Drive / Dropbox

```
Integrasi: TIDAK ada API integration langsung pada fase MVP

Cara kerja:
- UMKM upload file mereka sendiri ke Google Drive/Dropbox (di luar Marketiv)
- UMKM copy link share (public/anyone with link)
- UMKM paste link tersebut ke kolom input di form Campaign Marketiv
- Marketiv hanya menyimpan URL string tersebut di database

Validasi URL yang perlu dicek:
- Format URL valid (https://)
- Tidak kosong
- (Opsional) Cek apakah URL mengandung domain drive.google.com atau dropbox.com
```

### 5.5 TikTok & Instagram

```
Integrasi: TIDAK ada API integration pada fase MVP

Cara kerja:
- Kreator posting video di akun pribadi mereka (di luar Marketiv)
- Kreator copy URL publik postingan tersebut
- Kreator paste URL ke kolom submit di Marketiv
- Marketiv menyimpan URL string tersebut
- Validasi manual/semi-otomatis oleh admin

Post-MVP (Roadmap):
- Integrasi TikTok Display API untuk fetch views secara otomatis
- Integrasi Instagram Graph API untuk verifikasi Collab Post
```

---

## 6. Model Bisnis & Logika Komisi

### 6.1 Harga Campaign Mode

```
Model: Pay-per-View (Performance-Based)

Cara hitung:
- UMKM tentukan: harga_per_1000_views (range: Rp 2.000 — Rp 10.000)
- UMKM deposit total budget maksimal
- Kreator dibayar: (views_aktual / 1000) × harga_per_1000_views
- Dana yang tidak terpakai dikembalikan ke UMKM setelah campaign selesai

Komisi Marketiv:
- 15% dari total budget campaign yang disetorkan UMKM
- Dibebankan di awal (UMKM bayar: budget + 15%)

Contoh kalkulasi:
  UMKM alokasikan Rp 100.000
  Komisi 15%: Rp 15.000
  Total yang dibayar UMKM: Rp 115.000

  Jika kreator capai 20.000 views dengan rate Rp 4.000/1000 views:
  Dana ke kreator: (20.000 / 1.000) × 4.000 = Rp 80.000
  Sisa dikembalikan ke UMKM: Rp 20.000
```

### 6.2 Harga Rate Card Mode

```
Model: Fixed Price (Harga Tetap)

Cara hitung:
- Harga ditentukan oleh kreator (Rate Card) atau negosiasi (Custom Offer)
- Platform & Escrow Fee: 10% dari nilai kontrak, dibebankan ke UMKM

Komisi Marketiv:
- 10% dari harga_final yang disepakati
- Dibebankan ke UMKM (kreator menerima harga penuh)

Contoh:
  Harga kontrak yang disepakati: Rp 350.000
  Platform fee 10%: Rp 35.000
  Total yang dibayar UMKM ke Escrow: Rp 385.000

  Kreator menerima: Rp 350.000 (setelah pekerjaan selesai & tervalidasi)
  Marketiv menerima: Rp 35.000
```

### 6.3 Target Finansial P2MW

```
Target 6 bulan pertama:
- 500 UMKM aktif bertransaksi
- GMV: Rp 75.000.000 / bulan
- Revenue Marketiv: Rp 9.375.000 / bulan (rata-rata take rate 12.5%)
- User Retention Rate: 65% di bulan ke-6
- Total active users (UMKM + Kreator) di akhir bulan ke-6: 292 users

Dana P2MW yang diajukan: Rp 11.900.000
Proyeksi pendapatan 6 bulan: Rp 15.000.000
ROI: 77.9%
BEP: Bulan ke-4 (sekitar 166 UMKM aktif)
```

---

## 7. Catatan Akhir untuk AI Coding Assistant

> **Baca bagian ini sebelum men-generate kode apapun.**

1. **Selalu cek role user** sebelum render komponen atau memproses request API. Gunakan RBAC yang didefinisikan di [FEATURES.md § 1.3](FEATURES.md#13-role-based-access-control-rbac).

2. **Campaign Mode = ZERO CHAT.** Jika ada permintaan untuk menambahkan fitur komunikasi di Campaign Mode, tolak dan acu ke [FEATURES.md § 2](FEATURES.md#2-modul-campaign-mode) dan [§ 4.3](#43-batasan-logika-ekosistem-campaign-mode).

3. **File > 100MB = URL eksternal.** Wajib selalu ada validasi ukuran file di dua tempat: frontend (sebelum upload) dan backend API (sebelum proses). Lihat [§ 4.2](#42-batasan-penyimpanan-file).

4. **Jangan simpan password plaintext.** Selalu gunakan `bcrypt.hash()` sebelum menyimpan dan `bcrypt.compare()` saat verifikasi.

5. **Jangan expose API key** (OpenAI, Midtrans server key, Supabase service role) ke client-side. Semua panggilan ke layanan sensitif harus lewat Next.js API Routes (server-side).

6. **Rate Card maks 3 paket.** Enforce di level aplikasi (cek count sebelum izinkan tambah baru) dan tampilkan error yang jelas jika sudah mencapai batas.

7. **Escrow adalah inti keamanan platform.** Jangan pernah langsung mentransfer dana dari UMKM ke kreator tanpa melalui sistem validasi. Semua dana transit via tabel `TRANSACTIONS` dengan status tracking yang jelas.

8. **Mobile-First selalu.** Semua komponen harus ditest di viewport 375px terlebih dahulu sebelum desktop.

9. **Bahasa Indonesia.** Semua teks UI, pesan error, label, dan notifikasi ditulis dalam Bahasa Indonesia yang sederhana dan mudah dipahami oleh UMKM dengan literasi digital menengah.

10. **Free tier dulu.** Jangan suggestkan solusi berbayar sebelum batas Free Tier tercapai. Ini adalah constraint keras dari regulasi P2MW.

---

*Kembali ke: [README.md](../README.md) | [FEATURES.md](FEATURES.md) | [DATABASE.md](DATABASE.md)*

*Dokumen ini dihasilkan dari: SKPL Marketiv v5.0, Marketiv Final PPT, dan Proposal P2MW Marketiv — Universitas Nusa Putra, Sukabumi, 2026.*
