import { logError } from "$lib/server/database/logs";
import type { BookSchemaOutput } from "$lib/validation/book";
import { combineBooksData } from "./combine-books";
import { formatBookData } from "./format";
import { getParsedGoogleBooksBook } from "./google-books";
import { getParsedOpenLibraryBook } from "./open-library";


export type ExternalBookEditionData = Omit<BookSchemaOutput["editions"][number], "copies" | "authors">
export type ExternalBookData = Omit<BookSchemaOutput, "editions"> & {
    edition: ExternalBookEditionData
}
export async function fetchBookData(isbn: string): Promise<ExternalBookData | null> {
    const booksResults = await Promise.allSettled<ExternalBookData | null>([
        getParsedGoogleBooksBook(isbn),
        getParsedOpenLibraryBook(isbn)
    ])

    const books = booksResults
        .filter(book => book.status === "fulfilled")
        .map(book => book.value)
        .filter(book => book !== null)

    const errors = booksResults
        .filter(book => book.status === "rejected")
        .map(book => book.reason)
    for (const err of errors)
        logError(err, "Errors of fetching book data")

    if (books.length === 0) return null

    const resultBook = combineBooksData(books)
    const formattedBook = formatBookData(resultBook)
    return formattedBook
}
