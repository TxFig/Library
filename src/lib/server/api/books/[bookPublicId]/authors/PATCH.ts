import { log, logError } from "$lib/server/database/logs"
import type { AuthEventLocals } from "$lib/request-validators/auth"
import type { ApiMethodReturn } from "$lib/server/api"
import HttpCodes from "$lib/utils/http-codes"
import db from "$lib/server/database/"
import messages from "$lib/messages"


export type BookAuthorPatchMethodReturn = ApiMethodReturn<undefined, undefined>
export async function PATCH(bookPublicId: string, data: string[], locals: AuthEventLocals): Promise<BookAuthorPatchMethodReturn> {
    try {
        await db.books.author.clearBookAuthors(bookPublicId)
        await db.books.author.createManyInBook(bookPublicId, data)
        await log("info", messages.author.replaced.success, {
            bookPublicId,
            userId: locals.user.id,
            data
        })

        return {
            message: messages.author.replaced.success,
            success: true,
            code: HttpCodes.Success.OK,
            data: undefined
        }
    } catch (err) {
        await logError(err, messages.author.replaced.error, {
            bookPublicId,
            user: locals.user.id,
            data
        })
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: messages.author.replaced.error
        }
    }
}

export default PATCH
