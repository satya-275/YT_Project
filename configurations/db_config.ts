import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.host, 
    port: 5432, 
    user: process.env.user, 
    password: process.env.password,
    database: process.env.database
})

export const db = drizzle(pool);