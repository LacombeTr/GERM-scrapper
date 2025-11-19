CREATE TABLE "element_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"reservoir" varchar(255) NOT NULL,
	"z" integer,
	"element" varchar(10) NOT NULL,
	"value" numeric,
	"median" numeric,
	"sd" numeric,
	"low" numeric,
	"high" numeric,
	"analysis_number" integer,
	"unit" varchar(50),
	"info" text,
	"reference" text,
	"reference_url" text,
	"source" text,
	"source_url" text
);
