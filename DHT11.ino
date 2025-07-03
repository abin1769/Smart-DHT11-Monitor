#include <DHT.h>

#define DHTPIN 2      // Pin data DHT11
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature(); // Celsius

  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT11");
    return;
  }

  Serial.print("Suhu: ");
  Serial.print(t);
  Serial.print(";");
  Serial.print("Kelembaban: ");
  Serial.println(h);

  delay(2000);
}
// The code reads temperature and humidity from a DHT11 sensor and prints the values to the Serial Monitor.
// It initializes the sensor in the setup function and reads the values in the loop function.