import fs from 'node:fs';
import path from 'node:path';
import sqlite3 from 'sqlite3';
import type { NewPart, Part } from './types/part';

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

const sampleParts: NewPart[] = [
  {
    name: 'AMD Ryzen 5 5600',
    brand: 'AMD',
    category: 'CPU',
    price: 130,
    performanceScore: 70,
    powerDraw: 65,
    socket: 'AM4',
    chipset: null,
    memoryType: 'DDR4',
    notes: 'Good value AM4 gaming CPU',
  },
  {
    name: 'AMD Ryzen 7 5700X',
    brand: 'AMD',
    category: 'CPU',
    price: 180,
    performanceScore: 79,
    powerDraw: 65,
    socket: 'AM4',
    chipset: null,
    memoryType: 'DDR4',
    notes: 'Strong 8-core AM4 upgrade option',
  },
  {
    name: 'Intel Core i5-12400F',
    brand: 'Intel',
    category: 'CPU',
    price: 145,
    performanceScore: 72,
    powerDraw: 65,
    socket: 'LGA1700',
    chipset: null,
    memoryType: 'DDR4',
    notes: 'Popular mid-range CPU for budget gaming builds',
  },
  {
    name: 'NVIDIA GeForce RTX 4060',
    brand: 'NVIDIA',
    category: 'GPU',
    price: 299,
    performanceScore: 76,
    powerDraw: 115,
    socket: null,
    chipset: null,
    memoryType: 'GDDR6',
    notes: 'Efficient 1080p card with DLSS support',
  },
  {
    name: 'NVIDIA GeForce RTX 4070',
    brand: 'NVIDIA',
    category: 'GPU',
    price: 549,
    performanceScore: 88,
    powerDraw: 200,
    socket: null,
    chipset: null,
    memoryType: 'GDDR6X',
    notes: 'Strong 1440p performer with good efficiency',
  },
  {
    name: 'AMD Radeon RX 7600',
    brand: 'AMD',
    category: 'GPU',
    price: 269,
    performanceScore: 73,
    powerDraw: 165,
    socket: null,
    chipset: null,
    memoryType: 'GDDR6',
    notes: 'Good value rasterized performance for 1080p gaming',
  },
  {
    name: 'AMD Radeon RX 7800 XT',
    brand: 'AMD',
    category: 'GPU',
    price: 499,
    performanceScore: 90,
    powerDraw: 263,
    socket: null,
    chipset: null,
    memoryType: 'GDDR6',
    notes: 'High-value 1440p GPU with strong VRAM capacity',
  },
  {
    name: 'Corsair Vengeance 16GB DDR4',
    brand: 'Corsair',
    category: 'RAM',
    price: 45,
    performanceScore: 58,
    powerDraw: null,
    socket: null,
    chipset: null,
    memoryType: 'DDR4',
    notes: 'Affordable 2x8GB kit for mainstream builds',
  },
  {
    name: 'Kingston Fury Beast 32GB DDR5',
    brand: 'Kingston',
    category: 'RAM',
    price: 115,
    performanceScore: 75,
    powerDraw: null,
    socket: null,
    chipset: null,
    memoryType: 'DDR5',
    notes: 'Good capacity upgrade for modern DDR5 platforms',
  },
  {
    name: 'MSI MAG B550 Tomahawk',
    brand: 'MSI',
    category: 'Motherboard',
    price: 170,
    performanceScore: 68,
    powerDraw: null,
    socket: 'AM4',
    chipset: 'B550',
    memoryType: 'DDR4',
    notes: 'Reliable AM4 board with solid VRM design',
  },
  {
    name: 'ASUS Prime B760M-A',
    brand: 'ASUS',
    category: 'Motherboard',
    price: 155,
    performanceScore: 69,
    powerDraw: null,
    socket: 'LGA1700',
    chipset: 'B760',
    memoryType: 'DDR5',
    notes: 'Compact Intel board for current mainstream systems',
  },
  {
    name: 'Samsung 980 1TB NVMe SSD',
    brand: 'Samsung',
    category: 'Storage',
    price: 79,
    performanceScore: 74,
    powerDraw: 5,
    socket: null,
    chipset: null,
    memoryType: null,
    notes: 'Fast PCIe NVMe storage for OS and game library',
  },
  {
    name: 'Corsair RM750e PSU',
    brand: 'Corsair',
    category: 'PSU',
    price: 99,
    performanceScore: 80,
    powerDraw: 750,
    socket: null,
    chipset: null,
    memoryType: null,
    notes: 'Efficient 750W unit for mid to upper-range GPUs',
  },
];

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

  for (const part of sampleParts) {
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

  console.log(`Inserted ${sampleParts.length} sample parts into SQLite.`);
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
    conditions.push('(LOWER(name) LIKE LOWER(?) OR LOWER(brand) LIKE LOWER(?))');
    const searchTerm = `%${options.search}%`;
    params.push(searchTerm, searchTerm);
  }

  let sql = 'SELECT * FROM parts';

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  sql += ' ORDER BY category ASC, brand ASC, name ASC';

  return getAllRows<Part>(sql, params);
}

export default db;
