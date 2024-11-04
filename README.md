# OrbitalPlay

**OrbitalPlay** is a custom gaming solution designed for fitness-inspired setups. This project includes a Windows game launcher developed by Jan Blomme in C# and controller software created by Guus Loccufier in C++. The launcher organizes games based on input type (one-ball or two-ball) and features a customizable in-game overlay. The controller software provides real-time feedback for a seamless gaming experience.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Resources](#resources)
- [Contact](#contact)

## Overview

This repository contains:
- The **C# game launcher** developed for Windows.
- The **C++ controller software** for input management.
- All necessary **3D files** for hardware.
- A **guide** to build and configure the system.
- A **Bill of Materials (BOM)** and other documentation.

## Features

- **Categorized Game Launcher**: Organize games based on input type.
- **In-Game Overlay**: Customizable with opacity, position, and hotkey options.
- **Controller Feedback**: Real-time status from the C++ software.
- **User Customization**: Theme switching and configurable settings.

## Technologies Used

- **C#** (WPF) for the game launcher.
- **C++** for the controller software.
- **Newtonsoft.Json** for data handling.
- **Gma.System.MouseKeyHook** for hotkey support.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/janblomme/orbitalplay.git
   cd orbitalplay
   ```

2. **Build the Windows application**:
   ```bash
   dotnet build
   ```

3. **Run the launcher**:
   ```bash
   dotnet run
   ```

## Usage

- **Launch OrbitalPlay**: Start the game launcher and browse the categorized game library.
- **Overlay Control**: Use the configured hotkey to toggle the in-game overlay.
- **Controller Verification**: Check real-time input status through the controller software.

## Configuration

- **Modify `games.json`** for game management.
- **Adjust `settings.json`** for user preferences.

## Resources

This repository includes:
- **3D Files** for hardware components.
- A **build guide** to set up the system.
- A **Bill of Materials (BOM)** for parts and components.

## Contact

Developed by **Jan Blomme** and **Guus Loccufier**.

- **Email**: jan@itsbryce.com
- **LinkedIn**: [Jan Blomme](https://www.linkedin.com/in/jan-blomme-17b0bb258/)
