#include <Arduino.h>
#include "WiFi.h"
#include <HTTPClient.h>
#include <Wire.h>

float accelX_g = 0.0;
float accelY_g = 0.0;
float accelZ_g = 0.0;

float gyroX_dps = 0.0;
float gyroY_dps = 0.0;
float gyroZ_dps = 0.0;


#include "secrets.h"



void setup() {
  Serial.begin(115200);

  Wire.begin(21,22);
  setupMPU();

  Serial.println("Setup Basladı");
  delay(1000);

  WiFi.begin(ssid,password);

  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("Wifi baglaniyor... ");
    delay(1000);
  }

  Serial.println("Wifi baglandi!");
  Serial.println(WiFi.localIP());

  scanI2C();

}


void loop()
{
  readMPU();
  readGyro();

  sendSensorData();

  delay(200);
}
