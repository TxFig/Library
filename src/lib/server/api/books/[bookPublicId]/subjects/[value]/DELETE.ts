import { log, logError } from "$lib/server/database/logs";
import type { AuthEventLocals } from "$lib/request-validators/auth";
import type { ApiMethodReturn } from "$lib/server/api";
import HttpCodes from "$lib/utils/http-codes";
import db from "$lib/server/database/"
import messages from "$lib/messages";


type SubjectDeleteMethodReturn = ApiMethodReturn<undefined, undefined>
export async function DELETE(bookPublicId: string, value: string, locals: AuthEventLocals): Promise<SubjectDeleteMethodReturn> {
    try {
        await db.books.subject.delete(bookPublicId, value)
        await log("info", messages.subject.delete.success, {
            bookPublicId,
            userId: locals.user.id,
            value
        })

        return {
            message: messages.subject.delete.success,
            success: true,
            data: undefined
        }
    } catch (err) {
        await logError(err, messages.subject.delete.error, {
            bookPublicId,
            userId: locals.user.id,
            value
        })
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: messages.subject.delete.error
        }
    }
}

export default DELETE
