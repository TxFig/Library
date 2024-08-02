import type { BookCreateFormData } from "$lib/validation/book/book-form";
import { combineBooksData } from "./combine-books";
import { formatBookData } from "./format";
import { getParsedGoogleBooksBook } from "./google-books";
import { getParsedOpenLibraryBook } from "./open-library";


type FieldsToOmit = "location" | "language" | "public"
export type ExternalBookData = Omit<BookCreateFormData, FieldsToOmit>
export const defaultsForOmittedFields: {[key in FieldsToOmit]: BookCreateFormData[key]} = {
    location: undefined,
    language: undefined,
    public: true,
}

export async function fetchBookData(isbn: string): Promise<BookCreateFormData | null> {
    const booksOrNull: (ExternalBookData | null)[] = await Promise.all([
        getParsedGoogleBooksBook(isbn),
        getParsedOpenLibraryBook(isbn)
    ])

    const books = booksOrNull.filter(book => book !== null)
    if (books.length === 0) return null

    const resultBook = await combineBooksData(isbn, books)
    const formattedBook = formatBookData(resultBook)
    return {
        ...formattedBook,
        ...defaultsForOmittedFields
    }
}
