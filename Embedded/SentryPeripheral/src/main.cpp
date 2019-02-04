/*
*   main.c for SentryPeripheral
*   Original Author: François Beaufort
*   Editing Author: Fred Drury
*   
*   This code is derived from the Arduino sketch provided
*   in GoogleChrome's chrome-app-samples repository at
*   https://github.com/GoogleChrome/chrome-app-samples/blob/master/samples/serial/ledtoggle/sketches/serial_light/serial_light.ino
*   
*   This program serves to test the serial connection between
*   a Chrome App and an Arduino Uno.
*   
*   Inputs: bytes of data received over USB interface.
*   Outputs: builtin LED on/off, bytes of data sent over USB interface.
*/

#include <Arduino.h>

#define LED 13

void setup() {
    Serial.begin(9600);

    pinMode(LED, OUTPUT);
    // Turn it off for now.
    digitalWrite(LED, LOW);
}

void loop() {
    // Check if there's a serial message waiting.
    if (Serial.available() > 0) {
        // If there is, read the incoming byte.
        int incomingByte = Serial.read();
        if (incomingByte == 'y') {
            digitalWrite(LED, HIGH);
        } else if (incomingByte == 'n') {
            digitalWrite(LED, LOW);
        } else {
            Serial.println(incomingByte);
        }
    }
}
