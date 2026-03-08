---
title: KAT500 Serial Command Reference
description: Complete serial command reference for the Elecraft KAT500 automatic antenna tuner (firmware 02.12)
---

## Introduction

This document is derived from Elecraft's KAT500 Serial Command Reference, revised September 6, 2023, for firmware version 02.12. It provides a complete reference for all serial control commands supported by the Elecraft KAT500 automatic antenna tuner.

## Command Set Overview

| Name     | Description                                          | Name         | Description                                  |
| -------- | ---------------------------------------------------- | ------------ | -------------------------------------------- |
| `;`      | Null command                                         | `FT`         | Full Search Tune                             |
| `AB`     | ATU Settings per bin                                 | `FTNS`       | Full Tune, No Save                           |
| `AE`     | Antenna Enable                                       | `FT0`, `FT1` | Transmit VFO                                 |
| `AFT`    | Automatic Fine Tune                                  | `FX`         | XCVR or CAT Frequency                        |
| `AKIP`   | Amplifier Key Interrupt Power Threshold              | `FY`         | Current ATU Frequency Range                  |
| `AMPI`   | Interrupt Amplifier Key Line                         | `I`          | Identify Device                              |
| `AN`     | Antenna Select                                       | `IF`         | Transceiver Info                             |
| `AP`     | Antenna Preference                                   | `L`          | Select Inductors                             |
| `ATTN`   | Enable Attenuator                                    | `MD`         | Mode                                         |
| `BN`     | Band Number                                          | `MT`         | Memory Recall Tune                           |
| `BR`     | Serial I/O Speed                                     | `MTA`        | Memory Recall Tune on QSY in AUTO (obsolete) |
| `BYP`    | Bypass                                               | `MTM`        | Memory Recall Tune on QSY in MAN (obsolete)  |
| `C`      | Select Capacitors                                    | `PS`         | Power On/Off                                 |
| `CT`     | Cancel Full Search Tune                              | `PSI`        | Power Status Initial                         |
| `DM`     | Display Memories                                     | `RSTx`       | Reset                                        |
| `EEINIT` | Clear Configuration and Frequency Memories           | `RV`         | Firmware Revision                            |
| `EM`     | Erase Frequency Memory                               | `SIDE`       | Select Side                                  |
| `F`      | Frequency                                            | `SL`         | Sleep when Idle                              |
| `FA`     | VFO A Frequency                                      | `SM`         | Save Memory                                  |
| `FB`     | VFO B Frequency                                      | `SN`         | Serial Number                                |
| `FC`     | Frequency Counter                                    | `ST`         | SWR Thresholds                               |
| `FCCS`   | Frequency Counter Consecutive Sample Time (obsolete) | `T`          | Start Full Tune                              |
| `FCMD`   | Frequency Counter Match Distance (obsolete)          | `TP`         | Tune Poll                                    |
| `FDT`    | Frequency Counter Distance for Retune                | `VFWD`       | Forward ADC Count                            |
| `FLT`    | Fault Display                                        | `VRFL`       | Reflected ADC Count                          |
| `FLTC`   | Clear Fault                                          | `VSWR`       | Standing Wave Ratio                          |
|          |                                                      | `VSWRB`      | Standing Wave Ratio in Bypass                |

## Serial Port Settings

KAT500 commands and their responses use the printable ASCII character set. Commands are sent to the KAT500 via its "PC DATA" serial port. Use 4800, 9600, 19200, or 38400 bit/s, 8-bit characters, one stop bit, and no parity. There is no flow control. You can change the KAT500's serial port speed with the `BR` command.

Beginning with firmware version 01.38, the microcontroller may be configured to "sleep" when logically off or otherwise idle. It takes a few serial port characters and about 100 milliseconds to wake up, and characters sent during the wakeup period may be lost. The KAT500 Utility sends semicolons at approximately 100-millisecond intervals until the KAT500 firmware begins to respond. See the `SL` command.

## Command Format

KAT500 commands are either **GET** or **SET**.

- **GET** commands are used to get information from the KAT500; the KAT500 provides that information in a **RESPONSE** message.
- **SET** commands are used to change the KAT500's internal state or to initiate an action. SET commands do not generally generate a RESPONSE. SET can be followed by a GET to verify the SET. In some cases (such as `FT;`) a SET causes a response at the completion of an action. RESPONSEs generally look like the corresponding SET command.

Each command is followed by a terminating semicolon character. Examples:

```text
RV;      GETs the firmware revision number. RESPONSE: RV01.13;
AN1;     SETs the KAT500 to use Antenna 1. No response.
AN;      GETs the currently selected antenna. RESPONSE: AN1;
```

After sending a GET command, you should generally wait for the corresponding RESPONSE before sending more commands. The KAT500 has a limited-size input command buffer. You may safely queue up to 64 bytes of commands without risk of overrun. If you wish to send a very long sequence of SET commands, break them up with an intervening GET (such as the null command or `RV;`) and wait for those responses.

Commands may be entered in UPPER or lower case. `RV;` and `rv;` are equivalent. Responses (with the exception of the permanent boot block response to `I;`) are UPPERCASE.

## Command Reference

### ; -- Null Command

GET format:

```text
;
```

RESPONSE format:

```text
;
```

The KAT500 Utility sends semicolons to determine the serial port speed during a connection sequence and to wake up a sleeping microcontroller.

### AB -- ATU Settings Per Bin (GET/SET)

_New in firmware 2.11._

GET format:

```text
ABbbn;
```

SET/RESPONSE format:

```text
ABbbn;
```

| Parameter | Description                                                              |
| --------- | ------------------------------------------------------------------------ |
| `bb`      | Band number (see the `BN` command)                                       |
| `n`       | Maximum number of ATU settings per bin per antenna connector, range 1--6 |

Each frequency "bin" has room for 6 unique ATU settings, shared across all three antenna connectors. `AB` allows you to allocate bin space depending on the antenna connectors you use on each band.

Examples:

- 3 antenna connectors in use on a band: ATU Settings per bin might be set to 2.
- 2 antenna connectors on a band: ATU Settings per bin might be set to 3.
- 1 antenna connector with an external antenna switch: ATU Settings per bin might be set to 6.

### AE -- Antenna Enable (GET/SET)

GET format:

```text
AEbba;
```

SET/RESPONSE format:

```text
AEbba0;    (disable)
AEbba1;    (enable)
```

| Parameter | Description                        |
| --------- | ---------------------------------- |
| `bb`      | Band number (see the `BN` command) |
| `a`       | Antenna number: `1`, `2`, or `3`   |

Enables or disables an antenna connector for a specified band. Successive presses of the ANT button skip disabled antennas.

Examples:

- `AE0030;` disables ANT3 on 160 meters.
- `AE1031;` enables ANT3 on 6 meters.

Disabling the currently selected antenna may result in an antenna change. This command is used by the KAT500 Utility Edit Configuration dialog.

### AFT -- Automatic Fine Tune (GET/SET)

_Added in firmware version 01.39._

GET format:

```text
AFTbb;
```

SET/RESPONSE format:

```text
AFTbb0;    (disabled)
AFTbb1;    (enabled)
```

| Parameter | Description                        |
| --------- | ---------------------------------- |
| `bb`      | Band number (see the `BN` command) |

Full search tune starts with a "coarse" step that tests several inductance values to find an approximate starting point for finer granularity searches. In some cases with high-SWR antennas, particularly on low bands, not enough inductance values are tested to find a good starting point. Enabling AFT causes full search coarse tune to try more inductor settings. Full search coarse tune takes longer but may find matching solutions for some difficult antenna loads.

A similar fine tune is accomplished by pressing the KAT500 TUNE button within five seconds of completion of a full search tune. This command is used by the KAT500 Utility Edit Configuration Auto Fine Tune tab.

### AKIP -- Amplifier Key Interrupt Power Threshold (GET/SET)

_Added in firmware version 01.05._

GET format:

```text
AKIP;
```

RESPONSE format:

```text
AKIP wwwwW VFWD aaaa;
```

SET format:

```text
AKIP wwww;
```

| Parameter | Description                                    |
| --------- | ---------------------------------------------- |
| `wwww`    | Transmit power threshold in watts              |
| `aaaa`    | VFWD threshold used to monitor the power level |

AKIP GETs or SETs a transmit power threshold below which the KAT500 can interrupt the amplifier key line. The KAT500 must interrupt the amplifier key line before it changes other relays during Memory Recall or Full Search Tune (bypass, antenna, capacitors, and inductors).

Recommended settings:

- **Elecraft KPA500**: Set to `1500` (solid-state T/R switching can handle hot-switching). Use `AKIP 1500;` even if the amplifier cannot supply that much power.
- **Amplifiers with frame or vacuum relays**: Set to the power your relay can safely hot-switch (e.g., `AKIP 100;`).

The default factory value is 30 watts. While the transmitter power exceeds this threshold, some front panel button presses and serial commands that change relays (`MD`, `AN`, `BYP`, `C`, `L`, `SIDE`, etc.) are ignored.

### AMPI -- Interrupt Amplifier Key Line (GET/SET)

GET format:

```text
AMPI;
```

SET/RESPONSE format:

```text
AMPI0;     (amplifier key line connected)
AMPI1;     (amplifier key line interrupted)
```

GETs or SETs the amplifier key line interrupt relay K23. `AMPI1;` selects the relay, interrupting the amplifier key line. `AMPI0;` releases the relay, connecting the amplifier key line.

The amplifier key line must be run through the KAT500's amplifier key line interrupt relay. 15-pin ACC cables used between the K3, KAT500, and KPA500 provide this capability. Alternatively, two-wire cables with RCA connectors may be used.

It may take a few milliseconds after issuing an AMPI SET before the relay changes. The SET form may be ignored if the current transmit power exceeds the AKIP threshold. The amplifier key interrupt relay may be changed by TUNE operations.

### AN -- Antenna Select (GET/SET)

GET format:

```text
AN;
```

SET/RESPONSE format:

```text
AN0;     (advance to next enabled antenna)
AN1;     (select Antenna 1)
AN2;     (select Antenna 2)
AN3;     (select Antenna 3)
```

Antenna selection is deferred if a tune is in progress. Antenna selection is ignored if the antenna is disabled on the current band (see the `AE` command).

`AN0;` advances to the next enabled antenna, simulating a press of the ANT button on the front panel. `AN0;` was added in firmware revision 01.55.

It may take a few milliseconds after issuing an `ANx;` SET before relays change. The SET form is ignored while transmitting or tuning.

### AP -- Antenna Preference (GET/SET)

GET format:

```text
APbb;
```

SET/RESPONSE format:

```text
APbba;
```

| Parameter | Description                                                                                |
| --------- | ------------------------------------------------------------------------------------------ |
| `bb`      | Band number (see the `BN` command)                                                         |
| `a`       | Antenna number: `0` = last used antenna on this band; `1`, `2`, or `3` = preferred antenna |

The KAT500 normally returns to the last-used antenna on band change. However, a preferred antenna may be configured so that the ATU always starts at a fixed antenna for a given band.

Example: `AP103;` causes ANT3 to be selected whenever you switch to 6 meters. `AP` SET is ignored if the antenna is disabled (see `AE`).

### ATTN -- Enable Attenuator (GET/SET)

GET format:

```text
ATTN;
```

SET/RESPONSE format:

```text
ATTN0;     (disabled)
ATTN1;     (enabled)
```

Selects relay K22, which switches in an attenuator resistor. It may take a few milliseconds after issuing `ATTNx;` before the relay changes.

Firmware releases the attenuator if it detects power high enough to damage the attenuator. Firmware normally inserts the attenuator during full search tune to present a more consistent load. The attenuator is disabled if the tune power is too low with the attenuator in place.

### BN -- Band Number (GET/SET)

GET format:

```text
BN;
```

SET/RESPONSE format:

```text
BNbb;
```

| Value | Band       |
| ----- | ---------- |
| `00`  | 160 meters |
| `01`  | 80 meters  |
| `02`  | 60 meters  |
| `03`  | 40 meters  |
| `04`  | 30 meters  |
| `05`  | 20 meters  |
| `06`  | 17 meters  |
| `07`  | 15 meters  |
| `08`  | 12 meters  |
| `09`  | 10 meters  |
| `10`  | 6 meters   |

The ATU is switched to the target band. The appropriate last-used or preferred antenna is selected. The ATU inductor and capacitor relays are set to the most recent setting used for the tuner on the indicated band.

KAT500 Band Numbers are the same as the K3 Programmer Reference Band Numbers, but differ from the BCD values of the four BAND lines.

It may take a few milliseconds for this command to take effect. Relays will not change until the transmitter power is below the AKIP threshold. The band may be subsequently overridden by a change to the four BAND lines in the accessory connector, or by counting the transmit frequency.

### BR -- Serial I/O Speed (GET/SET)

GET format:

```text
BR;
```

SET/RESPONSE format:

```text
BR0;     (4800 bit/s)
BR1;     (9600 bit/s)
BR2;     (19200 bit/s)
BR3;     (38400 bit/s)
```

Firmware load automatically chooses 38400 bit/s. Serial I/O speed significantly affects the time required for configuration save and restore. 38400 bit/s is recommended when possible.

### BYP -- Bypass (GET/SET)

GET format:

```text
BYP;
```

SET/RESPONSE format:

```text
BYPN;     (not bypassed)
BYPB;     (bypassed)
```

Gets or sets the bypass relays K20 and K21. These relays are in the bypassed position when not energized.

It may take a few milliseconds after issuing a `BYPx;` SET before relays change. Relays are not changed until the transmit power is below the AKIP threshold. Firmware releases inductor, capacitor, and SIDE relays while bypassed to reduce power consumption.

### C -- Select Capacitors (GET/SET)

GET format:

```text
C;
```

SET/RESPONSE format:

```text
Chh;
```

| Parameter | Description                                                   |
| --------- | ------------------------------------------------------------- |
| `hh`      | Pair of hexadecimal digits indicating the selected capacitors |

Examples:

```text
C00;     selects no capacitors
CFF;     selects all capacitors
C80;     selects only the largest capacitor (K5)
CC1;     selects the largest, second largest, and smallest capacitors (K5, K4, K1)
```

Capacitor relay mapping:

| Hex Digit | Relay | Capacitance (pF) |
| --------- | ----- | ---------------- |
| `80`      | K5    | 1360             |
| `40`      | K4    | 680              |
| `20`      | K3    | 330              |
| `10`      | K6    | 180              |
| `08`      | K2    | 82               |
| `04`      | K7    | 39               |
| `02`      | K8    | 22               |
| `01`      | K1    | 8                |

It may take a few milliseconds after issuing SET before the relays change. The SET form may be ignored if the current transmit power exceeds the AKIP power threshold, or if the bypass relay is in bypass. Capacitor relays are released when the bypass relay is in bypass.

### CT -- Cancel Full Search Tune (SET)

_Added in firmware revision 01.43._

SET format:

```text
CT;
```

Cancel Tune stops a full search tune at the end of the next tuning step. Poll with `TP;` to determine when tune completes.

### DM -- Display Memories (GET)

_Response format revised in firmware 2.12._

GET format:

```text
DMfffff;
```

| Parameter | Description                                                                            |
| --------- | -------------------------------------------------------------------------------------- |
| `fffff`   | Frequency in kHz. If omitted (`DM;`), displays memories for the current ATU frequency. |

RESPONSE example:

```text
DM 21040-21059;
AN3;SIDEA;C06;L00;VSWRB 2.11;
AN2;SIDET;C20;L01;VSWRB 2.11;
AN1;BYP;VSWRB 1.00;
3 UNUSED;
```

Displays the ATU settings for one frequency-related "bin". Each bin contains up to six ATU settings.

- The first line shows the kHz frequency range for the bin.
- `AN` shows the antenna number; `SIDEA` indicates capacitors on the antenna side (LC network); `SIDET` indicates capacitors on the transmitter side (CL network).
- `L` and `C` are the inductor and capacitor settings in hex notation (see the `L` and `C` commands).
- If the ATU setting is bypassed (`BYP`), SIDE, L, and C are not shown.
- `VSWRB` is the bypass SWR, measured with the ATU bypassed.

### EEINIT -- Clear Configuration and Frequency Memories (SET)

SET format:

```text
EEINIT;
```

Erases EEPROM containing frequency memories, per-band settings, and all configuration selections, including the current RS-232 speed. Configuration and per-band settings are formatted to default values during restart after a microcontroller reset. `EEINIT;` does not change the KAT500 serial number or its fault table.

`EEINIT;` is ignored while the ATU is tuning or transmitting.

### EM -- Erase Frequency Memory (SET)

SET format:

```text
EMbba;
```

| Parameter | Description                                             |
| --------- | ------------------------------------------------------- |
| `bb`      | Band number (see `BN`)                                  |
| `a`       | `0` = all antennas; `1`, `2`, or `3` = specific antenna |

Clears frequency memories for one or all antennas on the specified band. This command may take as long as a couple of seconds.

### F -- Frequency (GET/SET)

GET format:

```text
F;
```

SET/RESPONSE format:

```text
F nnnnn;
```

| Parameter | Description                                     |
| --------- | ----------------------------------------------- |
| `nnnnn`   | Frequency in kHz used for ATU setting selection |

`F` SET causes the ATU to change bands (if needed) and recall prior settings for the specified frequency, without transmitting. See also `BN` and `MT`. `F` SET is ignored while tuning. See the `FY` response for the span of frequencies for the ATU's frequency segment.

### FA -- VFO A Frequency (SET)

SET format:

```text
FA000fffffiii;
```

| Parameter     | Description     |
| ------------- | --------------- |
| `000fffffiii` | Frequency in Hz |

_Introduced in firmware version 01.34._ In firmware version 01.81 and later, `FA` accepts frequencies in Hz in 9, 10, or 11 digits and causes a memory recall tune (see `MT`) if VFO A is the transmit VFO. The transmit VFO is set with `IF` or `FT0`.

### FB -- VFO B Frequency (SET)

SET format:

```text
FB000fffffiii;
```

| Parameter     | Description     |
| ------------- | --------------- |
| `000fffffiii` | Frequency in Hz |

In firmware version 01.81 and later, `FB` accepts 9, 10, or 11-digit frequencies in Hz and causes a memory recall tune (see `MT`) if VFO B is the transmit VFO. The transmit VFO is set with `IF` or `FT1`.

### FC -- Frequency Counter (GET)

GET format:

```text
FC;
```

RESPONSE format:

```text
FC nnnnn;
```

| Parameter | Description                                                              |
| --------- | ------------------------------------------------------------------------ |
| `nnnnn`   | Frequency count of the last transmitted signal in kHz (8 kHz increments) |

### FCCS -- Frequency Counter Consecutive Sample Time (GET/SET, obsolete)

_Introduced in firmware 01.70, removed in 01.98._

GET format:

```text
FCCS;
```

SET/RESPONSE format:

```text
FCCSnnnnn;
```

| Parameter | Description                                        |
| --------- | -------------------------------------------------- |
| `nnnnn`   | Time in milliseconds, range 2--50000 (default: 12) |

FCCS and FCMD influence the behavior of the KAT500's frequency counter. FCCS is the time in milliseconds of the same-frequency signal that must be counted for the KAT500 to consider the count "valid."

Set this value low for the ATU to change settings to a new frequency with a single CW "dit." Set this value higher to add more inertia and make the ATU more resistant to frequency change.

### FCMD -- Frequency Counter Match Distance (GET/SET, obsolete)

_Introduced in firmware 01.70, removed in 01.98._

GET format:

```text
FCMD;
```

SET/RESPONSE format:

```text
FCMDnnn;
```

| Parameter | Description                                                                               |
| --------- | ----------------------------------------------------------------------------------------- |
| `nnn`     | Allowable distance between consecutive frequency count samples, range 1--127 (default: 1) |

Sampling is at 8 kHz increments, so a value of 1 means that consecutive samples within +/- 8 kHz of the prior sample are accepted.

### FDT -- Frequency Counter Distance for Retune (GET/SET)

_Introduced in firmware version 01.99._

GET format:

```text
FDT;
```

SET/RESPONSE format:

```text
FDT nn;
```

| Parameter | Description                                                                                                                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nn`      | Distance in kHz between the current ATU frequency and the most recent TX frequency count for the ATU to change settings. Range 0--65535. `0` is interpreted as the default of 10 kHz. `65535` disables ATU tuning based on frequency count. |

This is intended for users who prefer the KAT500 only follow the frequency provided by a serial port command or the K3/K3S/K4 AUXBUS, or to select a minimum distance between current ATU frequency and a newly counted frequency.

### FLT -- Fault Display (GET)

GET format:

```text
FLT;
```

RESPONSE format:

```text
FLTc;
```

| Fault Code | Name                                              | Description                                                                                                                                                                                        |
| ---------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0`        | No Fault                                          | No error                                                                                                                                                                                           |
| `1`        | No Match                                          | The ATU tune algorithm was unable to find a satisfactory match                                                                                                                                     |
| `2`        | Power Above Design Limit for Antenna SWR          | Transmitter power exceeds the design limit for the unmatched antenna SWR. Limit varies with SWR: 600W at 10:1, 1000W at 3:1.                                                                       |
| `3`        | Power Above Safe Relay Switch Limit               | Transmit power with the amplifier key line relay interrupted exceeds the safe relay switching limit of 100W. May result from failing to route the amplifier key line through the KAT500.           |
| `4`        | SWR Exceeds Amplifier Key Interrupt SWR Threshold | Current SWR exceeds the amplifier key interrupt SWR threshold. Cleared by a subsequent transmission with SWR below 7/8 of this threshold. Not written into the fault log. _New in firmware 01.52._ |

A fault condition may be cleared by tapping the TUNE button or cycling the KAT500 power. The amplifier key line is kept interrupted during any fault.

### FLTC -- Clear Fault (SET)

SET format:

```text
FLTC;
```

Turns off the FAULT LED and clears the current fault.

### FT -- Full Search Tune (SET)

SET/RESPONSE format:

```text
FT;
```

`FT;` starts a Full Search Tune. If Mode is Bypass, the Mode is changed to Manual. An `FT;` RESPONSE is sent when a Full Tune initiated by `T;` or `FT;` completes.

Full Tune may not start immediately if the current transmit power exceeds the AKIP threshold. When you next stop transmitting, KAT500 firmware interrupts the amplifier key line. Start transmitting again at about 15 to 30 watts. When tune completes, an FT response is sent. You should stop transmitting, and KAT500 firmware will then reconnect the amplifier key line.

If the amplifier's T/R switch can handle full-power switching (AKIP set to 1500), amplifier key line interrupt, tuning, and key line reconnect occur without requiring a pause in transmission.

The ATU setting found is saved for later recall. This save may be skipped with `FTNS`.

### FTNS -- Full Tune, No Save (SET)

_Added in firmware version 01.98._

SET format:

```text
FTNS;
```

RESPONSE format:

```text
FT;
```

`FTNS;` starts a Full Search Tune just like `FT` but does not store the resulting ATU setting in memory. If you like the setting, it may be stored with `SM;`.

### FT0, FT1 -- Transmit VFO (SET)

SET format:

```text
FT0;     (select VFO A as transmit VFO)
FT1;     (select VFO B as transmit VFO)
```

Yaesu radios do not indicate the transmit VFO in the IF response message. `FT0;` selects VFO A and `FT1;` selects VFO B as the transmit VFO. Subsequent `FA` or `FB` messages provide the transmit frequency.

### FX -- XCVR or CAT Frequency (GET)

GET format:

```text
FX;
```

RESPONSE example:

```text
FX 7023;
```

Shows the frequency most recently received from a serial command (`FA`, `FB`) or transceiver frequency from a K3/K3S/K4 via AUXBUS.

### FY -- Current ATU Frequency Range (GET)

_Added in firmware version 01.97._

GET format:

```text
FY;
```

RESPONSE example:

```text
FY 14000-14019;
```

`FY` shows the frequency range of the currently selected ATU "bin." The bin width varies by band: 10 kHz on 160 meters, 20 kHz on bands 80 through 12 meters, 100 kHz on 10 meters, and 200 kHz on 6 meters.

### I -- Identify Device (GET)

GET format:

```text
I;
```

RESPONSE format:

```text
KAT500;
```

The KAT500 protected boot block firmware responds with `kat500;` in lower case. This command is used by the KAT500 Utility to verify that it is connected to a KAT500 rather than some other device.

### IF -- Transceiver Info (SET)

SET format:

```text
IF<26, 27, or 37 characters>;
```

`IF` is followed by 26, 27, or 37 characters representing the Elecraft, Kenwood, Flex, or Yaesu response to an IF query.

`IF` is used to determine the XIT offset. The IF response is also used to determine the transmit VFO for Elecraft, Flex, and Kenwood radios. Yaesu radios do not provide the transmit VFO in an IF message; this information is conveyed via `FT0` or `FT1`.

### L -- Select Inductors (GET/SET)

GET format:

```text
L;
```

SET/RESPONSE format:

```text
Lhh;
```

| Parameter | Description                                                          |
| --------- | -------------------------------------------------------------------- |
| `hh`      | Hexadecimal digits (0--9 and A--F) indicating the selected inductors |

Examples:

```text
L00;     selects no inductors
LFF;     selects all inductors
L80;     selects only the largest inductor (K17)
LE0;     selects the three largest inductors (K17, K16, K15)
```

Inductor relay mapping:

| Hex Digit | Relay | Inductance (nH) |
| --------- | ----- | --------------- |
| `80`      | K17   | 9000            |
| `40`      | K16   | 4400            |
| `20`      | K15   | 2100            |
| `10`      | K14   | 1000            |
| `08`      | K13   | 480             |
| `04`      | K12   | 230             |
| `02`      | K11   | 110             |
| `01`      | K10   | 50              |

It may take a few milliseconds after issuing `Lxx;` SET before the relays change. SET may be ignored if the current transmit power exceeds the AKIP power threshold. Inductor relays are released when the bypass relay is in bypass (`BYPB`), and SET has no effect in that state.

### MD -- Mode (GET/SET)

GET format:

```text
MD;
```

SET/RESPONSE format:

```text
MDB;     (Bypass mode)
MDM;     (Manual mode)
MDA;     (Automatic mode)
```

| Mode  | Description                                                                                                                                                                                                                |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MDB` | Bypass mode. The bypass relay is released to its bypassed setting and the KAT500 does not attempt to tune.                                                                                                                 |
| `MDM` | Manual mode. The KAT500 recalls memorized tuner settings from prior tune efforts on frequency and antenna change, and when the TUNE pushbutton is pressed. A TUNE button press is also used to search for a match setting. |
| `MDA` | Automatic mode. The KAT500 recalls memorized tuner settings on frequency change, and can initiate a full search tune if the SWR exceeds a threshold value (see the `ST` command).                                          |

SET may be ignored while transmitting.

### MT -- Memory Recall Tune (SET)

SET format:

```text
MT fffff;
```

| Parameter | Description                                                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fffff`   | Frequency in kHz. If zero or missing, the last transmit frequency is used. If the ATU detects a current transmit frequency, the measured frequency is used instead. |

`MT` performs a memory recall tune by changing to the memorized tuner setting for the current antenna.

If there is no memorized tuner setting for the specified frequency, adjacent memories are searched above and below the specified frequency, to the band edges, until a suitable memory is found.

Memory Recall Tune may be deferred until the current transmit power drops below the AKIP power threshold.

### MTA -- Memory Recall Tune on QSY in AUTO (GET/SET, obsolete)

_Added in firmware version 01.28, disabled in 01.99. See `FDT`._

GET format:

```text
MTA;
```

SET/RESPONSE format:

```text
MTA1;     (enabled)
MTA0;     (disabled)
```

Enables or disables Memory Recall Tunes when transmit frequency changes are detected while in Mode AUTO. When enabled, the KAT500 performs Memory Recall Tunes as the transmit frequency changes within the current band, even if the VSWR is below the Auto tune threshold. When disabled, tunes occur only when the VSWR rises above the threshold (see the `ST` command). MTA is enabled by default.

### MTM -- Memory Recall Tune on QSY in MAN (GET/SET, obsolete)

_Added in firmware version 01.28, disabled in 01.99. See `FDT`._

GET format:

```text
MTM;
```

SET/RESPONSE format:

```text
MTM1;     (enabled)
MTM0;     (disabled)
```

Enables or disables Memory Recall Tunes as transmit frequency changes are detected while in Mode MAN. When disabled, the KAT500 performs Memory Recall Tunes only on band and antenna changes. MTM is enabled by default.

### PS -- Power On/Off (GET/SET)

_`PS;` and `PS1;` added in firmware version 01.20._

GET format:

```text
PS;
```

SET/RESPONSE format:

```text
PS0;     (off)
PS1;     (on)
```

Turns the KAT500 ON or OFF. The KAT500's microcontroller operates whenever DC power is applied. LEDs and relays are off (Antenna 1, bypassed) when the KAT500 is logically off. See the `SL` command.

This command may be ignored while transmitting.

### PSI -- Power Status Initial (GET/SET)

_Added in firmware version 01.37._

GET format:

```text
PSI;
```

SET/RESPONSE format:

```text
PSI0;     (start OFF when DC power applied)
PSI1;     (start ON when DC power applied)
```

Determines whether the KAT500 starts OFF or ON when DC power is initially applied. This command is used by the KAT500 Utility Edit Configuration dialog Initial Power tab.

### RSTx -- Reset (SET)

SET format:

```text
RST0;     (reset without saving state)
RST1;     (save state, then reset)
```

`RST0;` resets the microcontroller without saving state in EEPROM. This is equivalent to removing and reconnecting the power plug. `RST1;` simulates pressing the power-off button, which saves current state in EEPROM before reset.

RST may be ignored while transmitting.

### RV -- Firmware Revision (GET)

GET format:

```text
RV;
```

RESPONSE format:

```text
RVnn.nn;
```

### SIDE -- Select Side (GET/SET)

GET format:

```text
SIDE;
```

SET/RESPONSE format:

```text
SIDET;     (transmitter side -- CL network)
SIDEA;     (antenna side -- LC network)
```

Gets or sets the state of SIDE relay K9.

| Setting | Description                                                                                     |
| ------- | ----------------------------------------------------------------------------------------------- |
| `SIDET` | Capacitors connected to the transmitter side of the inductor (CL network). K9 is not energized. |
| `SIDEA` | Capacitors connected to the antenna side of the inductor (LC network). K9 is energized.         |

Generally, the capacitors shunt the higher impedance side. It may take a few milliseconds after issuing `SIDEx;` before the relay changes. SET may be ignored if the current transmit power exceeds the AKIP power threshold. The SIDE relay is released while the bypass relay is bypassed.

### SL -- Sleep when Idle (GET/SET)

_Introduced in firmware version 01.38._

GET format:

```text
SL;
```

SET/RESPONSE format:

```text
SL0;     (disable sleep)
SL1;     (enable sleep)
```

`SL1;` causes the KAT500 microcontroller to enter a low-power and electrically quieter sleep mode when switched off or when idle. The 16 MHz crystal oscillator is turned off while sleeping.

The sleeping microcontroller can be awakened by:

1. Front panel button press
2. Change to any of the accessory connector BAND lines
3. High-to-low transition of the accessory connector AUXBUS line
4. High-to-low transition of the "start tune" line of the rear-panel TUNE connector
5. High-to-low transition (a start bit) on the RS-232 serial port
6. Transmit-level RF

While the microcontroller can be awakened by characters arriving on the RS-232 serial port, it takes about 100 milliseconds for the crystal oscillator to reach operating speed, and characters arriving in that period may be lost. Computer programs should send a series of single semicolons at approximately 100-millisecond intervals until the KAT500 returns semicolon responses (normally two or three semicolons).

The microcontroller is deemed "idle" when a short period has elapsed without front panel button presses or changes to any of the rear panel inputs (band, tune start, AUXBUS, serial port communications, and RF transmission).

Install KAT500 Utility version 1.13.4.2 or later before enabling Sleep when Idle.

### SM -- Save Memory (SET)

SET format:

```text
SM;
SM fffff;
```

| Parameter | Description                                                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `fffff`   | Frequency in kHz. If zero or missing, the last transmit frequency is used. If transmitting, the measured frequency is used instead. |

`SM` saves the current tuner settings (antenna, side, inductor, capacitor, and bypass VSWR) in the tuner memory for the indicated or most recent transmit frequency.

_`SM` with a frequency was introduced in firmware version 01.20._

### SN -- Serial Number (GET)

GET format:

```text
SN;
```

RESPONSE format:

```text
SN xxxxx;
```

Reads the KAT500's serial number, installed in EEPROM during factory installation. Leading zeros may be omitted. `EEINIT` does not change the serial number.

### ST -- SWR Thresholds (GET/SET)

GET format:

```text
STbbt;
```

SET/RESPONSE format:

```text
STbbtnn.nn;
```

| Parameter | Description                |
| --------- | -------------------------- |
| `bb`      | Band number (see `BN`)     |
| `t`       | Threshold type (see below) |
| `nn.nn`   | VSWR value                 |

Threshold types:

| Type | Name                                   | Description                                                                                                                                                                                                                    |
| ---- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `A`  | Auto tune VSWR threshold               | When in Mode AUTO and the current VSWR reaches this threshold, the KAT500 will attempt to recall a prior tuner setting or perform a Full Tune. Default: 1.8. Minimum: 1.5. Example: `ST05A1.75;` sets 20m threshold to 1.75:1. |
| `B`  | Bypass VSWR threshold                  | During full tune, if bypass VSWR is at or below this threshold, the desired tuner setting is "use bypass." Default: 1.2. Example: `ST01B1.3;` sets 80m threshold to 1.3:1.                                                     |
| `K`  | Amplifier Key interrupt VSWR threshold | If VSWR exceeds this threshold, the amplifier key interrupt relay is energized. Default: 2.0. May be set as high as 99.99 to defeat the protection function.                                                                   |

VSWR values are encoded in an 8.8 binary format, so the least significant digit may change when converting between binary and decimal representations.

### T -- Start Full Tune (SET)

SET format:

```text
T;
```

RESPONSE format:

```text
FT;
```

This command is equivalent to pressing the front panel TUNE button. `T;` is equivalent to `FT;` (Full Tune). An `FT;` response is sent when the full tune completes.

### TP -- Tune Poll (GET)

_Added in firmware version 01.42._

GET format:

```text
TP;
```

RESPONSE format:

```text
TP1;     (currently tuning)
TP0;     (not tuning)
```

### VFWD -- Forward ADC Count (GET)

GET format:

```text
VFWD;
```

RESPONSE format:

```text
VFWD nnnn;
```

| Parameter | Description                                             |
| --------- | ------------------------------------------------------- |
| `nnnn`    | ADC count, range 0--4095. Leading zeros may be omitted. |

Returns an analog-to-digital conversion count of the VFWD voltage from the KAT500's RF coupler. `VFWD` and `VRFL` are used to compute the VSWR. `VFWD` is also used for safety thresholds.

### VRFL -- Reflected ADC Count (GET)

GET format:

```text
VRFL;
```

RESPONSE format:

```text
VRFL nnnn;
```

| Parameter | Description                                             |
| --------- | ------------------------------------------------------- |
| `nnnn`    | ADC count, range 0--4095. Leading zeros may be omitted. |

Returns the ADC count of the reflected voltage at the coupler.

### VSWR -- Standing Wave Ratio (GET)

GET format:

```text
VSWR;
```

RESPONSE format:

```text
VSWR nn.nn;
```

| Parameter | Description                                                        |
| --------- | ------------------------------------------------------------------ |
| `nn.nn`   | VSWR value, range 0.00--99.99 (99.99 represents 99.99:1 or higher) |

### VSWRB -- Standing Wave Ratio in Bypass (GET)

GET format:

```text
VSWRB;
```

RESPONSE format:

```text
VSWRB nn.nn;
```

| Parameter | Description                                                               |
| --------- | ------------------------------------------------------------------------- |
| `nn.nn`   | Bypass VSWR value, range 0.00--99.99 (99.99 represents 99.99:1 or higher) |

`VSWRB` is the VSWR of the antenna as measured at the KAT500 coupler when the bypass relay was released, without any KAT500 inductors or capacitors in the RF path.
