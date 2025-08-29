import HttpCodes from "$lib/utils/http-codes"
import type { ApiMethodReturn } from "$lib/server/api"
import db from "$lib/server/database/"
import { log, logError } from "$lib/server/database/logs"
import type { AuthEventLocals } from "$lib/request-validators/auth"
import messages from "$lib/messages"
import { sendMail } from "$lib/server/mail"
import { env } from "$env/dynamic/private"


export type BookCopyRequestRejectPostMethodReturn = ApiMethodReturn<undefined, undefined>
export async function POST(copyPublicId: string, requestPublicId: string, locals: AuthEventLocals): Promise<BookCopyRequestRejectPostMethodReturn> {
    try {
        const copy = await db.interactions.copy.getUnique({
            where: { publicId: copyPublicId },
            include: {
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

        if (copy.ownerId !== locals.user.id) {
            await log("info", messages.copyRequest.forbidden, {
                copyPublicId,
                requestPublicId,
                userId: locals.user.id
            })
            return {
                success: false,
                code: HttpCodes.ClientError.Forbidden,
                message: messages.copyRequest.forbidden
            }
        }

        const request = await db.interactions.copy.request.getUnique({
            where: { publicId: requestPublicId },
            include: {
                user: true
            }
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

        if (request.status === "cancelled") {
            await log("info", messages.copyRequest.cancelled, {
                copyPublicId,
                requestPublicId,
                userId: locals.user.id
            })
            return {
                success: false,
                code: HttpCodes.ClientError.Forbidden,
                message: messages.copyRequest.cancelled
            }
        }

        await db.interactions.copy.request.update({
            where: { publicId: request.publicId },
            data: {
                status: "rejected",
                resolvedAt: new Date()
            }
        })

        const dueDate = new Date(request.startDate)
        dueDate.setDate(dueDate.getDate() + request.duration)
        await sendMail(request.user.email, "copyRequestRejected", {
            title: copy.edition.title,
            authors: copy.edition.book.authors.map(author => author.name).join(", "),
            location: copy.location.value,
            library_link: env.ORIGIN
        })

        await log("info", messages.copyRequest.reject.success, {
            copyPublicId,
            requestPublicId,
            userId: locals.user.id
        })

        return {
            success: true,
            data: undefined,
            message: messages.copyRequest.reject.success
        }
    } catch (err) {
        await logError(err, messages.copyRequest.reject.error, {
            copyPublicId,
            requestPublicId,
            userId: locals.user.id
        })
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: messages.copyRequest.reject.error
        }
    }
}

export default POST
