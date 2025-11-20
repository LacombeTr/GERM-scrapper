import {
    pgTable,
    serial,
    varchar,
    numeric,
    integer,
    text,
} from "drizzle-orm/pg-core";

/**
 * Table stockant les valeurs d'éléments géochimiques provenant de divers réservoirs.
 * Cette table contient des données analytiques pour différents éléments chimiques
 * trouvés dans des échantillons géologiques, incluant des mesures statistiques et métadonnées.
 */
export const elementValues = pgTable("element_values", {
    /** Identifiant unique pour chaque enregistrement de valeur d'élément */
    id: serial("id").primaryKey(),
    
    /** Nom du réservoir géologique (ex: "Manteau Primitif", "MORB") */
    reservoir: varchar("reservoir", { length: 255 }).notNull(),
    
    /** Numéro atomique de l'élément chimique */
    z: integer("z"),
    
    /** Symbole chimique ou nom de l'élément (ex: "Si", "Al", "Fe") */
    element: varchar("element", { length: 255 }).notNull(),
    
    /** Valeur principale mesurée ou calculée pour la concentration de l'élément */
    value: numeric("value"),
    
    /** Valeur médiane provenant de multiples analyses ou sources de données */
    median: numeric("median"),
    
    /** Écart-type indiquant la variabilité des données */
    sd: numeric("sd"),
    
    /** Borne inférieure ou valeur minimale dans le jeu de données */
    low: numeric("low"),
    
    /** Borne supérieure ou valeur maximale dans le jeu de données */
    high: numeric("high"),
    
    /** Nombre d'analyses utilisées pour calculer les valeurs statistiques */
    analysisNumber: integer("analysis_number"),
    
    /** Unité de mesure (ex: "ppm", "wt%", "ppb") */
    unit: varchar("unit", { length: 50 }),
    
    /** Informations supplémentaires ou notes sur la mesure */
    info: text("info"),
    
    /** Citation ou référence pour la source des données */
    reference: text("reference"),
    
    /** Lien URL vers la publication de référence ou la source */
    referenceURL: text("reference_url"),
    
    /** Nom ou description de la source des données */
    source: text("source"),
    
    /** Lien URL vers la source de données originale */
    sourceURL: text("source_url"),
});
