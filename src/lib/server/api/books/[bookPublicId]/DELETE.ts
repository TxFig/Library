import db from "$lib/server/database/"
import { log, logError } from "$lib/server/database/logs"
import HttpCodes from "$lib/utils/http-codes"
import type { ApiMethodReturn } from "$lib/server/api"
import type { AuthEventLocals } from "$lib/request-validators/auth"
import messages from "$lib/messages"


export type BookDeleteMethodReturn = ApiMethodReturn<undefined, undefined>
export async function DELETE(bookPublicId: string, locals: AuthEventLocals): Promise<BookDeleteMethodReturn> {
    try {
        await db.books.book.delete(bookPublicId)
        await log("info", messages.book.delete.success, { userId: locals.user.id, bookPublicId })

        return {
            message: messages.book.delete.success,
            success: true,
            data: undefined
        }
    } catch (err) {
        await logError(err, messages.book.delete.error, {
            userId: locals.user.id,
            bookPublicId
        })
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: messages.book.delete.error
        }
    }
}


export default DELETE
