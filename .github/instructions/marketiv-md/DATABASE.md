# DATABASE.md — Skema Database Marketiv

> Kembali ke: [README.md](../README.md) | [FEATURES.md](FEATURES.md) | [TECHNICAL_GUIDELINES.md](TECHNICAL_GUIDELINES.md)

---

## Prinsip Utama

> Database **TIDAK BOLEH** menyimpan tipe data BLOB (file binary). Semua aset besar disimpan sebagai URL string. Database murni relasional (teks/angka).

---

## Daftar Isi

1. [Tabel USERS](#1-tabel-users)
2. [Tabel CAMPAIGNS](#2-tabel-campaigns)
3. [Tabel SUBMISSIONS](#3-tabel-submissions)
4. [Tabel RATE_CARDS](#4-tabel-rate_cards)
5. [Tabel RATE_CARD_ORDERS](#5-tabel-rate_card_orders)
6. [Tabel TRANSACTIONS](#6-tabel-transactions)
7. [Tabel MESSAGES](#7-tabel-messages)
8. [Relasi Antar Tabel](#8-relasi-antar-tabel)

---

## 1. Tabel: `USERS`

Menyimpan identitas semua aktor sistem (UMKM, Kreator, Admin).

```sql
CREATE TABLE users (
  id_user         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role            VARCHAR(15) NOT NULL CHECK (role IN ('UMKM', 'KREATOR', 'ADMIN')),
  nama_lengkap    VARCHAR(100) NOT NULL,
  nomor_whatsapp  VARCHAR(20),
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,          -- Di-hash dengan Bcrypt, JANGAN simpan plaintext
  dompet_saldo    DECIMAL(12,2) DEFAULT 0,
  niche           VARCHAR(50),            -- Untuk kreator: kuliner, fesyen, edukasi, dll
  foto_profil_url VARCHAR(500),           -- URL foto profil (maks 100MB jika upload langsung)
  bio             TEXT,
  is_verified     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

**Catatan Penting:**
- Field `dompet_saldo` menyimpan saldo aktif kreator yang sudah bisa di-withdraw
- Field `role` menentukan seluruh hak akses di sistem (role-based access)
- `password_hash` wajib menggunakan Bcrypt — TIDAK BOLEH menyimpan password plaintext

---

## 2. Tabel: `CAMPAIGNS`

Menyimpan semua proyek pemasaran viral yang dibuat oleh UMKM.

```sql
CREATE TABLE campaigns (
  id_campaign          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_umkm              UUID NOT NULL REFERENCES users(id_user),
  judul_campaign       VARCHAR(200) NOT NULL,
  deskripsi_brief      TEXT NOT NULL,          -- Instruksi editing video untuk kreator
  url_aset_eksternal   VARCHAR(500) NOT NULL,  -- WAJIB: Link Google Drive/Dropbox aset mentah UMKM
  kuota_kreator        INT NOT NULL,           -- Jumlah kreator yang boleh mengklaim campaign ini
  kuota_terpakai       INT DEFAULT 0,          -- Berapa kreator sudah klaim
  harga_per_1000_views DECIMAL(10,2) NOT NULL, -- Range: Rp 2.000 - Rp 10.000
  total_budget_escrow  DECIMAL(12,2) NOT NULL, -- Total dana yang di-lock oleh UMKM
  niche                VARCHAR(50),            -- kuliner, fesyen, edukasi, pariwisata, dll
  status               VARCHAR(20) DEFAULT 'Draft'
                         CHECK (status IN ('Draft', 'Aktif', 'Penuh', 'Selesai', 'Dibatalkan')),
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);
```

**Logika Status Campaign:**

| Status | Kondisi |
|--------|---------|
| `Draft` | UMKM sedang isi form, belum bayar |
| `Aktif` | Dana sudah masuk Escrow, tampil di Job Pool untuk kreator |
| `Penuh` | `kuota_terpakai >= kuota_kreator`, tidak bisa diklaim lagi |
| `Selesai` | Semua submission valid, semua dana sudah dicairkan |
| `Dibatalkan` | Campaign dibatalkan, dana dikembalikan ke UMKM |

---

## 3. Tabel: `SUBMISSIONS`

Menyimpan bukti pekerjaan kreator untuk setiap campaign.

```sql
CREATE TABLE submissions (
  id_submission       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_campaign         UUID NOT NULL REFERENCES campaigns(id_campaign),
  id_kreator          UUID NOT NULL REFERENCES users(id_user),
  url_bukti_tayang    VARCHAR(500) NOT NULL,   -- URL publik TikTok/Instagram Reels
  jumlah_views_target INT,                     -- Target views sesuai budget
  jumlah_views_aktual INT DEFAULT 0,           -- Views tervalidasi sistem
  status_validasi     VARCHAR(20) DEFAULT 'Pending'
                        CHECK (status_validasi IN ('Pending', 'Valid', 'Fraud', 'Dispute')),
  dana_dicairkan      DECIMAL(12,2) DEFAULT 0, -- Dana yang sudah cair ke kreator
  submitted_at        TIMESTAMPTZ DEFAULT NOW(),
  validated_at        TIMESTAMPTZ,
  UNIQUE(id_campaign, id_kreator)              -- Satu kreator hanya boleh submit 1x per campaign
);
```

---

## 4. Tabel: `RATE_CARDS`

Menyimpan paket harga jasa yang ditawarkan kreator.

```sql
CREATE TABLE rate_cards (
  id_ratecard      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_kreator       UUID NOT NULL REFERENCES users(id_user),
  nama_paket       VARCHAR(100) NOT NULL,   -- Contoh: "Paket Basic", "Paket Premium"
  deskripsi_paket  TEXT,
  harga_paket      DECIMAL(12,2) NOT NULL,
  deliverable      TEXT,                   -- Apa yang didapat klien (1 video Reels, dst)
  estimasi_hari    INT,                    -- Estimasi pengerjaan dalam hari
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
-- Constraint: Maksimal 3 paket per kreator
-- Enforce di aplikasi level: jika sudah ada 3 rate card aktif, blokir penambahan baru
```

---

## 5. Tabel: `RATE_CARD_ORDERS`

Menyimpan transaksi/booking pada mode Rate Card.

```sql
CREATE TABLE rate_card_orders (
  id_order         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_umkm          UUID NOT NULL REFERENCES users(id_user),
  id_kreator       UUID NOT NULL REFERENCES users(id_user),
  id_ratecard      UUID REFERENCES rate_cards(id_ratecard),
  judul_proyek     VARCHAR(200),
  scope_pekerjaan  TEXT,                   -- Detail pekerjaan dari Custom Offer
  harga_final      DECIMAL(12,2) NOT NULL, -- Harga yang disepakati
  deadline         DATE,
  url_collab_post  VARCHAR(500),           -- URL Collab Post setelah selesai
  status           VARCHAR(30) DEFAULT 'Negosiasi'
                     CHECK (status IN (
                       'Negosiasi',           -- Sedang chat
                       'Menunggu Pembayaran', -- Custom Offer dikirim, tunggu UMKM bayar
                       'Escrow',              -- Dana ditahan, kreator eksekusi
                       'Revisi',              -- UMKM minta revisi
                       'Menunggu Verifikasi', -- Kreator submit collab post, tunggu verif
                       'Selesai',             -- Dana cair
                       'Dibatalkan',
                       'Dispute'              -- Sengketa, admin intervensi
                     )),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. Tabel: `TRANSACTIONS`

Menyimpan semua pergerakan dana di platform.

```sql
CREATE TABLE transactions (
  id_transaksi    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_user         UUID NOT NULL REFERENCES users(id_user),
  id_referensi    UUID,                    -- id_campaign atau id_order yang terkait
  tipe_referensi  VARCHAR(20),             -- 'Campaign' atau 'RateCard'
  nominal         DECIMAL(12,2) NOT NULL,
  tipe            VARCHAR(20) NOT NULL
                    CHECK (tipe IN ('Deposit', 'Withdrawal', 'Fee', 'Refund', 'Pencairan')),
  status          VARCHAR(20) DEFAULT 'Pending'
                    CHECK (status IN ('Pending', 'Escrow', 'Success', 'Failed', 'Refunded')),
  midtrans_order_id VARCHAR(100),          -- ID order dari Midtrans
  keterangan      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 7. Tabel: `MESSAGES`

Digunakan untuk Live Chat di Rate Card Mode saja.

```sql
CREATE TABLE messages (
  id_message    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_order      UUID NOT NULL REFERENCES rate_card_orders(id_order),
  id_sender     UUID NOT NULL REFERENCES users(id_user),
  tipe_pesan    VARCHAR(20) DEFAULT 'Text'
                  CHECK (tipe_pesan IN ('Text', 'CustomOffer', 'System')),
  konten        TEXT NOT NULL,
  offer_data    JSONB,    -- Berisi detail Custom Offer jika tipe_pesan = 'CustomOffer'
  is_read       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

**Tipe Pesan:**
- `Text` — Pesan biasa dari UMKM atau Kreator
- `CustomOffer` — Widget penawaran resmi (hanya UMKM yang bisa kirim)
- `System` — Notifikasi otomatis sistem (contoh: "UMKM telah mengirim pembayaran")

---

## 8. Relasi Antar Tabel

```
USERS ||--o{ CAMPAIGNS         : "Membuat (jika role=UMKM)"
USERS ||--o{ SUBMISSIONS       : "Mengerjakan (jika role=KREATOR)"
USERS ||--o{ RATE_CARDS        : "Memiliki (jika role=KREATOR, maks 3)"
USERS ||--o{ RATE_CARD_ORDERS  : "Terlibat sebagai UMKM atau KREATOR"
USERS ||--o{ TRANSACTIONS      : "Melakukan"
CAMPAIGNS ||--o{ SUBMISSIONS   : "Menerima banyak bukti (1..N)"
RATE_CARD_ORDERS ||--o{ MESSAGES : "Memiliki percakapan"
```

### Row Level Security (RLS) — Supabase

Wajib dikonfigurasi untuk setiap tabel agar user hanya bisa akses data miliknya:

```sql
-- Contoh RLS: UMKM hanya bisa baca campaign milik sendiri
CREATE POLICY "UMKM can see own campaigns"
  ON campaigns FOR SELECT
  USING (id_umkm = auth.uid());

-- Kreator hanya bisa baca submission milik sendiri
CREATE POLICY "Kreator can see own submissions"
  ON submissions FOR SELECT
  USING (id_kreator = auth.uid());

-- Pesan hanya bisa dibaca oleh pihak yang terlibat dalam order
CREATE POLICY "Order participants can read messages"
  ON messages FOR SELECT
  USING (
    id_order IN (
      SELECT id_order FROM rate_card_orders
      WHERE id_umkm = auth.uid() OR id_kreator = auth.uid()
    )
  );
```

---

*Kembali ke: [README.md](../README.md) | [FEATURES.md](FEATURES.md) | [TECHNICAL_GUIDELINES.md](TECHNICAL_GUIDELINES.md)*
