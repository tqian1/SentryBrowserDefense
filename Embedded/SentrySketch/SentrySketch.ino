#include "PinChangeInterrupt.h"
#include "NewhavenOLED4x20.h"

const byte CS = NO_PIN;
const byte RES = NO_PIN;
const byte SCLK = 13;
const byte SDIN = 11;

enum PinAssignments {
    encoderPinA = 2,     // right
    encoderPinB = 3,     // left
    clearButton = A0        // another two pins
};

volatile unsigned int encoderRow = 0;    // a counter for the dial
volatile unsigned int level = 0;
unsigned int lastReportedPos = 1;     // change management
static boolean rotating = false;        // debounce management
bool updateLCD = true;  //true so that update is performed on 1st iteration.
unsigned long buttonTime;

// interrupt service routine vars
boolean A_set = false;
boolean B_set = false;

NewhavenOLED4x20 oled(SDIN, SCLK, CS, RES);

char *displayInfo[20] = {
    " 5ca627a64001640ad9d 5d0627a64001640ad9e 203c6ef730016bd3340 204c6ef730016bd3341",
    " STRING              ARRAY               CODE                OBJECT             ",
    " @37463              @39181              @20991              @51901             ",
    " @78881              @61193              @61201              @61209             "
};

/*char ids[] =          " 5ca627a64001640ad9d 5d0627a64001640ad9e 203c6ef730016bd3340 204c6ef730016bd3341"; // level 0
char types[] =        " STRING              ARRAY               CODE                OBJECT             "; // level 1
char nodeGroups[] =   " @37463              @39181              @20991              @51901             "; // level 2
char nodes[] =        " @78881              @61193              @61201              @61209             "; // level 3*/


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
    
    oled.begin();
}


void loop() {
    if(updateLCD) {
        while(encoderRow > 3) encoderRow -= 4;
        while(encoderRow < 0) encoderRow += 4;
        while(level > 3) level-=4; // enables looping/resetting
        while(level < 0) level++;

        displayInfo[level][encoderRow * 20] = '>';
        oled.write(displayInfo[level]);
        displayInfo[level][0] = ' ';
        displayInfo[level][20] = ' ';
        displayInfo[level][40] = ' ';
        displayInfo[level][60] = ' ';

        updateLCD = false;
    }
    
    delay(100);
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
            encoderRow += 1;
            updateLCD = true;
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
            encoderRow -= 1;
            updateLCD = true;
        }

        rotating = false;
    }
}


void pushbutton() {
    level++;
    updateLCD = true;
    delay(10);
}
