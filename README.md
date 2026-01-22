# League Stats - Monorepo

A full-stack League of Legends statistics application with a React frontend and Express backend.

## Project Structure

```
.
├── league-backend/      # Express.js backend API server
├── league-stats-app/     # React + TypeScript frontend application
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Riot Games API Key (optional for local dev - mock data available)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd league-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   API_KEY=your_riot_api_key_here
   NODE_ENV=dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5005` (dev mode) or `http://localhost:3000` (production).

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd league-stats-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file to override API URL:
   ```bash
   VITE_API_URL=http://localhost:5005
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173` (or the port Vite assigns).

## Development Workflow

### Running Both Services

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd league-backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd league-stats-app
npm run dev
```

### Testing

**Backend Tests:**
```bash
cd league-backend
npm test
```

**Frontend Tests:**
```bash
cd league-stats-app
npm test
```

## Features

### Backend (`league-backend`)
- Express.js REST API
- Riot Games API integration
- Rate limiting (80 requests/2min)
- Caching with NodeCache
- Pagination support
- Health check endpoints

### Frontend (`league-stats-app`)
- React 19 with TypeScript
- Vite build tool
- Tailwind CSS styling
- Match history display
- Player statistics
- Rank information
- Recent searches
- Load more pagination

## Environment Variables

### Backend (`.env` in `league-backend/`)
- `API_KEY` - Your Riot Games API key (required for production, optional in dev)
- `NODE_ENV` - Set to `dev` for local development, `prod` for production

### Frontend (`.env` in `league-stats-app/`)
- `VITE_API_URL` - Backend API URL (optional, defaults to localhost:5005 in dev)

## Deployment

### Backend
The backend is configured to run on Render.com:
- Production port: 3000
- Dev port: 5005
- Health check endpoint: `/health`
- Readiness check endpoint: `/ready`

### Frontend
The frontend can be built for production:
```bash
cd league-stats-app
npm run build
```

The built files will be in the `dist/` directory.

## License

ISC

