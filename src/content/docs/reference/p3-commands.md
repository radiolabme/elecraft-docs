---
title: P3 CAT Command Reference
description: Complete CAT serial command reference for the Elecraft P3 panadapter (Rev. A7)
---

## Introduction

This document is derived from the **Elecraft P3 Programmer's Reference, Rev. A7** (March 8, 2016, firmware 01.59). It provides a complete reference for the CAT (Computer Aided Transceiver) serial commands supported by the Elecraft P3 panadapter. These commands allow remote control of the P3's most important instrument functions via its RS232 PC port.

The **P3 Utility** computer program provides a convenient Command Tester screen for trying individual commands, as well as macro support for sending strings of P3 and/or K3 commands with a single click. The Capture Image screen uses the `#BMP` command to upload the current P3 screen to a standard bitmap file.

When a K3 is connected to the RS232 XCVR port, both K3 and P3 commands can be sent from the same computer program. For example, `#RVM;` returns the P3 firmware revision while `RVM;` (without the `#` prefix) returns the K3 main firmware revision. This is a useful connectivity check: a response to `#RVM;` confirms the PC port is connected; a response to `RVM;` confirms the XCVR port is also connected.

## Command Set Overview

The table below lists all P3 control commands. Commands marked "Internal use only" are omitted from the detailed reference.

| Command | Description              | Command | Description            | Command | Description              |
| ------- | ------------------------ | ------- | ---------------------- | ------- | ------------------------ |
| `=`     | Product ID               | `#LBL`  | Labels on/off          | `#RVS`  | SVGA firmware revision   |
| `#AVG`  | Averaging time           | `#MFA`  | Marker A frequency     | `#SCL`  | Scale                    |
| `#BMP`  | Bitmap upload            | `#MFB`  | Marker B frequency     | `#SPM`  | Span mode                |
| `BR`    | Baud rate set            | `#MKA`  | Marker A on/off        | `#SPN`  | Span                     |
| `#BR`   | Baud rate set            | `#MKB`  | Marker B on/off        | `#SVDT` | SVGA data on/off         |
| `#CTF`  | Center frequency         | `#NB`   | Noise blanker on/off   | `#SVEN` | SVGA enable              |
| `#DSM`  | Display mode             | `#NBL`  | Noise blanker level    | `#SVFL` | SVGA fill on/off         |
| `#FNL`  | Function key label       | `#PKM`  | Peak mode on/off       | `#SVFN` | SVGA font                |
| `#FNX`  | Function key execute     | `#PS`   | Power status/control   | `#SVRS` | SVGA resolution          |
| `#FON`  | Display font size        | `#PT`   | Pass-through mode      | `#SVWB` | SVGA waterfall bias      |
| `#FXA`  | Fixed auto-adjust mode   | `#QSY`  | QSY to current marker  | `#VFB`  | VFO B cursor on/off      |
| `#FXT`  | Fixed or tracking select | `#RCF`  | Relative center freq.  | `#WFA`  | Waterfall average on/off |
|         |                          | `#REF`  | Reference level        | `#WFC`  | Waterfall color          |
|         |                          | `#RST`  | Reset the P3           | `#WFM`  | Waterfall markers on/off |
|         |                          | `#RVF`  | SVGA FPGA revision     | `#XCV`  | Transceiver select       |
|         |                          | `#RVM`  | Main firmware revision |         |                          |

## Command Format

Commands sent from the computer to the P3 follow a **GET/SET/RSP** model:

- **GET** commands are sent by the computer to request information from the P3. The P3 responds with a **RSP** (response) message.
- **SET** commands are sent by the computer to change the P3's configuration or initiate an event.
- Commands with an incorrect format or out-of-range parameter are silently ignored.
- A SET can be followed by a GET to verify the new settings.

### SET Command Structure

SET commands use 2-4 characters, optional data fields, and a terminating semicolon (`;`).

```text
#AVG05;      Set averaging on with time constant of 5
#DSM1;       Select spectrum+waterfall display mode
```

### GET Command Structure

Many SET commands have a corresponding GET command, which is the command letters with no data, plus the semicolon. The RSP data format is usually identical to the SET data format; exceptions are noted in the individual command descriptions.

```text
#AVG;         Get the current averaging setting
#DSM;         Get the current display mode
```

### General Notes

- Characters sent to the P3 can be in either **upper or lower case**. The P3 always responds in upper case.
- All commands must be terminated with a semicolon (`;`) except where noted.
- When a K3 is connected to the XCVR port, commands without the `#` prefix are passed through to the K3.

## Command Reference

This section describes all P3 GET, SET, and RSP command formats. Unless otherwise noted, the GET format is the command letters followed by a semicolon with no data. The SET and RSP data formats are identical unless otherwise noted.

### `=` -- Product Identification

**Type:** GET only

**GET format:**

```text
=
```

**RSP format:**

```text
P3        Main firmware executing
p3        Boot loader ready to download new firmware
```

There is no `#` prefix or semicolon in either the query or the response.

---

### `#AVG` -- Averaging Time

**Type:** GET/SET

**SET/RSP format:**

```text
#AVGnn;
```

| Parameter | Values    | Description                               |
| --------- | --------- | ----------------------------------------- |
| `nn`      | `00`      | Average mode off                          |
| `nn`      | `02`-`20` | Averaging time constant (average mode on) |

---

### `#BMP` -- Bitmap Upload

**Type:** GET only

**RSP format:**

```text
[bmp]cc
```

| Field   | Description                                                     |
| ------- | --------------------------------------------------------------- |
| `[bmp]` | 131,638 bytes of binary image data in standard .BMP file format |
| `cc`    | Two-byte checksum                                               |

**Notes:**

- The response does **not** include the command name and has **no** terminating semicolon.
- The checksum is the modulo-65,536 sum of all 131,638 bytes, sent least-significant byte first.

---

### `BR` and `#BR` -- Baud Rate

**Type:** SET only

**SET format:**

```text
BRn;
#BRn;
```

| Parameter | Value | Baud Rate  |
| --------- | ----- | ---------- |
| `n`       | `0`   | 4800 baud  |
| `n`       | `1`   | 9600 baud  |
| `n`       | `2`   | 19200 baud |
| `n`       | `3`   | 38400 baud |

**Notes:**

- The P3 Utility program automatically sets the P3 to 38400 baud for downloads, then restores the user's previous selection.
- The baud rate can also be set via the P3's RS232 menu.
- The RS232 port that connects to the K3 always runs at 38400 baud.
- Any `BR` command received from a host computer affects the baud rate of the P3's PC-facing RS232 port, not the K3.

---

### `#CTF` -- Center Frequency

**Type:** GET/SET

**SET/RSP format:**

```text
#CTFsxxxxxxxxxxx;
```

| Parameter     | Description                                           |
| ------------- | ----------------------------------------------------- |
| `s`           | Sign: `+`, `-`, or space (space is equivalent to `+`) |
| `xxxxxxxxxxx` | Center frequency in Hz (11 digits)                    |

**Example:**

```text
#CTF+00014060000;     Set center frequency to 14,060 kHz
```

**Notes:**

- If the specified frequency is in a different band than the K3 is tuned to, the action is undefined.
- A value of zero sets the center frequency to the main VFO frequency of the transceiver.
- For transceivers other than the K3, the center frequency is interpreted relative to the frequency the transceiver is tuned to and may be positive or negative.

---

### `#DSM` -- Display Mode

**Type:** GET/SET

**SET/RSP format:**

```text
#DSMn;
```

| Parameter | Value | Mode                                |
| --------- | ----- | ----------------------------------- |
| `n`       | `0`   | Spectrum only                       |
| `n`       | `1`   | Spectrum + waterfall                |
| `n`       | `2`   | Spectrum + power meters             |
| `n`       | `3`   | Spectrum + waterfall + power meters |

---

### `#FNL` -- Function Key Label

**Type:** GET only

**GET format:**

```text
#FNLn;
```

**RSP format:**

```text
#FNLnccccccccc;
```

| Parameter   | Description                                 |
| ----------- | ------------------------------------------- |
| `n`         | Key number, `1`-`8` (for keys FN1-FN8)      |
| `ccccccccc` | 9 ASCII characters of the key label for FNn |

---

### `#FON` -- Font Size

**Type:** GET/SET

**SET/RSP format:**

```text
#FONn;
```

| Parameter | Value | Font Size     |
| --------- | ----- | ------------- |
| `n`       | `0`   | 5 x 7 pixels  |
| `n`       | `1`   | 7 x 11 pixels |
| `n`       | `2`   | 9 x 14 pixels |

---

### `#FNX` -- Function Key Execute

**Type:** SET only

**SET format:**

```text
#FNXn;
```

| Parameter | Description                            |
| --------- | -------------------------------------- |
| `n`       | Key number, `1`-`8` (for keys FN1-FN8) |

Executes the function assigned to the specified key, if any.

---

### `#FXA` -- Fixed-tune Auto-adjust Mode

**Type:** GET/SET

**SET/RSP format:**

```text
#FXAn;
```

| Parameter | Value | Mode        |
| --------- | ----- | ----------- |
| `n`       | `0`   | Full screen |
| `n`       | `1`   | Half screen |
| `n`       | `2`   | Slide       |
| `n`       | `3`   | Static      |

Specifies how far the P3 center frequency moves when the K3 VFO A is tuned off screen in fixed-tune mode.

---

### `#FXT` -- Fixed or Tracking Select

**Type:** GET/SET

**SET/RSP format:**

```text
#FXTn;
```

| Parameter | Value | Mode            |
| --------- | ----- | --------------- |
| `n`       | `0`   | Tracking mode   |
| `n`       | `1`   | Fixed-tune mode |

---

### `#LBL` -- Labels On/Off

**Type:** GET/SET

**SET/RSP format:**

```text
#LBLn;
```

| Parameter | Value | Description       |
| --------- | ----- | ----------------- |
| `n`       | `0`   | FN key labels off |
| `n`       | `1`   | FN key labels on  |

---

### `#MFA` and `#MFB` -- Marker A/B Frequency

**Type:** GET/SET

**SET/RSP format:**

```text
#MFAsxxxxxxxxxxx;
#MFBsxxxxxxxxxxx;
```

| Parameter     | Description                                           |
| ------------- | ----------------------------------------------------- |
| `s`           | Sign: `+`, `-`, or space (space is equivalent to `+`) |
| `xxxxxxxxxxx` | Marker frequency in Hz (11 digits)                    |

**Example:**

```text
#MFA+00014060000;     Set marker A frequency to 14,060 kHz
```

**Notes:**

- If the specified frequency is in a different band than the K3 is tuned to, the action is undefined.
- A value of zero sets the marker to the main VFO frequency of the transceiver.
- For transceivers other than the K3, the marker frequency is interpreted relative to the frequency the transceiver is tuned to and may be positive or negative.

---

### `#MKA` and `#MKB` -- Marker A/B On/Off

**Type:** GET/SET

**SET/RSP format:**

```text
#MKAn;
#MKBn;
```

| Parameter | Value | Description |
| --------- | ----- | ----------- |
| `n`       | `0`   | Marker off  |
| `n`       | `1`   | Marker on   |

**Notes:**

- The last marker to be turned on automatically becomes the **active marker**, meaning it can be adjusted with the knob and responds to the QSY command.
- If the marker was off-screen before executing a marker-on command, it will default to the center frequency.

---

### `#NB` -- Noise Blanker On/Off

**Type:** GET/SET

**SET/RSP format:**

```text
#NBn;
```

| Parameter | Value | Description       |
| --------- | ----- | ----------------- |
| `n`       | `0`   | Noise blanker off |
| `n`       | `1`   | Noise blanker on  |

---

### `#NBL` -- Noise Blanker Level

**Type:** GET/SET

**SET/RSP format:**

```text
#NBLnn;
```

| Parameter | Values   | Description                                         |
| --------- | -------- | --------------------------------------------------- |
| `nn`      | `1`-`15` | Noise blanker aggressiveness (1 = least, 15 = most) |

---

### `#PKM` -- Peak Mode On/Off

**Type:** GET/SET

**SET/RSP format:**

```text
#PKMn;
```

| Parameter | Value | Description   |
| --------- | ----- | ------------- |
| `n`       | `0`   | Peak mode off |
| `n`       | `1`   | Peak mode on  |

---

### `#PS` -- Power Status

**Type:** GET/SET

**SET/RSP format:**

```text
#PSn;
```

| Parameter | Value | Description |
| --------- | ----- | ----------- |
| `n`       | `0`   | Turn P3 off |
| `n`       | `1`   | P3 is on    |

**Notes:**

- `#PS0` turns the P3 off, but this removes power, so `#PS1` cannot be used to turn it back on.
- If the power-on jumper on the rear-panel I/O board is in the "always on" position, the `#PS0` command has no effect.

---

### `#PT` -- Pass-Through Mode

**Type:** SET only

**SET format:**

```text
#PT;
```

Sets the P3 to pass-through mode: panadapter operation ceases and all data received on either RS232 port is passed through immediately to the other RS232 port without delay or modification.

**Notes:**

- This command is used by P3 Utility when downloading new firmware to the K3 transceiver.
- Pass-through mode ends automatically 8 seconds after the last RS232 activity.

---

### `#QSY` -- QSY to Current Marker

**Type:** SET only

**SET format:**

```text
#QSYn;
```

| Parameter | Value | Description                                                |
| --------- | ----- | ---------------------------------------------------------- |
| `n`       | `0`   | Undo QSY (return VFO to pre-QSY frequency; one-level undo) |
| `n`       | `1`   | QSY (transfer active marker frequency to associated VFO)   |

**Notes:**

- Marker A controls VFO A; Marker B controls VFO B.
- "Undo QSY" returns the VFO to the frequency it was on before the last QSY (one-level undo).

---

### `#RCF` -- Relative Center Frequency

**Type:** GET/SET

**SET format:**

```text
#RCFsnnnnnn;
```

| Parameter | Description             |
| --------- | ----------------------- |
| `s`       | Sign: `+` or `-`        |
| `nnnnnn`  | Offset in Hz (6 digits) |

The offset is added to the VFO A frequency to compute the new center frequency. This command is used to position the VFO A cursor on the screen.

**Example:**

```text
#RCF+025000;     With a 50 kHz span, moves VFO A cursor to the left edge
```

The center frequency moves up 25 kHz, which shifts the VFO A cursor to the left.

**RSP format:**

```text
#RCFsnnnnnn;
```

The response returns the difference between the current center frequency and the VFO A frequency.

---

### `#REF` -- Reference Level

**Type:** GET/SET

**SET/RSP format:**

```text
#REFsnnn;
```

| Parameter | Description                                           |
| --------- | ----------------------------------------------------- |
| `s`       | Sign: `+`, `-`, or space (space is equivalent to `+`) |
| `nnn`     | Reference level in dBm, range `-170` to `+010`        |

**Example:**

```text
#REF-120;     Set reference level (bottom of spectrum screen) to -120 dBm
```

---

### `#RST` -- Reset the P3

**Type:** SET only

**SET format:**

```text
#RST;
```

Forces a power-on reset of the P3.

---

### `#RVF` -- SVGA FPGA Image Revision

**Type:** GET only

**GET format:**

```text
#RVFnn;
```

**RSP format:**

```text
#RVFnnNN.NN;
```

| Parameter | Description                     |
| --------- | ------------------------------- |
| `nn`      | FPGA image number, `00` to `05` |
| `NN.NN`   | Image revision (e.g., `01.23`)  |

**Notes:**

- Returns `99.99` if no FPGA image is installed.

---

### `#RVM` -- Main Firmware Revision

**Type:** GET only

**RSP format:**

```text
#RVMNN.NN;
```

| Parameter | Description                       |
| --------- | --------------------------------- |
| `NN.NN`   | Firmware revision (e.g., `01.23`) |

---

### `#RVS` -- SVGA Board Firmware Revision

**Type:** GET only

**RSP format:**

```text
#RVSNN.NN;
```

| Parameter | Description                       |
| --------- | --------------------------------- |
| `NN.NN`   | Firmware revision (e.g., `01.23`) |

**Notes:**

- Returns `99.99` if no SVGA firmware is installed.
- Returns `00.00` if only the SVGA boot loader is installed.

---

### `#SCL` -- Scale

**Type:** GET/SET

**SET/RSP format:**

```text
#SCLnnn;
```

| Parameter | Values      | Description                                                        |
| --------- | ----------- | ------------------------------------------------------------------ |
| `nnn`     | `010`-`080` | Scale in dB (difference between top and bottom of spectrum screen) |

**Example:**

```text
#SCL080;     Set scale to 80 dB
```

---

### `#SPM` -- Span Mode

**Type:** GET/SET

**SET/RSP format:**

```text
#SPMn;
```

| Parameter | Value | Mode                 |
| --------- | ----- | -------------------- |
| `n`       | `0`   | Continuous span mode |
| `n`       | `1`   | Stepped span mode    |

**Notes:**

- In stepped span mode, the span steps between 2, 5, 10, 20, 50, 100, and 200 kHz.

---

### `#SPN` -- Span

**Type:** GET/SET

**SET/RSP format:**

```text
#SPNxxxxxx;
```

| Parameter | Values            | Description          |
| --------- | ----------------- | -------------------- |
| `xxxxxx`  | `000020`-`002000` | Span in 100 Hz units |

**Example:**

```text
#SPN000500;     Set span to 50 kHz (500 x 100 Hz)
```

---

### `#SVDT` -- SVGA Decoded Data Display On/Off

**Type:** GET/SET

**SET/RSP format:**

```text
#SVDTn;
```

| Parameter | Value | Description      |
| --------- | ----- | ---------------- |
| `n`       | `0`   | Data display off |
| `n`       | `1`   | Data display on  |

---

### `#SVEN` -- SVGA Display On/Off

**Type:** GET/SET

**SET/RSP format:**

```text
#SVENn;
```

| Parameter | Value | Description      |
| --------- | ----- | ---------------- |
| `n`       | `0`   | SVGA display off |
| `n`       | `1`   | SVGA display on  |

---

### `#SVFL` -- SVGA Spectrum Fill On/Off

**Type:** GET/SET

**SET/RSP format:**

```text
#SVFLn;
```

| Parameter | Value | Description |
| --------- | ----- | ----------- |
| `n`       | `0`   | Fill off    |
| `n`       | `1`   | Fill on     |

**Notes:**

- When on, the area below the spectrum trace on the external SVGA display is filled in for easier visibility.

---

### `#SVFN` -- SVGA Font Select

**Type:** GET/SET

**SET/RSP format:**

```text
#SVFNn;
```

| Parameter | Values  | Description                               |
| --------- | ------- | ----------------------------------------- |
| `n`       | `0`-`3` | Font number (larger number = larger font) |

---

### `#SVRS` -- SVGA Display Resolution

**Type:** GET/SET

**SET/RSP format:**

```text
#SVRSn;
```

| Parameter | Values  | Description                 |
| --------- | ------- | --------------------------- |
| `n`       | `0`-`4` | External display resolution |

See the SVGA option manual for details on resolution values.

---

### `#SVWB` -- SVGA Waterfall Bias

**Type:** GET/SET

**SET/RSP format:**

```text
#SVWBnn;
```

| Parameter | Values    | Description                                                         |
| --------- | --------- | ------------------------------------------------------------------- |
| `nn`      | `01`-`99` | Waterfall bias, corresponding to 0.1-9.9 in the P3 "SVGA bias" menu |

**Notes:**

- The higher the number, the greater the color contrast in the external display waterfall.
- A value of 1.0 (parameter `10`) makes the display look similar to the P3 screen on a typical monitor.

---

### `#VFB` -- VFO B Cursor On/Off

**Type:** GET/SET

**SET/RSP format:**

```text
#VFBn;
```

| Parameter | Value | Description      |
| --------- | ----- | ---------------- |
| `n`       | `0`   | VFO B cursor off |
| `n`       | `1`   | VFO B cursor on  |

---

### `#WFA` -- Waterfall Averaging On/Off

**Type:** GET/SET

**SET/RSP format:**

```text
#WFAn;
```

| Parameter | Value | Description             |
| --------- | ----- | ----------------------- |
| `n`       | `0`   | Waterfall averaging off |
| `n`       | `1`   | Waterfall averaging on  |

---

### `#WFC` -- Waterfall Color

**Type:** GET/SET

**SET/RSP format:**

```text
#WFCn;
```

| Parameter | Value | Description          |
| --------- | ----- | -------------------- |
| `n`       | `0`   | Gray scale waterfall |
| `n`       | `1`   | Colored waterfall    |

---

### `#WFM` -- Waterfall Markers On/Off

**Type:** GET/SET

**SET/RSP format:**

```text
#WFMn;
```

| Parameter | Value | Description           |
| --------- | ----- | --------------------- |
| `n`       | `0`   | Waterfall markers off |
| `n`       | `1`   | Waterfall markers on  |

---

### `#XCV` -- Transceiver Select

**Type:** GET/SET

**SET/RSP format:**

```text
#XCVnn;
```

| Parameter | Value | Description                                 |
| --------- | ----- | ------------------------------------------- |
| `nn`      | `00`  | K3                                          |
| `nn`      | `01`  | User-defined transceiver                    |
| `nn`      | `02`  | 455 kHz IF                                  |
| `nn`      | `03`+ | Additional transceivers per "Xcvr Sel" menu |

---

## Appendix A: Change History

Applicable firmware revision shown in brackets.

| Revision | Date       | Firmware | Changes                                                                                                                                         |
| -------- | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| A1       | 2010-10-20 | 00.41    | Added commands `#AVG`, `#CTF`, `#DPM`, `#FNL`, `#FNX`, `#LBL`, `#MFA`/`#MFB`, `#MKA`/`#MKB`, `#PKM`, `#PS`, `#QSY`, `#REF`, `#SCL`, and `#SPN`. |
| A2       | 2010-11-05 | 00.41    | Added "Internal use only" commands to the table. Changed `#DPM` command name to `#DSM`. Changed `#SPN` format. Added `#PT` and `#VFB` commands. |
| A3       | 2011-02-16 | 01.05    | Added commands `#FXA`, `#FXT`, and `#TP`.                                                                                                       |
| A4       | 2012-03-19 | 01.11    | Added commands `#RST`, `#RVF`, and `#RVS`.                                                                                                      |
| A5       | 2015-01-23 | 01.35    | Added commands `#NB`, `#NBL`, `#SPM`, `#SVWB`, `#SVDT`, `#SVEN`, `#SVFN`, `#SVFL`, `#SVRS`, `#WFA`, `#WFC`, and `#WFM`.                         |
| A6       | 2016-02-02 | 01.57    | Changed `#DSM` command. Added `#FON` and `#XCV` commands.                                                                                       |
| A7       | 2016-03-08 | 01.59    | Added `#RCF` command.                                                                                                                           |
