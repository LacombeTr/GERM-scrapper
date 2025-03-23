-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "continents" (
	"id" serial PRIMARY KEY NOT NULL,
	"continent" varchar(32)
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"country" varchar(64),
	"continentid" integer
);
--> statement-breakpoint
CREATE TABLE "volcanoes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"countryid" integer,
	"altitude" integer,
	"latitude" numeric,
	"longitude" numeric,
	"type" varchar(64),
	"lasteruption" integer
);
--> statement-breakpoint
CREATE TABLE "eruptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"volcanoid" integer,
	"date" date,
	"confirmed" boolean,
	"vei" integer,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "bulletins" (
	"id" serial PRIMARY KEY NOT NULL,
	"volcanoid" integer,
	"countryid" integer,
	"watchstart" date,
	"watchend" date,
	"description" text,
	"source" text,
	"pubdate" date,
	"latitude" numeric,
	"longitude" numeric
);
--> statement-breakpoint
ALTER TABLE "countries" ADD CONSTRAINT "countries_continentid_fkey" FOREIGN KEY ("continentid") REFERENCES "public"."continents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volcanoes" ADD CONSTRAINT "volcanoes_countryid_fkey" FOREIGN KEY ("countryid") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eruptions" ADD CONSTRAINT "eruptions_volcanoid_fkey" FOREIGN KEY ("volcanoid") REFERENCES "public"."volcanoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bulletins" ADD CONSTRAINT "bulletins_countryid_fkey" FOREIGN KEY ("countryid") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bulletins" ADD CONSTRAINT "bulletins_volcanoid_fkey" FOREIGN KEY ("volcanoid") REFERENCES "public"."volcanoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_countries_continentid" ON "countries" USING btree ("continentid" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_volcanoes_countryid" ON "volcanoes" USING btree ("countryid" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_eruptions_volcanoid" ON "eruptions" USING btree ("volcanoid" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_bulletins_countryid" ON "bulletins" USING btree ("countryid" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_bulletins_volcanoid" ON "bulletins" USING btree ("volcanoid" int4_ops);
*/