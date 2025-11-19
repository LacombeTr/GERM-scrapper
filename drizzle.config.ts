import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: `postgresql://${process.env.POSTGRES_USER!}:${process.env
            .POSTGRES_PASSWORD!}@127.0.0.1:5432/${process.env
            .POSTGRES_DB!}?serverVersion=16&charset=utf8`,
    },
});
