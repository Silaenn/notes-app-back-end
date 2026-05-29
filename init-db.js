#!/usr/bin/env node

/**
 * Script untuk create database schema di Turso
 * Run: node init-db.js
 */

import db from "./db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    console.log("📝 Creating database schema...");

    const statements = schema
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (const statement of statements) {
      await db.execute(statement);
      console.log("✅", statement.substring(0, 50) + "...");
    }

    console.log("\n🎉 Database schema created successfully!");
    console.log("💡 Your Turso database is ready to use!\n");
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
    process.exit(1);
  }
}

initDatabase();
