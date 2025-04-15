import {normalizeString} from "./normalizeString";

const slugify = (str: string) => {
    return str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace('.', '');
}

export default slugify