export function getItemName(name: string, typeLine: string): string {
    if (name !== "") {
        return `${name}, ${typeLine}`;
    } else {
        return `${typeLine}`;
    }
}
