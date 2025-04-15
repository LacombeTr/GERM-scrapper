import { relations } from "drizzle-orm/relations";
import { volcanoes, eruptions, continents, countries, episodes, events, bulletins } from "./schema";

export const eruptionsRelations = relations(eruptions, ({one, many}) => ({
	volcano: one(volcanoes, {
		fields: [eruptions.volcanoid],
		references: [volcanoes.id]
	}),
	episodes: many(episodes),
}));

export const volcanoesRelations = relations(volcanoes, ({one, many}) => ({
	eruptions: many(eruptions),
	country: one(countries, {
		fields: [volcanoes.countryid],
		references: [countries.id]
	}),
	bulletins: many(bulletins),
}));

export const countriesRelations = relations(countries, ({one, many}) => ({
	continent: one(continents, {
		fields: [countries.continentid],
		references: [continents.id]
	}),
	volcanoes: many(volcanoes),
	bulletins: many(bulletins),
}));

export const continentsRelations = relations(continents, ({many}) => ({
	countries: many(countries),
}));

export const episodesRelations = relations(episodes, ({one, many}) => ({
	eruption: one(eruptions, {
		fields: [episodes.eruptionid],
		references: [eruptions.id]
	}),
	events: many(events),
}));

export const eventsRelations = relations(events, ({one}) => ({
	episode: one(episodes, {
		fields: [events.episodeid],
		references: [episodes.id]
	}),
}));

export const bulletinsRelations = relations(bulletins, ({one}) => ({
	country: one(countries, {
		fields: [bulletins.countryid],
		references: [countries.id]
	}),
	volcano: one(volcanoes, {
		fields: [bulletins.volcanoid],
		references: [volcanoes.id]
	}),
}));