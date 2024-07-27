export function isObjectEmpty<T extends object>(obj: T | {}): obj is {} {
    return Object.keys(obj).length === 0 && obj.constructor === Object
}

export function isObjectNotEmpty<T extends object>(obj: T | {}): obj is T {
    return !isObjectEmpty(obj)
}

export default isObjectEmpty
