import db from "$lib/server/database/"
import log, { logError } from "$lib/logging"
import HttpCodes from "$lib/utils/http-codes"

import type { Book } from "@prisma/client"
import type { ApiMethodReturn } from "$lib/server/api"
import type { FormEndpointFunction } from "$lib/server/api/endpoint"
import type { RequestEvent } from "."
import type { BookCreateSchema } from "$lib/validation/book/book"


type ReturnData = Book
export type BookPatchMethodReturn = ApiMethodReturn<ReturnData>
export const PATCH: FormEndpointFunction<RequestEvent, BookCreateSchema, Book> = async function(event, form) {
    const { params: { bookPublicId }, locals } = event
    const userId = locals.user!.id
    const { data } = form

    const doesBookExist = await db.books.book.doesBookExist({
        publicId: bookPublicId
    })
    if (!doesBookExist) {
        return {
            success: false,
            code: HttpCodes.ClientError.NotFound,
            message: "Book Not Found"
        }
    }

    try {
        const book = await db.books.book.updateBook(data)
        await log("info", `Book updated: ${bookPublicId}`, userId, data)

        return {
            success: true,
            message: "Book Updated Successfully",
            data: book
        }
    } catch (err) {
        await logError(err, `Error updating book: ${bookPublicId} in database`, userId)
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error updating book in database"
        }
    }
}

export default PATCH
