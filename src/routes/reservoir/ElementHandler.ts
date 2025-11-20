import { Request, Response } from "express";
import { dbConnect } from "../../utils/dbConnect";
import { eq } from "drizzle-orm";
import { ElementValueSelect, PeriodicElement } from "../../types";
import { elementValues } from "../../db/schema";

export class ElementHandler {
    public static async getAllElement(request: Request, response: Response) {
        const db = dbConnect();

        try {
            const elementValuesResponse: ElementValueSelect[] = await db
                .select()
                .from(elementValues);

            response.status(200).json(elementValuesResponse);
        } catch (error) {
            console.error("Error fetching values:", error);
            response.status(500).json({ error: "Internal server error" });
        }
    }

    public static async getElement(request: Request, response: Response) {
        const db = dbConnect();
        const { z, symbol } = request.query;

        try {
            let elementValuesResponse: ElementValueSelect[];

            if (z) {
                const elementNumber = parseInt(z as string);
                elementValuesResponse = await db
                    .select()
                    .from(elementValues)
                    .where(eq(elementValues.z, elementNumber))
                    .execute();
            } else if (symbol) {
                const elementSymbol = symbol as string;
                elementValuesResponse = await db
                    .select()
                    .from(elementValues)
                    .where(eq(elementValues.element, elementSymbol))
                    .execute();
            } else {
                return response.status(400).json({ error: "Missing z or symbol parameter" });
            }

            response.status(200).json(elementValuesResponse);
        } catch (error) {
            console.error("Error fetching values:", error);
            response.status(500).json({ error: "Internal server error" });
        }
    }
}
