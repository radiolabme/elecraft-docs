---
title: KPA500 Remote Command Reference
description: Complete remote control command reference for the Elecraft KPA500 amplifier (Rev. A2)
---

## Introduction

This document is derived from Elecraft's KPA500 Programmer's Reference, Rev. A2. It provides a complete reference for all remote control commands supported by the Elecraft KPA500 500-watt amplifier. The KPA500 provides a set of remote-control commands to control most functions and to allow monitoring of the amplifier.

## Command Set Overview

| Name   | Description               | Name   | Description               |
| ------ | ------------------------- | ------ | ------------------------- |
| `^AL`  | ALC Threshold             | `^OS`  | STBY/OP Mode Selection    |
| `^AR`  | Atten Fault Release Time  | `^PJ`  | Power Adjustment          |
| `^BC`  | STBY on Band Change       | `^RVM` | Firmware Version          |
| `^BN`  | Band Selection            | `^SN`  | Serial Number             |
| `^BRP` | PC Port RS232 Data Rate   | `^SP`  | Speaker On/Off            |
| `^BRX` | XCVR Port RS232 Data Rate | `^TM`  | PA Temperature            |
| `^DMO` | Demo Mode                 | `^TR`  | T/R Delay Time            |
| `^FC`  | Fan Minimum Control       | `^VI`  | PA Voltage and Current    |
| `^FL`  | Fault Value               | `^WS`  | Power / SWR               |
| `^NH`  | INHIBIT Input Control     | `^XI`  | Radio Interface Selection |
| `^ON`  | Power Status/Control      |        |                           |

## Command Format

### Serial Port Settings

Commands are sent to the KPA500 via its serial port. All KPA500 commands use the `^` (caret) prefix.

### GET/SET/RSP Model

Commands sent from the computer to the KPA500 are considered either **GETs** or **SETs**.

- **GET** commands are used by the computer to get information from the KPA500; the KPA500 will then provide an appropriate response message (**RSP**).
- **SET** commands are sent by the computer to change the amplifier's configuration or initiate an event. Commands with an incorrect format or an out-of-range parameter are ignored. A SET can be followed by a GET to verify the new settings.

SET commands use 2 or 3 characters (after the `^` prefix), optional data fields, and a terminating semicolon (`;`). Examples:

```text
^BN05;       Computer selects 20m band
^OS1;        Computer sets OPER mode in KPA500
```

Many SET commands have a corresponding GET command, which is just the command letters with no data, plus the semicolon. The data format of the response message from the KPA500 (RSP) is usually identical to the format of the SET data. Exceptions are noted in the command descriptions.

Characters sent to the KPA500 can be in either upper or lower case. The KPA500 always responds with upper case. The KPA500 will respond to a null command containing only a `;` by echoing the `;` character. This may be useful to verify that the PC is communicating with the KPA500.

## Command Reference

This section describes all KPA500 GET, SET, and RSP (response) command formats. Unless otherwise noted, the GET format is just the command letters followed by a semicolon. The SET and RSP data formats are identical unless otherwise noted. All commands must be followed by a semicolon except where noted.

### ^AL -- ALC Threshold (GET/SET)

SET/RSP format:

```text
^ALnnn;
```

| Parameter | Description               |
| --------- | ------------------------- |
| `nnn`     | ALC setting, range 0--210 |

The ALC value is saved on a per-band basis for the current band. The response indicates the setting for the current band.

### ^AR -- Attenuator Fault Release Time (GET/SET)

SET/RSP format:

```text
^ARnnnn;
```

| Parameter | Description                                                 |
| --------- | ----------------------------------------------------------- |
| `nnnn`    | Attenuation timeout value in milliseconds, range 1400--5000 |

### ^BC -- STBY on Band Change (GET/SET)

SET/RSP format:

```text
^BCn;
```

| Parameter | Description                                                                         |
| --------- | ----------------------------------------------------------------------------------- |
| `n`       | `1` = stay in STBY after band change; `0` = return to previous state (STBY or OPER) |

### ^BN -- Band Selection (GET/SET)

SET/RSP format:

```text
^BNnn;
```

| Value | Band |
| ----- | ---- |
| `00`  | 160m |
| `01`  | 80m  |
| `02`  | 60m  |
| `03`  | 40m  |
| `04`  | 30m  |
| `05`  | 20m  |
| `06`  | 17m  |
| `07`  | 15m  |
| `08`  | 12m  |
| `09`  | 10m  |
| `10`  | 6m   |

All other values are ignored.

### ^BRP -- RS232 PC Port Data Rate (GET/SET)

SET/RSP format:

```text
^BRPn;
```

| Value | Data Rate  |
| ----- | ---------- |
| `0`   | 4800 baud  |
| `1`   | 9600 baud  |
| `2`   | 19200 baud |
| `3`   | 38400 baud |

Remember to change the data rate of the PC immediately after changing this value to maintain communications with the KPA500.

### ^BRX -- RS232 XCVR Port Data Rate (GET/SET)

SET/RSP format:

```text
^BRXn;
```

| Value | Data Rate  |
| ----- | ---------- |
| `0`   | 4800 baud  |
| `1`   | 9600 baud  |
| `2`   | 19200 baud |
| `3`   | 38400 baud |

### ^DMO -- Demo Mode (GET/SET)

SET/RSP format:

```text
^DMOn;
```

| Parameter | Description                                     |
| --------- | ----------------------------------------------- |
| `n`       | `1` = DEMO mode enabled; `0` = normal operation |

### ^FC -- Fan Minimum Control (GET/SET)

RSP/SET format:

```text
^FCn;
```

| Parameter | Description                                  |
| --------- | -------------------------------------------- |
| `n`       | Fan minimum speed, range 0 (off) to 6 (high) |

### ^FL -- Current Fault (GET/CLEAR)

SET format:

```text
^FLC;
```

Clears the current fault.

RSP format:

```text
^FLnn;
```

| Parameter | Description                                                    |
| --------- | -------------------------------------------------------------- |
| `nn`      | Current fault identifier. `00` indicates no faults are active. |

### ^NH -- Enable INHIBIT# Input (GET/SET)

SET/RSP format:

```text
^NHn;
```

| Parameter | Description                                                       |
| --------- | ----------------------------------------------------------------- |
| `n`       | `1` = enable INHIBIT# input pin; `0` = disable INHIBIT# input pin |

### ^ON -- Power Status and Off (GET/SET)

SET format:

```text
^ON0;
```

Turns the KPA500 off.

RSP format:

```text
^ONn;
```

| Parameter | Description                                                        |
| --------- | ------------------------------------------------------------------ |
| `n`       | `1` when the KPA500 is on. No response is sent if the unit is off. |

If `^ON;` quickly follows `^ON0;`, you may see a `^ON0;` response. See the `P` command in the Bootloader section for a serial command to turn on the KPA500.

### ^OS -- OP/STBY (GET/SET)

SET/RSP format:

```text
^OSn;
```

| Parameter | Description                       |
| --------- | --------------------------------- |
| `n`       | `0` = Standby; `1` = Operate mode |

### ^PJ -- Power Adjustment (GET/SET)

SET/RSP format:

```text
^PJnnn;
```

| Parameter | Description                             |
| --------- | --------------------------------------- |
| `nnn`     | Power adjustment setting, range 80--120 |

The Power Adjustment value is saved on a per-band basis for the current band. The response indicates the setting for the current band.

### ^RVM -- Firmware Release Identifier (GET only)

RSP format:

```text
^RVMnn.nn;
```

| Parameter | Description             |
| --------- | ----------------------- |
| `nn.nn`   | Firmware version number |

### ^SN -- Serial Number (GET only)

RSP format:

```text
^SNnnnnn;
```

| Parameter | Description          |
| --------- | -------------------- |
| `nnnnn`   | KPA500 serial number |

### ^SP -- Fault Speaker On/Off (GET/SET)

SET/RSP format:

```text
^SPn;
```

| Parameter | Description                         |
| --------- | ----------------------------------- |
| `n`       | `0` = speaker off; `1` = speaker on |

### ^TM -- PA Temperature (GET only)

RSP format:

```text
^TMnnn;
```

| Parameter | Description                                  |
| --------- | -------------------------------------------- |
| `nnn`     | Temperature in degrees Celsius, range 0--150 |

### ^TR -- T/R Delay Time (GET/SET)

SET/RSP format:

```text
^TRnn;
```

| Parameter | Description                                                     |
| --------- | --------------------------------------------------------------- |
| `nn`      | TR delay time for TX-to-RX transition, range 0--50 milliseconds |

### ^VI -- PA Voltage and Current (GET only)

RSP format:

```text
^VIvvv iii;
```

| Parameter | Description                                                                   |
| --------- | ----------------------------------------------------------------------------- |
| `vvv`     | PA voltage, range 00.0--99.9 volts (implied decimal point after second digit) |
| `iii`     | PA current, range 00.0--99.9 amps (implied decimal point after second digit)  |

### ^WS -- Power/SWR (GET only)

RSP format:

```text
^WSppp sss;
```

| Parameter | Description                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------- |
| `ppp`     | Output power in watts, range 0--999                                                                      |
| `sss`     | SWR with implied decimal point after second digit, range 1.0--99.0. Returns `000` when not transmitting. |

### ^XI -- Radio Interface (GET/SET)

SET/RSP format:

```text
^XIno;
```

| Parameter | Description                        |
| --------- | ---------------------------------- |
| `n`       | Transceiver type (see table below) |
| `o`       | Radio-dependent option value       |

| Value of `n` | Transceiver Type              | Option (`o`)                                        |
| ------------ | ----------------------------- | --------------------------------------------------- |
| `0`          | K3                            | Ignored. Always returns `o = 1` in V1.04 and later. |
| `1`          | BCD                           | Ignored.                                            |
| `2`          | Analog (Icom voltage levels)  | Ignored.                                            |
| `3`          | Elecraft / Kenwood serial I/O | `o = 1` enables polling of radio for frequency.     |

## Bootloader Commands

The KPA500 uses single-character commands when in boot mode. Boot mode is the state the KPA500 is in when the rear panel power switch is in the ON position while the main firmware is not running. This mode is used for starting up the KPA500 or downloading fresh firmware. Bootloader commands must be sent in upper case only. Bootloader commands do not use the `^` prefix or a terminating semicolon.

### D -- Download Firmware

The `D` command is used to download firmware to the KPA500. This command is for Elecraft internal use only. Accidentally issuing a `D` command may require a rear panel power-off for recovery.

### I -- Identify

On receipt of the `I` command, the amplifier will respond with `KPA500`.

### P -- Power On

The `P` command causes the KPA500 to perform internal firmware checks, then execute the main firmware to power up the amplifier. This is the command to use to remotely power up the KPA500. No response is sent from the KPA500 after receiving this command.

## Appendix: Change History

- **A1**, 7-4-11 (firmware 1.04): Initial release.
