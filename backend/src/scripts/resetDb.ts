import fs from 'node:fs';
import path from 'node:path';

const databasePath = path.resolve(__dirname, '../../data/rigwise.db');

if (fs.existsSync(databasePath)) {
  fs.unlinkSync(databasePath);
  console.log(`Deleted database: ${databasePath}`);
} else {
  console.log(`Database file not found, nothing to delete: ${databasePath}`);
}

console.log('Run `npm run dev` to recreate and reseed the database.');
