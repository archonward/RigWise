# RigWise

RigWise is a web app for planning consumer PC upgrades. The goal is to help users enter their current PC build, budget, and target use case, then surface smarter upgrade paths, compatibility warnings, and better value-for-money part choices.

This repository is set up as a simple monorepo-style project with separate frontend and backend folders so you can grow each side independently without adding unnecessary complexity yet.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: SQLite for local development
- Package manager: npm

## Project Structure

```text
RigWise/
  frontend/
  backend/
  README.md
  .gitignore
```

## Frontend Setup

The frontend lives in `frontend/` and uses React, TypeScript, Vite, and Tailwind CSS.

### Install dependencies

```bash
cd frontend
npm install
```

### Run the frontend

```bash
npm run dev
```

By default, Vite will start a local development server and print the local URL in the terminal.

### Build the frontend

```bash
npm run build
```

## Backend Setup

The backend lives in `backend/` and uses Express, TypeScript, and SQLite.
RigWise currently uses seeded sample PC part data for local development and testing. Prices, scores, and notes are realistic placeholders rather than live market data.

### Install dependencies

```bash
cd backend
npm install
```

### Run the backend in development

```bash
npm run dev
```

The backend starts on `http://localhost:3001` by default.
On first startup, it creates `backend/data/rigwise.db`, creates the `parts` table if needed, and inserts sample parts when the table is empty.

### Reset and reseed the database

If you want to rebuild the local parts catalogue from the current seed data:

```bash
npm run reset-db
npm run dev
```

`reset-db` deletes `backend/data/rigwise.db` if it exists. The next backend start recreates the database and reseeds the `parts` table automatically.

### Build the backend

```bash
npm run build
```

### Start the built backend

```bash
npm run start
```

## API Endpoints

### Health check

`GET /health`

Response:

```json
{
  "status": "ok",
  "service": "rigwise-backend"
}
```

### Parts API

`GET /api/parts`

Returns all seeded sample parts from the local SQLite database.

### Filter by category

`GET /api/parts?category=GPU`

Returns only parts in the `GPU` category.

### Search by name or brand

`GET /api/parts?search=ryzen`

`GET /api/parts?search=nvidia`

`GET /api/parts?search=ddr5`

`GET /api/parts?search=7800x3d`

Search is case-insensitive and matches against fields such as `name`, `brand`, `category`, `memoryType`, `socket`, `chipset`, and `notes`.

### Combine category and search

`GET /api/parts?category=GPU&search=rtx`

Returns only GPU parts whose name or brand matches `rtx`.

## Quick Start

From the repository root, run:

```bash
cd frontend
npm install
npm run dev
```

In a second terminal:

```bash
cd backend
npm install
npm run dev
```

## Testing the Parts API

Once the backend is running, test these URLs:

- `http://localhost:3001/health`
- `http://localhost:3001/api/parts`
- `http://localhost:3001/api/parts?category=CPU`
- `http://localhost:3001/api/parts?category=GPU`
- `http://localhost:3001/api/parts?category=Motherboard`
- `http://localhost:3001/api/parts?category=Storage`
- `http://localhost:3001/api/parts?search=ryzen`
- `http://localhost:3001/api/parts?search=ddr5`
- `http://localhost:3001/api/parts?search=7800x3d`
- `http://localhost:3001/api/parts?category=GPU&search=rtx`

## Notes

- Authentication is not implemented yet.
- The recommendation engine is not implemented yet.
- The backend includes a basic SQLite connection for local development, with the database stored under `backend/data/`.
