import express, { Request, Response } from "express";
import 'dotenv/config';
import {setupSwagger} from "./config/swaggerConfig";
import { drizzle } from 'drizzle-orm/node-postgres';

const app = express();
const PORT = process.env.PORT || 3000;

const db = drizzle(process.env.DATABASE_URL!);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the Node.js + TypeScript API!");
});

setupSwagger(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});