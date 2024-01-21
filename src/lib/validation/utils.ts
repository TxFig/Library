export const MAX_INT32BIT = 2 ** 31 - 1


export function isNullish<T>(value: T | null | undefined): value is null | undefined {
    return value == null || value == undefined
}
