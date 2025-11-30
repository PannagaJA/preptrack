# PrepTrack

PrepTrack is a full-stack web application designed to help users prepare for aptitude tests, track their progress, and compete on leaderboards. The project consists of a Node.js/Express backend and a React frontend powered by Vite.

## Features
- User authentication and profile management
- Aptitude test platform with scoring
- Leaderboard to track top performers
- Personalized learning roadmap
- Chatbot for assistance

## Project Structure
```
backend/    # Node.js/Express API, database, and routes
frontend/   # React app (Vite), UI components, pages
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure your environment variables in a `.env` file (see `config/database.js` for required variables).
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm run dev
   ```

### Usage
- Access the frontend at `http://localhost:5173` (default Vite port).
- The backend runs on `http://localhost:3000` by default.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

