import { elementValues } from "./db/schema";

/**
 * Type for element analysis values from volcanic samples - inferred from database schema
 */
export type ElementValueSelect = typeof elementValues.$inferSelect;
export type ElementValueInsert = typeof elementValues.$inferInsert;

export type ElementValue = Omit<typeof elementValues.$inferSelect, "id"> & {
    id?: number;
};
