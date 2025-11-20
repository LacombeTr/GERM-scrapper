import express, { Request, Response } from "express";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { ElementHandler } from "./routes/reservoir/ElementHandler";

const app = express();
const PORT = process.env.PORT || 3000;

const db = drizzle(process.env.DATABASE_URL!);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the VolcAPI");
});

app.get("/reservoir", ElementHandler.getAllElement);
app.get("/reservoir/z/:z", (req: Request, res: Response) => {
    req.query.z = req.params.z;
    ElementHandler.getElement(req, res);
});
app.get("/reservoir/symbol/:symbol", (req: Request, res: Response) => {
    req.query.symbol = req.params.symbol;
    ElementHandler.getElement(req, res);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
