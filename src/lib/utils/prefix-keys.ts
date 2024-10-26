import type { Entries } from "./types"


export type PrefixKeys<Prefix extends string, Object> = keyof Object extends string | number ? {
    [Key in keyof Object as `${Prefix}${Key}`]: Object[Key]
} : never

export function prefixKeys<
    Prefix extends string,
    Object extends Record<string | number, any>
>(prefix: Prefix, object: Object): PrefixKeys<Prefix, Object> {
    const newObject = {} as PrefixKeys<Prefix, Object>

    for (const [key, value] of Object.entries(object) as Entries<Object>) {
        if (typeof key !== "string" && typeof key !== "number") continue
        const newKey: `${Prefix}${typeof key}` = `${prefix}${key}`
        newObject[newKey] = value
    }
    return newObject
}

export default prefixKeys
