import { log, logError } from "$lib/server/database/logs"
import type { AuthEventLocals } from "$lib/request-validators/auth"
import type { ApiMethodReturn } from "$lib/server/api"
import HttpCodes from "$lib/utils/http-codes"
import db from "$lib/server/database/"
import messages from "$lib/messages"
import type { CopyUpdateSchema } from "$lib/validation/interactions/copy"
import type * as v from "valibot"


export type BookCopyPatchMethodReturn = ApiMethodReturn<undefined, undefined>
export async function PATCH(copyPublicId: string, data: v.InferOutput<CopyUpdateSchema>, locals: AuthEventLocals): Promise<BookCopyPatchMethodReturn> {
    try {
        const copy = await db.interactions.copy.getUnique({
            where: { publicId: copyPublicId }
        })

        if (!copy) {
            await log("info", messages.copy.not_found, { copyPublicId })
            return {
                success: false,
                code: HttpCodes.ClientError.BadRequest,
                message: messages.copy.not_found
            }
        }

        if (copy.ownerId !== locals.user.id) {
            return {
                success: false,
                code: HttpCodes.ClientError.Forbidden,
                message: messages.copy.forbidden
            }
        }

        await db.interactions.copy.update({
            where: {
                publicId: copyPublicId
            },
            data: {
                status: data.status
            }
        })

        if (data.status === "unavailable") {
            await db.interactions.copy.request.deleteMany({
                where: { copyId: copy.id }
            })
        }

        await log("info", messages.copy.update.success, {
            copyPublicId,
            userId: locals.user.id,
            data
        })

        return {
            message: messages.copy.update.success,
            success: true,
            data: undefined
        }
    } catch (err) {
        await logError(err, messages.copy.update.error, {
            copyPublicId,
            user: locals.user.id,
            data
        })
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: messages.copy.update.error
        }
    }
}

export default PATCH
