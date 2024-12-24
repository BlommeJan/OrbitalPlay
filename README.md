# OrbitalPlay

![OrbitalPlay Logo](https://orbitalplay.com/images/logo.png)

**OrbitalPlay** is a fitness-inspired gaming solution featuring custom-made Lua games using LÖVE2D and C++ controller software. Developed by Jan Blomme and Guus Loccufier, it offers a seamless gaming experience with real-time controller feedback and customizable in-game overlays. This project includes everything needed to recreate the system.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Resources](#resources)
- [License](#license)
- [Contact](#contact)

## Overview

This repository contains:
- Custom **Lua games** developed with the LÖVE2D framework.
- **C++ controller software** for input management.
- All necessary **3D files** for hardware components.
- A **guide** to build and configure the system.
- A **Bill of Materials (BOM)** and additional documentation.

## Features

- **Custom Games**: Designed to enhance fitness and fun.
- **In-Game Overlay**: Customizable with opacity, position, and hotkey options.
- **Controller Feedback**: Real-time status from the C++ software.
- **User Customization**: Adjustable settings for a personalized experience.

## Technologies Used

- **Lua** and **LÖVE2D** for game development.
- **C++** for the controller software.
- **JSON** for configuration and data management.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/janblomme/orbitalplay.git
   cd orbitalplay
   ```

2. **Install dependencies**:
   - Ensure you have LÖVE2D and a C++ compiler installed.

3. **Build the controller software**:
   ```bash
   make
   ```

4. **Run the games**:
   ```bash
   love [game_folder]
   ```

## Usage

- **Launch OrbitalPlay Games**: Run any of the Lua-based games in the repository using LÖVE2D.
- **Controller Feedback**: Start the C++ software for real-time input feedback.
- **Overlay Control**: Configure and toggle the in-game overlay as needed.

## Configuration

- **Edit `games.json`** to add or manage games.
- **Modify `settings.json`** to adjust overlay and feedback settings.

## Resources

This repository includes:
- **3D Files** for hardware components.
- A **build guide** to set up the system.
- A **Bill of Materials (BOM)** for parts and components.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

Developed by **Jan Blomme** and **Guus Loccufier**.

- **Email**: jan@itsbryce.com
- **LinkedIn**: [Jan Blomme](https://www.linkedin.com/in/jan-blomme-17b0bb258/)
