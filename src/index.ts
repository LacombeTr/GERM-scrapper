import express, {Request, Response} from "express";
import 'dotenv/config';
import {setupSwagger} from "./config/swaggerConfig";
import {drizzle} from 'drizzle-orm/node-postgres';
import {VolcanoesHandler} from "./routes/getVolcanoes";
import {GetEruptions} from "./routes/getEruptions";

const app = express();
const PORT = process.env.PORT || 3000;

const db = drizzle(process.env.DATABASE_URL!);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the VolcAPI");
});

app.get("/volcano", VolcanoesHandler.getAllVolcanoes);
app.get('/volcano/getVolcanoByID/:id', VolcanoesHandler.getVolcanoById)
app.get('/volcano/getVolcanoByName/:name', VolcanoesHandler.getVolcanoByName)

app.get("/eruption", GetEruptions.getAllEruptions)
app.get("/eruption/volcano/volcanoById/:id", GetEruptions.getEruptionsByVolcanoID)
// app.get("/eruption/volcano/volcanoByName/:name", GetEruptions.getEruptionsByVolcanoID)

setupSwagger(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});