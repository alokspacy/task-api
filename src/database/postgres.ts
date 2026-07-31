import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.warn("⚠️ DATABASE_URL is not set in environment variables");
}

const pool = new Pool({
    connectionString,
});

export async function initPostgres() {
    try {
        const client = await pool.connect();
        console.log("✅ Successfully connected to PostgreSQL");

        await client.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                done BOOLEAN NOT NULL DEFAULT FALSE
            );
        `);
        console.log("✅ Tasks table initialized in PostgreSQL");

        client.release();
    } catch (error) {
        console.error("❌ Error connecting to PostgreSQL:", error);
    }
}

initPostgres();

export default pool;
