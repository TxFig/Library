import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes"
import type { Implements } from "$lib/utils/types"
import type { InternalApiMethodReturn } from ".."
import db from "$lib/server/database/"
import log, { logError } from "$lib/logging"


export type BookDeleteMethodReturn = Implements<InternalApiMethodReturn, {
    success: true
    message: string,
    data: null,
} | {
    success: false,
    code: HttpErrorCodesValues,
    message: string
}>

export async function DELETE(isbn: string, userId: number): Promise<BookDeleteMethodReturn> {
    try {
        await db.books.book.deleteBook(isbn)
        await log("info", `Book deleted: ${isbn}`, userId, isbn)

        return {
            message: "Book Deleted Successfully",
            success: true,
            data: null
        }
    } catch (err) {
        await logError(err, `Error deleting book: ${isbn} in database`, userId)
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error deleting book in database"
        }
    }
}

export default DELETE
