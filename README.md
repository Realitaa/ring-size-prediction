# Ring Size Prediction 💍

Proyek ini adalah aplikasi berbasis web yang menggunakan **Computer Vision** (OpenCV) untuk memprediksi ukuran jari tangan (ring size) dari sebuah foto. Aplikasi ini menggunakan koin sebagai objek referensi untuk menghitung dimensi fisik jari secara akurat.

## ✨ Fitur Utama
- **Deteksi Jari Otomatis**: Menggunakan teknik segmentasi citra untuk menemukan area jari.
- **Referensi Koin**: Mendeteksi koin dalam foto untuk mengonversi ukuran piksel ke sentimeter (skala nyata).
- **Prediksi Ukuran Ring**: Mencocokkan diameter jari dengan standar ukuran cincin internasional (Size 4 - 14).
- **Antarmuka Web Modern**: UI yang bersih dan responsif untuk mengunggah gambar dan melihat hasil secara instan.

## 🛠️ Tech Stack
- **Backend**: Python, [Django 6.0](https://www.djangoproject.com/)
- **API**: [Django REST Framework](https://www.django-rest-framework.org/)
- **Computer Vision**: [OpenCV](https://opencv.org/), [NumPy](https://numpy.org/)
- **Frontend**: HTML5, Vanilla CSS, JavaScript

## 🚀 Cara Instalasi

1. **Clone repositori**:
   ```bash
   git clone https://github.com/username/ring-size-prediction.git
   cd ring-size-prediction
   ```

2. **Buat Virtual Environment (Opsional tapi direkomendasikan)**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Untuk Linux/macOS
   # atau
   venv\Scripts\activate     # Untuk Windows
   ```

3. **Install Dependensi**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Jalankan Migrasi Database**:
   ```bash
   python manage.py migrate
   ```

5. **Jalankan Server**:
   ```bash
   python manage.py runserver
   ```
   Buka `http://127.0.0.1:8000` di browser Anda.

## 📸 Cara Penggunaan

Untuk mendapatkan hasil yang akurat, ikuti panduan pengambilan foto berikut:
1. Letakkan tangan Anda di atas permukaan datar yang kontras.
2. Letakkan **koin Rp 1.000 (diameter 2.4 cm)** di sebelah jari Anda.
3. Pastikan foto diambil dari atas (tegak lurus) dengan pencahayaan yang cukup.
4. Unggah foto melalui aplikasi, dan sistem akan memberikan estimasi ukuran cincin Anda.

## 📂 Struktur Proyek
- `config/`: Konfigurasi utama proyek Django.
- `vision/`: Logika inti pemrosesan gambar dan deteksi jari menggunakan OpenCV.
- `templates/`: File HTML untuk antarmuka pengguna.
- `static/`: Aset statis seperti CSS dan JavaScript.
- `requirements.txt`: Daftar pustaka Python yang dibutuhkan.

## 📡 API Endpoint
### Proses Gambar
- **URL**: `/api/process/`
- **Method**: `POST`
- **Payload**: `multipart/form-data` dengan key `image`.
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "diameter_mm": 16.5,
      "ring_size": 7,
      "reference_mm": 16.5
    }
  }
  ```

---
Dikembangkan untuk keperluan analisis ukuran cincin berdasarkan gambar berbasis kalkulus untuk mata kuliah Kalkulus Integral.