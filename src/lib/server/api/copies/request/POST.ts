import HttpCodes from "$lib/utils/http-codes"
import type { ApiMethodReturn } from "$lib/server/api"
import db from "$lib/server/database/"
import { log, logError } from "$lib/server/database/logs"
import type { AuthEventLocals } from "$lib/request-validators/auth"
import type { CopyRequestCreateSchema } from "$lib/validation/interactions/copy"
import applyTransformSpec from "$lib/utils/transform-object"
import transforms from "$lib/transforms"
import type { CopyRequestTransformed } from "$lib/server/database/interactions/copy"
import { sendMail } from "$lib/server/mail"
import messages from "$lib/messages"
import urlsServer from "$lib/urls-server"
import type * as v from "valibot"


export type BookCopyRequestPostMethodReturn = ApiMethodReturn<CopyRequestTransformed, undefined>
export async function POST(copyPublicId: string, data: v.InferOutput<CopyRequestCreateSchema>, locals: AuthEventLocals): Promise<BookCopyRequestPostMethodReturn> {
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
                location: true,
                owner: true,
                requests: true
            }
        })
        if (!copy) {
            await log("info", messages.copy.not_found, {
                copyPublicId,
                userId: locals.user.id
            })
            return {
                message: messages.copy.not_found,
                success: false,
                code: HttpCodes.ClientError.BadRequest
            }
        }
        if (copy.status === "unavailable") {
            await log("info", messages.copy.unavailable, {
                copyPublicId,
                userId: locals.user.id
            })
            return {
                message: messages.copy.unavailable,
                success: false,
                code: HttpCodes.ClientError.Forbidden
            }
        }
        const pendingRequests = copy.requests.filter(req => req.userId === locals.user.id && req.status === "pending")
        if (pendingRequests.length !== 0) {
            return {
                message: messages.copyRequest.unique,
                success: false,
                code: HttpCodes.ClientError.Forbidden
            }
        }

        const request = await db.interactions.copy.request.create({
            data: {
                startDate: data.startDate,
                duration: data.duration,
                copy: {
                    connect: { publicId: copyPublicId }
                },
                user: {
                    connect: { publicId: locals.user.publicId }
                }
            }
        })

        const { edition: { book, ...edition } } = copy
        await sendMail(copy.owner.email, "copyRequested", {
            username: copy.owner.username,
            title: edition.title,
            authors: book.authors.map(author => author.name).join(", "),
            location: copy.location.value,
            request_date: new Date().toLocaleDateString(),
            duration: data.duration.toString(),
            start_date: new Date(data.startDate).toLocaleDateString(),
            dashboard_link: urlsServer.copiesDashboard
        })
        await log("info", messages.copyRequest.create.success, {
            copyPublicId,
            userId: locals.user.id,
            data
        })

        const transformed = applyTransformSpec(request, {
            $: transforms.copyRequest
        })
        return {
            success: true,
            message: messages.copyRequest.create.success,
            data: transformed
        }
    } catch (err) {
        await logError(err, messages.copyRequest.create.error, {
            copyPublicId,
            userId: locals.user.id,
            data
        })
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: messages.copyRequest.create.error
        }
    }
}

export default POST
