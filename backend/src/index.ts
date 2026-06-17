import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { initializeDatabase } from './db';
import { errorHandler } from './middleware/errorHandler';
import healthRouter from './routes/healthRoutes';
import partRouter from './routes/partRoutes';
import recommendationRouter from './routes/recommendationRoutes';

const app = express();
const port = Number(process.env.PORT) || 3001;

function allowFrontendRequests(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const allowedOrigins = new Set([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ]);

  const requestOrigin = request.headers.origin;

  if (requestOrigin && allowedOrigins.has(requestOrigin)) {
    response.header('Access-Control-Allow-Origin', requestOrigin);
  }

  response.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.header('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }

  next();
}

app.use(allowFrontendRequests);
app.use(express.json());

app.use('/health', healthRouter);
app.use('/api/parts', partRouter);
app.use('/api/recommendations', recommendationRouter);

app.use(errorHandler);

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(port, () => {
      console.log(`RigWise backend is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize the database.', error);
    process.exit(1);
  }
}

void startServer();
