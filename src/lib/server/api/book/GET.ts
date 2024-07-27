import type { EntireBook } from "$lib/server/database/books/book"
import db from "$lib/server/database/"

import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes"
import type { Implements } from "$lib/utils/types"

import type { InternalApiMethodReturn } from ".."


type BookGetMethodReturn = Implements<InternalApiMethodReturn, {
    data: EntireBook | EntireBook[],
    success: true
} | {
    success: false
    code: HttpErrorCodesValues
    message: string
}>

export async function GET(isbn?: string): Promise<BookGetMethodReturn> {
    try {
        if (isbn) {
            const book = await db.books.book.getEntireBookByISBN(isbn)
            if (book) {
                return {
                    data: book,
                    success: true
                }
            }
            return {
                success: false,
                code: HttpCodes.ClientError.NotFound,
                message: "Book Not Found"
            }
        }

        const books = await db.books.book.getAllBooks()
        return {
            data: books,
            success: true
        }
    }
    catch {
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error retrieving book(s)"
        }
    }
}


export default GET
