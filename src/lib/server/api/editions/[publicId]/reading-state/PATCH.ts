import HttpCodes from "$lib/utils/http-codes"
import type { ApiMethodReturn } from "$lib/server/api"
import db from "$lib/server/database/"
import { log, logError } from "$lib/server/database/logs"
import type { AuthEventLocals } from "$lib/request-validators/auth"
import type { ReadingStateUpdateSchemaOutput } from "$lib/validation/book/reading-state"
import messages from "$lib/messages"


export type BookEditionReadingStatePatchMethodReturn = ApiMethodReturn<undefined, undefined>
export async function PATCH(editionPublicId: string, data: ReadingStateUpdateSchemaOutput, locals: AuthEventLocals): Promise<BookEditionReadingStatePatchMethodReturn> {
    try {
        await db.interactions.readingState.update(editionPublicId, locals.user.id, data.state)
        await log("info", messages.readingState.update.success, {
            editionPublicId,
            userId: locals.user.id,
            state: data.state
        })

        return {
            success: true,
            message: messages.readingState.update.success,
            data: undefined
        }
    } catch (err) {
        await logError(err, messages.readingState.update.error, {
            editionPublicId,
            userId: locals.user.id,
            state: data.state
        })
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: messages.readingState.update.error
        }
    }
}

export default PATCH
