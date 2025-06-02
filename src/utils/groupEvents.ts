import {EruptionDBResponse} from "../types";

function groupEvents(data: Array<EruptionDBResponse>) {
    const eruptionsMap = new Map();

    data.forEach(item => {
        const {
            eruptionId,
            volcano,
            startDate,
            endDate,
            uncertaintyStartDate,
            uncertaintyEndDate,
            confirmed,
            type,
            vei,
            episodeId,
            episodeStartDate,
            episodeEndDate,
            location,
            sourceConf,
            typeEpisode,
            eventStartDate,
            eventEndDate,
            eventType,
            remarks,
        } = item;

        // Si l'éruption n'existe pas, on la crée
        if (!eruptionsMap.has(eruptionId)) {
            eruptionsMap.set(eruptionId, {
                eruptionId,
                volcano,
                startDate,
                endDate,
                uncertaintyStartDate,
                uncertaintyEndDate,
                confirmed,
                type,
                vei,
                episodes: new Map()
            });
        }

        const eruption = eruptionsMap.get(eruptionId);

        // Si l'épisode n'existe pas, on le crée
        if (!eruption.episodes.has(episodeId)) {
            eruption.episodes.set(episodeId, {
                episodeId,
                episodeStartDate,
                episodeEndDate,
                location,
                sourceConf,
                typeEpisode,
                events: []
            });
        }

        const episode = eruption.episodes.get(episodeId);

        // Ajouter l'événement
        episode.events.push({
            eventStartDate,
            eventEndDate,
            eventType,
            remarks
        });
    });

    // Convertir la structure en tableaux
    const finalEruptions = [];
    for (const eruption of eruptionsMap.values()) {
        eruption.episodes = Array.from(eruption.episodes.values());
        finalEruptions.push(eruption);
    }

    return finalEruptions;
}

export default groupEvents;