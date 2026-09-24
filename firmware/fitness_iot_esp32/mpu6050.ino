const byte MPU_ADDRESS = 0x68;


void setupMPU()
{
    Wire.beginTransmission(MPU_ADDRESS);
    Wire.write(0x6B);
    Wire.write(0);
    Wire.endTransmission();
}

void readMPU()
{
  int16_t accelX;
  int16_t accelY;
  int16_t accelZ;

  Wire.beginTransmission(MPU_ADDRESS);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDRESS, 6);

  accelX = (int16_t)((Wire.read() << 8) | Wire.read());
  accelY = (int16_t)((Wire.read() << 8) | Wire.read());
  accelZ = (int16_t)((Wire.read() << 8) | Wire.read());

  accelX_g = accelX / 16384.0;
  accelY_g = accelY / 16384.0;
  accelZ_g = accelZ / 16384.0;

  Serial.print("X: ");
  Serial.print(accelX_g);

  Serial.print(" g | Y: ");
  Serial.print(accelY_g);

  Serial.print(" g | Z: ");
  Serial.print(accelZ_g);

  Serial.println(" g");
}
void readGyro()
{
    int16_t gyroX;
    int16_t gyroY;
    int16_t gyroZ;

    Wire.beginTransmission(MPU_ADDRESS);
    Wire.write(0x43);
    Wire.endTransmission(false);

    Wire.requestFrom(MPU_ADDRESS, 6);

    gyroX = (int16_t)((Wire.read() << 8) | Wire.read());
    gyroY = (int16_t)((Wire.read() << 8) | Wire.read());
    gyroZ = (int16_t)((Wire.read() << 8) | Wire.read());

    gyroX_dps = gyroX / 131.0;
    gyroY_dps = gyroY / 131.0;
    gyroZ_dps = gyroZ / 131.0;

    Serial.print("Gyro X: ");
    Serial.print(gyroX_dps);

    Serial.print(" dps | Y: ");
    Serial.print(gyroY_dps);

    Serial.print(" dps | Z: ");
    Serial.print(gyroZ_dps);

    Serial.println(" dps");
}

