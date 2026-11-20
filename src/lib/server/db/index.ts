import { DATABASE_URL } from '$app/env/private';
import { getPlatformPackageName } from '@sqliteai/sqlite-vector';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { createRequire } from 'node:module';
import * as schema from './schema';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

if (!DATABASE_URL.startsWith('file:')) {
	throw new Error('DATABASE_URL must be a local SQLite file URL');
}

const databasePath = DATABASE_URL.slice('file:'.length);
if (!databasePath) throw new Error('DATABASE_URL must include a SQLite file path');

const require = createRequire(import.meta.url);
const extensionPackage = require(getPlatformPackageName()) as { path?: unknown };
if (typeof extensionPackage.path !== 'string') {
	throw new Error('SQLite Vector platform package does not expose an extension path');
}

const client = new Database(databasePath);
client.loadExtension(extensionPackage.path);

export const db = drizzle(client, { schema });
