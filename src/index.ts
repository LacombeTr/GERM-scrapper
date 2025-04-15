import express, {Request, Response} from "express";
import 'dotenv/config';
import {setupSwagger} from "./config/swaggerConfig";
import {drizzle} from 'drizzle-orm/node-postgres';
import {VolcanoesHandler} from "./routes/volcano/getVolcanoes";
import {GetEruptions} from "./routes/eruptions/getEruptions";

const app = express();
const PORT = process.env.PORT || 3000;

const db = drizzle(process.env.DATABASE_URL!);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the VolcAPI");
});

app.get("/volcanoes", VolcanoesHandler.getAllVolcanoes);
app.get('/volcanoes/getVolcanoByID/:id', VolcanoesHandler.getVolcanoById)
app.get('/volcanoes/getVolcanoByName/:name', VolcanoesHandler.getVolcanoByName)

app.get("/volcanoes/eruptions", GetEruptions.getAllEruptions)
app.get("/volcanoes/eruptions/getEruptionByVolcanoId/:id", GetEruptions.getEruptionsByVolcanoID)
app.get("/volcanoes/eruption/getEruptionByVolcanoName/:name", GetEruptions.getEruptionsByVolcanoName)

setupSwagger(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});