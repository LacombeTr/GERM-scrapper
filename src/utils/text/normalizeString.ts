export function normalizeString(str: string): string {
    return str
        .normalize("NFD") // Décompose les caractères avec accents (é -> e +  ́)
        .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
        .replace(/[^a-zA-Z0-9]/g, "") // Supprime les caractères spéciaux (garde uniquement lettres et chiffres)
}