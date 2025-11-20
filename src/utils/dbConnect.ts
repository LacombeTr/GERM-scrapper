import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

export function dbConnect() {
    return drizzle(process.env.DATABASE_URL!);
}
