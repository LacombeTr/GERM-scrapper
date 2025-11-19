import {
    pgTable,
    serial,
    varchar,
    numeric,
    integer,
    text,
} from "drizzle-orm/pg-core";

export const elementValues = pgTable("element_values", {
    id: serial("id").primaryKey(),
    reservoir: varchar("reservoir", { length: 255 }).notNull(),
    z: integer("z"),
    element: varchar("element", { length: 10 }).notNull(),
    value: numeric("value"),
    median: numeric("median"),
    sd: numeric("sd"),
    low: numeric("low"),
    high: numeric("high"),
    analysisNumber: integer("analysis_number"),
    unit: varchar("unit", { length: 50 }),
    info: text("info"),
    reference: text("reference"),
    referenceURL: text("reference_url"),
    source: text("source"),
    sourceURL: text("source_url"),
});
