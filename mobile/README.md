# Learning Support Platform - Mobile App

This is the mobile version of the Learning Support Platform, built with React Native and Expo.

## Prerequisites

- Node.js
- [Expo Go](https://expo.dev/client) app on your physical device OR Android Studio (Emulator) / Xcode (Simulator) on your computer.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on your device/emulator:
   - **Physical Device**: Scan the QR code with the Expo Go app.
     - *Note*: Ensure your phone and computer are on the same Wi-Fi network.
     - *Important*: You must update `src/services/api.js` to use your computer's local IP address instead of `localhost` or `10.0.2.2`.
   - **Android Emulator**: Press `a` in the terminal.
     - *Note*: The app is pre-configured to use `10.0.2.2` to access the backend running on the host machine.
   - **iOS Simulator**: Press `i` in the terminal.

## Project Structure

- `App.js`: Main entry point and Navigation setup.
- `src/screens/`: Screen components (Login, Dashboard, Detail).
- `src/services/api.js`: API configuration.
