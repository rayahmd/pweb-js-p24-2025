# Recipe Collection - Login Page

Aplikasi Recipe Collection dengan halaman Login yang terintegrasi dengan DummyJSON API.

## Fitur Login Page

1. **Form Login**
   - Field username/email
   - Field password
   - Validasi input

2. **Autentikasi**
   - Menggunakan API https://dummyjson.com/users
   - Username bisa menggunakan username atau email
   - Password tidak boleh kosong

3. **Loading State**
   - Menampilkan loading spinner saat proses login
   - Disable form saat loading

4. **Error Handling**
   - Pesan error untuk username tidak ditemukan
   - Pesan error untuk password kosong
   - Pesan error untuk koneksi API bermasalah

5. **Success Message**
   - Menampilkan pesan sukses saat login berhasil
   - Auto redirect ke halaman recipes

6. **LocalStorage**
   - Menyimpan firstName user
   - Menyimpan userId
   - Menyimpan userEmail

## Cara Menjalankan

1. Install Node.js (jika belum)
2. Jalankan server:
   ```
   node server.js
   ```
3. Buka browser dan akses:
   - Login: http://localhost:3000/login.html
   - Recipes: http://localhost:3000/index.html

## Cara Testing Login

Gunakan salah satu username dari DummyJSON API:
- Username: `emilys` atau Email: `emily.johnson@x.dummyjson.com`
- Username: `michaelw` atau Email: `michael.williams@x.dummyjson.com`
- Password: (isi dengan teks apapun, tidak boleh kosong)

Lihat daftar lengkap users di: https://dummyjson.com/users

## Struktur File

```
public/
  - login.html      (Halaman login)
  - login.css       (Styling login page)
  - login.js        (Logic login)
  - index.html      (Halaman recipes)
  - style.css       (Styling recipes page)
  - app.js          (Logic recipes + auth)
```

## Alur Aplikasi

1. User membuka `login.html`
2. User memasukkan username dan password
3. Sistem fetch data users dari API
4. Sistem validasi username dan password
5. Jika valid, simpan firstName ke localStorage
6. Redirect ke `index.html`
7. Halaman recipes check auth dari localStorage
8. Tampilkan nama user di navbar
9. User bisa logout untuk kembali ke login

## Teknologi

- HTML5
- CSS3 (dengan animasi dan gradient)
- Vanilla JavaScript (ES6+)
- Fetch API
- LocalStorage
- DummyJSON API
