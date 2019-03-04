/* interrupt routine for Rotary Encoders
     tested with Noble RE0124PVB 17.7FINB-24 http://www.nobleusa.com/pdf/xre.pdf - available at pollin.de
     and a few others, seems pretty universal

     The average rotary encoder has three pins, seen from front: A C B
     Clockwise rotation A(on)->B(on)->A(off)->B(off)
     CounterCW rotation B(on)->A(on)->B(off)->A(off)

     and may be a push switch with another two pins, pulled low at pin 8 in this case
     raf@synapps.de 20120107


     
*/


/*
*   cpstone_IO.ino for SentryPeripheral
*   Original Authors: Newhaven Display International Inc. & rafbuff
*   Editing Author: Pasquale D'Antini
*   Editing Author: Andy4495
*   Editing Author: Fred Drury
*   
*   Original example created by Newhaven Display International Inc.
*   Modified and adapted to Arduino Uno 30 Mar 2015 by Pasquale D'Antini
*   Modified 19 May 2015 by Pasquale D'Antini:
*   https://www.newhavendisplay.com/NHD_forum/index.php?topic=914.0
*   
*   Further modifications to use "NewhavenOLED" library by Andy4495, Dec 2017 and Jan 2019:
*   https://github.com/Andy4495/NewhavenOLED
*
*   Modified Feb 2019 by Fred Drury to include other IO functions and mirror text on display
*   
*   Merged with original code from rafbuff:
*   https://playground.arduino.cc/Main/RotaryEncoders
*
*   This example code is in the public domain.
*   
*   This program serves to test the LCD screen and rotary encoder
*   
*   Inputs: Rotary encoder
*   Outputs: Bit-bang serial LCD
*
*   The circuit:
*   OLED pin 1 (Vss)        to Arduino pin ground
*   OLED pin 2 (VDD)        to Arduino pin 5V
*   OLED pin 3 (REGVDD) to Arduino pin 5V
*   OLED pin 4 to 6         to Vss ground
*   OLED pin 7 (SCLK)     to Arduino pin D13 (SCK)
*   OLED pin 8 (SID)        to Arduino pin D11 (MOSI)
*   OLED pin 9 (SOD)        No connection
*   OLED pin 10 to 14     to Vss ground
*   OLED pin 15 (/CS)     to Vss ground    (or to Arduino pin D2, in case of use of more than one display)
*   OLED pin 16 (/RES)    to Arduino pin Reset or VDD 5V (or to Arduino pin D3, to control reset by sw)
*   OLED pin 17 (BS0)     to Vss ground
*   OLED pin 18 (BS1)     to Vss ground
*   OLED pin 19 (BS2)     to Vss ground
*   OLED pin 20 (Vss)     to Vss ground
*/
#include "PinChangeInterrupt.h"
#include "NewhavenOLED.h"


const byte ROW_N = 4;                                 // Number of display rows
const byte COLUMN_N = 20;                         // Number of display columns

const byte CS = 2;                                        // Arduino's pin assigned to the /CS line
const byte RES = NO_PIN;                            // Arduino's pin assigned to the Reset line (optional, can be always high)
const byte SCLK = 13;                                 // Arduino's pin assigned to the SCLK line
const byte SDIN = 11;                                 // Arduino's pin assigned to the SID line

byte new_line[4] = {0x80, 0xA0, 0xC0, 0xE0};                             // DDRAM address for each line of the display
NewhavenOLED oled(ROW_N, COLUMN_N, SDIN, SCLK, CS, RES);


// usually the rotary encoders three pins have the ground pin in the middle
enum PinAssignments {
    encoderPinA = 2,     // right
    encoderPinB = 3,     // left
    clearButton = 8        // another two pins
};

volatile unsigned int encoderPos = 0;    // a counter for the dial
volatile unsigned int pushes = 0;
unsigned int lastReportedPos = 1;     // change management
static boolean rotating = false;        // debounce management

// interrupt service routine vars
boolean A_set = false;
boolean B_set = false;

boolean LCDupdate = true;


void setup() {
    digitalWrite(A0,HIGH);
    attachPCINT(digitalPinToPCINT(A0), pushbutton, FALLING);
    
    pinMode(encoderPinA, INPUT);
    pinMode(encoderPinB, INPUT);
    pinMode(clearButton, INPUT);
    // turn on pullup resistors
    digitalWrite(encoderPinA, HIGH);
    digitalWrite(encoderPinB, HIGH);
    digitalWrite(clearButton, HIGH);

    // encoder pin on interrupt 0 (pin 2)
    attachInterrupt(0, doEncoderA, CHANGE);
    // encoder pin on interrupt 1 (pin 3)
    attachInterrupt(1, doEncoderB, CHANGE);

    Serial.begin(9600);    // output


    oled.begin();                                        // Setup control pins and initialize OLED controller

    if (ROW_N == 2)                                    // Update DDRAM address for 2-line mode
        new_line[1] = 0xC0;                        // 3- and 4-line use row addresses as defined above
}

// main loop, work is done by interrupt service routines, this one only prints stuff
void loop() {
    rotating = true;    // reset the debouncer

    if (lastReportedPos != encoderPos) {
        Serial.print("Index:");
        Serial.println(encoderPos, DEC);
        lastReportedPos = encoderPos;
    }
    if (digitalRead(clearButton) == LOW )    {
        encoderPos = 0;
    }

    /*if (LCDupdate) {
        updateLCD();
    }*/
}

void updateLCD() {
    /*char *s = sprintf("rotation: %d", encoderPos);
    oled.write(s);
    *s = "\npushbutton: " + pushes;
    oled.write(s);*/
    /*oled.clear();
    char s[] = "test";
    oled.write(s);*/

    oled.clear();
    char s[] = "rotations: ";
    for(int i = 0; i < 11; i++) {
        oled.write(s[i]);
    }
    char *t;
    itoa(encoderPos, t, 10);
    oled.write(t[0]);
    oled.setCursor(0,1);

    char u[] = "pushbutton: ";
    for(int i = 0; i < 12; i++) {
        oled.write(u[i]);
    }
    *t;
    itoa(pushes, t, 10);
    oled.write(t[0]);
    oled.setCursor(0,2);
    
}

// Interrupt on A changing state
void doEncoderA() {
    // debounce
    if ( rotating ) delay (1);    // wait a little until the bouncing is done

    // Test transition, did things really change?
    if ( digitalRead(encoderPinA) != A_set ) { // debounce once more
        A_set = !A_set;

        // adjust counter + if A leads B
        if ( A_set && !B_set ) {
            encoderPos += 1;
            LCDupdate = true;
        }

        rotating = false;    // no more debouncing until loop() hits again
    }
}

// Interrupt on B changing state, same as A above
void doEncoderB() {
    if ( rotating ) delay (1);
    if ( digitalRead(encoderPinB) != B_set ) {
        B_set = !B_set;
        //    adjust counter - 1 if B leads A
        if ( B_set && !A_set ) {
            encoderPos -= 1;
            LCDupdate = true;
        }

        rotating = false;
    }
}

void pushbutton()
{
    pushes += 1;
    LCDupdate = true;
    delay(1);
}  
