import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

/**
 * Initialize Turso database connection
 */
const db = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default db;
