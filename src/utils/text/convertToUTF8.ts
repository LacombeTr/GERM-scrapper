export function convertToUtf8(text: string) {
    return Buffer.from(text, "latin1").toString("utf-8");
}