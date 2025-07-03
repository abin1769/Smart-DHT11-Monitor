# 🌡️ Smart DHT11 Monitor

Aplikasi web monitoring sensor DHT11 berbasis Flask untuk memantau suhu dan kelembaban secara real-time.

## ✨ Fitur

- 📊 **Real-time monitoring** - Data sensor update otomatis setiap 3 detik
- 🎨 **UI Modern & Responsive** - Interface yang indah dan mobile-friendly
- 🔄 **Auto-refresh** - Data terupdate tanpa perlu reload halaman
- 📱 **Status indicators** - Indikator visual untuk koneksi sensor
- 🏠 **Comfort level** - Penilaian tingkat kenyamanan berdasarkan suhu & kelembaban
- 📊 **Export data** - Ekspor data sensor ke format JSON
- 🔧 **Error handling** - Penanganan error yang robust

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Clone atau download project
# Masuk ke directory project
cd Arduino

# Install dependencies otomatis
python setup.py
```

### 2. Hubungkan Arduino

- Upload sketch `DHT11.ino` ke Arduino
- Hubungkan DHT11 ke pin 2 Arduino
- Sambungkan Arduino ke PC via USB (biasanya COM5)

### 3. Jalankan Aplikasi

```bash
python app.py
```

Buka browser dan akses: `http://localhost:5000`

## 📋 Manual Setup

Jika setup otomatis tidak berjalan:

```bash
# Install dependencies
pip install flask pyserial

# Jalankan aplikasi
python app.py
```

## 🔧 Konfigurasi

### Port Serial

Default menggunakan COM5. Untuk mengubah port:

```bash
# Windows
set SERIAL_PORT=COM3
python app.py

# Atau edit langsung di app.py
SERIAL_PORT = 'COM3'
```

### Arduino Code

File `DHT11.ino` sudah siap digunakan. Pastikan:
- DHT11 terhubung ke pin 2
- Baud rate 9600
- Format output: `Suhu: XX.X;Kelembaban: XX.X`

## 🌐 API Endpoints

### GET /
- Web interface utama
- Menampilkan data sensor terbaru

### GET /api/sensor-data
- JSON endpoint untuk data real-time
- Response:
```json
{
  "temperature": "25.5",
  "humidity": "60.2",
  "connected": true,
  "status": "online",
  "comfort_level": "comfortable",
  "timestamp": "14:30:25",
  "date": "2025-01-11"
}
```

### GET /api/health
- Health check endpoint
- Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-11 14:30:25",
  "version": "1.0.0",
  "service": "DHT11 Monitor"
}
```

## 📊 Comfort Level

Aplikasi menghitung tingkat kenyamanan berdasarkan:

- **Comfortable**: Suhu 20-30°C, Kelembaban 40-60%
- **Hot/Humid**: Suhu >30°C atau Kelembaban >70%
- **Cold/Dry**: Suhu <20°C atau Kelembaban <30%
- **Moderate**: Kondisi lainnya

## 🎯 Troubleshooting

### Arduino tidak terdeteksi
1. Periksa koneksi USB
2. Pastikan Arduino IDE mendeteksi device
3. Cek port COM di Device Manager (Windows)
4. Ubah SERIAL_PORT jika perlu

### Data tidak muncul
1. Pastikan sketch sudah diupload
2. Periksa wiring DHT11
3. Buka Serial Monitor Arduino untuk debug
4. Restart aplikasi Flask

### Error dependencies
```bash
# Install manual
pip install flask pyserial

# Atau gunakan requirements.txt
pip install -r requirements.txt
```

## 📁 Struktur Project

```
Arduino/
├── app.py              # Main Flask application
├── DHT11.ino          # Arduino sketch
├── setup.py           # Setup script
├── requirements.txt   # Python dependencies
├── templates/
│   └── index.html     # Web interface
└── README.md          # Documentation
```

## 🛠️ Development

### Menjalankan dalam development mode:
```bash
python app.py
# Debug mode aktif otomatis
```

### Menambah fitur baru:
1. Edit `app.py` untuk backend logic
2. Edit `templates/index.html` untuk UI
3. Restart Flask server

## 📈 Monitoring

- **Real-time data**: Update setiap 3 detik via AJAX
- **Connection status**: Indikator online/offline
- **Error logging**: Error ditampilkan di console
- **Health check**: Endpoint `/api/health` untuk monitoring

## 💡 Tips

1. **Stabilitas koneksi**: Gunakan kabel USB yang baik
2. **Akurasi sensor**: Tunggu 2-3 menit untuk stabilisasi
3. **Performance**: Matikan debug mode untuk production
4. **Backup data**: Gunakan fitur export data

## 🔒 Security

- Aplikasi berjalan di localhost (127.0.0.1)
- Tidak ada autentikasi (cocok untuk penggunaan lokal)
- Untuk deployment, tambahkan HTTPS dan auth

## 📞 Support

Jika ada masalah:
1. Periksa console output untuk error
2. Cek koneksi Arduino dan sensor
3. Restart aplikasi dan Arduino
4. Periksa requirements dan dependencies

---

**Made with ❤️ for IoT enthusiasts**
