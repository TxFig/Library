import Fuse, { type IFuseOptions } from "fuse.js"


export type SearchOptions<Item> = IFuseOptions<Item> & {
    filter?: (item: Item) => boolean
}

export function search<Item>(
    items: Item[],
    query: string,
    options?: SearchOptions<Item>
): Item[] {
    if (query === "") {
        return items
    }

    const searchItems = options?.filter ? items.filter(options.filter) : items
    const fuse = new Fuse(searchItems, options)
    const results = fuse.search(query)
    return results.map(result => result.item)
}
