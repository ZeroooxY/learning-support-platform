# Learning Support Platform

This project consists of a backend (Express/MongoDB) and a frontend (React/Vite).

## Prerequisites

- Node.js installed
- MongoDB installed and running locally on port 27017

## Setup

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (if not exists) with the following content:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/learning_platform
   JWT_SECRET=supersecretkey
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (or similar).

### Mobile App

1. Navigate to the `mobile` directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   This will start the Expo Metro Bundler.
   - Press `a` to open in Android Emulator.
   - Scan the QR code with Expo Go app on your phone.
     - *Note*: If running on a physical phone, update `src/services/api.js` to use your computer's local IP address instead of `localhost` or `10.0.2.2`.

## Features

- **Login/Register**: User authentication.
- **Dashboard**: View learning materials.
- **Detail View**: View details of a material and its sub-materials.
- **Create Course**: Admin users can create new courses.
- **Deleted Materials**: View and restore deleted materials.
- **Mobile Responsive**: The layout adapts to mobile screens.

## Initial Data

To seed the database with initial data, you can run:
```bash
curl -X POST http://localhost:5000/api/seed
```
(On Windows PowerShell: `Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/seed`)
