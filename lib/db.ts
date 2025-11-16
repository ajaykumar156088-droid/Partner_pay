import fs from 'fs';
import path from 'path';

function getDataDir(): string {
  const dataDir = path.join(process.cwd(), 'data');
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return dataDir;
}

// Simple file locking mechanism
const locks = new Map<string, boolean>();

async function acquireLock(filename: string): Promise<void> {
  const lockKey = filename;
  while (locks.get(lockKey)) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  locks.set(lockKey, true);
}

function releaseLock(filename: string): void {
  locks.delete(filename);
}

export async function readJSON<T>(filename: string): Promise<T> {
  const DATA_DIR = getDataDir();
  const filePath = path.join(DATA_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    return {} as T;
  }
  
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return {} as T;
  }
}

export async function writeJSON<T>(filename: string, data: T): Promise<void> {
  const DATA_DIR = getDataDir();
  const filePath = path.join(DATA_DIR, filename);
  const backupPath = path.join(DATA_DIR, `${filename}.backup.json`);
  
  await acquireLock(filename);
  
  try {
    // Create backup if file exists
    if (fs.existsSync(filePath)) {
      const existingData = fs.readFileSync(filePath, 'utf-8');
      fs.writeFileSync(backupPath, existingData, 'utf-8');
    }
    
    // Write new data
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  } finally {
    releaseLock(filename);
  }
}

// Type definitions for database
export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  balance: number;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'admin_add' | 'admin_deduct' | 'withdraw_attempt';
  details: string;
  timestamp: string;
}

export interface UsersData {
  users: User[];
}

export interface TransactionsData {
  transactions: Transaction[];
}

