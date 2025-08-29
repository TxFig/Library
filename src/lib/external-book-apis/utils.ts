import type { BookEditionSchemaOutput, BookSchemaOutput } from "$lib/validation/book"
import type { ExternalBookData, ExternalBookEditionData } from "."


export function externalBookToBookSchemaOutput(book: ExternalBookData): BookSchemaOutput {
    const { edition, ...restBook } = book
    return {
        ...restBook,
        editions: [
            externalBookEditionToBookEditionSchemaOutput(edition)
        ]
    }
}

export function externalBookEditionToBookEditionSchemaOutput(edition: ExternalBookEditionData): BookEditionSchemaOutput {
    return {
        ...edition,
        authors: [],
        copies: []
    }
}
