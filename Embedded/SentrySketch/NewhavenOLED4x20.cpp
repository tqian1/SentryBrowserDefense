/*
  Creation Date: April, 2019
  Original author: Andreas Taylor
  Original author repository: https://gitlab.com/Andy4495/NewhavenOLED
  Authors of modifications: Fred Drury
  Contents: Newhave 4x20 OLED Character Display driver
*/

#include "NewhavenOLED4x20.h"


// Use NO_PIN if csPin or rstPin are not connected to GPIO
NewhavenOLED4x20::NewhavenOLED4x20(byte mosiPin, byte sckPin, byte csPin, byte rstPin)
{
    MOSI_pin = mosiPin;
    SCK_pin = sckPin;
    CS_pin = csPin;
    RST_pin = rstPin;

    row_address[0] = 0x80;
    row_address[1] = 0xA0;
    row_address[2] = 0xC0;
    row_address[3] = 0xE0;

}

// this is the default from the datasheet
// TODO: convert to use explanatory functions
void NewhavenOLED4x20::begin() {
    if (RST_pin != NO_PIN) {
        pinMode(RST_pin, OUTPUT);
        digitalWrite(RST_pin, HIGH);
    }
    if (CS_pin != NO_PIN) {
        pinMode(CS_pin, OUTPUT);
        digitalWrite(CS_pin, HIGH);
    }
    pinMode(MOSI_pin, OUTPUT);
    digitalWrite(MOSI_pin, LOW);
    pinMode(SCK_pin, OUTPUT);
    digitalWrite(SCK_pin, HIGH);

    cursorC = 0;
    cursorR = 0;

    functionSet0(NH_1_3_LINE, false, 1);        // Function set: extended command set (RE=1), lines #
    setCGRAMaddr(0b110000);                     // Function selection A:
    data(0x5C);                                 // enable internal Vdd regulator at 5V I/O mode (def. value) (0x00 for disable, 2.8V I/O)
    functionSet0(NH_1_3_LINE, false, 0);        // Function set: fundamental command set (RE=0) (exit from extended command set), lines #
    cursorDisplayShift(NH_CURSOR_SHIFT, true);  // Display ON/OFF control: display off, cursor off, blink off (default values)
    functionSet0(NH_1_3_LINE, false, 1);        // Function set: extended command set (RE=1), lines #
    setCGRAMaddr(0b111001);                     // OLED characterization: OLED command set enabled (SD=1)
    setDDRAMaddr(0b1010101);                    // Set display clock divide ratio/oscillator frequency:
    setCGRAMaddr(0b110000);                     // divide ratio=1, frequency=7 (default values)
    setCGRAMaddr(0b111000);                     // OLED characterization: OLED command set disabled (SD=0) (exit from OLED command set)

    // https://www.newhavendisplay.com/NHD_forum/index.php?topic=2863.0
    command(0x2A); // Function set (extended command set)
    command(0x04); // COM SEG direction
    command(0x28); // function set (fundamental command set)

    displayOnOff(false, false, true);           // Extended function set (RE=1): 5-dot font, B/W inverting disabled (def. val.), 3/4 lines

    entryModeSet(true, false);                  // Entry Mode set - COM/SEG direction: COM0->COM31, SEG99->SEG0 (BDC=1, BDS=0)
    setCGRAMaddr(0b110010);                     // Function selection B:
    data(0x0A);                                 //    ROM/CGRAM selection: ROM C, CGROM=250, CGRAM=6 (ROM=10, OPR=10)
    setCGRAMaddr(0b111001);                     // OLED characterization: OLED command set enabled (SD=1)
    setDDRAMaddr(0b1011010);                    // Set SEG pins hardware configuration:
    cursorDisplayShift(NH_CURSOR_SHIFT, false); // alternative odd/even SEG pin, disable SEG left/right remap (default values)
    setDDRAMaddr(0b1011100);                    // Function selection C:
    command(0x00);                //    internal VSL, GPIO input disable
    command(0x81);                // Set contrast control:
    command(0x7F);                //    contrast=127 (default value)
    command(0xD9);                // Set phase length:
    command(0xF1);                //    phase2=15, phase1=1 (default: 0x78)
    command(0xDB);                // Set VCOMH deselect level:
    command(0x40);                //    VCOMH deselect level=1 x Vcc (default: 0x20=0,77 x Vcc)
    command(0x78);                // OLED characterization: OLED command set disabled (SD=0) (exit from OLED command set)
    functionSet0(NH_2_4_LINE, false, 0);        // Function set: extended command set (RE=0), lines #
    command(0x01);                // Clear display
    delay(2);                         // After a clear display, a minimum pause of 1-2 ms is required
    command(0x80);                // Set DDRAM address 0x00 in address counter (cursor home) (default value)
    command(0x0C);                // Display ON/OFF control: display ON, cursor off, blink off
    delay(250);                     // Waits 250 ms for stabilization purpose after display on
}

void NewhavenOLED4x20::command(int instructionCode) {
    if (CS_pin != NO_PIN) {
        digitalWrite(CS_pin, LOW);
    }

    byte i = 0; // Bit index

    for (i = 0; i < 5; i++)
    {
        digitalWrite(MOSI_pin, HIGH);
        clock_cycle();
    }
    for (i = 0; i < 3; i++)
    {
        digitalWrite(MOSI_pin, LOW);
        clock_cycle();
    }

    send_byte(instructionCode); // Transmits the byte

    if (CS_pin != NO_PIN) {
        digitalWrite(CS_pin, HIGH);
    }
}

void NewhavenOLED4x20::commandOld(byte c)
// Start Byte: 5 high bits, followed by:
// - R/W control bit: 0 = write, 1 = read
// - Data/Control bit: 0 = control, 1 = data
// - End bit: 0
// So in the case of a command, the sequence is 5 high bits followed by 3 low bits
{
    if (CS_pin != NO_PIN) {
        digitalWrite(CS_pin, LOW);
    }

    byte i = 0;                                     // Bit index

    for (i = 0; i < 5; i++)
    {
        digitalWrite(MOSI_pin, HIGH);
        clock_cycle();
    }
    for (i = 0; i < 3; i++)
    {
        digitalWrite(MOSI_pin, LOW);
        clock_cycle();
    }

    send_byte(c);                                            // Transmits the byte

    if (CS_pin != NO_PIN) {
        digitalWrite(CS_pin, HIGH);
    }

}

void NewhavenOLED4x20::data(byte d) {
    if (CS_pin != NO_PIN) {
        digitalWrite(CS_pin, LOW);
    }

    byte i = 0; // Bit index

    for (i = 0; i < 5; i++)
    {
        digitalWrite(MOSI_pin, HIGH);
        clock_cycle();
    }
    digitalWrite(MOSI_pin, LOW);
    clock_cycle();
    digitalWrite(MOSI_pin, HIGH);
    clock_cycle();
    digitalWrite(MOSI_pin, LOW);
    clock_cycle();

    send_byte(d); // Transmits the byte

    if (CS_pin != NO_PIN) {
        digitalWrite(CS_pin, HIGH);
    }
}

void NewhavenOLED4x20::setCursor(int col, int row) {
    if (col < COLUMNS && row < ROWS) {
        cursorC = col;
        cursorR = row;
    } else {
        cursorC = 0;
        cursorR = 0;
    }
}

byte NewhavenOLED4x20::write(char c) {
    command(row_address[cursorR] + cursorC);
    data(c);
    cursorC++;
    if (cursorC >= COLUMNS) {
        cursorR++;
        cursorC = 0;
    }
    if (cursorR >= ROWS) cursorR = 0;

    return 1; // Number of characters written to display
}

byte NewhavenOLED4x20::write(const char* s) {
    int position = 0;

    clearDisplay(); // Clear display and cursor home
    delay(2);                     // Need a pause after clearing display
    for (cursorR = 0; cursorR < ROWS; cursorR++)                // One row at a time
    {
        commandOld(row_address[cursorR]);                //    moves the cursor to the first column of that line
        for (cursorC = 0; cursorC < COLUMNS; cursorC++)            //    One character at a time
        {
            data((byte)s[position++]);                 //    displays the corresponding string
        }
    }
    cursorR = 0;
    cursorC = 0;

    return COLUMNS * ROWS;                                         // Number of characters written to display
}

// parameter is line number to start on 0-3
void NewhavenOLED4x20::newLine(int lineNum) {
    switch(lineNum) {
        case 0:
            command(0x80);
            break;
        case 1:
            command(0xA0);
            break;
        case 2:
            command(0xC0);
            break;
        case 3:
            command(0xE0);
            break;
    }
}

// =======================================================================================
// =============================== Fundamental Command Set ===============================
// =======================================================================================

void NewhavenOLED4x20::clearDisplay() {
    int instructionCode = 0x01;
    command(instructionCode);
    delay(2);
}

void NewhavenOLED4x20::returnHome() {
    int instructionCode = 0x02;
    command(instructionCode);
}

void NewhavenOLED4x20::entryModeSet(bool movesRight, bool enableDisplayShift) {
    int instructionCode = 0x04 | (movesRight << 1) | enableDisplayShift;
    command(instructionCode);
}

void NewhavenOLED4x20::displayOnOff(bool displayOn, bool cursorOn, bool blinkOn) {
    int instructionCode = 0x08 | (displayOn << 2) | (cursorOn << 1) | blinkOn;
    command(instructionCode);
}

// TODO: combine with function set 0 (below). this will likely require storing default values for the other parameters so that just num lines can be changed?
void NewhavenOLED4x20::extendedFunctionSet(bool fontWidth, bool invertCursor, bool displayMode) {
    int instructionCode = 0x808 | (fontWidth << 2) | (invertCursor << 1) | displayMode;
    command(instructionCode);
}

void NewhavenOLED4x20::cursorDisplayShift(bool shiftType, bool shiftRight) {
    int instructionCode = 0x10 | (shiftType << 3) | (shiftRight << 2);
    command(instructionCode);
}

// TODO: confirm correct order and values of double height
void NewhavenOLED4x20::doubleHeightDisplayDot(bool doubleHeightTop, bool doubleHeightBottom, bool displayDot) {
    int instructionCode = 0x810 | (doubleHeightBottom << 3) | (doubleHeightTop << 2) | displayDot;
    command(instructionCode);
}

void NewhavenOLED4x20::shiftEnable(bool enableLine1, bool enableLine2, bool enableLine3, bool enableLine4) {
    int instructionCode = 0xC08 | (enableLine4 << 3) | (enableLine3 << 2) | (enableLine2 << 1) | enableLine1;
    command(instructionCode);
}

void NewhavenOLED4x20::scrollEnable(bool enableLine1, bool enableLine2, bool enableLine3, bool enableLine4) {
    int instructionCode = 0xC08 | (enableLine4 << 3) | (enableLine3 << 2) | (enableLine2 << 1) | enableLine1;
    command(instructionCode);
}

void NewhavenOLED4x20::functionSet0(bool numDisplayLines, bool doubleHeight, bool RE) {
    int instructionCode = 0x20 | (numDisplayLines << 3) | (doubleHeight << 2) | (RE << 1);
    command(instructionCode);
}

// TODO: does this have the correct value of N?
void NewhavenOLED4x20::functionSet1(bool blinkEnable, bool reverse) {
    int instructionCode = 0x822 | (blinkEnable << 2) | reverse;
    command(instructionCode);
}

void NewhavenOLED4x20::setCGRAMaddr(int addr) {
    int instructionCode = 0x40 | addr;
    command(instructionCode);
}

void NewhavenOLED4x20::setDDRAMaddr(int addr) {
    int instructionCode = 0x80 | addr;
    command(instructionCode);
}

// scrollQuant valid up to 48
void NewhavenOLED4x20::setScrollQuant(int scrollQuant) {
    int instructionCode = 0x880 | scrollQuant;
    command(instructionCode);
}

void NewhavenOLED4x20::readBusyAddr(bool busy, int addr) {
    int instructionCode = 0x100 | (busy << 7) | addr;
    command(instructionCode);
}

void NewhavenOLED4x20::writeData(int data) {
    int instructionCode = 0x200 | data;
    command(instructionCode);
}

void NewhavenOLED4x20::readData(int data) {
    int instructionCode = 0x300 | data;
    command(instructionCode);
}

// ======================================================================================
// ================================ Extended Command Set ================================
// ======================================================================================

// TODO: implement Extended Command Set

// ======================================================================================
// ================================== OLED Command Set ==================================
// ======================================================================================

// TODO: implement OLED Command Set

// =======================================================================================
// ================================== Private Functions ==================================
// =======================================================================================

void NewhavenOLED4x20::clock_cycle() {
    digitalWrite(SCK_pin, LOW);     // Sets LOW the SCLK line of the display
    delayMicroseconds(3);           // Waits 3 us (required for timing purpose)
    digitalWrite(SCK_pin, HIGH);    // Sets HIGH the SCLK line of the display
    delayMicroseconds(3);           // Waits 3 us (required for timing purpose)
}

void NewhavenOLED4x20::send_byte(byte tx_b) {
    byte i;

    // send the lower nybble
    digitalWrite(MOSI_pin, tx_b & 0x01);
    clock_cycle();
    digitalWrite(MOSI_pin, tx_b & 0x02);
    clock_cycle();
    digitalWrite(MOSI_pin, tx_b & 0x04);
    clock_cycle();
    digitalWrite(MOSI_pin, tx_b & 0x08);
    clock_cycle();

    for (i = 0; i < 4; i++) // 4 low data filler bits
    {
        digitalWrite(MOSI_pin, LOW);
        clock_cycle();
    }

    // send the upper nybble
    digitalWrite(MOSI_pin, tx_b & 0x10);
    clock_cycle();
    digitalWrite(MOSI_pin, tx_b & 0x20);
    clock_cycle();
    digitalWrite(MOSI_pin, tx_b & 0x40);
    clock_cycle();
    digitalWrite(MOSI_pin, tx_b & 0x80);
    clock_cycle();

    for (i = 0; i < 4; i++) // 4 low data filler bits
    {
        digitalWrite(MOSI_pin, LOW);
        clock_cycle();
    }
}
