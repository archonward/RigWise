import express from 'express';
import { initializeDatabase } from './db';
import { errorHandler } from './middleware/errorHandler';
import healthRouter from './routes/healthRoutes';
import partRouter from './routes/partRoutes';

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());

app.use('/health', healthRouter);
app.use('/api/parts', partRouter);

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
