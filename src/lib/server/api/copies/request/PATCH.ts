import { log, logError } from "$lib/server/database/logs"
import type { AuthEventLocals } from "$lib/request-validators/auth"
import type { ApiMethodReturn } from "$lib/server/api"
import HttpCodes from "$lib/utils/http-codes"
import db from "$lib/server/database/"
import messages from "$lib/messages"
import type { CopyRequestUpdateSchema } from "$lib/validation/interactions/copy"
import * as v from "valibot"
import { sendMail } from "$lib/server/mail"


export type BookCopyRequestPatchMethodReturn = ApiMethodReturn<undefined, undefined>
export async function PATCH(copyPublicId: string, requestPublicId: string, data: v.InferOutput<CopyRequestUpdateSchema>, locals: AuthEventLocals): Promise<BookCopyRequestPatchMethodReturn> {
    try {
        const copy = await db.interactions.copy.getUnique({
            where: { publicId: copyPublicId },
            include: {
                owner: true,
                edition: {
                    include: {
                        book: {
                            include: {
                                authors: true
                            }
                        }
                    }
                },
                location: true
            }
        })

        if (!copy) {
            await log("info", messages.copy.not_found, {
                copyPublicId,
                userId: locals.user.id
            })
            return {
                success: false,
                code: HttpCodes.ClientError.BadRequest,
                message: messages.copy.not_found
            }
        }

        const request = await db.interactions.copy.request.getUnique({
            where: { publicId: requestPublicId }
        })
        if (!request) {
            await log("info", messages.copyRequest.not_found, {
                copyPublicId,
                requestPublicId,
                userId: locals.user.id
            })
            return {
                success: false,
                code: HttpCodes.ClientError.BadRequest,
                message: messages.copyRequest.not_found
            }
        }

        if (request.userId !== locals.user.id) {
            await log("info", messages.copyRequest.forbidden, {
                copyPublicId,
                requestPublicId,
                userId: locals.user.id
            })
            return {
                success: false,
                code: HttpCodes.ClientError.Forbidden,
                message: messages.copy.forbidden
            }
        }

        await db.interactions.copy.request.update({
            where: {
                publicId: requestPublicId
            },
            data: {
                status: data.status,
                resolvedAt: new Date()
            }
        })
        await sendMail(copy.owner.email, "copyRequestCancelled", {
            username: locals.user.username,
            title: copy.edition.title,
            authors: copy.edition.book.authors.map(author => author.name).join(", "),
            location: copy.location.value,
            request_date: request.createdAt.toLocaleDateString(),
            cancel_date: new Date().toLocaleDateString(),
        })
        await log("info", messages.copyRequest.update.success, {
            copyPublicId,
            userId: locals.user.id,
            data
        })

        return {
            message: messages.copyRequest.update.success,
            success: true,
            data: undefined
        }
    } catch (err) {
        await logError(err, messages.copyRequest.update.error, {
            copyPublicId,
            requestPublicId,
            user: locals.user.id,
            data
        })
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: messages.copyRequest.update.error
        }
    }
}

export default PATCH
