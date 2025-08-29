import { log, logError } from "$lib/server/database/logs"
import type { AuthEventLocals } from "$lib/request-validators/auth"
import type { ApiMethodReturn } from "$lib/server/api"
import HttpCodes from "$lib/utils/http-codes"
import db from "$lib/server/database/"
import messages from "$lib/messages"
import type { CopyLoanUpdateSchema } from "$lib/validation/interactions/copy"
import * as v from "valibot"
import { sendMail } from "$lib/server/mail"


export type CopyLoanPatchReturn = ApiMethodReturn<undefined, undefined>
export async function PATCH(copyPublicId: string, loanPublicId: string, data: v.InferOutput<CopyLoanUpdateSchema>, locals: AuthEventLocals): Promise<CopyLoanPatchReturn> {
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

        const loan = await db.interactions.copy.loan.getUnique({
            where: { publicId: loanPublicId }
        })
        if (!loan) {
            await log("info", messages.loan.not_found, {
                copyPublicId,
                loanPublicId,
                userId: locals.user.id
            })
            return {
                success: false,
                code: HttpCodes.ClientError.BadRequest,
                message: messages.loan.not_found
            }
        }

        if (copy.ownerId !== locals.user.id && loan.userId !== locals.user.id) {
            await log("info", messages.loan.forbidden, {
                copyPublicId,
                loanPublicId,
                userId: locals.user.id
            })
            return {
                success: false,
                code: HttpCodes.ClientError.Forbidden,
                message: messages.loan.forbidden
            }
        }

        await db.interactions.copy.loan.update({
            where: {
                publicId: loanPublicId
            },
            data: {
                status: data.status,
            }
        })
        // await sendMail(copy.owner.email, "copyRequestCancelled", {
        //     username: locals.user.username,
        //     title: copy.edition.title,
        //     authors: copy.edition.book.authors.map(author => author.name).join(", "),
        //     location: copy.location.value,
        //     request_date: request.createdAt.toLocaleDateString(),
        //     cancel_date: new Date().toLocaleDateString(),
        // })
        await log("info", messages.loan.update.success, {
            copyPublicId,
            userId: locals.user.id,
            data
        })

        return {
            message: messages.loan.update.success,
            success: true,
            data: undefined
        }
    } catch (err) {
        await logError(err, messages.loan.update.error, {
            copyPublicId,
            loanPublicId,
            user: locals.user.id,
            data
        })
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: messages.loan.update.error
        }
    }
}

export default PATCH
