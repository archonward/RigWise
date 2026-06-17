import fs from 'node:fs';
import path from 'node:path';
import sqlite3 from 'sqlite3';
import { seedParts } from './data/seedParts';
import type { Part } from './types/part';

const dataDirectory = path.resolve(__dirname, '../data');
const databasePath = path.join(dataDirectory, 'rigwise.db');

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

sqlite3.verbose();

const db = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.error('Failed to connect to SQLite.', error);
    return;
  }

  console.log(`SQLite connected at ${databasePath}`);
});

function runQuery(sql: string, params: Array<string | number | null> = []) {
  return new Promise<void>((resolve, reject) => {
    db.run(sql, params, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function getSingleRow<T>(sql: string, params: Array<string | number> = []) {
  return new Promise<T>((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row as T);
    });
  });
}

function getAllRows<T>(sql: string, params: Array<string | number> = []) {
  return new Promise<T[]>((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows as T[]);
    });
  });
}

async function createPartsTable() {
  // This keeps local development simple: start the app and the table appears.
  await runQuery(`
    CREATE TABLE IF NOT EXISTS parts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      performanceScore INTEGER NOT NULL,
      powerDraw INTEGER,
      socket TEXT,
      chipset TEXT,
      memoryType TEXT,
      notes TEXT
    )
  `);
}

async function seedPartsTable() {
  const countResult = await getSingleRow<{ count: number }>(
    'SELECT COUNT(*) as count FROM parts',
  );

  if (countResult.count > 0) {
    return;
  }

  const insertSql = `
    INSERT INTO parts (
      name,
      brand,
      category,
      price,
      performanceScore,
      powerDraw,
      socket,
      chipset,
      memoryType,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const part of seedParts) {
    await runQuery(insertSql, [
      part.name,
      part.brand,
      part.category,
      part.price,
      part.performanceScore,
      part.powerDraw,
      part.socket,
      part.chipset,
      part.memoryType,
      part.notes,
    ]);
  }

  console.log(`Inserted ${seedParts.length} sample parts into SQLite.`);
}

export async function initializeDatabase() {
  await createPartsTable();
  await seedPartsTable();
}

interface GetPartsOptions {
  category?: string;
  search?: string;
}

export async function getParts(options: GetPartsOptions = {}) {
  const conditions: string[] = [];
  const params: string[] = [];

  if (options.category) {
    conditions.push('LOWER(category) = LOWER(?)');
    params.push(options.category);
  }

  if (options.search) {
    conditions.push(`
      (
        LOWER(name) LIKE LOWER(?)
        OR LOWER(brand) LIKE LOWER(?)
        OR LOWER(category) LIKE LOWER(?)
        OR LOWER(COALESCE(memoryType, '')) LIKE LOWER(?)
        OR LOWER(COALESCE(socket, '')) LIKE LOWER(?)
        OR LOWER(COALESCE(chipset, '')) LIKE LOWER(?)
        OR LOWER(COALESCE(notes, '')) LIKE LOWER(?)
      )
    `);
    const searchTerm = `%${options.search}%`;
    params.push(
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
    );
  }

  let sql = 'SELECT * FROM parts';

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  sql += ' ORDER BY category ASC, brand ASC, name ASC';

  return getAllRows<Part>(sql, params);
}

export default db;
