#!/usr/bin/env python3
"""
Setup script untuk Smart DHT11 Monitor
Installer otomatis untuk dependensi dan konfigurasi
"""

import subprocess
import sys
import os

def install_package(package):
    """Install Python package using pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"✅ {package} berhasil diinstall")
        return True
    except subprocess.CalledProcessError:
        print(f"❌ Gagal menginstall {package}")
        return False

def check_port_available(port):
    """Check if COM port is available"""
    try:
        import serial
        with serial.Serial(port, 9600, timeout=1) as ser:
            print(f"✅ Port {port} tersedia")
            return True
    except Exception as e:
        print(f"⚠️ Port {port} tidak tersedia: {e}")
        return False

def main():
    print("🚀 Smart DHT11 Monitor Setup")
    print("=" * 50)
    
    # Check Python version
    if sys.version_info < (3, 6):
        print("❌ Python 3.6+ diperlukan")
        sys.exit(1)
    
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
    
    # Install dependencies
    print("\n📦 Installing dependencies...")
    dependencies = ['flask', 'pyserial']
    
    for dep in dependencies:
        if not install_package(dep):
            print(f"❌ Setup gagal karena {dep} tidak bisa diinstall")
            sys.exit(1)
    
    # Check COM port
    print("\n🔌 Checking COM port...")
    check_port_available('COM5')
    
    # Create directories if needed
    os.makedirs('templates', exist_ok=True)
    
    print("\n✅ Setup selesai!")
    print("📋 Cara menjalankan:")
    print("   python app.py")
    print("   Kemudian buka: http://localhost:5000")
    print("\n📌 Pastikan Arduino sudah terhubung ke COM5")

if __name__ == "__main__":
    main()
