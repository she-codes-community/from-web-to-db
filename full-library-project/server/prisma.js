
import prismaPkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/******************** Prisma Client & DB connection ********************/
const { PrismaClient } = prismaPkg;
const { Pool } = pg;
const pool = new Pool({
    connectionString: "postgresql://user:password@zone/library_db?sslmode=require&channel_binding=require",
});

export const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
});

/******************** DB specific functions ********************/
export function toPrismaId(id) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
        throw new Error("INVALID_PRISMA_ID: " + id);
    }
    return numericId;
}
