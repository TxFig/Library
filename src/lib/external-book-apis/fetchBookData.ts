import type { BookCreateFormData } from "$lib/validation/book/book-form";
import { getGoogleBooksBook, parseGoogleBookBookData } from "./google-books";
import { getOpenLibraryBook, parseOpenLibraryBookData } from "./open-library";


export async function fetchBookData(isbn: string): Promise<BookCreateFormData | null> {
    const googleBooksBook = await getGoogleBooksBook(isbn)
    if (googleBooksBook) {
        return await parseGoogleBookBookData(isbn, googleBooksBook)
    }

    const openLibraryBook = await getOpenLibraryBook(isbn)
    if (openLibraryBook) {
        return await parseOpenLibraryBookData(isbn, openLibraryBook)
    }

    return null
}
