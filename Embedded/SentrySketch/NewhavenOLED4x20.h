/*
  Creation Date: April, 2019
  Original author: Andreas Taylor
  Original author repository: https://gitlab.com/Andy4495/NewhavenOLED
  Authors of modifications: Fred Drury
  Contents: Newhave 4x20 OLED Character Display driver
*/


/*  This library is designed for using NHD-0420CW's Serial Interface.
    The display doesn't support hardware SPI so bit-banging is required.
    
    This library is based off of Andreas Taylor's NewhavenOLED library:
        https://gitlab.com/Andy4495/NewhavenOLED

    Pinout:
        NHD-0420CW                  Microcontroller
        ----------                  ---------------
        Pin 1       VSS             GND
        Pin 2       VDD             5V
        Pin 3       REG VDD         5V
        Pin 4-6     NC              GND
        Pin 7       SCLK            sckPin (GPIO output - does not have to be hardware SPI)
        Pin 8       SDI             mosiPin (GPIO output - does not have to be hardware SPI)
        Pin 9       SDO             NC
        Pin 10-14   NC              GND
        Pin 15      /CS             GND (for multiple displays sharing sck and mosi pins: csPin (GPIO output))
        Pin 16      /RES            5V (or rstPin (GPIO output) for resettability)
        Pin 17-19   BS0-BS2         GND
        Pin 20      VSS             GND
*/

#ifndef NEWHAVEN_OLED4X20
#define NEWHAVEN_OLED4X20


#include <Arduino.h>


#define NO_PIN                  255

#define ROW_BIT                 0x08

#define COLUMNS                 20
#define ROWS                    4

#define NH_6_DOT_FONT_WIDTH     1
#define NH_5_DOT_FONT_WIDTH     0

#define NH_3_4_LINE             1
#define NH_1_2_LINE             0

#define NH_DISPLAY_SHIFT        1
#define NH_CURSOR_SHIFT         0

#define NH_DISPLAY_SHIFT_ENABLE 1
#define NH_DOT_SCROLL_ENABLE    0

#define NH_ENABLE               1
#define NH_DISABLE              0

#define NH_2_4_LINE             1
#define NH_1_3_LINE             0


class NewhavenOLED4x20 {
public:
    NewhavenOLED4x20(byte mosiPin, byte sckPin, byte csPin, byte rstPin);
    void begin();
    void end();
    void command(byte c);
    void commandOld(byte c);
    void data(byte d);
    void setCursor(int col, int row);
    byte write(int col, int row, char c);
    byte write(char c);
    byte write(const char* s);

    // Fundamental Command Set
    void NewhavenOLED4x20::clearDisplay();
    void NewhavenOLED4x20::returnHome();
    void NewhavenOLED4x20::entryModeSet(bool movesRight, bool enableDisplayShift);
    void NewhavenOLED4x20::displayOnOff(bool displayOn, bool cursorOn, bool blinkOn);
    void NewhavenOLED4x20::extendedFunctionSet(bool fontWidth, bool invertCursor, bool displayMode);
    void NewhavenOLED4x20::cursorDisplayShift(bool shiftType, bool shiftRight);
    void NewhavenOLED4x20::doubleHeightDisplayDot(bool doubleHeightTop, bool doubleHeightBottom, bool displayDot);
    void NewhavenOLED4x20::shiftEnable(bool enableLine1, bool enableLine2, bool enableLine3, bool enableLine4);
    void NewhavenOLED4x20::scrollEnable(bool enableLine1, bool enableLine2, bool enableLine3, bool enableLine4);
    void NewhavenOLED4x20::functionSet0(bool numDisplayLines, bool doubleHeight, bool RE);
    void NewhavenOLED4x20::functionSet1(bool blinkEnable, bool reverse);
    void NewhavenOLED4x20::setCGRAMaddr(int addr);
    void NewhavenOLED4x20::setDDRAMaddr(int addr);
    void NewhavenOLED4x20::setScrollQuant(int scrollQuant);
    void NewhavenOLED4x20::readBusyAddr(bool busy, int addr);
    void NewhavenOLED4x20::writeData(int data);
    void NewhavenOLED4x20::readData(int data);

    void NewhavenOLED4x20::command(int instructionCode);
    void NewhavenOLED4x20::oldBegin();
    void NewhavenOLED4x20::newLine(int lineNum);


private:
    int cursorC, cursorR;
    byte MOSI_pin, SCK_pin, CS_pin, RST_pin;
    void clock_cycle();
    void send_byte(byte c);
    byte row_address[4];

    void sendCommand(int instructionCode);
};


#endif
