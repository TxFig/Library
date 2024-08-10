import Fuse, { type IFuseOptions } from "fuse.js"


export type SearchOptions<Item> = IFuseOptions<Item> & {
    filter?: (item: Item) => boolean
}

export function search<Item extends Record<string, any>>(
    items: Item[],
    query: string,
    options?: SearchOptions<Item>
): Item[] {
    const filteredItems = options?.filter ? items.filter(options.filter) : items

    if (items.length < 2 || options?.keys?.length === 0 || query === "") {
        return filteredItems
    }

    const fuse = new Fuse(filteredItems, options)
    const results = fuse.search(query)
    return results.map(result => result.item)
}
