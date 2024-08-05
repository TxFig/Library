import Fuse, { type FuseOptionKey } from "fuse.js"


type SearchOptions<Item> = {
    filter?: (item: Item) => boolean
}

export function search<Item extends Record<string, any>>(
    items: Item[],
    keys: FuseOptionKey<Item>[],
    query: string,
    options?: SearchOptions<Item>
): Item[] {
    const filteredItems = options?.filter ? items.filter(options.filter) : items

    if (items.length < 2 || keys.length === 0 || query === "") {
        return filteredItems
    }

    const fuse = new Fuse(filteredItems, {
        keys: keys,
        threshold: 0.25,
        distance: 10,
        ignoreLocation: true,

        includeScore: true,
    })
    const results = fuse.search(query)
    return results.map(result => result.item)
}
