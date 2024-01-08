export function isNullish<T>(value: T | null | undefined): value is null | undefined {
    return value == null || value == undefined
}

export function convertToNullIfUndefined<T>(value: T | undefined): T | null {
    return value ?? null
}
