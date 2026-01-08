import prismaPkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
const { PrismaClient } = prismaPkg;
const { Pool } = pg;
const pool = new Pool({
    connectionString: "/* add yours */",
});
export const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
});

