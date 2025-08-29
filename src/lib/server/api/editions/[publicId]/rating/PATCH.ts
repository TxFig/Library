import { log, logError } from "$lib/server/database/logs";
import type { AuthEventLocals } from "$lib/request-validators/auth";
import type { ApiMethodReturn } from "$lib/server/api";
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes";
import type { RatingUpdateSchemaOutput } from "$lib/validation/book/rating";
import messages from "$lib/messages";


type BookEditionRatingPatchMethodReturn = ApiMethodReturn<undefined, undefined>
export async function PATCH(editionPublicId: string, data: RatingUpdateSchemaOutput, locals: AuthEventLocals): Promise<BookEditionRatingPatchMethodReturn> {
    try {
        await db.interactions.rating.update(editionPublicId, locals.user.id, data.rating)
        await log("info", messages.rating.update.success, {
            editionPublicId,
            userId: locals.user.id,
            rating: data.rating,
        })
        return {
            success: true,
            message: messages.rating.update.success,
            data: undefined
        }
    } catch (err) {
        await logError(err, messages.rating.update.error, {
            editionPublicId,
            userId: locals.user.id,
            rating: data.rating
        })
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: messages.rating.update.error
        }
    }
}


export default PATCH
