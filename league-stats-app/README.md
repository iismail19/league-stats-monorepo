# League Stats App

A modern, clean League of Legends statistics application built with React, TypeScript, and Vite.

## Features

- Search for summoners by name and tagline (e.g., "God of Wind #NA1")
- View match history in an elegant card-based layout
- Expandable match cards with detailed statistics
- Modern, dark-themed UI inspired by op.gg

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- League Backend server running (see `league-backend` directory)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional):
```bash
VITE_API_URL=http://localhost:5005
```

If not set, the app defaults to `http://localhost:5005`.

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

### Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling

## Project Structure

```
src/
  components/     # React components
    SearchBar.tsx # Search input component
    MatchCard.tsx # Match card with expandable details
  types/          # TypeScript type definitions
  utils/          # Utility functions
    api.ts        # API client
    matchUtils.ts # Match data utilities
  App.tsx         # Main application component
  main.tsx        # Application entry point
```
