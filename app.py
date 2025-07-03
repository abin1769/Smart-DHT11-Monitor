from flask import Flask, render_template, jsonify
import serial
import time
import os

app = Flask(__name__)

# Configuration
SERIAL_PORT = os.getenv('SERIAL_PORT', 'COM5')
BAUD_RATE = 9600
TIMEOUT = 3

def read_sensor_data():
    """Baca data sensor dari Arduino"""
    suhu = "N/A"
    kelembaban = "N/A"
    
    try:
        # Buka koneksi ke Arduino, baca data, lalu tutup
        with serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=TIMEOUT) as ser:
            time.sleep(2)  # Tunggu Arduino siap
            
            # Baca beberapa kali untuk dapat data yang valid
            for attempt in range(5):
                if ser.in_waiting > 0:
                    line = ser.readline().decode('utf-8').strip()
                    print(f"📥 Data diterima: {line}")
                    
                    # Skip error messages from Arduino
                    if "Failed to read" in line:
                        print("⚠️ Arduino melaporkan error sensor")
                        continue
                    
                    if "Suhu" in line and ";" in line:
                        try:
                            parts = line.split(";")
                            suhu_part = parts[0].split(":")[1].strip()
                            kelembaban_part = parts[1].split(":")[1].strip()
                            
                            # Validate numeric values
                            suhu_val = float(suhu_part)
                            kelembaban_val = float(kelembaban_part)
                            
                            # Check for reasonable sensor ranges
                            if -10 <= suhu_val <= 60 and 0 <= kelembaban_val <= 100:
                                suhu = f"{suhu_val:.1f}"
                                kelembaban = f"{kelembaban_val:.1f}"
                                print(f"✅ Suhu: {suhu}°C | Kelembaban: {kelembaban}%")
                                break
                            else:
                                print(f"⚠️ Nilai sensor tidak wajar: T={suhu_val}, H={kelembaban_val}")
                                
                        except (ValueError, IndexError) as e:
                            print(f"❌ Error parsing: {e}")
                
                time.sleep(0.5)  # Tunggu data berikutnya
                
    except serial.SerialException as e:
        print(f"❌ Error koneksi serial: {e}")
    except Exception as e:
        print(f"❌ Error umum: {e}")
    
    return suhu, kelembaban

@app.route('/')
def index():
    suhu, kelembaban = read_sensor_data()
    return render_template('index.html', suhu=suhu, kelembaban=kelembaban)

@app.route('/api/sensor-data')
def get_sensor_data():
    """API endpoint untuk data sensor real-time"""
    suhu, kelembaban = read_sensor_data()
    
    # Calculate additional metrics
    status = "online" if suhu != "N/A" else "offline"
    
    # Comfort level calculation
    comfort_level = "unknown"
    if suhu != "N/A" and kelembaban != "N/A":
        try:
            temp_val = float(suhu)
            hum_val = float(kelembaban)
            
            if 20 <= temp_val <= 30 and 40 <= hum_val <= 60:
                comfort_level = "comfortable"
            elif temp_val > 30 or hum_val > 70:
                comfort_level = "hot_humid"
            elif temp_val < 20 or hum_val < 30:
                comfort_level = "cold_dry"
            else:
                comfort_level = "moderate"
        except ValueError:
            comfort_level = "unknown"
    
    return jsonify({
        'temperature': suhu,
        'humidity': kelembaban,
        'connected': suhu != "N/A",
        'status': status,
        'comfort_level': comfort_level,
        'timestamp': time.strftime('%H:%M:%S'),
        'date': time.strftime('%Y-%m-%d')
    })

@app.route('/api/health')
def health_check():
    """Health check endpoint untuk monitoring sistem"""
    return jsonify({
        'status': 'healthy',
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
        'version': '1.0.0',
        'service': 'DHT11 Monitor'
    })

if __name__ == '__main__':
    print("🚀 Starting Flask server...")
    app.run(debug=True)
