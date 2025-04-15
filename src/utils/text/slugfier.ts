import {normalizeString} from "./normalizeString";

const slugify = (str: string) => {
    return normalizeString(str).replace(' ', '-')
}

export default slugify