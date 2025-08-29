import HttpCodes from "$lib/utils/http-codes"
import type { ApiMethodReturn } from "$lib/server/api"
import db from "$lib/server/database/"
import { log, logError } from "$lib/server/database/logs"
import type { AuthEventLocals } from "$lib/request-validators/auth"
import messages from "$lib/messages"
import { sendMail } from "$lib/server/mail"
import { env } from "$env/dynamic/private"
import type { CopyLoanStatus } from "@prisma/client"
import applyTransformSpec from "$lib/utils/transform-object"
import { CopyRequestAccept } from "$lib/types"


export type BookCopyRequestAcceptPostMethodReturn = ApiMethodReturn<CopyRequestAccept.Type, undefined>
export async function POST(copyPublicId: string, requestPublicId: string, locals: AuthEventLocals): Promise<BookCopyRequestAcceptPostMethodReturn> {
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
                status: "accepted",
                resolvedAt: new Date()
            }
        })
        await log("info", messages.copyRequest.accept.success, {
            copyPublicId,
            requestPublicId,
            userId: locals.user.id
        })

        const dueDate = new Date(request.startDate)
        dueDate.setDate(dueDate.getDate() + request.duration)
        await sendMail(request.user.email, "copyRequestAccepted", {
            title: copy.edition.title,
            authors: copy.edition.book.authors.map(author => author.name).join(", "),
            location: copy.location.value,
            start_date: request.startDate.toLocaleDateString(),
            duration: request.duration.toString(),
            due_date: dueDate.toLocaleDateString(),
            library_link: env.ORIGIN
        })

        const today = new Date().toISOString().split('T')[0]
        const startDate = request.startDate.toISOString().split('T')[0]
        const loanStatus: CopyLoanStatus = startDate === today ? "active" : "reserved"
        const loan = await db.interactions.copy.loan.create({
            data: {
                startDate: request.startDate,
                duration: request.duration,
                status: loanStatus,

                copyId: copy.id,
                userId: request.user.id,
                requestId: request.id
            },
            include: CopyRequestAccept.include
        })
        await log("info", messages.loan.create.success, {
            copyPublicId,
            requestPublicId,
            userId: locals.user.id,
            startDate: request.startDate,
            duration: request.duration,
            status: loanStatus,
        })
        const transformed = applyTransformSpec(loan, CopyRequestAccept.spec)

        return {
            success: true,
            data: transformed,
            message: messages.copyRequest.accept.success
        }
    } catch (err) {
        await logError(err, messages.copyRequest.accept.error, {
            copyPublicId,
            requestPublicId,
            userId: locals.user.id
        })
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: messages.copyRequest.accept.error
        }
    }
}

export default POST
