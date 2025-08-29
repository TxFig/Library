import type { Entries } from "./types"


type Replace<
    T extends Record<PropertyKey, any>,
    Map extends Partial<Record<keyof T | string, keyof T>>,
> = Omit<T, keyof Map | Exclude<Map[keyof Map], undefined>> & {
    [Key in keyof Map]: Map[Key] extends keyof T ? T[Map[Key]] : never
}
function replace<
    T extends Record<PropertyKey, any>,
    Map extends Partial<Record<keyof T, keyof T>>,
>(
    object: T,
    map: Map
): Replace<T, Map> {
    let result = structuredClone(object)

    for (const [key, replaceKey] of Object.entries(map) as Entries<T>) {
        result[key] = result[replaceKey]
        delete result[replaceKey]
    }

    return result
}

type Remove<
    T extends Record<PropertyKey, any>,
    Keys extends readonly (keyof T)[]
> = Omit<T, Keys[number]>
function remove<
    T extends Record<PropertyKey, any>,
    Keys extends readonly (keyof T)[]
>(
    object: T,
    keys: Keys
): Remove<T, Keys> {
    let result = structuredClone(object)

    for (const key of keys) {
        delete result[key]
    }

    return result
}

type IsObjectOrArray<T> = NonNullable<T> extends object ?
    T extends Function ?
        false
    : true
: false

type KeysWithObjectsOrArrays<T extends Record<PropertyKey, any>> = {
    [K in keyof T]: IsObjectOrArray<T[K]> extends true ? K : never
}[keyof T]

export type TransformSpec<
    T extends Record<PropertyKey, any> | Record<PropertyKey, any>[]
> = T extends any[]
    ? ({
        $?: {
            replace?: Partial<Record<keyof T[number] | string, keyof T[number]>>,
            remove?: readonly (keyof T[number])[]
            pick?: keyof T[number]
        }
    } & {
        [K in KeysWithObjectsOrArrays<T[number]>]?: TransformSpec<T[number][K]>
    })
    : ({
        $?: {
            replace?: Partial<Record<keyof T | string, keyof T>>,
            remove?: readonly (keyof T)[],
            pick?: keyof T
        }
    } & {
        [K in KeysWithObjectsOrArrays<T>]?:
            NonNullable<T[K]> extends Record<PropertyKey, any>
                ? TransformSpec<NonNullable<T[K]>>
                : never
    })

export type ApplyTransformSpec<
    T extends Record<PropertyKey, any> | Record<PropertyKey, any>[],
    TSpec extends TransformSpec<T>
> = T extends any[]
    ? T extends Record<PropertyKey, any>[]
        ? ApplyTransformSpec<T[number], TSpec>[]
        : never
    // Apply $.pick
    : TSpec["$"] extends { pick?: keyof T }
        ? T[NonNullable<TSpec["$"]["pick"]>]
        // Apply $.replace
        : (TSpec["$"] extends { replace?: Partial<Record<keyof T | string, keyof T>> }
            ? Replace<NonNullable<T>, NonNullable<TSpec["$"]["replace"]>>
            : T
        ) extends infer T1
            // Apply $.remove
            ? (TSpec["$"] extends { remove?: readonly (keyof T1)[] }
                ? Remove<NonNullable<T1>, NonNullable<TSpec["$"]["remove"]>>
                : T1
            ) extends infer T2
                // Apply deeper $
                ? Omit<T2, Exclude<keyof TSpec, "$">> & ({
                    [K in keyof TSpec as K extends "$" ? never : K]:
                        K extends keyof T2
                            ? NonNullable<T2[K]> extends Record<PropertyKey, any> | Record<PropertyKey, any>[]
                                ? TSpec[K] extends TransformSpec<NonNullable<T2[K]>>
                                    ? ApplyTransformSpec<NonNullable<T2[K]>, TSpec[K]>
                                    : never
                                : never
                            : never
                    })
                : never
            : never

export function applyTransformSpec<
    T extends Record<PropertyKey, any> | Record<PropertyKey, any>[],
    const TSpec extends TransformSpec<T>
>(
    data: T,
    spec: TSpec
): ApplyTransformSpec<T, TSpec> {
    if (Array.isArray(data)) {
        return data.map(object =>
            applyTransformSpec(object, spec)
        ) as ApplyTransformSpec<T, TSpec>
    }

    let result = structuredClone(data) as Record<PropertyKey, any>

    if (spec.$?.pick) {
        return result[spec.$.pick]
    }

    if (spec.$?.replace) {
        result = replace(result, spec.$.replace)
    }

    if (spec.$?.remove) {
        result = remove(result, spec.$.remove)
    }

    for (const [key, nestedSpec] of Object.entries(spec)) {
        if (key === "$") continue

        const current = result[key]
        if (current && typeof current === "object") {
            result[key] = applyTransformSpec(current, nestedSpec)
        }
    }

    return result as ApplyTransformSpec<T, TSpec>
}


export default applyTransformSpec
