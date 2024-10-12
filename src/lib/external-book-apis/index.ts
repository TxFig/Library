import { logError } from "$lib/logging";
import type { BookCreateFormData } from "$lib/validation/book/_book";
import { combineBooksData } from "./combine-books";
import { formatBookData } from "./format";
import { getParsedGoogleBooksBook } from "./google-books";
import { getParsedOpenLibraryBook } from "./open-library";


type FieldsToOmit = "location" | "language"
export type ExternalBookData = Omit<BookCreateFormData, FieldsToOmit>
export const defaultsForOmittedFields: {[key in FieldsToOmit]: BookCreateFormData[key]} = {
    location: undefined,
    language: undefined,
}

export async function fetchBookData(isbn: string): Promise<BookCreateFormData | null> {
    const booksResults = await Promise.allSettled<ExternalBookData | null>([
        getParsedGoogleBooksBook(isbn),
        getParsedOpenLibraryBook(isbn)
    ])

    const books = booksResults
        .filter(book => book.status === "fulfilled")
        .map(book => book.value)
        .filter(book => book !== null)

    const errors = booksResults.filter(book => book.status === "rejected").map(book => book.reason)
    for (const err of errors)
        logError(err, "Errors of fetching book data")

    if (books.length === 0) return null
    books.length === 1

    const resultBook = combineBooksData(isbn, books)
    const formattedBook = formatBookData(resultBook)
    return {
        ...formattedBook,
        ...defaultsForOmittedFields
    }
}
