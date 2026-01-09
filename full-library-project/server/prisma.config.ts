export default defineConfig({
    datasource: {
        url: "postgresql://user:password@zone/library_db?sslmode=require&channel_binding=require"
    },
});

import { defineConfig } from "prisma/config";
