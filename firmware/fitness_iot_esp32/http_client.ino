void sendSensorData()
{
    String json = "{";
    json += "\"accel_x\":" + String(accelX_g);
    json += ",\"accel_y\":" + String(accelY_g);
    json += ",\"accel_z\":" + String(accelZ_g);

    json += ",\"gyro_x\":" + String(gyroX_dps);
    json += ",\"gyro_y\":" + String(gyroY_dps);
    json += ",\"gyro_z\":" + String(gyroZ_dps);
    
    
    json += "}";


    Serial.println(json);

    if (WiFi.status() == WL_CONNECTED)
    {
        HTTPClient http;

        http.begin("http://51.20.191.178:8000/sensors");
        http.addHeader("Content-Type", "application/json");

        int responseCode = http.POST(json);

        Serial.print("HTTP Response Code: ");
        Serial.println(responseCode);

        http.end();
    }
    else
    {
        Serial.println("WiFi baglantisi yok!");
    }
}