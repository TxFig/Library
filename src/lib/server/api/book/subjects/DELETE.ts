import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes";
import type { Implements } from "$lib/utils/types";
import type { InternalApiMethodReturn } from "../..";
import db from "$lib/server/database/";
import log, { logError } from "$lib/logging";


export type BookSubjectsDeleteMethodReturn = Implements<InternalApiMethodReturn, {
    success: true
    message: string,
    data: null,
} | {
    success: false,
    code: HttpErrorCodesValues,
    message: string
}>

export async function DELETE(isbn: string, subjects: string[], userId: number): Promise<BookSubjectsDeleteMethodReturn> {
    const book = await db.books.book.getBookByISBN(isbn)
    if (!book) {
        return {
            success: false,
            code: HttpCodes.ClientError.NotFound,
            message: "Book Not Found"
        }
    }

    try {
        await db.books.subject.deleteBookSubjects(book.id, subjects)
        log("info", `Book (${book.isbn}) subjects deleted: ${subjects.join(", ")}`, userId)
        return {
            success: true,
            message: "Book Subjects Deleted Successfully",
            data: null
        }
    } catch (err) {
        logError(err, `Error deleting book subjects: ${subjects.join(", ")} from book (${book.isbn})`, userId)
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error deleting book subjects in database"
        }
    }
}

export default DELETE
