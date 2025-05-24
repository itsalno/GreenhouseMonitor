App is deployed at: https://greenhousemonitor-af0a4.web.app/

# Greenhouse IoT Monitoring System

## Description
A web application for monitoring and managing environmental conditions in a greenhouse using real-time sensor data. Users can view live metrics, set thresholds, and track historical changes.

## Features
- Real-time dashboard displaying sensor data (temperature, humidity, soil moisture).
- User authentication (sign-in/sign-up).
- Ability to set and update warning thresholds for sensor values.
- History log of threshold changes.
- Responsive user interface for desktop and mobile devices.
- Live WebSocket communication for instant data updates.

## Tech Stack
### Backend
- .NET(C#)
- Fleck(for websockets)

### Frontend
- React
- TypeScript
- Vite
- Jotai (for state management)
- Recharts (for charts)
- Tailwind CSS


### Database
Aiven hosted PosgreSql

### Deployment
- Render(Backend)
- Firebase(Frontend)


## Getting Started / Installation

1.  **Clone the repository (if you haven't already or for others):**
    ```bash
    git clone 
    cd GreenhouseIOT 
    ```

2.  **Backend Setup:**
    Navigate to your backend project directory ( `GreenhouseIOT/Greenhouse/server`):
    ```bash
    cd Greenhouse/server
    dotnet restore
    dotnet build
    ```
    *Note: Ensure `appsettings.Development.json` (usually in `Greenhouse/server/Startup`) is configured.*

3.  **Frontend Setup:**
    Navigate to your frontend project directory (e.g., `GreenhouseIOT/Greenhouse/client`):
    ```bash
    npm install 
    ```

## Running the Application

1.  **Start the Backend:**
    From backend project directory (e.g., `GreenhouseIOT/Greenhouse/server/Startup`):
    ```bash
    dotnet run 
    ```

2.  **Start the Frontend:**
    From frontend project directory (e.g., `GreenhouseIOT/Greenhouse/client`):
    ```bash
    npm run dev
    ```


## API Documentation
API documentation is available via OpenAPI. When the backend is running locally, it can usually be accessed in  `server/Startup/openapi.json` file.

## Notes
The app needs some time for connection to establish.(If you run it cold).Around 15 seconds expected.The websocket connection status can be monitored on top of application UI.
