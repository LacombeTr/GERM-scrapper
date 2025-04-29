import { pgTable, serial, varchar, foreignKey, integer, text, boolean, index, numeric, date } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const continents = pgTable("continents", {
	id: serial().primaryKey().notNull(),
	continent: varchar({ length: 32 }),
});

export const eruptions = pgTable("eruptions", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "eruptions_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	volcanoid: integer().notNull(),
	startdate: text(),
	enddate: text(),
	confirmed: boolean().notNull(),
	type: text(),
	vei: integer(),
	uncertaintystartdate: text(),
	uncertaintyenddate: text(),
}, (table) => [
	foreignKey({
			columns: [table.volcanoid],
			foreignColumns: [volcanoes.id],
			name: "fk_volcanoes"
		}),
]);

export const countries = pgTable("countries", {
	id: serial().primaryKey().notNull(),
	country: varchar({ length: 64 }),
	continentid: integer(),
}, (table) => [
	index("idx_countries_continentid").using("btree", table.continentid.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.continentid],
			foreignColumns: [continents.id],
			name: "countries_continentid_fkey"
		}).onDelete("set null"),
]);

export const episodes = pgTable("episodes", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "episode_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	eruptionid: integer().notNull(),
	startdate: text(),
	enddate: text(),
	location: text(),
	sourceofconf: varchar({ length: 32 }),
	typeofepisode: varchar({ length: 64 }),
}, (table) => [
	foreignKey({
			columns: [table.eruptionid],
			foreignColumns: [eruptions.id],
			name: "fk_eruptions"
		}),
]);

export const events = pgTable("events", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "episode_id_seq1", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	episodeid: integer().notNull(),
	startdate: text(),
	enddate: text(),
	eventtype: varchar({ length: 64 }),
	remarks: text(),
}, (table) => [
	foreignKey({
			columns: [table.episodeid],
			foreignColumns: [episodes.id],
			name: "fk_episodes"
		}),
]);

export const volcanoes = pgTable("volcanoes", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }),
	countryid: integer(),
	altitude: integer(),
	latitude: numeric(),
	longitude: numeric(),
	type: varchar({ length: 64 }),
	lasteruption: integer(),
	smithsonianid: integer(),
	slug: text().default(').notNull(),
}, (table) => [
	index("idx_volcanoes_countryid").using("btree", table.countryid.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.countryid],
			foreignColumns: [countries.id],
			name: "volcanoes_countryid_fkey"
		}).onDelete("cascade"),
]);

export const bulletins = pgTable("bulletins", {
	id: serial().primaryKey().notNull(),
	volcanoid: integer(),
	countryid: integer(),
	watchstart: date(),
	watchend: date(),
	description: text(),
	source: text(),
	pubdate: date(),
	latitude: numeric(),
	longitude: numeric(),
	status: varchar({ length: 32 }),
}, (table) => [
	index("idx_bulletins_countryid").using("btree", table.countryid.asc().nullsLast().op("int4_ops")),
	index("idx_bulletins_volcanoid").using("btree", table.volcanoid.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.countryid],
			foreignColumns: [countries.id],
			name: "bulletins_countryid_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.volcanoid],
			foreignColumns: [volcanoes.id],
			name: "bulletins_volcanoid_fkey"
		}).onDelete("cascade"),
]);
