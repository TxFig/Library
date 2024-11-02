import db from "$lib/server/database/"
import log, { logError } from "$lib/logging"
import HttpCodes from "$lib/utils/http-codes"

import type { ApiMethodReturn } from "$lib/server/api"
import type { BaseEndpointFunction } from "$lib/server/api/endpoint"
import type { RequestEvent } from "."


type ReturnData = null
export type BookGetMethodReturn = ApiMethodReturn<ReturnData>
export const DELETE: BaseEndpointFunction<RequestEvent, ReturnData> = async function(event) {
    const { params: { bookPublicId }, locals } = event
    const userId = locals.user!.id

    try {
        await db.books.book.deleteBook(bookPublicId)
        await log("info", `Book deleted: ${bookPublicId}`, userId, bookPublicId)

        return {
            message: "Book Deleted Successfully",
            success: true,
            data: null
        }
    } catch (err) {
        await logError(err, `Error deleting book: ${bookPublicId} in database`, userId)
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error deleting book in database"
        }
    }
}


export default DELETE
