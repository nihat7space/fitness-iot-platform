#include <Wire.h>

void scanI2C()
{
  Serial.println("I2C taramsi basliyor...");

  byte error;
  byte address;

  for (address=1 ; address < 127 ; address++)
  {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();

    if (error == 0)
    { 
      Serial.print("I2C cihazi bulundu! Adres: 0x");
      Serial.println(address, HEX);
    }
  }

}