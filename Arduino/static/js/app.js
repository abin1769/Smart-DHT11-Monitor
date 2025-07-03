/* Smart DHT11 Monitor - JavaScript */

// Global variables
let autoRefreshInterval;
let isAutoRefreshActive = true;
let currentTemp = 'N/A';
let currentHumidity = 'N/A';

// Initialize with server-side data
function initializeData(temp, humidity) {
    currentTemp = temp;
    currentHumidity = humidity;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Update comfort level
function updateComfortLevel(temp, humidity) {
    const comfortElement = document.getElementById('comfort-level');
    
    if (temp === 'N/A' || humidity === 'N/A') {
        comfortElement.innerHTML = '❓ Tidak ada data';
        comfortElement.style.color = '#888';
        return;
    }
    
    const tempNum = parseFloat(temp);
    const humNum = parseFloat(humidity);
    
    if (tempNum >= 20 && tempNum <= 30 && humNum >= 40 && humNum <= 60) {
        comfortElement.innerHTML = '😊 Nyaman';
        comfortElement.style.color = '#4CAF50';
    } else if (tempNum > 30 || humNum > 70) {
        comfortElement.innerHTML = '🥵 Terlalu Panas/Lembab';
        comfortElement.style.color = '#f44336';
    } else if (tempNum < 20 || humNum < 30) {
        comfortElement.innerHTML = '🥶 Terlalu Dingin/Kering';
        comfortElement.style.color = '#2196F3';
    } else {
        comfortElement.innerHTML = '😐 Sedang';
        comfortElement.style.color = '#ff9800';
    }
}

// Update progress bars
function updateProgressBars(temperature, humidity) {
    const tempProgress = document.querySelector('.temp-progress');
    const humidityProgress = document.querySelector('.humidity-progress');
    
    if (temperature !== 'N/A' && !isNaN(parseFloat(temperature))) {
        const tempPercent = Math.min(parseFloat(temperature) / 50 * 100, 100);
        tempProgress.style.width = `${tempPercent}%`;
    } else {
        tempProgress.style.width = '0%';
    }
    
    if (humidity !== 'N/A' && !isNaN(parseFloat(humidity))) {
        const humPercent = Math.min(parseFloat(humidity), 100);
        humidityProgress.style.width = `${humPercent}%`;
    } else {
        humidityProgress.style.width = '0%';
    }
}

// Update status indicators
function updateStatusIndicators(connected) {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.getElementById('status-text');
    
    if (connected) {
        statusIndicator.className = 'status-indicator status-online';
        statusText.textContent = '🟢 Sensor Online & Monitoring';
    } else {
        statusIndicator.className = 'status-indicator status-offline';
        statusText.textContent = '🔴 Sensor Offline - Menunggu Data';
    }
}

// Fetch sensor data via AJAX
async function fetchSensorData() {
    try {
        const response = await fetch('/api/sensor-data');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update temperature display
        const tempElement = document.getElementById('temp-value');
        tempElement.textContent = data.temperature;
        
        // Update humidity display
        const humidityElement = document.getElementById('humidity-value');
        humidityElement.textContent = data.humidity;
        
        // Update progress bars
        updateProgressBars(data.temperature, data.humidity);
        
        // Update status indicators
        updateStatusIndicators(data.connected);
        
        // Update comfort level
        updateComfortLevel(data.temperature, data.humidity);
        
        // Update last update time
        document.getElementById('last-update').textContent = data.timestamp;
        
        // Store current values
        currentTemp = data.temperature;
        currentHumidity = data.humidity;
        
        console.log('📊 Data updated:', data);
        
    } catch (error) {
        console.error('❌ Error fetching sensor data:', error);
        showNotification('Gagal mengambil data sensor', 'warning');
        
        // Update status to offline on error
        updateStatusIndicators(false);
    }
}

// Refresh data manually
function refreshData() {
    fetchSensorData();
    showNotification('Data berhasil direfresh!');
}

// Toggle auto-refresh
function toggleAutoRefresh() {
    const button = document.getElementById('auto-refresh-text');
    
    if (isAutoRefreshActive) {
        clearInterval(autoRefreshInterval);
        button.textContent = '▶️ Mulai Auto-Refresh';
        isAutoRefreshActive = false;
        showNotification('Auto-refresh dihentikan', 'warning');
    } else {
        startAutoRefresh();
        button.textContent = '⏸️ Stop Auto-Refresh';
        isAutoRefreshActive = true;
        showNotification('Auto-refresh dimulai');
    }
}

// Start auto-refresh using AJAX
function startAutoRefresh() {
    autoRefreshInterval = setInterval(() => {
        fetchSensorData();
    }, 3000); // Update every 3 seconds
}

// Export data to JSON
function exportData() {
    const data = {
        timestamp: new Date().toISOString(),
        suhu: currentTemp,
        kelembaban: currentHumidity,
        status: currentTemp !== 'N/A' ? 'online' : 'offline',
        comfort_level: getComfortLevel(currentTemp, currentHumidity),
        export_time: new Date().toLocaleString('id-ID')
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Data berhasil diekspor!');
}

// Get comfort level as string
function getComfortLevel(temp, humidity) {
    if (temp === 'N/A' || humidity === 'N/A') {
        return 'unknown';
    }
    
    const tempNum = parseFloat(temp);
    const humNum = parseFloat(humidity);
    
    if (tempNum >= 20 && tempNum <= 30 && humNum >= 40 && humNum <= 60) {
        return 'comfortable';
    } else if (tempNum > 30 || humNum > 70) {
        return 'hot_humid';
    } else if (tempNum < 20 || humNum < 30) {
        return 'cold_dry';
    } else {
        return 'moderate';
    }
}

// Initialize everything when page loads
function initializeApp() {
    // Update comfort level with initial data
    updateComfortLevel(currentTemp, currentHumidity);
    
    // Update progress bars with initial data
    updateProgressBars(currentTemp, currentHumidity);
    
    // Set initial timestamp
    document.getElementById('last-update').textContent = new Date().toLocaleTimeString();
    
    // Start auto-refresh
    startAutoRefresh();
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Selamat datang di Smart DHT11 Monitor!');
    }, 1000);
    
    // Initial data fetch after a short delay
    setTimeout(() => {
        fetchSensorData();
    }, 2000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Handle page visibility changes (pause auto-refresh when tab is hidden)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        if (isAutoRefreshActive) {
            clearInterval(autoRefreshInterval);
        }
    } else {
        if (isAutoRefreshActive) {
            startAutoRefresh();
            // Immediate refresh when tab becomes visible
            setTimeout(fetchSensorData, 500);
        }
    }
});

// Handle online/offline events
window.addEventListener('online', function() {
    showNotification('Koneksi internet kembali normal', 'success');
    if (isAutoRefreshActive) {
        fetchSensorData();
    }
});

window.addEventListener('offline', function() {
    showNotification('Koneksi internet terputus', 'warning');
});
