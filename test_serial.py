import serial
import serial.tools.list_ports
import time

def test_serial_connection():
    print("🔍 Scanning untuk port yang tersedia...")
    ports = serial.tools.list_ports.comports()
    
    for port in ports:
        print(f"📍 Found: {port.device} - {port.description}")
        
        try:
            print(f"🔄 Testing connection ke {port.device}...")
            ser = serial.Serial(port.device, 9600, timeout=5)
            time.sleep(2)  # Wait for Arduino to initialize
            
            print(f"✅ Berhasil terhubung ke {port.device}!")
            print("📡 Menunggu data dari Arduino...")
            
            # Try to read some data
            for i in range(10):
                if ser.in_waiting > 0:
                    line = ser.readline().decode('utf-8').strip()
                    print(f"📥 Data diterima: {line}")
                time.sleep(1)
            
            ser.close()
            print(f"✅ Test selesai untuk {port.device}")
            
        except Exception as e:
            print(f"❌ Gagal terhubung ke {port.device}: {e}")
        
        print("-" * 50)

if __name__ == "__main__":
    test_serial_connection()
