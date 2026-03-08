---
title: K3/K3S/KX3/KX2 CAT Command Reference
description: Complete CAT serial command reference for Elecraft K3, K3S, KX3, and KX2 transceivers (Rev. G5)
---

## Introduction

This document is derived from Elecraft's K3S/K3/KX3/KX2 Programmer's Reference, Rev. G5 (February 20, 2019). It provides a complete reference for all CAT (Computer Aided Transceiver) serial control commands supported by the Elecraft K3, K3S, KX3, and KX2 transceivers. For change history, see the appendix at the end of this document.

## Command Set Overview

All K3S/K3/KX3/KX2 remote control commands are listed in the table below. The KX3 and KX2 accept all K3 commands, though some have no functional effect on the KX3/KX2 (marked with `*`). Some commands are recognized only by the KX3 or KX2 (marked with `**`). For K2 commands, see the KIO2 Programmer's Reference.

Commands marked with `$` support a `$` suffix to target VFO B / sub RX (VFO B / dual watch for KX3/KX2).

| Name       | Description           | Name      | Description            | Name        | Description          |
| ---------- | --------------------- | --------- | ---------------------- | ----------- | -------------------- |
| `!`, `@`\* | Direct DSP control    | `FT`      | TX VFO select          | `PS`        | Power-on/off control |
| `AG` $     | AF gain               | `FW` $    | Filter bandwidth and # | `RA` $      | RX attenuator on/off |
| `AI`       | Auto-info mode        | `GT`      | AGC speed and on/off   | `RC`        | RIT/XIT offset clear |
| `AK` \*\*  | ATU network values    | `IC`      | Icon and misc. status  | `RD`        | RIT down             |
| `AN`       | Antenna selection     | `ID`      | Radio identification   | `RG` $      | RF gain              |
| `AP`       | CW APF on/off         | `IF`      | General information    | `RO`        | RIT/XIT offset (abs) |
| `AR` \*    | RX antenna on/off     | `IO` \*\* | Internal use only      | `RT`        | RIT on/off           |
| `BC` \*\*  | Internal use only     | `IS`      | IF shift               | `RU`        | RIT up               |
| `BG`       | Bargraph read         | `K2`      | K2 command mode        | `RV`        | Firmware revisions   |
| `BN` $     | Band number           | `K3`      | K3 command mode        | `RX`        | Enter RX mode        |
| `BR`       | Baud rate set         | `KE` \*\* | Internal use only      | `SB`        | Sub or dual watch    |
| `BW` $     | Filter bandwidth      | `KS`      | Keyer speed            | `SD`        | QSK delay            |
| `CP`       | Speech compression    | `KT` \*\* | Internal use only      | `SM` $      | S-meter              |
| `CW`       | CW sidetone pitch     | `KY`      | Keyboard CW/DATA       | `SMH` \*    | High-res S-meter     |
| `DB`       | VFO B text            | `LD`      | Internal use only      | `SP` \*     | Internal use only    |
| `DE` \*    | Cmd processing delay  | `LK` $    | VFO lock (A or B)      | `SQ` $      | Squelch level        |
| `DL`       | DSP command trace     | `LN` \*   | Link VFOs              | `SW`        | SWR                  |
| `DM`       | Internal use only     | `MC`      | Memory channel         | `SWT`/`SWH` | Switch tap/hold      |
| `DN`/`DNB` | VFO move down         | `MD` $    | Operating mode         | `TB`        | Buffered text        |
| `DS`       | VFO A text/icons      | `MG`      | Mic gain               | `TE`        | TX EQ                |
| `DT`       | Data sub-mode         | `ML`      | Monitor level          | `TM` \*     | TX meter mode        |
| `DV` \*    | Diversity mode        | `MN`      | Menu entry number      | `TQ`        | TX query             |
| `EL` \*\*  | Error logging on/off  | `MP`      | Menu param read/set    | `TT`        | Text-to-terminal     |
| `ER`       | Internal use only     | `MQ` \*\* | Menu param read/set    | `TX`        | Enter TX mode        |
| `ES`       | ESSB mode             | `NB` $    | Noise blanker on/off   | `UP`/`UPB`  | VFO move up          |
| `EW`       | Internal use only     | `NL` $    | Noise blanker level    | `VX`        | VOX state            |
| `FA`       | VFO A frequency       | `OM`      | Option modules         | `XF` $      | XFIL number          |
| `FB`       | VFO B frequency       | `PA` $    | RX preamp on/off       | `XL`        | Internal use only    |
| `FI` \*    | I.F. center frequency | `PC`      | Power Control          | `XT`        | XIT on/off           |
| `FN` \*    | Internal use only     | `PN` \*   | Internal use only      |             |                      |
| `FR`       | Receive VFO select    | `PO` \*\* | Power output read      |             |                      |

Some commands emulate controls and display elements. For example, the `SWT`/`SWH` commands emulate switch TAP/HOLD, `MN` accesses menus, `DS`, `DB`, and `IC` read VFO A / B and icons, and `BA` and `BG` read bargraphs. Other commands directly read or modify radio parameters, such as the VFO A and B frequencies (`FA` and `FB`). There is some overlap between emulation and parametric commands.

## Command Format

In the remainder of this document, K3 references apply to the KX3 and KX2 as well unless otherwise noted.

### GET/SET/RSP Model

Commands sent from the computer to the K3 are considered either **GETs** or **SETs**.

- **GET** commands are used by the computer to get information from the K3; the K3 will then provide an appropriate response message (**RSP**).
- **SET** commands are sent by the computer to change the radio's configuration or initiate an event. A SET can be followed by a GET to verify the new settings, or the auto-info mechanism can be used for confirmation that something has changed (see `AI` in the Meta-commands section).

SET commands use 2 or 3 characters, optional data fields, and a terminating semicolon (`;`). Examples:

```text
KS020;       Computer sets CW speed to 20 WPM (data = 020)
MD1;         Computer selects LSB mode (data = 1)
```

Many SET commands have a corresponding GET command, which is just the command letters with no data. The data format of the response message from the K3 (RSP) is usually identical to the format of the SET data. Exceptions are noted in the command descriptions.

Characters sent to the K3 can use either upper or lower case. The K3 will always respond with upper case, except when a lower-case character is a place-holder for a special symbol (e.g., the VFO B display command, `DB`).

### Sub Receiver / VFO B Commands ($)

Some commands target VFO B (and the sub RX, in the case of the K3) if `$` is added after the command prefix. Examples include `AG$`, `RG$`, `MD$`, `BW$`, `FW$`, `LK$`. This is indicated in the reference section by a `$` in the command title. Some commands target VFO B itself and do not need the `$`, including `FB`, `UPB`, `DNB`, and `DB`.

### Linked VFOs and Diversity Mode

If the VFOs are linked (see `LN`), commands that affect the VFO A frequency also change VFO B. This includes `FA`, `UP`, `DN`, `RU`, `RD`, and `RC`. In Diversity mode, `BW`, `FW` and `MD` match the VFO B/sub receiver filter and mode settings, respectively, to the main receiver.

### Extended Commands

Some commands have an extended data format which provides enhanced functionality or backward compatibility with older software applications. Such commands should be avoided in switch macros because of the need to use a meta-command to enable extended functionality (see Meta-commands section). Alternatives are available. For example, the `BW` (bandwidth) command should be used in macros rather than the legacy `FW` command, which depends on meta-command settings.

### Response Time

The K3 will typically respond in less than 10 milliseconds. General worst-case latency is around 100 ms, except for commands that change bands, which can take up to 500 ms.

Since the K3 provides a full-duplex interface, the computer can send the K3 commands at any time. Continuous, fast polling (< 100 ms per poll for bar graph data in transmit mode, for example) should be carefully tested to ensure that it is not affecting radio operation. Polling during transmit should not be used unless necessary.

### Busy/Limited Access Indication (`?;`)

Some commands cannot be safely handled when the K3 is in a busy state, such as transmit, or in a limited-access state, such as BSET or VFO A/B reverse (REV switch). If a command cannot respond due to such a condition, the K3 will return `?;`.

You can use the `TQ` command to see if the K3 is in transmit mode, and the icon/status command (`IC`) to check for BSET mode (byte a, bit 6).

## Meta-Commands

Meta-commands change the behavior of other commands to provide automatic responses or compatibility with older application software. In general they should not be embedded in K3 or KX3 front-panel switch macros, as they may adversely affect software applications that control meta-command modes. The Command Reference section explains when to use them with specific commands.

### AI (Auto-Info Mode)

The `AI` meta-command can be used to enable automatic responses from the K3 to a computer in response to K3 front panel control changes by the operator. Application software may use AI1 or AI2 mode as an alternative to continuous polling. (Not appropriate for switch macros.)

- **AI0 (No Auto-info):** This is the default. The PC must poll for all radio information using GET commands; the K3 will not send any information automatically.
- **AI1 (Auto-Info Mode 1):** The K3 sends an IF (info) response within 1 second when any frequency or mode-related event occurs, either manually (at the radio itself) or when the PC sends commands. These events include: band change, mode change, VFO movement, RIT/XIT offset change or clear, and several additional switches (e.g., A/B, REV, A=B, SPLIT, CW REV, RIT, XIT). IF responses are suppressed during VFO movement. Notes: (1) putting the K3 into auto-info mode 1 (by sending `AI1;`) causes an initial IF response. (2) The K3 can be placed into AI1 mode without a PC by setting CONFIG:AUTOINF to AUTO1. The user may do this to support non-PC devices that make use of auto-info, such as a SteppIR antenna controller. Application software can check for unexpected IF responses and turn AI off if required.
- **AI2 (Auto-Info Mode 2):** The K3 sends an appropriate response (FA, FB, IF, GT, MD, RA, PC, etc.) whenever any front-panel event occurs. This applies to all of the events mentioned for mode AI1, and ultimately to all rotary control changes and switch presses. At present only a subset of controls generate responses.
- **AI3 (Combination):** This is similar to mode AI2 and is provided only for compatibility with existing programs.

### K2 (K2 Command Mode)

The `K2` meta-command modifies the set/response format of some commands. Avoid using this command in switch macros.

- **K20 (K2 Normal mode):** This is the default; K2 command extensions are disabled.
- **K21 (K2 Normal/rtty_off):** Same as K20, except that MD and IF report RTTY and RTTY-reverse modes as LSB and USB, respectively. This may be useful with programs that don't support a separate RTTY mode.
- **K22 (K2 Extended mode):** Enables all K2 command extensions.
- **K23 (K2 Extended mode/rtty_off):** Enables all K2 extensions, but like K21, alters the MD and IF commands.

### K3 (K3 Command Mode)

The `K3` meta-command modifies the set/response format of some commands. Avoid using this command in switch macros.

- **K30 (K3 Normal mode):** This is the default; K3 command extensions are disabled.
- **K31 (K3 Extended Mode):** Enables all K3-specific command extensions (see, for example, `FW`). Typically, K3 applications will place the K3 in K31 mode except when K30 mode is needed due to the use of certain commands.

## Macro Examples

Macros -- strings containing one or more control commands -- can be used to automate K3/KX3/KX2 control sequences. The table below lists some examples. Macros can have a length of up to 120 characters, along with a label of up to 7 characters.

| Label   | Description                                                                             | Command String                                             |
| ------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| SPLIT+2 | CW DX split starting point: A>B twice, enter SPLIT, move VFO B up 2 kHz, RIT/XIT off    | `SWT13;SWT13;FT1;UPB5;RT0;XT0;`                            |
| EQ MIC1 | Boost 100-Hz TX EQ band by 8 dB; others "flat"                                          | `TE+00+08+00+00+00+00+00+00;`                              |
| WEAKSIG | Diversity mode, main/sub preamps on, 200-Hz bandwidth, no IF shift                      | `DV1;PA1;PA$1;BW0020;IS 9999;`                             |
| CLEANUP | Turn off split/RIT/XIT; unlink VFOs; open squelch                                       | `FT0;RT0;XT0;LN0;SQ000;`                                   |
| WWV 10  | 30 m, AM mode, VFO A to 10.0 MHz, 3 kHz AF bandwidth (requires 6 kHz IF crystal filter) | `FA00010000000;MD5;FA00010000000;BW0300;`                  |
| OLDIES  | Switch to AM radio station at 1550 kHz; 4 kHz BW, attn. on, preamp off                  | `FA00001550000;MD5;FA00001550000;BW0400;IS 9999;RA01;PA0;` |
| LCD BRT | Set the MAIN:LCD BRT menu parameter to 6                                                | `MN003;MP005;MN255;`                                       |
| MEM32   | Load frequency memory #32 into VFOs A and B                                             | `MC032;`                                                   |
| LOCKA&B | Lock both VFOs                                                                          | `LK1;LK$1;`                                                |
| PWRTEST | Send "BT" at 100 W, 10 W, and 1 W, then restore power to 100 W                          | `PC100;KYW =;PC010;KYW =;PC001;KYW =;PC100;`               |
| TUN 10W | Set power to 10 W and enter TUNE mode                                                   | `PC010;SWH16;`                                             |
| AMP ON  | Turn on an external amplifier and set K3 drive to 65 W                                  | `MN019;MP001;MN255;PC065;`                                 |
| 599FAST | Send "5NN" at 40 WPM, "TEST " at 30 WPM                                                 | `KS040;KYW5NN ;KS030;KYWTEST ;`                            |
| MUTE AF | Set main and sub AF GAIN to zero                                                        | `AG000;AG$000;`                                            |
| MON OFF | Set monitor volume to zero (present mode)                                               | `ML000;`                                                   |
| SCANNOW | (K3 only) Stores VFO A & B in per-band quick-memory M4 and starts scan                  | `SWT15;SWT39;SWT23;SWT39;SWH41;`                           |
| STEPPIR | Send frequency info to a device attached to the serial port                             | `IF;`                                                      |

**Important Restrictions:** (1) Macros normally only use SET commands, since they cannot make use of the response from a GET. For a useful exception, see the STEPPIR entry above. (2) Macros should not use meta-commands (like `K31;`) as this can interfere with software applications that control meta-modes. (3) Macros can be used to send direct DSP commands (see `!` and `@`), but at present this only works from K3 Utility, not from K3 front-panel switches.

### Creating and Using Macros

K3/KX3/KX2 Utility can be used to create and test macros. The first eight can be sent to the transceiver (K3 and KX3 only), where they can be assigned to any of the programmable function switches.

### Simple Application Program

The pseudo-code program below displays the VFO A frequency (8 digits) while watching for the user to request a frequency change via the PC keyboard:

```text
VfoControlLoop
{
    SendCommand( "FA;" )                        // GET frequency of VFO A
    StringF = GetResponse( TIMEOUT_100MS )      // wait for response; include a timeout
    Display( StringSubset( StringF, 5, 12 ) )   // show MHz through Hz digits on PC screen
    If( KeyboardInput = "+" )
        SendCommand( "UP;" )                    // SET command that moves VFO A up
    If( KeyboardInput = "-" )
        SendCommand( "DN;" )
}
```

## Command Reference

Commands marked with a dollar sign (`$`) apply to VFO B (and the sub receiver, in the case of the K3). Commands marked with an asterisk (`*`) are not functionally applicable to the Elecraft KX3 or KX2, but the KX3 and KX2 will accept and reply to all K3 commands. For K2 commands, see the KIO2 Programmer's Reference.

This section describes all K3 GET, SET and RSP (response) command formats. Unless otherwise noted, the GET format is just the 2 or 3 letters of the command followed by a semicolon. The SET and RSP data formats are identical unless noted otherwise. When K2 or K3 extended modes are in effect (typically K22 or K31), some commands have an extended format (see Meta-commands). Both Basic and Extended formats are described here.

---

### ! and @ - Direct Main/Auxiliary DSP Control

**K3/K3S only** (`@` is K3/K3S only)

Elecraft releases documentation on specific DSP commands as user needs for them arise. DSP commands can cause side effects and should be used with caution.

**Note:** At present, DSP commands cannot be used in combination with regular commands in K3 Utility macros. Also, they will not work as K3 switch macros.

---

### AG $ - AF Gain

**GET/SET**

```text
SET/RSP: AGnnn;   or   AG$nnn;
```

| Parameter | Range   | Description   |
| --------- | ------- | ------------- |
| `nnn`     | 000-255 | AF gain level |

---

### AI - Auto-Information

**GET/SET**

```text
SET/RSP: AIn;
```

| Parameter | Range | Description                                    |
| --------- | ----- | ---------------------------------------------- |
| `n`       | 0-3   | Auto-info mode (see Meta-commands for details) |

**Note:** The AI power-up default is normally AI0, corresponding to K3 menu setting CONFIG:AUTOINF = NOR. AUTOINF can also be set to AUTO1, which makes the default AI1 on power-up. This is useful for K3s controlling a SteppIR antenna, etc.

---

### AK - ATU Network Values

**KX3/KX2 only; GET only**

```text
RSP: AKaabbcc;
```

| Field | Description                      |
| ----- | -------------------------------- |
| `aa`  | Inductance IO bitmap (ASCII hex) |
| `bb`  | Capacitance bitmap (ASCII hex)   |
| `cc`  | Misc relays bitmap               |

The `aa` and `bb` bitmaps can be equated to L and C values by looking at the KXAT3 or KXAT2 schematic. For example, a value of "01" would represent the smallest L or C value in the network. At present only bit 0 of byte `cc` is defined: 00 = capacitors on the antenna side; 01 = capacitors on the transmit side. If the ATU is not installed or is in one of the Lx/Cx test settings, `AK000000;` is returned. In BYP mode, on some bands L and C are set to fixed non-zero values in order to cancel the ATU's own reactance when working into a 50-ohm load. In AUTO mode, the working auto-tuned values are shown.

---

### AN - Antenna Selection

**GET/SET**

```text
SET/RSP: ANn;
```

| Parameter | Value | Description |
| --------- | ----- | ----------- |
| `n`       | 1     | Antenna 1   |
| `n`       | 2     | Antenna 2   |

---

### AP - Audio Peaking Filter

**GET/SET**

```text
SET/RSP: APn;
```

| Parameter | Value | Description |
| --------- | ----- | ----------- |
| `n`       | 0     | APF OFF     |
| `n`       | 1     | APF ON      |

Applies to CW mode only, and only if CONFIG:DUAL PB is set to APF.

---

### AR - RX Antenna On/Off

**GET/SET; K3/K3S only**

```text
SET/RSP: ARn;
```

| Parameter | Value | Description    |
| --------- | ----- | -------------- |
| `n`       | 0     | RX antenna OFF |
| `n`       | 1     | RX antenna ON  |

---

### BG - Bargraph Read

**GET only**

```text
RSP: BGnnx;
```

| Field | Description                            |
| ----- | -------------------------------------- |
| `nn`  | Bars turned on                         |
| `x`   | R (receive) or T (transmit) -- K3 only |

Returns S-meter level in receive (also see `SM`/`SM$` command), and power or ALC level in transmit. On the K3 and K3S only, transmit metering mode can be set remotely using the `TM` command.

**K3 Receive:** `nn` is 00-21 (CWT off) or 00-09 (CWT on).

**K3 Transmit:** `nn` is 00-12 (PWR) or 00-07 (ALC) depending on METER setting. Also see `TM` command.

**K2 Receive or Transmit:** `nn` is 00-10 (DOT mode) or 12-22 (BAR mode).

---

### BN $ - Band Number

**GET/SET**

```text
SET/RSP: BNnn;
```

| Parameter | Range | Description                                            |
| --------- | ----- | ------------------------------------------------------ |
| `nn`      | 00-24 | Present logical band for VFO A (use `BN$nn` for VFO B) |

**Note:** BN SET command applies only to VFO A at present. BN GET works with either VFO A or B. If a band change occurs, allow 300 ms before sending other commands.

| Value | Band  | Value | Band         |
| ----- | ----- | ----- | ------------ |
| 00    | 160 m | 08    | 12 m         |
| 01    | 80 m  | 09    | 10 m         |
| 02    | 60 m  | 10    | 6 m          |
| 03    | 40 m  | 11-15 | Reserved     |
| 04    | 30 m  | 16    | Xvtr band #1 |
| 05    | 20 m  | 17    | Xvtr band #2 |
| 06    | 17 m  | ...   | ...          |
| 07    | 15 m  | 24    | Xvtr band #9 |

---

### BR - Serial I/O Baud Rate

**SET only**

```text
SET: BRn;
```

| Parameter | Value | Baud Rate |
| --------- | ----- | --------- |
| `n`       | 0     | 4800      |
| `n`       | 1     | 9600      |
| `n`       | 2     | 19200     |
| `n`       | 3     | 38400     |

**Note:** The K3 firmware download utility automatically sets the K3 to 38400 baud for downloads, then restores the baud rate to the user's selection (made using CONFIG:RS232).

---

### BW $ - Filter Bandwidth

**GET/SET**

```text
SET/RSP: BWxxxx;
```

| Parameter | Range  | Description              |
| --------- | ------ | ------------------------ |
| `xxxx`    | 0-9999 | Bandwidth in 10-Hz units |

May be quantized and/or range limited based on the present operating mode.

**Notes:**

1. BW is a derivative of the legacy FW command. BW is safer to use in switch macros, because it makes no assumptions about meta-command settings (K2x and K3x). FW may be preferred in applications.
2. In diversity mode, BW matches the sub receiver's filter bandwidth to the main receiver's.
3. Both BW and BW$ can be used in BSET mode (one exception: at present, BW/BW$ SET cannot be used in BSET mode with diversity receive in effect).
4. If a KX3/KX2 is in DUAL RX (dual watch) mode, BW$ returns the value for BW.

---

### CP - Speech Compression

**GET/SET**

```text
SET/RSP: CPxxx;
```

| Parameter | Range   | Description              |
| --------- | ------- | ------------------------ |
| `xxx`     | 000-040 | Speech compression level |

---

### CW - CW Sidetone Pitch

**GET only**

```text
RSP: CWxx;
```

| Parameter | Range | Description                   |
| --------- | ----- | ----------------------------- |
| `xx`      | 30-80 | Sidetone pitch in 10 Hz units |

---

### DB - VFO B Display Read/Write

**GET/SET; K3, KX3, and KX2 variants**

**GET format:** `DB;` (no data). Returns text displayed on VFO B, including decimal points and colons if present. VFO B normally displays only uppercase alphabetic characters. DB returns the following lower-case characters that represent symbols:

| Character | Symbol              |
| --------- | ------------------- |
| `a`       | antenna             |
| `b`       | mu                  |
| `c`       | slashed 0           |
| `d`       | itself              |
| `e`       | sigma               |
| `f`       | <- (left arrow)     |
| `g`       | -> (right arrow)    |
| `h`       | II (pause)          |
| `i`       | left-justified "1"  |
| `j`       | delta, large        |
| `k`       | delta, small        |
| `l`       | right-justified "1" |
| `m`       | superscript "m"     |
| `n`       | lowercase "w"       |

There are two SET formats with different functions:

**SET format 1:** `DBn;` where `n` is an ASCII character to send to VFO B, entering at the right end of the display and scrolling left as additional characters are entered. This can be used to create scrolling messages, insert a newsfeed, report a DX spot, etc.

**SET format 2:** `DBnn;` where `nn` is one of the available VFO B alternate display modes:

**K3 modes:**

| Value | Display                                     |
| ----- | ------------------------------------------- |
| 00    | Normal                                      |
| 01    | Time                                        |
| 02    | Date                                        |
| 03    | RIT/XIT offset                              |
| 04    | Supply voltage                              |
| 05    | Supply current                              |
| 06    | PA heatsink temp                            |
| 07    | Front panel temp                            |
| 08    | PLL1 voltage (requires CONFIG:TECH MD = ON) |
| 09    | PLL2 voltage (requires CONFIG:TECH MD = ON) |
| 10    | AFV (requires CONFIG:TECH MD = ON)          |
| 11    | dBV (requires CONFIG:TECH MD = ON)          |

**KX3 modes:**

| Value | Display                              |
| ----- | ------------------------------------ |
| 00    | Normal                               |
| 01    | Time                                 |
| 02    | Supply voltage                       |
| 03    | Battery voltage (if KXBC3 installed) |
| 04    | Supply current                       |
| 05    | PA temp (PA.I=KX3, PA.X=KXPA100)     |
| 06    | OSC temp                             |
| 07    | AFV                                  |
| 08    | dBV                                  |

**KX2 modes:**

| Value | Display                          |
| ----- | -------------------------------- |
| 00    | Normal                           |
| 01    | Time                             |
| 02    | Supply or batt. voltage          |
| 03    | N/A                              |
| 04    | Supply current                   |
| 05    | PA temp (PA.I=KX2, PA.X=KXPA100) |
| 06    | N/A                              |
| 07    | AFV                              |
| 08    | dBV                              |
| 09    | Amp hours (X.XXX AH)             |

---

### DE - Command Processing Delay

**SET only; K3/K3S only**

```text
SET: DExxx;
```

| Parameter | Range   | Description                     |
| --------- | ------- | ------------------------------- |
| `xxx`     | 001-255 | Delay value in 10-ms increments |

This is useful in switch or K-pod macros, where a delay may be desired to allow the radio to complete a previous operation before the next command is processed. Note: DE001 may result in a delay shorter than 10 ms, while DE002 is guaranteed to provide a delay between 10 and 20 ms.

---

### DL - DSP Command Debug On/Off

**SET only**

```text
SET: DLx;
```

| Parameter | Value | Description                    |
| --------- | ----- | ------------------------------ |
| `x`       | 2     | Turn DSP command debugging OFF |
| `x`       | 3     | Turn DSP command debugging ON  |

When ON, all commands sent from the MCU to the DSP are echoed to the K3's serial port, with a few exceptions such as during program loading. The DVR icon will flash as a reminder.

---

### DN/DNB - Move VFO A or B Down

**SET only** (also pertains to UP/UPB)

```text
SET: DN;   or   DNB;   or   DNn;   or   DNBn;
```

`DN;` and `DNn;` move VFO A down. `DNB;` and `DNBn;` move VFO B down. `DN;` and `DNB;` also change parameters shown on VFO B (menu or switch settings).

| Value of n      | VFO Displacement |
| --------------- | ---------------- |
| 0               | 1 Hz             |
| 1 (or not used) | 10 Hz            |
| 2               | 20 Hz            |
| 3               | 50 Hz            |
| 4               | 1 kHz            |
| 5               | 2 kHz            |
| 6               | 3 kHz            |
| 7               | 5 kHz            |
| 8               | 100 Hz           |
| 9               | 200 Hz           |

**Note:** If the VFOs are linked (non-SPLIT), `DN;` and `DNn;` set VFO B to the same frequency as VFO A.

---

### DS - VFO A and Basic Icon Read

**GET only**

```text
GET: DS;
RSP: DSttttttttaf;
```

Returns everything needed to reproduce the contents of the VFO A display, as well as a basic subset of the LCD icons (also see `IC` command).

| Field      | Description                                                 |
| ---------- | ----------------------------------------------------------- |
| `tttttttt` | LCD text and decimal point data (8 bytes, values 0x30-0xFF) |
| `a`        | Icon data (1 byte)                                          |
| `f`        | Icon flash data or additional K3 icon data (1 byte)         |

**Text and decimal point data:** The first byte is the left-most displayed character. Bit 7 (MSB) of each byte indicates whether the decimal point to the left of each character is on (1) or off (0). The other bits contain an ASCII character.

**Table 3: DS response character conversions (bit 7 cleared)**

| DS chr. | Converts to   | DS chr. | Converts to | DS chr. | Converts to      |
| ------- | ------------- | ------- | ----------- | ------- | ---------------- |
| `<`     | small-caps L  | `M`     | N           | `Z`     | lowercase c      |
| `>`     | dash          | `Q`     | O           | `[`     | r-bar            |
| `@`     | space (blank) | `V`     | U           | `\`     | lambda           |
| `K`     | H             | `W`     | I           | `]`     | RX/TX EQ level 4 |
|         |               | `X`     | c-bar       | `^`     | RX/TX EQ level 5 |

The menu parameters for MAIN:RX EQ / TX EQ consist of 8 mini bar-graphs with 5 possible levels. These show up as the following characters in the DS response string (level 1 through 5): `_`, `=`, `>`, `]`, and `^`.

**Icon data (byte `a`):** Value between 0x80 and 0xFF. Bit 7 is always 1.

| Bit | Description                        |
| --- | ---------------------------------- |
| B7  | Always 1                           |
| B6  | 1=NB on                            |
| B5  | 1=ANT2 selected                    |
| B4  | 1=PREAMP on                        |
| B3  | 1=ATT on                           |
| B2  | 0=VFO A selected (always 0 for K3) |
| B1  | 1=RIT on                           |
| B0  | 1=XIT on                           |

**Icon flash data / additional K3 icons (byte `f`):** Value between 0x80 and 0xFF. Bit 7 is always 1. In K3 normal mode (K30), the other 7 bits are all 0. In K3 Extended mode (K31):

| Bit | Description        |
| --- | ------------------ |
| B7  | Always 1           |
| B6  | 1=SUB on           |
| B5  | 1=RX ANT on        |
| B4  | 1=ATU on (in-line) |
| B3  | 1=CWT on           |
| B2  | 1=NR on            |
| B1  | 1=NTCH on          |
| B0  | 1=MAN NOTCH on     |

The `IC` command provides extended info about the K3's sub receiver and does not require the use of K31.

---

### DT - DATA Sub-Mode

**GET/SET**

```text
SET/RSP: DTn;
```

| Parameter | Value | Description |
| --------- | ----- | ----------- |
| `n`       | 0     | DATA A      |
| `n`       | 1     | AFSK A      |
| `n`       | 2     | FSK D       |
| `n`       | 3     | PSK D       |

The value returned is the data sub-mode last used with VFO A, whether or not DATA mode is in effect. In Diversity Mode (K3 only), sending `DTn` matches the sub receiver's mode to the main receiver's.

**Notes:**

1. Use DT only when the transceiver is in DATA mode; otherwise, the returned value may not be valid.
2. In AI2/3 modes, changing the data sub-mode results in both FW and IS responses.
3. The present data sub-mode is also reported as part of the IF command (requires K31).

---

### DV - Diversity Mode

**GET/SET**

```text
SET/RSP: DVn;
```

| Parameter | Value | Description                                      |
| --------- | ----- | ------------------------------------------------ |
| `n`       | 0     | Diversity mode OFF                               |
| `n`       | 1     | Diversity mode ON                                |
| `n`       | S     | Toggle both sub RX and diversity on/off together |

**K3 only;** requires sub receiver. Turning the sub off also cancels diversity mode. Also see: `LN` (VFO A/B link) and `SB` (sub receiver on/off).

---

### EL - Error Logging

**SET only; KX3/KX2 only**

```text
SET: ELn;
```

| Parameter | Value | Description       |
| --------- | ----- | ----------------- |
| `n`       | 0     | Error logging OFF |
| `n`       | 1     | Error logging ON  |

When error logging is ON, the radio will report all "ERR xxx" messages and general warnings (e.g. "HiTemp->5W;") to an attached PC.

---

### ES - ESSB Mode

**GET/SET**

```text
SET/RSP: ESn;
```

| Parameter | Value | Description   |
| --------- | ----- | ------------- |
| `n`       | 0     | ESSB mode OFF |
| `n`       | 1     | ESSB mode ON  |

**Note:** The application must place the K3 in either LSB or USB mode for the ESSB ON condition to be relevant.

---

### FA and FB - VFO A/B Frequency

**GET/SET**

```text
SET/RSP: FAxxxxxxxxxxx;   or   FBxxxxxxxxxxx;
```

| Parameter     | Description                 |
| ------------- | --------------------------- |
| `xxxxxxxxxxx` | Frequency in Hz (11 digits) |

**Example:** `FA00014060000;` sets VFO A to 14060 kHz.

The Hz digit is ignored if the K3 is not in FINE mode (1-Hz tuning; use `SWT49`). If the specified frequency is in a different amateur band than the present one, the K3 will change to the new band.

**Notes:**

1. Band changes typically take 0.5 seconds; all command handling is deferred until this process is complete.
2. If the specified frequency is over 30 MHz and is within a valid transverter band, the K3 will switch to that transverter band. If the specified frequency is outside the range of 500 kHz-30 MHz and 48-54 MHz, the K3 will switch to the amateur band closest to the requested one. (KSYN3A extends low range to 100 kHz.)
3. If the VFOs are linked (non-SPLIT), FA also sets VFO B to the same frequency as VFO A.

---

### FI - I.F. Center Frequency

**GET only; K3/K3S only**

```text
RSP: Finnnn;
```

| Parameter | Description                                                   |
| --------- | ------------------------------------------------------------- |
| `nnnn`    | Last 4 digits of the K3's present I.F. center frequency in Hz |

**Example:** If `nnnn` = 5000, the I.F. center frequency is 8,215,000 Hz. Intended for use with panadapters, which need to keep track of the exact I.F. center frequency as filter bandwidths and shifts are changed. Not applicable to the KX3/KX2.

---

### FR - RX VFO Assignment and SPLIT Cancel

**GET/SET**

```text
SET/RSP: FRn;
```

| Parameter | Description                                                       |
| --------- | ----------------------------------------------------------------- |
| `n`       | Ignored in the K3 case because VFO A is always active for receive |

Any FR SET cancels SPLIT mode.

---

### FT - TX VFO Assignment and Optional SPLIT Enable

**GET/SET**

```text
SET/RSP: FTn;
```

| Parameter | Value | Description                       |
| --------- | ----- | --------------------------------- |
| `n`       | 0     | VFO A for transmit                |
| `n`       | 1     | VFO B for transmit (enters SPLIT) |

If B (1) is selected for transmit, the K3 will enter SPLIT (except when split is N/A). Use `FR0;` to cancel SPLIT.

---

### FW $ - Filter Bandwidth and Number

**GET/SET**

**NOTE:** FW is a legacy K2 command with side-effects based on the K3x and K2x meta command settings. For the KX3, KX2, and K3, use `BW` if possible. Also use `BW` in switch macros.

**K3 Extended SET/RSP format (K31):**

```text
FWxxxx;
```

| Parameter | Range  | Description              |
| --------- | ------ | ------------------------ |
| `xxxx`    | 0-9999 | Bandwidth in 10-Hz units |

May be quantized and/or range limited based on the present operating mode.

**Basic and K2 Extended formats:** See KIO2 Programmer's Reference (K2). In K22 mode, direct selection of crystal filters is possible by adding a 5th digit (K2 and K3 only). However, K31 must not be in effect, or it will override the legacy K2 behavior.

Example to select filter #3:

```text
K30;K22;FW00003;K20;K31;
```

**Notes:**

1. In AI2/3 modes, moving the physical WIDTH control results in both FW and IS responses.
2. In diversity mode, FW matches the sub receiver's filter bandwidth to the main receiver's.
3. Both FW and FW$ can be used in BSET mode (exception: FW/FW$ SET cannot be used in BSET mode with diversity receive in effect).
4. In K22 mode, a legacy 6th digit is added to the response (always 0).
5. If a KX3/KX2 is in DUAL RX (dual watch) mode, FW$ returns the value for FW.

---

### GT - AGC Time Constant

**GET/SET**

**Basic SET/RSP format:**

```text
GTnnn;
```

| Parameter | Value | Description |
| --------- | ----- | ----------- |
| `nnn`     | 002   | Fast AGC    |
| `nnn`     | 004   | Slow AGC    |

**K2 Extended SET/RSP format (K22):**

```text
GTnnnx;
```

| Field | Value | Description |
| ----- | ----- | ----------- |
| `x`   | 0     | AGC off     |
| `x`   | 1     | AGC on      |

**Note:** AGC time constant is stored per-mode, as is AGC on/off and VFO tuning rate.

---

### IC - Misc. Icons and Status

**GET only**

```text
RSP: ICabcde;
```

Where `abcde` are 8-bit ASCII characters used as collections of flags. Each flag represents the status of an LCD icon and/or a specific transceiver function. The 8th bit (B7) of each byte is always 1 to ensure that control characters are not sent to the computer.

**Table 4: IC response fields**

**Byte a (Misc)**

| Bit | Description                                              |
| --- | -------------------------------------------------------- |
| B7  | Always 1                                                 |
| B6  | 1=BSET, 0=Normal                                         |
| B5  | 1=TX TEST, 0=Normal                                      |
| B4  | 1=mW power level (xvtr or KXV3 test), 0=normal power out |
| B3  | 0=MSG bank 1, 1=MSG bank 2                               |
| B2  | 1=MSG is playing, 0=no MSG playing                       |
| B1  | 1=CONFIG:MEM0-9 = BAND SEL                               |
| B0  | Preset #: 0=I, 1=II                                      |

**Byte b (Sub RX)**

| Bit | Description                                                   |
| --- | ------------------------------------------------------------- |
| B7  | Always 1                                                      |
| B6  | 1=VFOs linked (VFO A tunes both) (K3 only)                    |
| B5  | 1=VFO A/B bands are independent                               |
| B4  | 1=Diversity mode (K3 only)                                    |
| B3  | 1=Sub ant. = MAIN, 0=Sub ant. = AUX (K3 only)                 |
| B2  | Sub RX aux source: 1=BNC (AUX RF), 0=non-TX ATU ant (K3 only) |
| B1  | 1=Sub RX NB is on, 0=Off (K3 only)                            |
| B0  | 1=Sub RX is on (dual watch in KX3/KX2)                        |

**Byte c (CW/DATA)**

| Bit | Description                              |
| --- | ---------------------------------------- |
| B7  | Always 1                                 |
| B6  | 1=Full QSK, 0=Semi QSK                   |
| B5  | 1=Dual-passband CW or APF in use         |
| B4  | 1=VOX on for CW, FSK-D, or PSK-D         |
| B3  | 1=Dual-tone FSK filter in use            |
| B2  | 1=Normal FSK TX polarity, 0=inverted     |
| B1  | 1=Sync DATA, 0=Normal                    |
| B0  | 1=Text-to-terminal is in effect (see TT) |

**Byte d (Voice Modes)**

| Bit | Description                       |
| --- | --------------------------------- |
| B7  | Always 1                          |
| B6  | 1=VOX on in voice, DATA A, AFSK A |
| B5  | 1=ESSB, 0=Normal                  |
| B4  | 1=Noise gate on, 0=Off            |
| B3  | 1=AM Sync RX, 0=Normal            |
| B2  | 1=FM PL tone on, 0=Off            |
| B1  | 1=(+) Rptr TX offset              |
| B0  | 1=(-) Rptr TX offset              |

**Byte e (Misc)**

| Bit | Description                                      |
| --- | ------------------------------------------------ |
| B7  | Always 1                                         |
| B6  | 1=10 Hz SHIFT, 0=50 Hz SHIFT                     |
| B5  | 1=AM Sync USB, 0=AM Sync LSB                     |
| B4  | 1=Main RX is squelched                           |
| B3  | 1=Sub RX is squelched (K3 only)                  |
| B2  | 1=Sub RX NR is on, 0=Off (K3 only)               |
| B1  | 1=OFS LED is on, 0=VFOB LED is on (KX3/KX2 only) |
| B0  | 1=Fast Play in effect (KX3/KX2 only)             |

**Notes:**

- If BSET is in effect (byte a, bit 6=1), the values of some other flags may change or may be invalid. The application should examine this bit first.
- Per-mode or per mode-group items (e.g., MSG bank # is stored separately for CW/FSK-D/PSK-D and voice/DATA-A/AFSK-A).

---

### ID - Transceiver Identifier

**GET only**

```text
RSP: IDnnn;
```

| Parameter | Value | Description               |
| --------- | ----- | ------------------------- |
| `nnn`     | 017   | K3/K3S/KX3/KX2 identifier |

This command is provided only for compatibility with existing software. New or modified software should send the `K3` command to the transceiver. If a `K3n;` response is received, the computer must be connected to a K3, KX3, or KX2. The K3, KX3, and KX2 can be differentiated from each other using the `OM` command.

---

### IF - Transceiver Information

**GET only**

```text
RSP: IF[f]*****+yyyyrx*00tmvspbd1*;
```

| Field  | Description                                                                              |
| ------ | ---------------------------------------------------------------------------------------- |
| `[f]`  | Operating frequency, excluding any RIT/XIT offset (11 digits; see FA command format)     |
| `*`    | Space (BLANK, ASCII 0x20)                                                                |
| `+`    | Either "+" or "-" (sign of RIT/XIT offset)                                               |
| `yyyy` | RIT/XIT offset in Hz (range is -9999 to +9999 Hz when computer-controlled)               |
| `r`    | 1 if RIT is on, 0 if off                                                                 |
| `x`    | 1 if XIT is on, 0 if off                                                                 |
| `t`    | 1 if the K3 is in transmit mode, 0 if receive                                            |
| `m`    | Operating mode (see MD command)                                                          |
| `v`    | Receive-mode VFO selection: 0 for VFO A, 1 for VFO B                                     |
| `s`    | 1 if scan is in progress, 0 otherwise                                                    |
| `p`    | 1 if the transceiver is in split mode, 0 otherwise                                       |
| `b`    | Basic: always 0; K22: 1 if present IF response is due to a band change                   |
| `d`    | Basic: always 0; K31: DATA sub-mode if applicable (0=DATA A, 1=AFSK A, 2=FSK D, 3=PSK D) |

The fixed-value fields (space, 0, and 1) are provided for syntactic compatibility with existing software.

---

### IO - Internal Use Only

**KX3/KX2 only**

SET/RSP format: TBD.

---

### IS - I.F. Shift

**GET/SET**

```text
SET/RSP: IS*nnnn;
```

| Field  | Description                    |
| ------ | ------------------------------ |
| `*`    | Must be a space (blank)        |
| `nnnn` | AF center frequency (Fc) in Hz |

The SET value may be altered based on the present mode; a subsequent IS GET reports the value used. The nominal Fc (i.e., with no SHIFT) varies with mode, and in CW or DATA modes will also vary with PITCH. To center the passband, send `IS 9999;`. A subsequent IS read will then return the center frequency.

**Notes:**

- In AM-Sync mode, send `IS 1400` / `IS 1600` to shift to LSB / USB. An IS GET will return IS 1500 in AM-Sync because AF Fc remains at 1500 Hz. To determine which sideband is in use for AM sync, see the `IC` command.
- In AI2/3 modes, moving the physical SHIFT control results in both IS and FW responses.
- In diversity mode, an IS command also shifts the sub receiver.
- IS is not applicable to FM mode or QRQ CW mode.

---

### K2 - K2 Command Mode

**GET/SET**

```text
SET/RSP: K2n;
```

| Parameter | Range | Description                         |
| --------- | ----- | ----------------------------------- |
| `n`       | 0-3   | K2 mode (see Meta-commands section) |

If non-zero, enables K2 command extensions to legacy "2-letter" commands. In most cases the effects of the K2 command are independent from those of the K3 command, and the two can both be non-zero at the same time. The FW command is an exception.

---

### K3 - K3 Command Mode

**GET/SET**

```text
SET/RSP: K3n;
```

| Parameter | Range | Description                         |
| --------- | ----- | ----------------------------------- |
| `n`       | 0-1   | K3 mode (see Meta-commands section) |

If `n` is 1, enables K3-specific command extensions to legacy "2-letter" commands. Not needed for new commands that are unique to the K3.

---

### KS - Keyer Speed

**GET/SET**

```text
SET/RSP: KSnnn;
```

| Parameter | Range   | Description             |
| --------- | ------- | ----------------------- |
| `nnn`     | 008-050 | Speed in WPM (8-50 WPM) |

---

### KY - CW or CW-to-DATA Keying from Text

**GET/SET**

```text
SET: KY*[text];
```

| Field    | Description                                                                                                                           |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `*`      | Normally a BLANK. If `W` (for "wait"), processing of following host commands will be delayed until the current message has been sent. |
| `[text]` | 0 to 24 characters                                                                                                                    |

**Basic RSP format:**

```text
KYn;
```

| Value   | Description             |
| ------- | ----------------------- |
| `n` = 0 | CW text buffer not full |
| `n` = 1 | Buffer full             |

**K2 Extended RSP format (K22):**

| Value   | Description                                                         |
| ------- | ------------------------------------------------------------------- |
| `n` = 0 | Buffer < 75% full                                                   |
| `n` = 1 | Buffer > 75% full                                                   |
| `n` = 2 | Buffer completely empty AND transmit of previous string is complete |

**Prosign mappings:**

| Character | Prosign |
| --------- | ------- |
| `(`       | KN      |
| `+`       | AR      |
| `=`       | BT      |
| `%`       | AS      |
| `*`       | SK      |
| `!`       | VE      |

**Special characters:**

| Character            | Function                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `<`                  | Puts the K3 into TX TEST mode, until a `>` character is received                               |
| `>`                  | Returns the K3 to TX NORM mode                                                                 |
| `@`                  | Normally terminates any CW message; can be changed to prosign for "at" sign via CONFIG:CW WGHT |
| `^D` (EOT, ASCII 04) | Quickly terminates transmission; use with CW-to-DATA                                           |

---

### LK $ - VFO Lock

**GET/SET**

```text
SET/RSP: LKn;
```

| Parameter | Value | Description  |
| --------- | ----- | ------------ |
| `n`       | 0     | VFO unlocked |
| `n`       | 1     | VFO locked   |

---

### LN - Link VFOs

**GET/SET; K3/K3S only**

```text
SET/RSP: LNn;
```

| Parameter | Value | Description   |
| --------- | ----- | ------------- |
| `n`       | 0     | VFOs unlinked |
| `n`       | 1     | VFOs linked   |

---

### MC - Memory Channel

**GET/SET**

```text
SET/RSP: MCnnn;
```

| Parameter | Range   | Description                                          |
| --------- | ------- | ---------------------------------------------------- |
| `nnn`     | 000-099 | Regular memories                                     |
| `nnn`     | 100+    | Per-band quick memories: 100 + bandNum \* 4 + Mn - 1 |

For `bandNum`, see `BN`. `Mn` is 1-4 (M1-M4 tap).

**Notes:**

1. A SET is ignored if the target memory is invalid.
2. K3 only: If CONFIG:MEM0-9 = BAND SEL, then memories 000-009 will recall the last-used VFO frequencies in the target band, not fixed frequencies.
3. Switching to any regular memory (000-099) updates the K3's default V>M / M>V memory number.
4. Switching to any memory tagged with `*` as the first character in its label enables channel-hop scanning.

---

### MD $ - Operating Mode

**GET/SET**

```text
SET/RSP: MDn;   or   MD$n;
```

| Parameter | Value | Mode     |
| --------- | ----- | -------- |
| `n`       | 1     | LSB      |
| `n`       | 2     | USB      |
| `n`       | 3     | CW       |
| `n`       | 4     | FM       |
| `n`       | 5     | AM       |
| `n`       | 6     | DATA     |
| `n`       | 7     | CW-REV   |
| `n`       | 9     | DATA-REV |

**Notes:**

1. K3 only: In Diversity Mode, sending `MDn;` sets both main and sub mode.
2. DATA and DATA-REV select the data sub-mode that was last in effect on the present band (use `DT` to read/set data sub-mode).
3. In K2 command modes 1 and 3 (K21 and K23), the RSP message converts modes 6 and 7 (DATA and DATA-REV) to modes 1 and 2 (LSB and USB).
4. If a KX3/KX2 is in DUAL RX (dual watch) mode, MD$ returns the value for MD.
5. FM mode does not apply to the KX2.

---

### MG - Mic Gain

**GET/SET**

```text
SET/RSP: MGxxx;
```

| Parameter | Range   | Description    |
| --------- | ------- | -------------- |
| `xxx`     | 000-060 | Mic gain level |

---

### ML - Monitor Level

**GET/SET**

```text
SET/RSP: MLxxx;
```

| Parameter | Range   | Description   |
| --------- | ------- | ------------- |
| `xxx`     | 000-060 | Monitor level |

Applies to current mode (CW sidetone, voice, or data). In voice modes, applies to MON level, even if DVR monitor level is independent (MAIN:TX DVR).

---

### MN - Menu Selection

**GET/SET; K3, KX3, and KX2 variants**

```text
SET/RSP: MNnnn;
```

Where `nnn` is the menu entry number. MN255 is returned if the menu is not in use. MN commands can be sent in any order. To exit the menu, send `MN255`. To change the parameter, use `UP` / `DN` (or `MP` and `MQ` commands).

**Important:** TECH MD menu entry must be set to ON to access tech-mode menu entries; otherwise MN will skip these entries. Use `MN072` to access the TECH MD menu entry. On the KX3/KX2, tech-mode parameters are locked by default when accessed at the radio, but are automatically unlocked when accessed via the MN/MP/MQ commands.

#### Table 5: K3 MN Values

Items marked with `+` can be read/set using the MP command. Items marked `*` have been removed from the K3 menu (ID number preserved for backwards compatibility). `md` is the data mode pertaining to a menu entry: CW, SB (LSB/USB), DT (DATA), AM, or FM. `pwr` is LP (QRP), HP (QRO), or MW (milliwatt).

| Entry     | nnn | Entry     | nnn | Entry     | nnn | Entry     | nnn |
| --------- | --- | --------- | --- | --------- | --- | --------- | --- |
| ALARM     | 000 | DATE MD   | 030 | SMTR MD   | 060 | XVx RF    | 090 |
| IAMBIC    | 001 | DDS FRQ   | 031 | AGC-F     | 061 | XVx IF    | 091 |
| LCD ADJ + | 002 | LIN OUT + | 032 | REF CAL   | 062 | XVx PWR   | 092 |
| LCD BRT + | 003 | KIO3      | 033 | SQ MAIN   | 063 | XVx OFS   | 093 |
| LED BRT + | 004 | ADC REF   | 034 | SQ SUB    | 064 | XVx ADR   | 094 |
| MSG RPT + | 005 | RFI DET   | 035 | SMTR OF   | 065 | AF GAIN   | 095 |
| PADDLE    | 006 | KDVR3     | 036 | SMTR SC   | 066 | TX ESSB   | 096 |
| RPT OFS + | 007 | AGC-S     | 037 | SMTR PK   | 067 | SPKR+PH   | 097 |
| RX EQ     | 008 | FLx BW    | 038 | SPLT SV   | 068 | VFO B->A  | 098 |
| TX EQ     | 009 | FLx FRQ   | 039 | SPKRS     | 069 | AGC PLS   | 099 |
| VOX GN    | 010 | FLx GN    | 040 | SW TEST   | 070 | RIT CLR   | 100 |
| ANTIVOX   | 011 | FLx ON    | 041 | SW TONE   | 071 | TX GATE   | 101 |
| WEIGHT    | 012 | FLTX md   | 042 | TECH MD   | 072 | MEM 0-9   | 102 |
| 2 TONE    | 013 | FP TEMP   | 043 | TIME      | 073 | PTT KEY   | 103 |
| AFV TIM   | 014 | FSK POL   | 044 | AGC THR + | 074 | VFO CRS   | 104 |
| MIC+LIN   | 015 | AUTOINF   | 045 | PTT RLS   | 075 | AFX MD +  | 105 |
| TX DLY    | 016 | KBPF3     | 046 | BND MAP   | 076 | SIG RMV   | 106 |
| AGC SLP   | 017 | AF LIM    | 047 | TTY LTR   | 077 | AFSK TX   | 107 |
| FM MODE   | 018 | KNB3 \*   | 048 | TX ALC    | 078 | AGC DCY   | 108 |
| DIGOUT1 + | 019 | KRC2 AC   | 049 | TXGN pwr  | 079 | PB CTRL   | 109 |
| AGC HLD   | 020 | KRX3      | 050 | SUB AF    | 080 | MACRO x   | 110 |
| FM DEV    | 021 | KXV3      | 051 | PWR SET   | 081 | L-MIX-R + | 111 |
| EXT ALC   | 022 | LCD TST   | 052 | MIC BTN   | 082 | CW QRQ    | 112 |
| KAT3 +    | 023 | MIC SEL   | 053 | VCO MD +  | 083 | TX DVR    | 113 |
| BAT MIN   | 024 | NB SAVE   | 054 | VFO CTS   | 084 | TX MON    | 114 |
| TX INH    | 025 | KPA3 +    | 055 | VFO FST   | 085 | DUAL PB   | 115 |
| SER NUM   | 026 | PA TEMP   | 056 | VFO IND   | 086 | VFO LNK   | 116 |
| TXG VCE   | 027 | RS232     | 057 | VFO OFS   | 087 | ATTEN +   | 117 |
| FW REVS   | 028 | TUN PWR + | 058 | WMTR pwr  | 088 | PREAMP2   | 118 |
| DATE      | 029 | SYNC DT   | 059 | XVx ON    | 089 | Exit Menu | 255 |

#### Table 6: KX3 MN Values

Items marked with `+` can be read/set using the MP command (or MQ in the case of TXCRNUL). `nnn` is permanently associated with a menu entry, even if entries are moved.

| Entry     | nnn | Entry      | nnn | Entry     | nnn | Entry     | nnn |
| --------- | --- | ---------- | --- | --------- | --- | --------- | --- |
| ALARM +   | 000 | AUTOINF +  | 045 | MIC BTN + | 082 | CW KEY1 + | 120 |
| CW IAMB + | 001 | AF LIM +   | 047 | VFO CTS + | 084 | CW KEY2 + | 121 |
| MSG RPT + | 005 | LCD TST    | 052 | VFO OFS + | 087 | VOX INH + | 122 |
| RPT OFS + | 007 | RS232      | 057 | WATTMTR + | 088 | RX I/Q +  | 123 |
| RX EQ     | 008 | TUN PWR +  | 058 | XVx ON    | 089 | RX ISO +  | 124 |
| TX EQ     | 009 | SMTR MD +  | 060 | XVx RF    | 090 | RXSBNUL + | 125 |
| VOX GN +  | 010 | REF CAL    | 062 | XVx IF    | 091 | AM MODE + | 126 |
| CW WGHT + | 012 | SW TEST    | 070 | XVx PWR   | 092 | TXSBNUL + | 127 |
| 2 TONE    | 013 | SW TONE +  | 071 | XVx OFS   | 093 | AGC MD +  | 128 |
| TX DLY +  | 016 | TECH MD +  | 072 | XVx ADR   | 094 | AGC SPD + | 129 |
| FM MODE + | 018 | TIME       | 073 | TX ESSB + | 096 | TX BIAS   | 130 |
| FM DEV +  | 021 | AGC THR +  | 074 | VFO B->A  | 098 | TX GAIN   | 131 |
| ATU MD +  | 023 | BND MAP +  | 076 | TX GATE + | 101 | TXCRNUL + | 132 |
| BAT MIN + | 024 | SER NUM    | 026 | VFO CRS + | 104 | AUTOOFF + | 133 |
| FW REVS   | 028 | FW REVS    | 028 | AFX MD +  | 105 | RX XFIL + | 134 |
| MACRO x   | 110 | ATU DATA + | 112 | VFO NR +  | 119 | MICBIAS + | 135 |
| PREAMP +  | 136 | BAT CHG +  | 137 | BKLIGHT + | 138 | COR LVL + | 139 |
| DUAL RX + | 140 | ACC2 IO +  | 141 | RX SHFT + | 142 | RX NR +   | 143 |
| PBT SSB + | 144 | LED BRT +  | 145 | PA MODE + | 146 | 2M MODE + | 147 |
| Exit Menu | 255 |            |     |           |     |           |     |

#### Table 6A: KX2 MN Values

Items marked with `+` can be read/set using the MP command (or MQ in the case of TXCRNUL). Items marked with `*` are new KX2-specific menu entries not present in the KX3.

| Entry       | nnn | Entry        | nnn | Entry      | nnn | Entry       | nnn |
| ----------- | --- | ------------ | --- | ---------- | --- | ----------- | --- |
| CW IAMB +   | 001 | AUTOINF +    | 045 | MIC BTN +  | 082 | CW KEY1 +   | 120 |
| MSG RPT +   | 005 | AF LIM +     | 047 | WATTMTR +  | 088 | CW KEY2 +   | 121 |
| RX EQ       | 008 | LCD TST      | 052 | XVx ON     | 089 | VOX INH +   | 122 |
| TX EQ       | 009 | RS232        | 057 | XVx RF     | 090 | RX I/Q +    | 123 |
| VOX GN +    | 010 | TUN PWR +    | 058 | XVx IF     | 091 | RXSBNUL +   | 125 |
| CW WGHT +   | 012 | SMTR MD +    | 060 | XVx PWR    | 092 | AM MODE +   | 126 |
| 2 TONE      | 013 | REF CAL      | 062 | XVx OFS    | 093 | TXSBNUL +   | 127 |
| TX DLY +    | 016 | SW TEST      | 070 | TX GATE +  | 101 | AGC MD +    | 128 |
| ATU MD +    | 023 | SW TONE +    | 071 | VFO CRS +  | 104 | AGC SPD +   | 129 |
| BAT MIN +   | 024 | TECH MD +    | 072 | AFX MD +   | 105 | TX BIAS     | 130 |
| SER NUM     | 026 | TIME         | 073 | ATU DATA + | 112 | TX GAIN     | 131 |
| FW REVS     | 028 | AGC THR +    | 074 | LED BRT +  | 145 | TXCRNUL +   | 132 |
| BKLIGHT +   | 138 | COR LVL +    | 139 | DUAL RX +  | 140 | AUTOOFF +   | 133 |
| PA MODE +   | 146 | MICBIAS +    | 135 | PITCH + \* | 148 | ALT MD \*   | 149 |
| CWT \*      | 150 | AMP HRS \*   | 151 | VOX MD \*  | 152 | VOX DLY \*  | 153 |
| TX CMP + \* | 154 | RF GAIN + \* | 155 | XIT \*     | 156 | ANT.X SW \* | 157 |
| KXIO2 \*    | 158 | RTC ADJ \*   | 159 | AUX 1 \*   | 160 | AUX 2 \*    | 161 |
| Exit Menu   | 255 |              |     |            |     |             |     |

---

### MP - 8-bit Direct Menu Parameter Access

**GET/SET**

```text
SET/RSP: MPnnn;
```

| Parameter | Range | Description                                                         |
| --------- | ----- | ------------------------------------------------------------------- |
| `nnn`     | 0-255 | Parameter value (useful range determined by the present menu entry) |

Only menu entries marked with `+` in Table 5, 6, or 6A can be accessed with MP, while others will return `?;` (use `UP` / `DN`, `DS`, and `SWT`/`SWH` in such cases). There is no range checking with MP in most cases, so the user's macro or application must verify the correct range.

**MP Command Special Cases (KX3 and KX2 only):**

For some menu entries, the MP get/set value pertains only to specific binary bit fields in the 8-bit quantity. For MP SETs, the KX2/3 protects all unrelated bit positions. For MP GETs, the KX2/3 masks off unused bit positions.

| Menu Entry         | Bit Field                                                                                     | Description                             |
| ------------------ | --------------------------------------------------------------------------------------------- | --------------------------------------- |
| AGC MD             | bit0                                                                                          | on/off                                  |
| AGC SPD            | bit1                                                                                          | slow/fast                               |
| ALARM (KX3 only)   | bit4                                                                                          | on/off                                  |
| AM MODE            | bit6                                                                                          | disabled/enabled                        |
| ATU DATA           | bit3                                                                                          | SET1(0)/SET2(1)                         |
| ATU MODE           | When ATU.X is in effect (KXAT100 mode), MP is GET-only. KX2: L8/C8 do not apply to the KXAT2. |                                         |
| BND MAP (KX3 only) | bit5                                                                                          | in/out                                  |
| CW IAMB            | bit7                                                                                          | modeA/modeB                             |
| CW KEY1            | bit0=tip is dot/dash; bit1=paddle/hand-key                                                    |                                         |
| CW KEY2            | bit4=tip is dot/dash; bit5=paddle/hand-key                                                    |                                         |
| DUAL RX            | bit4                                                                                          | off/on                                  |
| FM MODE            | bit7                                                                                          | disabled/enabled                        |
| MIC BIAS           | bit4                                                                                          | off/on                                  |
| MIC BTN            | bit0=PTT disabled/enabled; bit2=UP/DN buttons disabled/enabled                                |                                         |
| PBT SSB (KX3 only) | bit7                                                                                          | lohicut/nor (nor=width-shift)           |
| PREAMP (KX3 only)  | bit0=10dB, bit1=20dB, both=30dB                                                               |                                         |
| RX I/Q (KX3 only)  | bit2                                                                                          | off/on                                  |
| RX SHFT (KX3 only) | bit0                                                                                          | nor/8.0 kHz                             |
| RX XFIL (KX3 only) | bit1                                                                                          | KXFL3 not installed/installed           |
| SMTR MD (KX3 only) | bit7                                                                                          | nor (relative)/absolute                 |
| SW TONE            | bits0-2=CW feedback speed in WPM; bit6=CW UI off/on; bit7=tones off/on                        |                                         |
| TECH MD            | bit2                                                                                          | off/on                                  |
| TX ESSB (KX3 only) | bit0                                                                                          | off/on                                  |
| TX GATE            | bit1                                                                                          | off/on                                  |
| VFO CRS            | bits2-3                                                                                       | one of up to 4 coarse-tuning selections |
| VFO NR (KX3 only)  | bit5                                                                                          | on/off                                  |
| VFO OFS (KX3 only) | bit0                                                                                          | coarse offset control disabled/enabled  |

---

### MQ - 16-bit Direct Menu Parameter Access

**GET/SET; KX3/KX2 only**

```text
SET/RSP: MQnnnnn;
```

| Parameter | Range   | Description            |
| --------- | ------- | ---------------------- |
| `nnnnn`   | 0-65535 | 16-bit parameter value |

Applies only to the TXCRNUL menu entry at present.

---

### NB $ - Noise Blanker On/Off

**GET/SET**

```text
SET/RSP: NBn;   or   NB$n;
```

| Parameter | Value | Description       |
| --------- | ----- | ----------------- |
| `n`       | 0     | Noise blanker OFF |
| `n`       | 1     | Noise blanker ON  |

**Notes:** NB0 always turns the noise blanker off, overriding any non-zero NL settings. In K2 extended mode, an additional '0' is appended to the NB response for legacy format compatibility.

---

### NL $ - DSP and IF Noise Blanker Level

**GET/SET**

```text
SET/RSP: NLddii;   or   NL$ddii;
```

| Field | Range | Description           |
| ----- | ----- | --------------------- |
| `dd`  | 00-21 | DSP NB level          |
| `ii`  | 00-21 | IF NB level (K3 only) |

For the K3's DSP or IF blanker, 00 effectively turns that blanker off, even if NB1 is in effect. For the DSP blanker on the K3, 01 = setting t1-1, 02 = t1-2, etc. For the KX3/KX2 DSP blanker, 01 = level 1, etc. For the IF blanker (K3 only), 01 = NAR1, 02 = NAR2, etc.

---

### OM - Option Module Query

**GET only; K3S, K3, KX3, and KX2 variants**

**K3/K3S RSP format:**

```text
OM APXSDFfLVR--;
```

Characters, if present, indicate installed and detected option modules. Positions are fixed. If a module is not present, its letter is replaced by a dash (`-`).

**K3/K3S Option modules:**

| Letter | Module                                                               |
| ------ | -------------------------------------------------------------------- |
| A      | ATU (KAT3A)                                                          |
| P      | PA (KPA3A)                                                           |
| X      | XVTR and RX I/O (KXV3, KXV3A, or KXV3B)                              |
| S      | Sub Receiver (KRX3A)                                                 |
| D      | DVR (KDVR3)                                                          |
| F      | Band-Pass Filter module, main (KBPF3A)                               |
| f      | Band-Pass Filter module, sub (KBPF3A)                                |
| L      | Low-Noise Amplifier available on present band (preamp 2, KXV3B only) |
| V      | KSYN3A synthesizer (extends VFO tuning range)                        |
| R      | K3S RF board                                                         |

**Note 1:** The presence of `R` in the string (K3S RF board) is the preferred way to identify a K3S.

**Note 2:** Presence of a KSYN3A (`V`) extends VFO tuning range down to 100 kHz. Use of frequencies below 160 meters requires a KBPF3 option module.

**KX3 and KX2 RSP format:**

```text
OM APF---TBXI0n;
```

Where `0n` is the product identifier: n=1 for KX2, n=2 for KX3.

**KX3/KX2 Option modules:**

| Letter | Module                                                  |
| ------ | ------------------------------------------------------- |
| A      | ATU (KXAT3 or KXAT2)                                    |
| P      | External 100-W PA (KXPA100)                             |
| F      | Roofing filter (KXFL3)                                  |
| T      | External 100-W ATU (KXAT100, a KXPA100 internal option) |
| B      | Internal NiMH battery-charger/real-time clock (KXBC3)   |
| X      | KX3-2M or KX3-4M transverter module                     |
| I      | KXIO2 RTC I/O module                                    |

---

### PA $ - Receive Preamp Control

**GET/SET**

```text
SET/RSP: PAn;   or   PA$n;
```

| Parameter | Value | Description                                          |
| --------- | ----- | ---------------------------------------------------- |
| `n`       | 0     | Preamp OFF                                           |
| `n`       | 1     | Preamp ON                                            |
| `n`       | 2     | Preamp 2 on the KXV3B module (requires KXV3B option) |

**Notes:**

1. The main receiver's preamp setting is saved per-RX ANT state. This is not the case for the sub receiver.
2. Preamp 2 is available on 12/10/6 meters only, and must be enabled individually on each band using the KXV3B menu entry. If the LNA is enabled on the present band, an `L` will appear in the OM response.
3. Preamp 2 is available for sub receiver use only if the sub is sharing the main antenna path.

---

### PC - Requested Power Output Level

**GET/SET**

**Basic SET/RSP format:**

```text
PCnnn;
```

- **K3:** `nnn` is normally 000-012 (KPA3 not enabled) or 000-110 watts (KPA3 enabled). If byte a, bit 4 of the IC command response is set (indicating CONFIG:KXV3 is set to TEST, or a transverter band with low-level I/O is selected), then the unit is hundreds of a mW, and the available range is 0.00-1.50 mW.
- **KX3/KX2:** If a KXPA100 is not attached, `nnn` is 000-012 on 80-20 m and 000-015 on 160/15-6 m. If a KXPA100 is attached, `nnn` is 000-110.

**K2 Extended SET format (K22):**

```text
PCnnnx;
```

Where `x` controls the 100-W PA stage. In the K3, x=0 sets CONFIG:KPA3 MD to PA BYP, and 1 sets it to PA NOR. In the KX3/KX2, x=0 sets MENU:PA MODE to OFF, and 1 sets it to ON.

**K2 Extended RSP format (K22):** `PCnnnx;` where `nnn` is power, and `x` is 0 (low range) or 1 (high range).

---

### PO - Actual Power Output Level

**GET only; KX3/KX2 only**

```text
RSP: POnnn;
```

| Parameter | Description                                              |
| --------- | -------------------------------------------------------- |
| `nnn`     | Power in tenths of a watt (QRP mode) or watts (QRO mode) |

**Note:** The QRO case only applies if the KXPA100 amplifier is enabled via PA MODE=ON, is connected to the KX3/KX2 via the special control cable, and the PWR level is set to 11 W or higher. The reading is approximate. For a more accurate reading, use the KXPA100's `^PF;` command.

---

### PS - Transceiver Power Status

**GET/SET**

```text
SET/RSP: PSn;
```

| Parameter | Value | Description     |
| --------- | ----- | --------------- |
| `n`       | 1     | Transceiver on  |
| `n`       | 0     | Transceiver off |

**Note:** PS0 turns the transceiver off, but this removes power, so PS1 cannot be used to turn it on. To turn power on, the K3's POWER_ON line (aux I/O jack) must be pulled low by an external device, or it can be turned on manually using the power switch.

---

### RA $ - Receive Attenuator Control

**GET/SET**

```text
SET/RSP: RAnn;   or   RA$nn;
```

- **K3/KX3/KX2:** `nn` is 00 (attenuator OFF) or 01 (attenuator ON, -10 dB).
- **K3S:** `nn` can be the actual value in dB: 00/05/10/15 for the main receiver, and 00/10 for the sub. For backward compatibility, RA01 can also be used to select 10 dB.

**Notes:**

1. K3/K3S: The main receiver's attenuator on/off condition is saved per-RX ANT state. The sub receiver's attenuator setting is not.
2. K3S only: The user's desired main receiver attenuator ON level is saved per-band (5, 10, or 15 dB). A host application can directly set this per-band attenuator ON value using RA while simultaneously turning the attenuator on.

---

### RC - RIT Clear

**SET only**

```text
SET: RC;
```

No data. Sets RIT/XIT offset to zero, even if RIT and XIT are both turned off (the change will be reflected when either RIT or XIT is turned on).

---

### RD - RIT Offset Down One Unit

**SET only**

```text
SET: RD;
```

No data. Moves the RIT/XIT offset down one step, which can be 1, 10, 20, or 50 Hz, depending on the present VFO tuning rate. If the user has selected COARSE VFO tuning, RD moves either 20 or 50 Hz, as specified by CONFIG:VFO FST. The offset change occurs even if RIT and XIT are both turned off. RIT/XIT offset range under computer control is -9.999 to +9.999 kHz. VFO step size is stored per-mode. Use the `IF` command to check the present RIT/XIT offset amount.

---

### RG $ - RF Gain

**GET/SET**

```text
SET/RSP: RGnnn;   or   RG$nnn;
```

| Parameter | Range   | Description   |
| --------- | ------- | ------------- |
| `nnn`     | 000-250 | RF gain level |

On the KX3/KX2, 250 = maximum RF gain (attenuation of 0 dB), and 190 = -60 dB.

---

### RO - RIT/XIT Offset, Absolute

**GET/SET**

```text
SET/RSP: ROsnnnn;
```

| Field  | Description                          |
| ------ | ------------------------------------ |
| `s`    | `+` or `-` (or space in lieu of `+`) |
| `nnnn` | 0000-9999 (offset in Hz)             |

---

### RT - RIT Control

**GET/SET**

```text
SET/RSP: RTn;
```

| Parameter | Value | Description |
| --------- | ----- | ----------- |
| `n`       | 0     | RIT OFF     |
| `n`       | 1     | RIT ON      |

RIT is disabled in QRQ CW mode.

---

### RU - RIT Offset Up One Unit

**SET only**

See `RD` command for details.

---

### RV - Firmware Revisions

**GET only**

```text
GET: RVx;
RSP: RVxNN.NN;
```

| Value of x | Module                 |
| ---------- | ---------------------- |
| M          | MCU                    |
| D          | Main DSP               |
| A          | Aux DSP (K3)           |
| R          | DVR (K3)               |
| F          | Front Panel flash (K3) |

`NN.NN` is the firmware revision, e.g. 02.37. If a module is not present, or an unknown module ID is requested, the revision is normally reported as 99.99. A module that is present but malfunctioning may return 00.00.

---

### RX - Receive Mode

**SET only**

```text
SET: RX;
```

No data. Terminates transmit in all modes, including message play and repeating messages. RX/TX status is available via the `TQ` command and is also included in the IF response.

**Note:** RX is not usable in CW mode in the K2.

---

### SB - Sub Receiver or Dual Watch On/Off

**GET/SET**

```text
SET/RSP: SBn;
```

| Parameter | Value | Description                                    |
| --------- | ----- | ---------------------------------------------- |
| `n`       | 0     | K3 sub receiver off, or KX3/KX2 dual watch off |
| `n`       | 1     | On                                             |

Also see `DV` command (diversity), which can automatically turn the sub on/off when using the DVS form.

---

### SD - QSK Delay

**GET only**

```text
RSP: SDnnnn;
```

| Parameter | Description                             |
| --------- | --------------------------------------- |
| `nnnn`    | Semi-break-in delay in 50-ms increments |

Provided for backwards compatibility with older applications. If the K3 is in full QSK mode, SD will still read the same value even though the actual break-in delay is set to as close to 0 as possible.

---

### SM $ - S-meter Read

**GET only**

**Basic RSP format:**

```text
SMnnnn;
```

| Parameter | Range     | Description             |
| --------- | --------- | ----------------------- |
| `nnnn`    | 0000-0015 | S-meter reading (Basic) |

Examples: S9=6; S9+20=9; S9+40=12; S9+60=15.

**K3 Extended RSP format (K31):**

| Parameter | Range     | Description                |
| --------- | --------- | -------------------------- |
| `nnnn`    | 0000-0021 | S-meter reading (Extended) |

Examples: S9=9; S9+20=13; S9+40=17; S9+60=21.

This command can be used to obtain either the main (`SM`) or sub (`SM$`) S-meter readings. Returns 0000 in transmit mode. Also see `BG` and `BA`.

---

### SMH - High-Resolution S-meter Read

**GET only; K3 only at present**

```text
RSP: SMHnnn;
```

| Parameter | Description                                        |
| --------- | -------------------------------------------------- |
| `nnn`     | Approximate S-meter values: S1=5, S9=40, S9+60=100 |

Max possible value is about 140.

---

### SP - Special Functions

**K3/K3S only (functionally)**

`SPG;` (KX3) returns ADC ground-reference reading, typically `SP000`.

---

### SQ $ - Squelch Level

**GET/SET**

```text
SET/RSP: SQnnn;   or   SQ$nnn;
```

| Parameter | Range   | Description   |
| --------- | ------- | ------------- |
| `nnn`     | 000-029 | Squelch level |

If the K3's CONFIG:SQ MAIN menu entry is set to a numeric value (0-29), then SQ and SQ$ apply to main and sub receivers, respectively, and the SUB RF/SQL pot on the K3 controls SUB RF GAIN. However, if SQ MAIN is set to =SUBPOT, then SQ and SQ$ are linked (either applies to both receivers).

---

### SW - SWR

**GET only**

```text
RSP: SWnnn;
```

| Parameter | Range   | Description                               |
| --------- | ------- | ----------------------------------------- |
| `nnn`     | 010-999 | SWR in tenths of a unit (1.0:1 to 99.9:1) |

The value is updated on any transmit, but not on a band change. SW works during transmit, TUNE, and during ATU tuning.

---

### SWT/SWH - Switch Emulation

**SET only; K3, KX3, and KX2 variants**

```text
SET: SWTnn;   (TAP functions)
SET: SWHnn;   (HOLD functions)
```

Where `nn` is determined from the tables below. Switch emulation commands must sometimes be followed by a delay if successive commands expect the switch function to have been executed.

#### Table 7: K3 Switch Identifiers

| TAP      | HOLD     | nn  | TAP              | HOLD        | nn  | TAP      | HOLD     | nn  |
| -------- | -------- | --- | ---------------- | ----------- | --- | -------- | -------- | --- |
| BAND-    | VOX      | 09  | FREQ ENT         | SCAN        | 41  | CWT (0)  | TEXT Dec | 40  |
| BAND+    | QSK      | 10  | FINE             | COARSE      | 49  | AFX (<-) | DATA Md  | 43  |
| MODE-    | ALT      | 17  | RATE             | LOCK        | 50  | V->M     | AF REC   | 15  |
| MODE+    | TEST     | 18  | SUB              | DVRSTY      | 48  | M->V     | AF PLAY  | 23  |
| MENU     | CONFIG   | 14  | A/B (1)          | BSET        | 11  | M1       | M1-RPT   | 21  |
| XMIT     | TUNE     | 16  | REV (FM/rpt) (2) | n/a         | 12  | M2       | M2-RPT   | 31  |
| RX ANT   | n/a      | 25  | A->B (3)         | SPLIT       | 13  | M3       | M3-RPT   | 35  |
| DISP     | METER    | 08  | PRE (4)          | ATT         | 24  | M4       | M4-RPT   | 39  |
| ATU Tune | ATU      | 19  | AGC (5)          | OFF         | 27  | REC      | MSG Bank | 37  |
| ANT      | ANT Name | 26  | XFIL (6)         | DUAL PB/APF | 29  | RIT      | PF1      | 45  |
| SHIFT/LO | NORM     | 58  | NB (7)           | LEVEL       | 33  | XIT      | PF2      | 47  |
| WIDTH/HI | I/II     | 59  | NR (8)           | ADJ         | 34  | CLR      | n/a      | 53  |
| SPD/MIC  | DELAY    | 57  | NTCH (9)         | MANUAL      | 32  |          |          |     |
| CMP/PWR  | MON      | 56  | SPOT (.)         | PITCH       | 42  |          |          |     |

#### Table 8: KX3 Switch Identifiers

| TAP           | HOLD  | nn  | TAP          | HOLD  | nn  | TAP           | HOLD | nn  | TAP   | HOLD         | nn  |
| ------------- | ----- | --- | ------------ | ----- | --- | ------------- | ---- | --- | ----- | ------------ | --- |
| BAND+         | RCL   | 08  | PRE (1)      | NR    | 19  | MODE          | ALT  | 14  | A/B   | REV (FM/rpt) | 24  |
| BAND-         | STORE | 41  | ATTN (2)     | NB    | 27  | DATA          | TEXT | 17  | A->B  | SPLIT        | 25  |
| FREQ ENT      | SCAN  | 10  | APF (3)      | NTCH  | 20  | RIT           | PF1  | 18  | XIT   | PF2          | 26  |
| MSG (<-)      | REC   | 11  | SPOT (4)     | CWT   | 28  | RATE          | KHZ  | 12  | DISP  | MENU         | 09  |
| ATU TUNE (.)  | ANT   | 44  | CMP (5)      | PITCH | 21  |               |      |     |       |              |     |
| XMIT (0)      | TUNE  | 16  | DLY (6)      | VOX   | 29  |               |      |     |       |              |     |
| AF/RF-SQL (7) | MON   | 32  | PBT I/II (8) | NORM  | 33  | KEYER/MIC (9) | PWR  | 34  | OFS/B | CLR          | 35  |

**Note:** If "Fast Play" is in effect, switch emulation commands for BAND+, BAND- and FREQ ENT are blocked (both SWT and SWH). See byte (e), bit 0 of the IC response.

#### Table 8A: KX2 Switch Identifiers

| TAP             | HOLD   | nn  | TAP  | HOLD      | nn  | TAP       | HOLD  | nn  |
| --------------- | ------ | --- | ---- | --------- | --- | --------- | ----- | --- |
| AF GAIN/MON (0) | NB     | 32  | DATA | TEXT      | 26  | MODE (.)  | RCL   | 08  |
| PRE (/ATTN) (1) | NR     | 19  | MSG  | REC       | 11  | BAND (<-) | STORE | 14  |
| FIL (2)         | APF/AN | 27  | RATE | FREQ/SCAN | 41  | A/B (6)   | A>B   | 44  |
| ATU (3)         | PFn    | 20  |      |           |     | RIT (7)   | SPLIT | 18  |
| XMIT (4)        | TUNE   | 16  |      |           |     | DISP (8)  | MENU  | 09  |
| KYR-SPT/MIC (5) | PWR    | 34  |      |           |     | OFS/B (9) | CLR   | 35  |

ATU on the KX2 is the same as ATU TUNE on the KX3.

---

### TB - Received Text Read / Transmit Text Count

**GET only**

```text
RSP: TBtrrs;
```

| Field | Description                                                                      |
| ----- | -------------------------------------------------------------------------------- |
| `t`   | Count of buffered CW/data characters remaining to be sent (from KY packets), 0-9 |
| `rr`  | Count of received CW/data characters available (00-40)                           |
| `s`   | Variable-length receive text string                                              |

If no received text is available, and no transmit text to be sent, the response is `TB000;`.

**Notes:**

1. Since an RX count is provided, semicolons can appear in the text string.
2. After the K3 responds to a TB command, it clears the RX count to zero.
3. Application software must poll with `TB;` often enough to prevent loss of incoming text.

---

### TBX - Transmitted Text Read / Text Count

**GET only; KX3/KX2 only**

```text
RSP: TBXtts;
```

| Field | Description                                                       |
| ----- | ----------------------------------------------------------------- |
| `tt`  | Count of buffered CW/data characters remaining to be sent (00-40) |
| `s`   | Variable-length transmit text string                              |

If no transmitted text is available, the response is `TBX00;`.

---

### TE - Transmit EQ

**SET only**

```text
SET: TEabcdefgh;
```

Where `a` through `h` are 3-character fields, each specifying a range of -16 to +16 dB.

| Field | EQ Band |
| ----- | ------- |
| a     | 50 Hz   |
| b     | 100 Hz  |
| c     | 200 Hz  |
| d     | 400 Hz  |
| e     | 800 Hz  |
| f     | 1600 Hz |
| g     | 2400 Hz |
| h     | 3200 Hz |

**Important:** If the current transmit mode is SSB, CW or DATA, TE applies to SSB. If the transmit mode is ESSB, AM, or FM, TE affects ESSB/AM/FM. The two setups are saved separately.

---

### TM - Transmit Meter Mode

**GET/SET; K3/K3S only**

```text
RSP: TM0;   or   TM1;
```

| Value | Description      |
| ----- | ---------------- |
| TM0   | SWR/RF metering  |
| TM1   | CMP/ALC metering |

This sets the transmit meter mode for the LCD bargraphs, as well as for the BG command (equivalent to using the METER switch). When TM0 is in effect, BG returns the RF level. When TM1 is in effect, BG returns the ALC level.

---

### TQ - Transmit Query

**GET only**

```text
RSP: TQ0;   or   TQ1;
```

| Value | Description   |
| ----- | ------------- |
| TQ0   | Receive mode  |
| TQ1   | Transmit mode |

This is the preferred way to check RX/TX status since it requires far fewer bytes than an IF response. TQ1 will be returned even during pseudo-transmit conditions such as TX TEST or when the radio is "pre-armed" for CW transmit via XMIT or PTT.

---

### TT - Text to Terminal

**SET only**

```text
SET: TTn;
```

| Parameter | Value | Description                               |
| --------- | ----- | ----------------------------------------- |
| `n`       | 0     | Disable decoded text routing to PC        |
| `n`       | 1     | Enable decoded text routing to PC (ASCII) |

**Note:** `TB` (text buffer read) provides a more reliable means of implementing a CW/data terminal. TB must be used rather than TT if a P3 panadapter is attached between the computer and K3.

There is no GET command for TT, but its status can be checked using the `IC` command: byte c, bit 0.

---

### TX - Transmit Mode

**SET only**

```text
SET: TX;
```

No data. Same as activating PTT or using the XMIT switch. Applies to all modes except direct data (FSK-D and PSK-D). In these cases, use the paddle, send a message, or use a `KY` text packet. The TX command is ignored in these modes. Use the `RX` command to cancel TX.

---

### UP/UPB - Move VFO A or B Up

**SET only**

See `DN`/`DNB` command for full details. `UP` and `UPn` move VFO A up. `UPB` and `UPBn` move VFO B up.

---

### VX - VOX State

**GET/SET on K3; GET only on KX2 and KX3**

```text
SET/RSP: VXn;
```

| Parameter | Value | Description |
| --------- | ----- | ----------- |
| `n`       | 0     | VOX off     |
| `n`       | 1     | VOX on      |

Applies only to present mode (voice/data, or CW). In CW mode, VOX refers to "hit-the-key transmit." In voice/data modes, VOX refers to voice-operated-relay.

**KX2 only:** In SSB mode, the VOX state returned by VX applies only to the external mic, whether currently plugged in or not. VOX cannot be used with the internal mic.

---

### XF $ - XFIL Number

**GET only**

```text
RSP: XFn;
```

| Parameter | Range | Description                                    |
| --------- | ----- | ---------------------------------------------- |
| `n`       | 1-5   | Present XFIL selection for the target receiver |

In the K3, the XFIL selection refers to crystal filters. In the KX3, the XFIL selection refers to the analog I/Q filters on the KXFL3 module. The KX2 has only DSP filters, so XF always returns `XF1;`.

---

### XT - XIT Control

**GET/SET**

```text
SET/RSP: XTn;
```

| Parameter | Value | Description |
| --------- | ----- | ----------- |
| `n`       | 0     | XIT OFF     |
| `n`       | 1     | XIT ON      |

XIT is disabled in QRQ CW mode.

---

## Appendix A: Change History

Applicable MCU firmware revisions are shown in brackets.

**Note:** Prior to revision D1 this document applied only to the K3. For earlier change history, see rev C14.

### D1 (January 18, 2012)

K3 rev 4.48; KX3 rev 0.58

- Document now pertains to both the K3 and KX3. Asterisks in Table 1 now show K3 commands that are not functionally applicable to the KX3.
- SWT/SWH, MN, and OM descriptions updated to show differences between K3 and KX3.

### D2 (January 19, 2012)

K3 rev 4.48; KX3 rev 0.59

- KXAT3 menu entry back to MN023.
- XMIT/TUNE switch on KX3 remapped to match the K3's SWT/SWH code (13).

### D5 (March 20, 2012)

K3 rev 4.48; KX3 rev 0.80

- DB command is different for the KX3.
- RG response is different for the KX3.
- MQ command added for the KX3 (16-bit menu parameter access).
- SPG command added (KX3 ground-reference check).
- SMH command added (K3 high-resolution S-meter).

### D8 (April 5, 2012)

K3 rev 4.48; KX3 rev 0.91

- PO command added to the KX3 (reads actual power output during transmit).
- EL command added to the KX3 (turns run-time error logging on/off).

### D9 (April 12, 2012)

K3 rev 4.48; KX3 rev 0.92

- Added RX SHFT menu entry to KX3's MN command ID list.

### D10 (April 17, 2012)

K3 rev 4.48; KX3 rev 0.92

- Corrected NL command description, including note about the KX3 noise blanker.

### E2 (May 7, 2012)

K3 rev 4.50; KX3 rev 0.99

- The MN command table now reflects all of the KX3 menu parameters accessible via MP and MQ.
- The MP command now has a full list of menu entries with detailed semantics and examples.

### E3 (July 12, 2012)

K3 rev 4.51; KX3 rev 1.10

- Added RX NR to MN table.

### E4 (September 18, 2012)

K3 rev 4.51; KX3 rev 1.20

- Added internal-only commands BC and KT to command table.

### E5 (January 3, 2013)

K3 rev 4.51; KX3 rev 1.35

- Added bit to IC command to show state of OFS/VFOB LEDs. See byte (e) bit (1).

### E6 (February 26, 2013)

K3 rev 4.62; KX3 rev 1.38

- Added MACRO menu function to MN table.

### E8 (April 15, 2013)

K3 rev 4.66; KX3 rev 1.42

- Added LED BRT to MN table (MN145).

### E9 (July 30, 2013)

K3 rev 4.66; KX3 rev 1.54

- Added PA MODE to MN table (MN146).

### E10 (October 7, 2013)

K3 rev 4.66; KX3 rev 1.70

- Clarified the effect of meta-mode K22 on the PC command (power control).
- Added 2M MODE menu entry to MN table (MN147).

### E11 (October 24, 2013)

K3 rev 4.68; KX3 rev 1.72

- The SW commands for the REV switch on both radios only apply to swapping repeater input/output frequencies in FM mode.

### E12 (February 20, 2014)

K3 rev 4.83; KX3 rev 1.92

- Added T and X identifiers to the OM (option module detect) response for the KX3.
- Added KE command (Elecraft internal use only).
- Clarified PO command usage in QRO mode.
- Clarified NL command usage.
- For ATU.X MD menu entry (KXAT100 status), the MP command is GET-only.

### E13 (March 21, 2014)

K3 rev 4.84; KX3 rev 1.94

- Added special-case LCD characters m and n to DB command.

### E14 (April 3, 2014)

K3 rev 4.84; KX3 rev 1.95

- Added TX DLY to KX3's MN function list (#016).

### E15 (May 12, 2014)

KX3 rev 2.01

- Added KX3-4M module to OM response list (for character X).

### E16 (June 26, 2014)

KX3 rev 2.11

- If KX3 is in Fast Play message mode: (1) bit 0 of byte (e) is set in the IC response; (2) the SWT emulation commands for BAND+, BAND-, and FREQ ENT are blocked, returning `?;`.

### E17 (October 6, 2014)

KX3 rev 2.25

- When the KX3 is in DUAL RX mode (dual watch), BW$, FW$, and MD$ commands return the values for VFO A, not VFO B, in the dual-watch case.

### E18 (February 20, 2015)

K3 rev 5.12

- In DV command: Described DVS command variant, which toggles both diversity and sub RX on/off together.
- Added CONFIG:VFO LNK menu entry to the MN table for the K3 (#116).

### E19 (March 31, 2015)

K3 rev 5.20

- The CONFIG:KNB3 menu entry has been removed (ID number 048 preserved for compatibility).
- If a new synthesizer is in use (KSYN3A), the lower limit for the FA and FB commands is 100 kHz rather than 490 kHz.

### F1 (March 31, 2015) -- First K3S/K3/KX3 Version

K3S/K3 rev 5.26

- Added ATTEN and PREAMP2 menu entries to the MN table.
- The PA command now supports preamp 2 get/set (12/10/6 m only; requires KXV3B).

### F2 (July 24, 2015)

K3S/K3 rev 5.33

- The UP/UPB and DN/DNB commands can now be used to adjust most displayed parameters.
- The RA (attenuator) command now has GET/SET values of RA00/05/10/15 (dB) in the K3S case.
- The OM (option module) command can now detect LNA, KSYN3A, and K3S RF board.

### F5 (December 4, 2015)

KX3, all firmware revisions

- AK command (ATU relay values) documented.

### F6 (January 8, 2016)

K3/K3S rev 5.46

- TX command does not apply to FSK-D and PSK-D modes.

### F7 (March 4, 2016)

KX3 rev 2.52

- Correction to 599FAST macro.
- TBX command documented.
- PC command description improved.

### F8 (May 25, 2016)

KX2 rev 2.60

- Command changes pertaining to the KX2: DB, MN, MP, OM, SW, VX.

### F9 (May 25, 2016)

KX2 rev 2.68

- AM MODE menu command added to MN table for KX2 (ID = 126). FM mode does not apply to the KX2.

### G1 (March 16, 2017)

K3/K3S rev 5.58

- VX SET (VOX on/off) command added.
- AR GET/SET (RX antenna on/off) command added.

### G2 (April 2, 2017)

KX3 rev 2.74; KX2 rev 2.73

- Added ATU DATA menu entry to MN tables for KX3 and KX2 (ID = 112).
- In MP command, ATU DATA access mask is bit 3 (for SET0/SET1).

### G3 (November 14, 2017)

K3/K3S rev 5.62

- TM command added. Sets the transmit metering mode for both the LCD bargraphs and for the BG command.
- DE command added. Inserts a command processing delay of about 10 to 2550 ms.

### G4 (November 28, 2018)

K3/K3S rev 5.66; KX2 rev 2.92; KX3 rev 2.93

- Added SW command. GET only; returns most recent transmit SWR reading.

### G5 (February 20, 2019)

KX2 and KX3, text corrections only

- MN143 is not a valid menu index on the KX2 because there is no NR menu entry. Removed MN143 from the KX2's table. NR can still be turned on/off on the KX2 using `SWH19;`.
